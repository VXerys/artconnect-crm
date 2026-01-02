// ============================================================================
// ARTCONNECT CRM - USERS SERVICE
// ============================================================================

import { supabase, TypedSupabaseClient } from '../supabase';
import type { User as DBUser, UserUpdate } from '../database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface UserProfile extends Omit<DBUser, 'settings'> {
  settings: Record<string, unknown>;
}

// ============================================================================
// USERS SERVICE
// ============================================================================

export const usersService = {
  /**
   * Get user profile by auth_id (Supabase Auth ID)
   * This is the main method to get the database user ID
   */
  async getByAuthId(
    authId: string,
    client: TypedSupabaseClient = supabase
  ): Promise<DBUser | null> {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching user by auth_id:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get user profile by database ID
   */
  async getById(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<DBUser | null> {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching user:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get current user's database profile
   * Uses the authenticated user's session
   */
  async getCurrentUser(
    client: TypedSupabaseClient = supabase
  ): Promise<DBUser | null> {
    const { data: { user: authUser } } = await client.auth.getUser();
    
    if (!authUser) return null;

    return this.getByAuthId(authUser.id, client);
  },

  /**
   * Update user profile
   */
  async update(
    id: string,
    updates: UserUpdate,
    client: TypedSupabaseClient = supabase
  ): Promise<DBUser> {
    const { data, error } = await client
      .from('users')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return data as DBUser;
  },

  /**
   * Create user profile (usually called automatically via trigger)
   * This is mainly for manual creation if trigger fails
   */
  async create(
    authId: string,
    email: string,
    fullName?: string,
    avatarUrl?: string,
    client: TypedSupabaseClient = supabase
  ): Promise<DBUser> {
    const { data, error } = await client
      .from('users')
      .insert({
        auth_id: authId,
        email,
        full_name: fullName || email.split('@')[0],
        avatar_url: avatarUrl,
        role: 'artist',
      } as never)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data as DBUser;
  },

  /**
   * Ensure user profile exists (create if not exists)
   */
  async ensureProfile(
    authId: string,
    email: string,
    fullName?: string,
    avatarUrl?: string,
    client: TypedSupabaseClient = supabase
  ): Promise<DBUser> {
    // Try to get existing profile
    let profile = await this.getByAuthId(authId, client);
    
    if (!profile) {
      // Create new profile
      profile = await this.create(authId, email, fullName, avatarUrl, client);
    }
    
    return profile;
  },
};

export default usersService;
