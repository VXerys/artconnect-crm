import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { Database } from './database.types';

// ============================================================================
// SUPABASE CLIENT CONFIGURATION
// ============================================================================

// Environment variables - Vite requires VITE_ prefix for client-side access
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// ============================================================================
// SUPABASE CLIENT INSTANCE
// ============================================================================

/**
 * Main Supabase client with Auth enabled
 * Configured for Supabase Auth with session persistence
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'artconnect-auth',
    flowType: 'pkce', // More secure OAuth flow
  },
  global: {
    headers: {
      'x-client-info': 'artconnect-crm',
    },
  },
  db: {
    schema: 'public',
  },
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TypedSupabaseClient = SupabaseClient<Database>;

// Re-export Supabase Auth types
export type { User, Session };

// Re-export database types for convenience
export type {
  Database,
  User as DBUser,
  Artwork,
  Contact,
  Sale,
  ActivityLog,
  Report,
  ScheduledReport,
  PipelineItem,
  Tag,
  Notification,
  NewUser,
  NewArtwork,
  NewContact,
  NewSale,
  NewActivityLog,
  NewReport,
  NewScheduledReport,
  NewPipelineItem,
  NewTag,
  NewNotification,
  UserUpdate,
  ArtworkUpdate,
  ContactUpdate,
  SaleUpdate,
  PipelineItemUpdate,
  DashboardStats,
  MonthlySalesSummary,
  UserRole,
  ArtworkStatus,
  ContactType,
  SaleStatus,
  ActivityType,
  ReportType,
  ReportFormat,
  ReportFrequency,
} from './database.types';

// ============================================================================
// AUTH HELPERS
// ============================================================================

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata?: { full_name?: string }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  return { data, error };
};

/**
 * Sign out
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Get current session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

/**
 * Reset password - send reset email
 */
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  return { data, error };
};

/**
 * Update password
 */
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};

// ============================================================================
// STORAGE HELPERS
// ============================================================================

/**
 * Get public URL for artwork image
 */
export const getArtworkImageUrl = (path: string): string => {
  const { data } = supabase.storage.from('artworks').getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Get public URL for avatar
 */
export const getAvatarUrl = (path: string): string => {
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Upload artwork image
 */
export const uploadArtworkImage = async (
  userId: string,
  file: File,
  fileName?: string
): Promise<{ path: string; url: string } | null> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${fileName || `${Date.now()}.${fileExt}`}`;
  
  const { error } = await supabase.storage
    .from('artworks')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading artwork image:', error);
    return null;
  }

  return {
    path: filePath,
    url: getArtworkImageUrl(filePath),
  };
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (
  userId: string,
  file: File
): Promise<{ path: string; url: string } | null> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Override existing avatar
    });

  if (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }

  return {
    path: filePath,
    url: getAvatarUrl(filePath),
  };
};

/**
 * Delete file from storage
 */
export const deleteStorageFile = async (
  bucket: 'artworks' | 'avatars' | 'reports' | 'documents',
  path: string
): Promise<boolean> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error(`Error deleting file from ${bucket}:`, error);
    return false;
  }

  return true;
};

// ============================================================================
// REALTIME SUBSCRIPTION HELPERS
// ============================================================================

/**
 * Subscribe to table changes
 * 
 * @example
 * const unsubscribe = subscribeToTable('artworks', (payload) => {
 *   console.log('Change received:', payload);
 * });
 * // Later: unsubscribe();
 */
export const subscribeToTable = <T extends keyof Database['public']['Tables']>(
  table: T,
  callback: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new: Database['public']['Tables'][T]['Row'] | null;
    old: Database['public']['Tables'][T]['Row'] | null;
  }) => void,
  filter?: string
) => {
  const channel = supabase
    .channel(`table-${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table as string,
        filter,
      },
      (payload) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as Database['public']['Tables'][T]['Row'] | null,
          old: payload.old as Database['public']['Tables'][T]['Row'] | null,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export default supabase;
