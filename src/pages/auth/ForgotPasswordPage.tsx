import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/ui/Logo';
import { Mail, Loader2, ArrowLeft, CheckCircle2, RefreshCcw } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Error", description: "Silakan masukkan email Anda", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setIsEmailSent(true);
      }
    } catch (err) {
      toast({ title: "Error", description: "Terjadi kesalahan saat mengirim email", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="dark min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Email Terkirim! 📬</h2>
              <p className="text-muted-foreground">Kami telah mengirim link reset password ke</p>
              <div className="inline-block bg-primary/10 px-3 py-1.5 rounded-lg">
                <span className="font-semibold text-primary break-all">{email}</span>
              </div>
              <p className="text-sm text-muted-foreground pt-2">Silakan cek inbox atau folder spam Anda</p>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full h-11 gap-2" onClick={() => setIsEmailSent(false)}>
                <RefreshCcw className="w-4 h-4" />
                Kirim Ulang Email
              </Button>
              <Link to="/auth/login" className="block">
                <Button variant="ghost" className="w-full h-11 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center mb-6">
          <Logo size="md" showText={true} forceTheme="dark" />
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-foreground">Lupa Password?</h1>
            <p className="text-muted-foreground">Masukkan email Anda dan kami akan mengirimkan link untuk reset password</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" disabled={isLoading} required />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 gap-2" disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Memuat...</> : <><Mail className="w-4 h-4" />Kirim Link Reset</>}
            </Button>
          </form>
          <div className="pt-4 border-t border-border">
            <Link to="/auth/login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Belum punya akun? <Link to="/auth/register" className="text-primary hover:underline font-medium">Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
