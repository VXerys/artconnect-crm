import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/ui/Logo';
import { Mail, Loader2, ArrowLeft, CheckCircle2, RefreshCcw } from 'lucide-react';

/**
 * Forgot Password Page - Responsive & Modern Design
 */
const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Silakan masukkan email Anda",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsEmailSent(true);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen - Responsive
  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Success Card */}
          <div className="bg-card border border-border rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Icon Container */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2 animate-in slide-in-from-bottom-4 duration-500 delay-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Email Terkirim! 📬
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Kami telah mengirim link reset password ke
              </p>
              <div className="inline-block bg-primary/10 px-3 py-1.5 rounded-lg">
                <span className="text-sm sm:text-base font-semibold text-primary break-all">
                  {email}
                </span>
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                Silakan cek inbox atau folder spam Anda
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500 delay-200">
              <Button
                variant="outline"
                className="w-full h-11 sm:h-12 gap-2 font-medium"
                onClick={() => setIsEmailSent(false)}
              >
                <RefreshCcw className="w-4 h-4" />
                Kirim Ulang Email
              </Button>
              
              <Link to="/auth/login" className="block">
                <Button 
                  variant="ghost" 
                  className="w-full h-11 sm:h-12 gap-2 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Login
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <p className="text-xs sm:text-sm text-center text-muted-foreground/70 animate-in fade-in duration-500 delay-300">
              Tidak menerima email? Cek folder spam atau tunggu beberapa menit.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Form - Responsive
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6 sm:mb-8 animate-in fade-in duration-500">
          <Logo size="md" showText={true} forceTheme="light" />
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Lupa Password?
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Masukkan email Anda dan kami akan mengirim link untuk reset password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 sm:h-12 font-semibold text-sm sm:text-base gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  Kirim Link Reset
                </>
              )}
            </Button>
          </form>

          {/* Back Link */}
          <div className="pt-4 border-t border-border">
            <Link 
              to="/auth/login" 
              className="flex items-center justify-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground/70 mt-6 sm:mt-8 animate-in fade-in duration-500 delay-200">
          Belum punya akun?{' '}
          <Link to="/auth/register" className="text-primary hover:underline font-medium">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
