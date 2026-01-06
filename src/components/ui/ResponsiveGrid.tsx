import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "none" | "sm" | "md" | "lg" | "xl";
}

/**
 * Responsive Grid Component
 * Provides flexible grid layout with responsive column configurations
 */
export const ResponsiveGrid = ({ 
  children, 
  className,
  cols = { base: 1, sm: 2, lg: 3 },
  gap = "md"
}: ResponsiveGridProps) => {
  const gapClasses = {
    none: "gap-0",
    sm: "gap-4",
    md: "gap-6 lg:gap-8",
    lg: "gap-8 lg:gap-10",
    xl: "gap-10 lg:gap-12"
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6"
  };

  const colClasses = [
    cols.base && gridCols[cols.base],
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`
  ].filter(Boolean).join(" ");

  return (
    <div 
      className={cn(
        "grid",
        colClasses,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};
