// ============================================================================
// ARTCONNECT CRM - ARTWORKS SERVICE
// ============================================================================

import { supabase, TypedSupabaseClient } from '../supabase';
import type {
  Artwork,
  NewArtwork,
  ArtworkUpdate,
  ArtworkStatus,
} from '../database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface ArtworkFilters {
  status?: ArtworkStatus | 'all';
  category?: string;
  search?: string;
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  yearFrom?: number;
  yearTo?: number;
  isArchived?: boolean;
}

export interface ArtworkPagination {
  page?: number;
  limit?: number;
  orderBy?: keyof Artwork;
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
// ARTWORKS SERVICE
// ============================================================================

export const artworksService = {
  /**
   * Get all artworks for a user with optional filters and pagination
   */
  async getAll(
    userId: string,
    filters?: ArtworkFilters,
    pagination?: ArtworkPagination,
    client: TypedSupabaseClient = supabase
  ): Promise<PaginatedResult<Artwork>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const offset = (page - 1) * limit;

    let query = client
      .from('artworks')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_archived', filters?.isArchived ?? false);

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters?.priceMin !== undefined) {
      query = query.gte('price', filters.priceMin);
    }

    if (filters?.priceMax !== undefined) {
      query = query.lte('price', filters.priceMax);
    }

    if (filters?.yearFrom !== undefined) {
      query = query.gte('year', filters.yearFrom);
    }

    if (filters?.yearTo !== undefined) {
      query = query.lte('year', filters.yearTo);
    }

    // Apply ordering
    const orderBy = pagination?.orderBy || 'created_at';
    const orderDirection = pagination?.orderDirection || 'desc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching artworks:', error);
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
   * Get a single artwork by ID
   */
  async getById(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Artwork | null> {
    const { data, error } = await client
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching artwork:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new artwork
   */
  async create(
    artwork: NewArtwork,
    client: TypedSupabaseClient = supabase
  ): Promise<Artwork> {
    const { data, error } = await client
      .from('artworks')
      .insert(artwork as never)
      .select()
      .single();

    if (error) {
      console.error('Error creating artwork:', error);
      throw error;
    }

    return data as Artwork;
  },

  /**
   * Update an artwork
   */
  async update(
    id: string,
    updates: ArtworkUpdate,
    client: TypedSupabaseClient = supabase
  ): Promise<Artwork> {
    const { data, error } = await client
      .from('artworks')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating artwork:', error);
      throw error;
    }

    return data as Artwork;
  },

  /**
   * Delete an artwork
   */
  async delete(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<void> {
    const { error } = await client
      .from('artworks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting artwork:', error);
      throw error;
    }
  },

  /**
   * Archive an artwork (soft delete)
   */
  async archive(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Artwork> {
    return this.update(id, { is_archived: true }, client);
  },

  /**
   * Restore an archived artwork
   */
  async restore(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Artwork> {
    return this.update(id, { is_archived: false }, client);
  },

  /**
   * Update artwork status
   */
  async updateStatus(
    id: string,
    status: ArtworkStatus,
    client: TypedSupabaseClient = supabase
  ): Promise<Artwork> {
    const updates: ArtworkUpdate = { status };
    
    // If marking as sold, add sold_at timestamp
    if (status === 'sold') {
      updates.sold_at = new Date().toISOString();
    }

    return this.update(id, updates, client);
  },

  /**
   * Get artwork count by status
   */
  async getCountByStatus(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Record<ArtworkStatus, number>> {
    const { data, error } = await client
      .from('artworks')
      .select('status')
      .eq('user_id', userId)
      .eq('is_archived', false);

    if (error) {
      console.error('Error fetching artwork counts:', error);
      throw error;
    }

    const counts: Record<ArtworkStatus, number> = {
      concept: 0,
      wip: 0,
      finished: 0,
      sold: 0,
    };

    (data as Array<{ status: ArtworkStatus }>)?.forEach((artwork) => {
      counts[artwork.status]++;
    });

    return counts;
  },

  /**
   * Get featured artworks
   */
  async getFeatured(
    userId: string,
    limit: number = 5,
    client: TypedSupabaseClient = supabase
  ): Promise<Artwork[]> {
    const { data, error } = await client
      .from('artworks')
      .select('*')
      .eq('user_id', userId)
      .eq('is_featured', true)
      .eq('is_archived', false)
      .limit(limit);

    if (error) {
      console.error('Error fetching featured artworks:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get recent artworks
   */
  async getRecent(
    userId: string,
    limit: number = 5,
    client: TypedSupabaseClient = supabase
  ): Promise<Artwork[]> {
    const { data, error } = await client
      .from('artworks')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent artworks:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Toggle featured status
   */
  async toggleFeatured(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<Artwork> {
    const artwork = await this.getById(id, client);
    if (!artwork) throw new Error('Artwork not found');
    
    return this.update(id, { is_featured: !artwork.is_featured }, client);
  },

  /**
   * Get distinct categories for a user
   */
  async getCategories(
    userId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<string[]> {
    const { data, error } = await client
      .from('artworks')
      .select('category')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .not('category', 'is', null);

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    const categories = [...new Set((data as Array<{ category: string | null }>)?.map(a => a.category).filter(Boolean))] as string[];
    return categories;
  },
};

export default artworksService;
