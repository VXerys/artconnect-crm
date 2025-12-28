// ============================================================================
// ARTCONNECT CRM - PIPELINE SERVICE
// ============================================================================

import { supabase, TypedSupabaseClient } from '../supabase';
import type {
  PipelineItem,
  NewPipelineItem,
  PipelineItemUpdate,
  ArtworkStatus,
} from '../database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface PipelineColumn {
  status: ArtworkStatus;
  title: string;
  items: PipelineItem[];
  color: string;
  bgColor: string;
}

export interface PipelineData {
  concept: PipelineColumn;
  wip: PipelineColumn;
  finished: PipelineColumn;
  sold: PipelineColumn;
}

export interface PipelineSummary {
  totalItems: number;
  totalValue: number;
  byStatus: Record<ArtworkStatus, { count: number; value: number }>;
}

// Column configuration
const COLUMN_CONFIG: Record<ArtworkStatus, { title: string; color: string; bgColor: string }> = {
  concept: { title: 'Konsep', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  wip: { title: 'Proses', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  finished: { title: 'Selesai', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  sold: { title: 'Terjual', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
};

// ============================================================================
// PIPELINE SERVICE
// ============================================================================

export const pipelineService = {
  /**
   * Get all pipeline items grouped by status
   */
  async getPipelineData(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<PipelineData> {
    const { data, error } = await client
      .from('pipeline_items')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching pipeline items:', error);
      throw error;
    }

    // Group by status
    const pipelineData: PipelineData = {
      concept: { status: 'concept', ...COLUMN_CONFIG.concept, items: [] },
      wip: { status: 'wip', ...COLUMN_CONFIG.wip, items: [] },
      finished: { status: 'finished', ...COLUMN_CONFIG.finished, items: [] },
      sold: { status: 'sold', ...COLUMN_CONFIG.sold, items: [] },
    };

    data?.forEach((item) => {
      pipelineData[item.status].items.push(item);
    });

    return pipelineData;
  },

  /**
   * Get all pipeline items for a user
   */
  async getAll(
    userId: string,
    status?: ArtworkStatus,
    client: TypedSupabaseClient = supabase
  ): Promise<PipelineItem[]> {
    let query = client
      .from('pipeline_items')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pipeline items:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a single pipeline item by ID
   */
  async getById(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<PipelineItem | null> {
    const { data, error } = await client
      .from('pipeline_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching pipeline item:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new pipeline item
   */
  async create(
    item: NewPipelineItem,
    client: TypedSupabaseClient = supabase
  ): Promise<PipelineItem> {
    // Get the highest position for the status
    const { data: existingItems } = await client
      .from('pipeline_items')
      .select('position')
      .eq('user_id', item.user_id)
      .eq('status', item.status || 'concept')
      .order('position', { ascending: false })
      .limit(1);

    const newPosition = existingItems && existingItems.length > 0 
      ? existingItems[0].position + 1 
      : 0;

    const { data, error } = await client
      .from('pipeline_items')
      .insert({
        ...item,
        position: newPosition,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating pipeline item:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update a pipeline item
   */
  async update(
    id: string,
    updates: PipelineItemUpdate,
    client: TypedSupabaseClient = supabase
  ): Promise<PipelineItem> {
    const { data, error } = await client
      .from('pipeline_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pipeline item:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a pipeline item
   */
  async delete(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<void> {
    const { error } = await client
      .from('pipeline_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting pipeline item:', error);
      throw error;
    }
  },

  /**
   * Move item to a different status/column
   */
  async moveToStatus(
    id: string,
    newStatus: ArtworkStatus,
    newPosition?: number,
    client: TypedSupabaseClient = supabase
  ): Promise<PipelineItem> {
    const item = await this.getById(id, client);
    if (!item) throw new Error('Pipeline item not found');

    // If position not specified, add to end of column
    let position = newPosition;
    if (position === undefined) {
      const { data: existingItems } = await client
        .from('pipeline_items')
        .select('position')
        .eq('user_id', item.user_id)
        .eq('status', newStatus)
        .order('position', { ascending: false })
        .limit(1);

      position = existingItems && existingItems.length > 0 
        ? existingItems[0].position + 1 
        : 0;
    }

    return this.update(id, { status: newStatus, position }, client);
  },

  /**
   * Reorder items within a column
   */
  async reorderItems(
    userId: string,
    status: ArtworkStatus,
    itemIds: string[],
    client: TypedSupabaseClient = supabase
  ): Promise<void> {
    // Update positions for all items
    const updates = itemIds.map((id, index) => ({
      id,
      position: index,
    }));

    for (const update of updates) {
      await client
        .from('pipeline_items')
        .update({ position: update.position })
        .eq('id', update.id)
        .eq('user_id', userId)
        .eq('status', status);
    }
  },

  /**
   * Get pipeline summary/statistics
   */
  async getSummary(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<PipelineSummary> {
    const { data, error } = await client
      .from('pipeline_items')
      .select('status, estimated_price')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching pipeline summary:', error);
      throw error;
    }

    const summary: PipelineSummary = {
      totalItems: data?.length || 0,
      totalValue: 0,
      byStatus: {
        concept: { count: 0, value: 0 },
        wip: { count: 0, value: 0 },
        finished: { count: 0, value: 0 },
        sold: { count: 0, value: 0 },
      },
    };

    data?.forEach((item) => {
      const price = Number(item.estimated_price) || 0;
      summary.totalValue += price;
      summary.byStatus[item.status].count++;
      summary.byStatus[item.status].value += price;
    });

    return summary;
  },

  /**
   * Get items with upcoming due dates
   */
  async getUpcoming(
    userId: string,
    days: number = 7,
    client: TypedSupabaseClient = supabase
  ): Promise<PipelineItem[]> {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    const { data, error } = await client
      .from('pipeline_items')
      .select('*')
      .eq('user_id', userId)
      .not('due_date', 'is', null)
      .gte('due_date', today.toISOString().split('T')[0])
      .lte('due_date', futureDate.toISOString().split('T')[0])
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching upcoming items:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get overdue items
   */
  async getOverdue(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<PipelineItem[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await client
      .from('pipeline_items')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'sold') // Exclude sold items
      .neq('status', 'finished') // Exclude finished items
      .not('due_date', 'is', null)
      .lt('due_date', today)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching overdue items:', error);
      throw error;
    }

    return data || [];
  },
};

export default pipelineService;
