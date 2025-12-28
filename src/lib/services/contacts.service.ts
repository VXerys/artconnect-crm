// ============================================================================
// ARTCONNECT CRM - CONTACTS SERVICE
// ============================================================================

import { supabase, TypedSupabaseClient } from '../supabase';
import type {
  Contact,
  NewContact,
  ContactUpdate,
  ContactType,
} from '../database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface ContactFilters {
  type?: ContactType | 'all';
  search?: string;
  location?: string;
  ratingMin?: number;
  isVip?: boolean;
  isActive?: boolean;
}

export interface ContactPagination {
  page?: number;
  limit?: number;
  orderBy?: keyof Contact;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// CONTACTS SERVICE
// ============================================================================

export const contactsService = {
  /**
   * Get all contacts for a user with optional filters and pagination
   */
  async getAll(
    userId: string,
    filters?: ContactFilters,
    pagination?: ContactPagination,
    client: TypedSupabaseClient = supabase
  ): Promise<PaginatedResult<Contact>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const offset = (page - 1) * limit;

    let query = client
      .from('contacts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters?.ratingMin !== undefined) {
      query = query.gte('rating', filters.ratingMin);
    }

    if (filters?.isVip !== undefined) {
      query = query.eq('is_vip', filters.isVip);
    }

    // Apply ordering
    const orderBy = pagination?.orderBy || 'created_at';
    const orderDirection = pagination?.orderDirection || 'desc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching contacts:', error);
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
   * Get a single contact by ID
   */
  async getById(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact | null> {
    const { data, error } = await client
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching contact:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new contact
   */
  async create(
    contact: NewContact,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact> {
    const { data, error } = await client
      .from('contacts')
      .insert(contact as never)
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }

    return data as Contact;
  },

  /**
   * Update a contact
   */
  async update(
    id: string,
    updates: ContactUpdate,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact> {
    const { data, error } = await client
      .from('contacts')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact:', error);
      throw error;
    }

    return data as Contact;
  },

  /**
   * Delete a contact
   */
  async delete(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<void> {
    const { error } = await client
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  /**
   * Deactivate a contact (soft delete)
   */
  async deactivate(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact> {
    return this.update(id, { is_active: false }, client);
  },

  /**
   * Reactivate a contact
   */
  async reactivate(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact> {
    return this.update(id, { is_active: true }, client);
  },

  /**
   * Update last contact date
   */
  async updateLastContact(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact> {
    return this.update(id, { last_contact_at: new Date().toISOString() }, client);
  },

  /**
   * Toggle VIP status
   */
  async toggleVip(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact> {
    const contact = await this.getById(id, client);
    if (!contact) throw new Error('Contact not found');
    
    return this.update(id, { is_vip: !contact.is_vip }, client);
  },

  /**
   * Get contact count by type
   */
  async getCountByType(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Record<ContactType, number>> {
    const { data, error } = await client
      .from('contacts')
      .select('type')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching contact counts:', error);
      throw error;
    }

    const counts: Record<ContactType, number> = {
      gallery: 0,
      collector: 0,
      museum: 0,
      curator: 0,
    };

    (data as Array<{ type: ContactType }>)?.forEach((contact) => {
      counts[contact.type]++;
    });

    return counts;
  },

  /**
   * Get VIP contacts
   */
  async getVips(
    userId: string,
    limit?: number,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact[]> {
    let query = client
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_vip', true)
      .eq('is_active', true)
      .order('total_purchases', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching VIP contacts:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get recent contacts
   */
  async getRecent(
    userId: string,
    limit: number = 5,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact[]> {
    const { data, error } = await client
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_contact_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent contacts:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get top buyers
   */
  async getTopBuyers(
    userId: string,
    limit: number = 5,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact[]> {
    const { data, error } = await client
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gt('purchase_count', 0)
      .order('total_purchases', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top buyers:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get distinct locations for a user
   */
  async getLocations(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<string[]> {
    const { data, error } = await client
      .from('contacts')
      .select('location')
      .eq('user_id', userId)
      .eq('is_active', true)
      .not('location', 'is', null);

    if (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }

    const locations = [...new Set((data as Array<{ location: string | null }>)?.map(c => c.location).filter(Boolean))] as string[];
    return locations;
  },

  /**
   * Search contacts by name or email
   */
  async search(
    userId: string,
    query: string,
    limit: number = 10,
    client: TypedSupabaseClient = supabase
  ): Promise<Contact[]> {
    const { data, error } = await client
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Error searching contacts:', error);
      throw error;
    }

    return data || [];
  },
};

export default contactsService;
