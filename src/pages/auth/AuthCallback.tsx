import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Logo from '@/components/ui/Logo';

/**
 * Auth Callback Page
 * Handles OAuth redirect and email confirmation tokens
 * Enhanced with premium white background design
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Memproses autentikasi...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage(error.message || 'Terjadi kesalahan saat autentikasi');
          setTimeout(() => navigate('/auth/login'), 3000);
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Login berhasil! Mengalihkan ke dashboard...');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
        } else {
          // No session - might be email confirmation
          setStatus('success');
          setMessage('Email terkonfirmasi! Mengalihkan ke login...');
          setTimeout(() => navigate('/auth/login', { replace: true }), 2000);
        }
      } catch (err) {
        console.error('Auth callback exception:', err);
        setStatus('error');
        setMessage('Terjadi kesalahan yang tidak terduga');
        setTimeout(() => navigate('/auth/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #fff 1px, transparent 1px),
              linear-gradient(to bottom, #fff 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 bg-card/50 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 p-10 max-w-sm w-full mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Logo size="lg" forceTheme="dark" />
        </div>

        {/* Status Icon with Animation */}
        <div className="mb-6 flex justify-center">
          {status === 'loading' && (
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center shadow-lg shadow-green-100/50 animate-[bounce_0.5s_ease-in-out]">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-white" />
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-rose-50 rounded-full flex items-center justify-center shadow-lg shadow-red-100/50">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center">
                <XCircle className="w-9 h-9 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Status Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          {status === 'loading' && 'Memproses...'}
          {status === 'success' && 'Berhasil!'}
          {status === 'error' && 'Gagal'}
        </h2>

        {/* Message */}
        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          {message}
        </p>

        {/* Progress Bar for Loading/Success States */}
        {status !== 'error' && (
          <div className="mt-6 w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                status === 'loading' 
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 animate-[loading_2s_ease-in-out_infinite]' 
                  : 'bg-gradient-to-r from-green-400 to-emerald-500 w-full'
              }`}
              style={status === 'loading' ? { width: '60%' } : undefined}
            />
          </div>
        )}
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes loading {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;
