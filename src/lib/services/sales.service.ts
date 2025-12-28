// ============================================================================
// ARTCONNECT CRM - SALES SERVICE
// ============================================================================

import { supabase, TypedSupabaseClient } from '../supabase';
import type {
  Sale,
  NewSale,
  SaleUpdate,
  SaleStatus,
} from '../database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface SaleFilters {
  status?: SaleStatus | 'all';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  contactId?: string;
  artworkId?: string;
}

export interface SalePagination {
  page?: number;
  limit?: number;
  orderBy?: keyof Sale;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  averageSaleValue: number;
  pendingAmount: number;
  completedCount: number;
  pendingCount: number;
}

export interface MonthlySalesData {
  month: string;
  sales: number;
  revenue: number;
}

// ============================================================================
// SALES SERVICE
// ============================================================================

export const salesService = {
  /**
   * Get all sales for a user with optional filters and pagination
   */
  async getAll(
    userId: string,
    filters?: SaleFilters,
    pagination?: SalePagination,
    client: TypedSupabaseClient = supabase
  ): Promise<PaginatedResult<Sale>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const offset = (page - 1) * limit;

    let query = client
      .from('sales')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,invoice_number.ilike.%${filters.search}%`);
    }

    if (filters?.dateFrom) {
      query = query.gte('sale_date', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('sale_date', filters.dateTo);
    }

    if (filters?.amountMin !== undefined) {
      query = query.gte('total_amount', filters.amountMin);
    }

    if (filters?.amountMax !== undefined) {
      query = query.lte('total_amount', filters.amountMax);
    }

    if (filters?.contactId) {
      query = query.eq('contact_id', filters.contactId);
    }

    if (filters?.artworkId) {
      query = query.eq('artwork_id', filters.artworkId);
    }

    // Apply ordering
    const orderBy = pagination?.orderBy || 'created_at';
    const orderDirection = pagination?.orderDirection || 'desc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  /**
   * Get a single sale by ID
   */
  async getById(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Sale | null> {
    const { data, error } = await client
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching sale:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new sale
   */
  async create(
    sale: NewSale,
    client: TypedSupabaseClient = supabase
  ): Promise<Sale> {
    // Calculate total if not provided
    const total = sale.total_amount || (
      sale.amount - (sale.discount_amount || 0) + (sale.tax_amount || 0)
    );

    const { data, error } = await client
      .from('sales')
      .insert({
        ...sale,
        total_amount: total,
      } as never)
      .select()
      .single();

    if (error) {
      console.error('Error creating sale:', error);
      throw error;
    }

    return data as Sale;
  },

  /**
   * Update a sale
   */
  async update(
    id: string,
    updates: SaleUpdate,
    client: TypedSupabaseClient = supabase
  ): Promise<Sale> {
    const { data, error } = await client
      .from('sales')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating sale:', error);
      throw error;
    }

    return data as Sale;
  },

  /**
   * Delete a sale
   */
  async delete(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<void> {
    const { error } = await client
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  },

  /**
   * Mark sale as completed
   */
  async complete(
    id: string,
    paymentMethod?: string,
    paymentReference?: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Sale> {
    const now = new Date().toISOString();
    return this.update(id, {
      status: 'completed',
      completed_at: now,
      paid_at: now,
      payment_method: paymentMethod,
      payment_reference: paymentReference,
    }, client);
  },

  /**
   * Cancel a sale
   */
  async cancel(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Sale> {
    return this.update(id, {
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    }, client);
  },

  /**
   * Refund a sale
   */
  async refund(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Sale> {
    return this.update(id, {
      status: 'refunded',
    }, client);
  },

  /**
   * Get sales statistics
   */
  async getStats(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<SalesStats> {
    const { data, error } = await client
      .from('sales')
      .select('status, total_amount')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching sales stats:', error);
      throw error;
    }

    const sales = (data || []) as Array<{ status: SaleStatus; total_amount: number }>;
    const completedSales = sales.filter(s => s.status === 'completed');
    const pendingSales = sales.filter(s => s.status === 'pending');

    const totalRevenue = completedSales.reduce((sum, s) => sum + Number(s.total_amount), 0);
    const pendingAmount = pendingSales.reduce((sum, s) => sum + Number(s.total_amount), 0);

    return {
      totalSales: sales.length,
      totalRevenue,
      averageSaleValue: completedSales.length > 0 ? totalRevenue / completedSales.length : 0,
      pendingAmount,
      completedCount: completedSales.length,
      pendingCount: pendingSales.length,
    };
  },

  /**
   * Get monthly sales data
   */
  async getMonthlySales(
    userId: string,
    year?: number,
    client: TypedSupabaseClient = supabase
  ): Promise<MonthlySalesData[]> {
    const currentYear = year || new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;

    const { data, error } = await client
      .from('sales')
      .select('sale_date, total_amount')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('sale_date', startDate)
      .lte('sale_date', endDate);

    if (error) {
      console.error('Error fetching monthly sales:', error);
      throw error;
    }

    // Group by month
    const monthlyData: Record<string, { sales: number; revenue: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    months.forEach(month => {
      monthlyData[month] = { sales: 0, revenue: 0 };
    });

    (data as Array<{ sale_date: string; total_amount: number }> || [])?.forEach(sale => {
      const month = new Date(sale.sale_date).getMonth();
      const monthName = months[month];
      monthlyData[monthName].sales++;
      monthlyData[monthName].revenue += Number(sale.total_amount);
    });

    return months.map(month => ({
      month,
      ...monthlyData[month],
    }));
  },

  /**
   * Get recent sales
   */
  async getRecent(
    userId: string,
    limit: number = 5,
    client: TypedSupabaseClient = supabase
  ): Promise<Sale[]> {
    const { data, error } = await client
      .from('sales')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent sales:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get sales by contact
   */
  async getByContact(
    contactId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Sale[]> {
    const { data, error } = await client
      .from('sales')
      .select('*')
      .eq('contact_id', contactId)
      .order('sale_date', { ascending: false });

    if (error) {
      console.error('Error fetching sales by contact:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Generate invoice number
   */
  generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `INV-${year}${month}-${random}`;
  },
};

export default salesService;
