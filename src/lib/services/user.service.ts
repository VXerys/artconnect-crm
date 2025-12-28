// ============================================================================
// ARTCONNECT CRM - USER SERVICE
// ============================================================================

import { supabase, TypedSupabaseClient } from '../supabase';
import type {
  User,
  NewUser,
  UserUpdate,
  DashboardStats,
} from '../database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface UserProfile extends User {
  stats?: DashboardStats;
}

export interface CreateUserParams {
  firebaseUid: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: 'admin' | 'artist' | 'collector' | 'user';
}

// ============================================================================
// USER SERVICE
// ============================================================================

export const userService = {
  /**
   * Get user by Firebase UID
   */
  async getByFirebaseUid(
    firebaseUid: string,
    client: TypedSupabaseClient = supabase
  ): Promise<User | null> {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching user:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get user by ID
   */
  async getById(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<User | null> {
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
   * Get user by email
   */
  async getByEmail(
    email: string,
    client: TypedSupabaseClient = supabase
  ): Promise<User | null> {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching user:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new user (called after Firebase Auth registration)
   */
  async create(
    params: CreateUserParams,
    client: TypedSupabaseClient = supabase
  ): Promise<User> {
    const newUser: NewUser = {
      firebase_uid: params.firebaseUid,
      email: params.email,
      full_name: params.fullName || null,
      avatar_url: params.avatarUrl || null,
      role: params.role || 'artist',
    };

    const { data, error } = await client
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update user profile
   */
  async update(
    id: string,
    updates: UserUpdate,
    client: TypedSupabaseClient = supabase
  ): Promise<User> {
    const { data, error } = await client
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update user by Firebase UID
   */
  async updateByFirebaseUid(
    firebaseUid: string,
    updates: UserUpdate,
    client: TypedSupabaseClient = supabase
  ): Promise<User> {
    const { data, error } = await client
      .from('users')
      .update(updates)
      .eq('firebase_uid', firebaseUid)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update last login timestamp
   */
  async updateLastLogin(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<void> {
    const { error } = await client
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating last login:', error);
      // Don't throw - this is not critical
    }
  },

  /**
   * Get user with dashboard stats
   */
  async getProfileWithStats(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<UserProfile | null> {
    // Get user
    const user = await this.getById(id, client);
    if (!user) return null;

    // Get stats
    const { data: stats } = await client
      .from('dashboard_stats')
      .select('*')
      .eq('user_id', id)
      .single();

    return {
      ...user,
      stats: stats || undefined,
    };
  },

  /**
   * Check if user exists by Firebase UID
   */
  async exists(
    firebaseUid: string,
    client: TypedSupabaseClient = supabase
  ): Promise<boolean> {
    const { count, error } = await client
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('firebase_uid', firebaseUid);

    if (error) {
      console.error('Error checking user existence:', error);
      return false;
    }

    return (count || 0) > 0;
  },

  /**
   * Get or create user (upsert-like behavior)
   */
  async getOrCreate(
    params: CreateUserParams,
    client: TypedSupabaseClient = supabase
  ): Promise<User> {
    // Try to get existing user
    const existingUser = await this.getByFirebaseUid(params.firebaseUid, client);
    
    if (existingUser) {
      // Update last login
      await this.updateLastLogin(existingUser.id, client);
      return existingUser;
    }

    // Create new user
    return this.create(params, client);
  },

  /**
   * Update user settings (JSON field)
   */
  async updateSettings(
    id: string,
    settings: Record<string, unknown>,
    client: TypedSupabaseClient = supabase
  ): Promise<User> {
    // Get current settings
    const user = await this.getById(id, client);
    if (!user) throw new Error('User not found');

    // Merge settings
    const mergedSettings = {
      ...(user.settings as Record<string, unknown> || {}),
      ...settings,
    };

    return this.update(id, { settings: mergedSettings }, client);
  },

  /**
   * Delete user (soft delete by deactivating)
   */
  async deactivate(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<User> {
    return this.update(id, { is_active: false }, client);
  },

  /**
   * Reactivate user
   */
  async reactivate(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<User> {
    return this.update(id, { is_active: true }, client);
  },

  /**
   * Verify user email
   */
  async verifyEmail(
    id: string,
    client: TypedSupabaseClient = supabase
  ): Promise<User> {
    return this.update(id, { email_verified: true }, client);
  },
};

export default userService;
