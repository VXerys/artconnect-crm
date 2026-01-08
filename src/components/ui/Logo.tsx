import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import { Palette } from 'lucide-react';

interface LogoProps {
  /** Size of the logo */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show the text next to the logo */
  showText?: boolean;
  /** Text color class override */
  textClassName?: string;
  /** Custom className for wrapper */
  className?: string;
  /** Force a specific theme (useful for auth pages with white bg) */
  forceTheme?: 'light' | 'dark';
}

const sizeMap = {
  xs: { logo: 'w-8 h-8', text: 'text-base', gap: 'gap-2' },
  sm: { logo: 'w-10 h-10', text: 'text-lg', gap: 'gap-2.5' },
  md: { logo: 'w-12 h-12', text: 'text-xl', gap: 'gap-3' },
  lg: { logo: 'w-14 h-14', text: 'text-2xl', gap: 'gap-3' },
  xl: { logo: 'w-20 h-20', text: 'text-4xl', gap: 'gap-4' },
};

/**
 * ArtConnect Logo Component
 * Automatically switches between light and dark mode logos
 */
const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  textClassName,
  className = '',
  forceTheme,
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = forceTheme ? forceTheme === 'dark' : (theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches));
  
  const sizes = sizeMap[size];
  const iconSizes = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
  };
  
  // Default text color based on context
  const defaultTextClass = textClassName || (isDark ? 'text-white' : 'text-gray-900');

  if (!mounted) return null;

  return (
    <div className={`flex items-center ${sizes.gap} ${className}`}>
      <div className={`${sizes.logo} rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-orange-500/10`}>
        <img 
          src="/favicon.svg" 
          alt="ArtConnect" 
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <span className={`font-display font-bold tracking-tight ${sizes.text} ${defaultTextClass}`}>
          Art<span className="text-primary">Connect</span>
        </span>
      )}
    </div>
  );
};

export default Logo;

