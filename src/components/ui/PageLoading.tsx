import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Minimum time to show loading (ms) - helps prevent flash */
  minDisplay?: number;
}

/**
 * Consistent loading indicator for all pages
 * Use this component for page-level loading states
 * 
 * Optimized for fast perception:
 * - Uses CSS animations instead of JS
 * - Minimal DOM elements
 * - Fast fade-in animation (200ms)
 */
const PageLoading: React.FC<PageLoadingProps> = ({ 
  title = 'Memuat...', 
  subtitle,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      title: 'text-sm',
      subtitle: 'text-xs'
    },
    md: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      title: 'text-base',
      subtitle: 'text-sm'
    },
    lg: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8',
      title: 'text-lg',
      subtitle: 'text-base'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className="flex-1 flex items-center justify-center min-h-[300px] animate-in fade-in duration-200">
      <div className="text-center">
        {/* Simple Spinner - minimal DOM */}
        <div className={`${sizes.container} mx-auto mb-3`}>
          <Loader2 className={`${sizes.icon} w-full h-full text-amber-500 animate-spin`} />
        </div>
        
        {/* Text - compact */}
        <p className={`${sizes.title} text-muted-foreground font-medium`}>{title}</p>
        {subtitle && (
          <p className={`${sizes.subtitle} text-muted-foreground/60 mt-0.5`}>{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default PageLoading;
