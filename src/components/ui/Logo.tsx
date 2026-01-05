import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme-provider';

// Import logos
import LogoLightMode from '@/assets/logo-lightmode.png';
import LogoDarkMode from '@/assets/logo-darkmode.png';

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
  const [isDark, setIsDark] = useState(true);
  
  useEffect(() => {
    if (forceTheme) {
      setIsDark(forceTheme === 'dark');
      return;
    }
    
    if (theme === 'system') {
      // Check system preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemDark);
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme, forceTheme]);
  
  // Select logo based on theme
  const logoSrc = isDark ? LogoDarkMode : LogoLightMode;
  
  const sizes = sizeMap[size];
  
  // Default text color based on context
  const defaultTextClass = textClassName || (isDark ? 'text-white' : 'text-gray-900');

  return (
    <div className={`flex items-center ${sizes.gap} ${className}`}>
      <img 
        src={logoSrc} 
        alt="ArtConnect Logo" 
        className={`${sizes.logo} object-contain`}
      />
      {showText && (
        <span className={`font-bold tracking-tight ${sizes.text} ${defaultTextClass}`}>
          ArtConnect
        </span>
      )}
    </div>
  );
};

export default Logo;

