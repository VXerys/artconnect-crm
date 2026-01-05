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
import type { User as DBUser } from '../lib/database.types';

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: DBUser | null;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null; needsConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  isAuthenticated: boolean;
  getUserId: () => string | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// AUTH PROVIDER
// ============================================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DBUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch profile - optimized for speed
  const fetchProfile = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setProfile(null);
      return;
    }

    setProfileLoading(true);
    
    try {
      // Try to get existing profile - single optimized query
      const { data, error } = await supabase
        .from('users')
        .select('id, auth_id, email, full_name, avatar_url, role, created_at, updated_at')
        .eq('auth_id', authUser.id)
        .maybeSingle();
      
      if (error) {
        console.error('Profile fetch error:', error.message);
        setProfile(null);
        return;
      }
      
      if (data) {
        setProfile(data as DBUser);
      } else {
        // No profile found - create one
        const insertData = {
          auth_id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User',
          avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
          role: 'artist',
        };
        
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert(insertData as never)
          .select('id, auth_id, email, full_name, avatar_url, role, created_at, updated_at')
          .single();
        
        if (createError) {
          // Try fetching again in case of race condition
          const { data: retryData } = await supabase
            .from('users')
            .select('id, auth_id, email, full_name, avatar_url, role, created_at, updated_at')
            .eq('auth_id', authUser.id)
            .maybeSingle();
          if (retryData) {
            setProfile(retryData as DBUser);
          }
        } else if (newProfile) {
          setProfile(newProfile as DBUser);
        }
      }
    } catch (err) {
      console.error('Profile error:', err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user);
  }, [user, fetchProfile]);

  // Initialize auth
  useEffect(() => {
    const isConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session - wait for profile to be fully loaded before ending loading
    const initAuth = async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        
        setSession(s);
        setUser(s?.user ?? null);
        
        if (s?.user) {
          // Wait for profile to be fetched before ending loading
          setProfileLoading(true);
          await fetchProfile(s.user);
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        // Only end loading after everything is done
        setLoading(false);
      }
    };

    initAuth();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      console.log('Auth:', event);
      setSession(s);
      setUser(s?.user ?? null);
      
      if (event === 'SIGNED_IN' && s?.user) {
        setProfileLoading(true);
        fetchProfile(s.user);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      } else if (event === 'PASSWORD_RECOVERY') {
        // User clicked password reset link - redirect to reset page
        console.log('PASSWORD_RECOVERY event - redirecting to reset password page');
        // Only redirect if not already on reset password page
        if (!window.location.pathname.includes('/auth/reset-password')) {
          window.location.href = '/auth/reset-password';
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const getUserId = useCallback(() => profile?.id || null, [profile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await signInWithEmail(email, password);
      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await signUpWithEmail(email, password, { full_name: fullName });
      if (error) return { error: new Error(error.message) };
      return { error: null, needsConfirmation: !data.session && !!data.user };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { error } = await signInWithGoogle();
      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      setProfile(null);
      const { error } = await supabaseSignOut();
      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  const handleResetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabaseResetPassword(email);
      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      return { error: err as Error };
    }
  }, []);

  return (
    <AuthContext.Provider value={{
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
