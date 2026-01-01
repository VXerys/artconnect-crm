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

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextType {
  // State
  user: User | null;
  session: Session | null;
  loading: boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null; needsConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  
  // Utils
  isAuthenticated: boolean;
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

          // Handle specific auth events
          if (event === 'SIGNED_IN') {
            console.log('User signed in:', currentSession?.user?.email);
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed');
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
  }, []);

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
    signIn,
    signUp,
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    isAuthenticated: !!user,
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
