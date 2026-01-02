/**
 * Responsive Utilities Index
 * 
 * Central export for all responsive-related utilities.
 * Import from '@/lib/responsive' for easy access.
 */

// Breakpoint definitions and utilities
export {
  BREAKPOINTS,
  CONTAINER_WIDTHS,
  TOUCH_TARGETS,
  type BreakpointKey,
  type DeviceType,
  type Orientation,
  getDeviceType,
  getCurrentBreakpoint,
  isBreakpointUp,
  isBreakpointDown,
  isBreakpointBetween,
  getOrientation,
  responsive,
  mediaQuery,
} from './breakpoints';

// React hooks
export { useResponsive } from './useResponsive';
export { useOrientation } from './useOrientation';

// Default export for convenience
import { useResponsive } from './useResponsive';
export default useResponsive;
