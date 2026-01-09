import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/ui/Logo';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

// ============================================================================
// PASSWORD STRENGTH INDICATOR
// ============================================================================

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all ${
              index < strength ? strengthColors[strength] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${strength < 2 ? 'text-red-500' : strength < 3 ? 'text-yellow-600' : 'text-green-600'}`}>
        {strengthLabels[strength]}
      </p>
    </div>
  );
};

// ============================================================================
// RESET PASSWORD PAGE COMPONENT
// ============================================================================

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    let isSubscribed = true;
    let hasHandledRecovery = false;

    const checkSession = async () => {
      try {
        // Wait a bit for Supabase to process the URL tokens first
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if there's a session (might have been set by Supabase automatically)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Session check:', { hasSession: !!session, error: error?.message });

        if (session && isSubscribed && !hasHandledRecovery) {
          console.log('Valid session found!');
          setIsValidSession(true);
          hasHandledRecovery = true;
          return;
        }

        // If no session yet, try manual token extraction
        const hash = window.location.hash;
        if (hash && !hasHandledRecovery) {
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');
          const errorDescription = hashParams.get('error_description');

          console.log('Hash check:', { hasToken: !!accessToken, type, errorDescription });

          if (errorDescription) {
            if (isSubscribed) {
              setIsValidSession(false);
              setErrorMessage(decodeURIComponent(errorDescription));
            }
            return;
          }

          if (accessToken && type === 'recovery') {
            console.log('Setting session from hash tokens...');
            const { data, error: setError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (setError) {
              console.error('setSession error:', setError);
              if (isSubscribed) {
                setIsValidSession(false);
                setErrorMessage(setError.message);
              }
              return;
            }

            if (data?.session && isSubscribed) {
              console.log('Session set from hash!');
              setIsValidSession(true);
              hasHandledRecovery = true;
              window.history.replaceState({}, '', window.location.pathname);
              return;
            }
          }
        }

        // Check URL params (PKCE flow)
        const code = new URLSearchParams(window.location.search).get('code');
        if (code && !hasHandledRecovery) {
          console.log('Exchanging code for session...');
          const { data, error: codeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (codeError) {
            console.error('Code exchange error:', codeError);
            if (isSubscribed) {
              setIsValidSession(false);
              setErrorMessage(codeError.message);
            }
            return;
          }

          if (data?.session && isSubscribed) {
            console.log('Session set from code!');
            setIsValidSession(true);
            hasHandledRecovery = true;
            window.history.replaceState({}, '', window.location.pathname);
            return;
          }
        }

        // Final check - maybe session was set by auth state change
        const { data: { session: finalSession } } = await supabase.auth.getSession();
        if (finalSession && isSubscribed) {
          console.log('Found session in final check');
          setIsValidSession(true);
          hasHandledRecovery = true;
          return;
        }

        // No valid session found
        if (isSubscribed && !hasHandledRecovery) {
          console.log('No valid session found');
          setIsValidSession(false);
          setErrorMessage('Link reset password tidak valid atau sudah kadaluarsa. Silakan minta link baru.');
        }

      } catch (err) {
        console.error('Session check error:', err);
        if (isSubscribed) {
          setIsValidSession(false);
          setErrorMessage('Terjadi kesalahan saat memverifikasi link.');
        }
      }
    };

    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Reset page auth event:', event, !!session);
      
      if (event === 'PASSWORD_RECOVERY' && isSubscribed && !hasHandledRecovery) {
        console.log('PASSWORD_RECOVERY event received!');
        setIsValidSession(true);
        hasHandledRecovery = true;
      } else if (event === 'SIGNED_IN' && session && isSubscribed && !hasHandledRecovery) {
        // Also handle SIGNED_IN in case PASSWORD_RECOVERY doesn't fire
        console.log('SIGNED_IN event with session');
        setIsValidSession(true);
        hasHandledRecovery = true;
      }
    });

    checkSession();

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  // Handle password update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Silakan isi semua field",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password minimal 8 karakter",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak cocok",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('Update password error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Berhasil! 🎉",
          description: "Password Anda telah diperbarui",
        });
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Update password exception:', err);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengubah password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading
  if (isValidSession === null) {
    return (
      <div className="dark min-h-screen flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="text-center animate-in fade-in duration-500 relative z-10">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/30">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
          </div>
          <p className="text-foreground font-medium">Memverifikasi link reset password...</p>
          <p className="text-sm text-muted-foreground mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // Invalid
  if (!isValidSession) {
    return (
      <div className="dark min-h-screen flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500 relative z-10">
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-red-500/30 rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-xl shadow-red-500/30">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            Link Tidak Valid 😔
          </h2>
          
          <p className="text-muted-foreground mb-8 leading-relaxed animate-in slide-in-from-bottom-4 duration-500 delay-200">
            {errorMessage}
          </p>
          
          <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <Link to="/auth/forgot-password" className="block">
              <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 
                hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-500/30
                active:scale-[0.98] transition-all duration-300 font-semibold">
                🔗 Minta Link Baru
              </Button>
            </Link>
            <Link to="/auth/login" className="block">
              <Button 
                variant="outline" 
                className="w-full h-12 border-border text-foreground font-medium
                  hover:bg-accent/10
                  active:scale-[0.98] transition-all duration-300"
              >
                ← Kembali ke Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success
  if (isSuccess) {
    return (
      <div className="dark min-h-screen flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500 relative z-10">
          {/* Animated Icon */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full animate-pulse" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
          </div>

          {/* Confetti */}
          <div className="text-4xl mb-4 animate-bounce">🎉</div>

          <h2 className="text-3xl font-bold text-foreground mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            Password Diperbarui!
          </h2>
          
          <p className="text-muted-foreground mb-8 leading-relaxed animate-in slide-in-from-bottom-4 duration-500 delay-200">
            Password Anda telah berhasil diubah.<br/>
            Silakan login dengan password baru Anda.
          </p>

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <Link to="/auth/login" className="block">
              <Button className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 text-lg
                hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-500/30
                active:scale-[0.98] transition-all duration-300 font-semibold">
                🚀 Masuk Sekarang
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-xs text-muted-foreground animate-in fade-in duration-500 delay-500">
            Anda akan diarahkan ke halaman login
          </p>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="dark min-h-screen flex items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center mb-8">
          <Logo size="lg" forceTheme="dark" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Reset Password
          </h2>
          <p className="text-muted-foreground">
            Masukkan password baru Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password Baru
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 bg-transparent border-border text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Konfirmasi Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-11 pr-11 h-12 bg-transparent border-border text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500">Password tidak cocok</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold
              hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-500/30
              active:scale-[0.98] transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Memuat...
              </>
            ) : (
              "🔐 Simpan Password Baru"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
