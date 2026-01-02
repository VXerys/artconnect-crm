import { useState, useEffect, useCallback } from 'react';
import {
  BREAKPOINTS,
  BreakpointKey,
  DeviceType,
  Orientation,
  getDeviceType,
  getCurrentBreakpoint,
  isBreakpointUp,
  isBreakpointDown,
  getOrientation,
  responsive,
} from './breakpoints';

/**
 * useResponsive Hook
 * 
 * Provides responsive utilities and device detection for React components.
 * Automatically updates on window resize and orientation change.
 */

interface ResponsiveState {
  // Dimensions
  width: number;
  height: number;
  
  // Device info
  deviceType: DeviceType;
  breakpoint: BreakpointKey;
  orientation: Orientation;
  
  // Convenience booleans
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  
  // Touch detection
  isTouchDevice: boolean;
  
  // Breakpoint checks
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
  
  // Breakpoint range checks
  isSmUp: boolean;
  isMdUp: boolean;
  isLgUp: boolean;
  isXlUp: boolean;
  isMdDown: boolean;
  isLgDown: boolean;
}

interface UseResponsiveReturn extends ResponsiveState {
  // Utility functions
  up: (breakpoint: BreakpointKey) => boolean;
  down: (breakpoint: BreakpointKey) => boolean;
  between: (min: BreakpointKey, max: BreakpointKey) => boolean;
  value: <T>(values: Partial<Record<BreakpointKey, T>> & { default: T }) => T;
}

// Detect if device supports touch
function isTouchDeviceCheck(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Get initial dimensions (SSR-safe)
function getInitialDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 768 }; // Default for SSR
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function useResponsive(): UseResponsiveReturn {
  const [dimensions, setDimensions] = useState(getInitialDimensions);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Update dimensions on resize and orientation change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsTouchDevice(isTouchDeviceCheck());

    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Debounced resize handler for performance
    let timeoutId: ReturnType<typeof setTimeout>;
    function debouncedResize() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    }

    // Initial call
    handleResize();

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', handleResize);

    // Also listen to screen orientation API if available
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleResize);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', handleResize);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleResize);
      }
    };
  }, []);

  const { width, height } = dimensions;

  // Computed values
  const deviceType = getDeviceType(width);
  const breakpoint = getCurrentBreakpoint(width);
  const orientation = getOrientation(width, height);

  // Utility functions
  const up = useCallback(
    (bp: BreakpointKey) => isBreakpointUp(width, bp),
    [width]
  );

  const down = useCallback(
    (bp: BreakpointKey) => isBreakpointDown(width, bp),
    [width]
  );

  const between = useCallback(
    (min: BreakpointKey, max: BreakpointKey) => 
      width >= BREAKPOINTS[min] && width < BREAKPOINTS[max],
    [width]
  );

  const value = useCallback(
    <T,>(values: Partial<Record<BreakpointKey, T>> & { default: T }): T =>
      responsive(width, values),
    [width]
  );

  return {
    // Dimensions
    width,
    height,
    
    // Device info
    deviceType,
    breakpoint,
    orientation,
    
    // Convenience booleans
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isLaptop: deviceType === 'laptop',
    isDesktop: deviceType === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    
    // Touch detection
    isTouchDevice,
    
    // Exact breakpoint checks
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2xl: breakpoint === '2xl',
    
    // Breakpoint range checks (up)
    isSmUp: up('sm'),
    isMdUp: up('md'),
    isLgUp: up('lg'),
    isXlUp: up('xl'),
    
    // Breakpoint range checks (down)
    isMdDown: down('md'),
    isLgDown: down('lg'),
    
    // Utility functions
    up,
    down,
    between,
    value,
  };
}

export default useResponsive;
