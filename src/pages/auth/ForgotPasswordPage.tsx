import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/ui/Logo';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

/**
 * Forgot Password Page
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

  // Success screen
  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500">
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title with animation */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            Cek Email Anda! 📬
          </h2>
          
          {/* Description */}
          <p className="text-gray-500 mb-8 leading-relaxed animate-in slide-in-from-bottom-4 duration-500 delay-200">
            Kami telah mengirim link reset password ke{' '}
            <span className="font-semibold text-gray-800 bg-amber-100 px-2 py-0.5 rounded">{email}</span>
            <br />Silakan cek inbox atau folder spam Anda.
          </p>
          
          {/* Buttons with animations */}
          <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <Button
              variant="outline"
              className="w-full h-12 bg-white border-2 border-gray-200 text-gray-700 font-semibold
                hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50 hover:shadow-lg hover:shadow-amber-500/10
                active:scale-[0.98] transition-all duration-300"
              onClick={() => setIsEmailSent(false)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Kirim Ulang Email
            </Button>
            <Link to="/auth/login" className="block">
              <Button 
                variant="ghost" 
                className="w-full h-12 text-gray-500 font-medium
                  hover:text-gray-900 hover:bg-gray-100
                  active:scale-[0.98] transition-all duration-300"
              >
                ← Kembali ke Login
              </Button>
            </Link>
          </div>
          
          {/* Help text */}
          <p className="mt-8 text-xs text-gray-400 animate-in fade-in duration-500 delay-500">
            Tidak menerima email? Cek folder spam atau tunggu beberapa menit.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Logo size="lg" forceTheme="light" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Lupa Password?
          </h2>
          <p className="text-gray-600">
            Masukkan email Anda dan kami akan mengirim link untuk reset password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 bg-white border-gray-300 text-gray-900"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              'Kirim Link Reset'
            )}
          </Button>
        </form>

        {/* Back Link */}
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

export default ForgotPasswordPage;
