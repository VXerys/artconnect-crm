import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Logo from '@/components/ui/Logo';

/**
 * Auth Callback Page
 * Handles OAuth redirect and email confirmation tokens
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center p-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Status Icon */}
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {status === 'loading' && 'Memproses...'}
          {status === 'success' && 'Berhasil!'}
          {status === 'error' && 'Gagal'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
