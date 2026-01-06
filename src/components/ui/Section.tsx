import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

/**
 * Responsive Section Component
 * Provides consistent vertical spacing and section structure
 */
export const Section = forwardRef<HTMLElement, SectionProps>(({ 
  children, 
  className, 
  id,
  spacing = "lg" 
}, ref) => {
  const spacingClasses = {
    none: "",
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16 lg:py-20",
    lg: "py-16 sm:py-20 lg:py-24",
    xl: "py-20 sm:py-24 lg:py-32"
  };

  return (
    <section 
      ref={ref}
      id={id}
      className={cn(
        "w-full",
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </section>
  );
});

Section.displayName = "Section";
