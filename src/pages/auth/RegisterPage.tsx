import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight,
  Sparkles, 
  User, 
  Check 
} from 'lucide-react';
import Logo from '@/components/ui/Logo';

// ============================================================================
// GOOGLE ICON COMPONENT
// ============================================================================

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

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
// REGISTER PAGE COMPONENT
// ============================================================================

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Validate form
  const validateForm = () => {
    if (!fullName.trim()) {
      toast({
        title: "Error",
        description: "Nama lengkap harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!email) {
      toast({
        title: "Error",
        description: "Email harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password minimal 8 karakter",
        variant: "destructive",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak cocok",
        variant: "destructive",
      });
      return false;
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "Anda harus menyetujui syarat dan ketentuan",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error, needsConfirmation } = await signUp(email, password, fullName);
      
      if (error) {
        toast({
          title: "Registrasi Gagal",
          description: error.message === "User already registered" 
            ? "Email sudah terdaftar" 
            : error.message,
          variant: "destructive",
        });
      } else if (needsConfirmation) {
        setShowConfirmation(true);
      } else {
        toast({
          title: "Selamat! 🎉",
          description: "Akun berhasil dibuat",
        });
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat registrasi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);

    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Registrasi Google Gagal",
          description: error.message,
          variant: "destructive",
        });
        setIsGoogleLoading(false);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat registrasi dengan Google",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  // Email confirmation screen
  if (showConfirmation) {
    return (
      <div className="dark min-h-screen flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500 relative z-10">
          {/* Animated Icon */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full animate-pulse" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/40">
              <Mail className="w-14 h-14 text-white" />
            </div>
          </div>

          {/* Confetti Icon */}
          <div className="text-4xl mb-4 animate-bounce">🎉</div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-foreground mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            Hampir Selesai!
          </h2>
          
          {/* Description */}
          <p className="text-muted-foreground mb-8 leading-relaxed animate-in slide-in-from-bottom-4 duration-500 delay-200">
            Kami telah mengirim link konfirmasi ke{' '}
            <span className="inline-block font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg mt-2">{email}</span>
          </p>

          {/* Steps */}
          <div className="bg-card/50 border border-border/50 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left space-y-4 animate-in slide-in-from-bottom-4 duration-500 delay-250">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Buka email Anda</p>
                <p className="text-sm text-muted-foreground">Cek inbox atau folder spam</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Klik link konfirmasi</p>
                <p className="text-sm text-muted-foreground">Link berlaku 24 jam</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Mulai berkreasi!</p>
                <p className="text-sm text-muted-foreground">Akun Anda siap digunakan</p>
              </div>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <Button
              variant="outline"
              className="w-full h-12 bg-transparent border-border text-foreground font-semibold
                hover:border-primary hover:text-primary hover:bg-primary/10
                active:scale-[0.98] transition-all duration-300"
              onClick={() => setShowConfirmation(false)}
            >
              ← Kembali ke Registrasi
            </Button>
            <Link to="/auth/login" className="block">
              <Button 
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 
                  hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-500/30
                  active:scale-[0.98] transition-all duration-300 font-semibold"
              >
                Sudah konfirmasi? Login →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background border-r border-border/50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="md" forceTheme="dark" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Buat Akun Baru
            </h2>
            <p className="text-muted-foreground">
              Mulai kelola karya seni Anda dengan mudah
            </p>
          </div>

          {/* Google Signup Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 mb-6 bg-transparent hover:bg-accent/10 border-border text-foreground font-medium transition-all duration-200 hover:shadow-md"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span className="ml-3">Lanjutkan dengan Google</span>
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                atau lanjutkan dengan email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Nama Lengkap
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-11 h-12 bg-transparent border-border text-foreground placeholder:text-muted-foreground"
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-transparent border-border text-foreground placeholder:text-muted-foreground"
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-transparent border-border text-foreground placeholder:text-muted-foreground"
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-transparent border-border text-foreground placeholder:text-muted-foreground"
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Password tidak cocok</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Saya setuju dengan{' '}
                <Link 
                  to="/privacy" 
                  state={{ from: 'register' }}
                  className="text-amber-500 hover:text-amber-600"
                >
                  Kebijakan Privasi
                </Link>
                {' '}dan{' '}
                <Link 
                  to="/terms" 
                  state={{ from: 'register' }}
                  className="text-amber-500 hover:text-amber-600"
                >
                  Syarat & Ketentuan
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 transition-all duration-200"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memuat...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-muted-foreground">
            Sudah punya akun?{' '}
            <Link 
              to="/auth/login" 
              className="text-amber-500 hover:text-amber-600 font-semibold"
            >
              Masuk
            </Link>
          </p>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        {/* Background Image */}
        <img 
          src="/register-bg.png" 
          alt="Art Studio Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Logo - Top Left */}
        <div className="absolute top-12 left-12 z-20">
          <Logo size="md" forceTheme="dark" />
        </div>

        {/* Content - Bottom Left */}
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 flex flex-col items-start justify-end h-full">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight max-w-lg">
            Mulai Perjalanan <br/>
            <span className="text-amber-400">Seni Anda</span>
          </h1>
          <p className="text-lg text-white/80 max-w-md mb-8 leading-relaxed">
            Bergabung dengan ribuan seniman yang telah sukses mengembangkan karir mereka bersama ArtConnect.
          </p>

          {/* Stats Badges - Horizontal */}
          <div className="flex items-center gap-6">
            <div>
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-sm text-white/60 font-medium">Seniman Aktif</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <div className="text-2xl font-bold text-white">5000+</div>
              <div className="text-sm text-white/60 font-medium">Karya Terdaftar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
