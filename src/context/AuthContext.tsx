import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { 
  supabase, 
  signInWithEmail, 
  signInWithGoogle, 
  signUpWithEmail, 
  signOut as supabaseSignOut,
  resetPassword as supabaseResetPassword,
} from '../lib/supabase';
import { usersService } from '../lib/services/users.service';
import type { User as DBUser } from '../lib/database.types';

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextType {
  // Auth State
  user: User | null;           // Supabase Auth user
  session: Session | null;
  loading: boolean;
  
  // Database User Profile
  profile: DBUser | null;      // Database user profile with users.id
  profileLoading: boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null; needsConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  
  // Utils
  isAuthenticated: boolean;
  
  // Helper to get the correct user_id for database operations
  getUserId: () => string | null;
  
  // Refresh profile
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// AUTH PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DBUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch user profile from database
  const fetchProfile = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setProfile(null);
      return;
    }

    setProfileLoading(true);
    try {
      const dbProfile = await usersService.getByAuthId(authUser.id);
      setProfile(dbProfile);
      
      if (!dbProfile) {
        console.warn('No database profile found for user:', authUser.id);
        // Try to create one if it doesn't exist
        try {
          const newProfile = await usersService.create(
            authUser.id,
            authUser.email || '',
            authUser.user_metadata?.full_name || authUser.user_metadata?.name,
            authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture
          );
          setProfile(newProfile);
          console.log('Created new database profile:', newProfile.id);
        } catch (createError) {
          console.error('Could not create profile:', createError);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Refresh profile manually
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  // Initialize auth state
  useEffect(() => {
    // Check if Supabase is properly configured
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - skipping auth initialization');
      setLoading(false);
      return;
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        // Fetch profile after getting session
        if (initialSession?.user) {
          await fetchProfile(initialSession.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log('Auth state changed:', event);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);

          // Fetch profile on auth changes
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (currentSession?.user) {
              await fetchProfile(currentSession.user);
            }
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
            console.log('User signed out');
          }
        }
      );
      subscription = data.subscription;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
    }

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Get the correct user_id for database operations
  const getUserId = useCallback((): string | null => {
    // Return the database user ID, not the auth ID
    return profile?.id || null;
  }, [profile]);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  // Sign up with email/password
  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await signUpWithEmail(email, password, { full_name: fullName });
      if (error) {
        return { error: new Error(error.message) };
      }
      // Check if email confirmation is required
      const needsConfirmation = !data.session && !!data.user;
      return { error: null, needsConfirmation };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  // Sign in with Google
  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  // Sign out
  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await supabaseSignOut();
      if (error) {
        return { error: new Error(error.message) };
      }
      setProfile(null);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  // Reset password
  const handleResetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabaseResetPassword(email);
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    profile,
    profileLoading,
    signIn,
    signUp,
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    isAuthenticated: !!user,
    getUserId,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
