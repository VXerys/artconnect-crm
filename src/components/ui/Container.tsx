import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  noPadding?: boolean;
}

/**
 * Responsive Container Component
 * Provides consistent max-width and padding across all breakpoints
 */
export const Container = ({ 
  children, 
  className, 
  size = "xl",
  noPadding = false 
}: ContainerProps) => {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full"
  };

  return (
    <div 
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        !noPadding && "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
};
