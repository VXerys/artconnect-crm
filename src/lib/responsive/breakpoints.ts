/**
 * Responsive Breakpoint Definitions
 * Based on common device sizes and Tailwind CSS defaults
 */

// Breakpoint values in pixels
export const BREAKPOINTS = {
  xs: 0,      // Extra small phones
  sm: 640,    // Small phones (landscape)
  md: 768,    // Tablets (portrait)
  lg: 1024,   // Tablets (landscape) / Small laptops
  xl: 1280,   // Laptops / Small desktops
  '2xl': 1536 // Large desktops
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

// Device type definitions
export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

// Orientation types
export type Orientation = 'portrait' | 'landscape';

// Device detection based on screen width
export function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.md) return 'mobile';
  if (width < BREAKPOINTS.lg) return 'tablet';
  if (width < BREAKPOINTS.xl) return 'laptop';
  return 'desktop';
}

// Get current breakpoint key
export function getCurrentBreakpoint(width: number): BreakpointKey {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

// Check if width is at or above a breakpoint
export function isBreakpointUp(width: number, breakpoint: BreakpointKey): boolean {
  return width >= BREAKPOINTS[breakpoint];
}

// Check if width is below a breakpoint
export function isBreakpointDown(width: number, breakpoint: BreakpointKey): boolean {
  return width < BREAKPOINTS[breakpoint];
}

// Check if width is between two breakpoints
export function isBreakpointBetween(
  width: number, 
  min: BreakpointKey, 
  max: BreakpointKey
): boolean {
  return width >= BREAKPOINTS[min] && width < BREAKPOINTS[max];
}

// Get orientation from dimensions
export function getOrientation(width: number, height: number): Orientation {
  return width > height ? 'landscape' : 'portrait';
}

// Responsive value picker - returns value based on current breakpoint
export function responsive<T>(
  width: number,
  values: Partial<Record<BreakpointKey, T>> & { default: T }
): T {
  const breakpoint = getCurrentBreakpoint(width);
  const breakpointOrder: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  
  // Find the first matching breakpoint (from largest to smallest)
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp] as T;
    }
  }
  
  return values.default;
}

// CSS media query helpers (for use in styled components or inline styles)
export const mediaQuery = {
  up: (breakpoint: BreakpointKey) => `@media (min-width: ${BREAKPOINTS[breakpoint]}px)`,
  down: (breakpoint: BreakpointKey) => `@media (max-width: ${BREAKPOINTS[breakpoint] - 1}px)`,
  between: (min: BreakpointKey, max: BreakpointKey) => 
    `@media (min-width: ${BREAKPOINTS[min]}px) and (max-width: ${BREAKPOINTS[max] - 1}px)`,
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
};

// Container width recommendations per breakpoint
export const CONTAINER_WIDTHS = {
  xs: '100%',
  sm: '100%',
  md: '720px',
  lg: '960px',
  xl: '1140px',
  '2xl': '1320px',
} as const;

// Touch-friendly sizing recommendations
export const TOUCH_TARGETS = {
  minimum: 44,    // Minimum touch target (Apple HIG)
  comfortable: 48, // Comfortable touch target
  large: 56,      // Large touch target for important actions
} as const;
