import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  Palette, 
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
              index < strength ? strengthColors[strength] : 'bg-gray-200'
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
      <div className="min-h-screen flex items-center justify-center p-8 bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">Memverifikasi link reset password...</p>
        </div>
      </div>
    );
  }

  // Invalid
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Link Tidak Valid
          </h2>
          <p className="text-gray-600 mb-6">
            {errorMessage}
          </p>
          <div className="space-y-3">
            <Link to="/auth/forgot-password">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                Minta Link Baru
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                Kembali ke Login
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
      <div className="min-h-screen flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Password Diperbarui!
          </h2>
          <p className="text-gray-600 mb-6">
            Password Anda telah berhasil diubah. Silakan login dengan password baru.
          </p>
          <Link to="/auth/login">
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold">
              Masuk Sekarang
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">ArtConnect</span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Buat Password Baru
          </h2>
          <p className="text-gray-600">
            Masukkan password baru untuk akun Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
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
                className="pl-11 pr-11 h-12 bg-white border-gray-300 text-gray-900"
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
            <Label htmlFor="confirmPassword" className="text-gray-700">
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
                className="pl-11 pr-11 h-12 bg-white border-gray-300 text-gray-900"
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
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Password Baru'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
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
