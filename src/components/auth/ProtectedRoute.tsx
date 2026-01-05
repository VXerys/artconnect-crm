import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/ui/Logo';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center animate-in fade-in duration-300">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo size="lg" forceTheme="light" />
          </div>
          
          {/* Spinner */}
          <div className="relative w-12 h-12 mx-auto mb-3">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          </div>
          
          {/* Text */}
          <p className="text-gray-500 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
