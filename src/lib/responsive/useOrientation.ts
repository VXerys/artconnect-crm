import { useState, useEffect, useCallback } from 'react';
import { Orientation, getOrientation } from './breakpoints';

/**
 * useOrientation Hook
 * 
 * Specifically tracks screen orientation changes.
 * Useful for handling rotation on mobile and tablet devices.
 */

interface OrientationState {
  orientation: Orientation;
  angle: number;
  isPortrait: boolean;
  isLandscape: boolean;
}

interface UseOrientationReturn extends OrientationState {
  // Check if device was rotated since mount
  wasRotated: boolean;
}

// Get orientation angle from Screen Orientation API or window
function getOrientationAngle(): number {
  if (typeof window === 'undefined') return 0;
  
  // Try Screen Orientation API first
  if (window.screen?.orientation?.angle !== undefined) {
    return window.screen.orientation.angle;
  }
  
  // Fallback to deprecated window.orientation
  if (typeof (window as any).orientation === 'number') {
    return (window as any).orientation;
  }
  
  // Infer from dimensions
  return window.innerWidth > window.innerHeight ? 90 : 0;
}

// Get initial state (SSR-safe)
function getInitialState(): OrientationState {
  if (typeof window === 'undefined') {
    return {
      orientation: 'landscape',
      angle: 0,
      isPortrait: false,
      isLandscape: true,
    };
  }
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  const orientation = getOrientation(width, height);
  const angle = getOrientationAngle();
  
  return {
    orientation,
    angle,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  };
}

export function useOrientation(): UseOrientationReturn {
  const [state, setState] = useState<OrientationState>(getInitialState);
  const [initialOrientation, setInitialOrientation] = useState<Orientation | null>(null);
  const [wasRotated, setWasRotated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleOrientationChange() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = getOrientation(width, height);
      const angle = getOrientationAngle();
      
      setState({
        orientation,
        angle,
        isPortrait: orientation === 'portrait',
        isLandscape: orientation === 'landscape',
      });
      
      // Track if rotated since mount
      if (initialOrientation && orientation !== initialOrientation) {
        setWasRotated(true);
      }
    }

    // Set initial orientation
    const currentOrientation = getOrientation(window.innerWidth, window.innerHeight);
    setInitialOrientation(currentOrientation);
    
    // Initial call
    handleOrientationChange();

    // Listen to orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Screen Orientation API
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
    };
  }, [initialOrientation]);

  return {
    ...state,
    wasRotated,
  };
}

export default useOrientation;
