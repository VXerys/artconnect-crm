import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  variant?: "display" | "title" | "heading" | "subheading" | "body" | "small" | "caption";
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "semibold" | "bold";
  gradient?: boolean;
}

/**
 * Responsive Typography Component
 * Provides consistent and responsive text styling across all breakpoints
 */
export const Typography = ({ 
  children, 
  className,
  as: Component = "p",
  variant = "body",
  align = "left",
  weight = "normal",
  gradient = false
}: TypographyProps) => {
  const variantClasses = {
    display: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight",
    title: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight",
    heading: "text-2xl sm:text-3xl md:text-4xl font-bold leading-snug",
    subheading: "text-xl sm:text-2xl md:text-3xl font-semibold leading-snug",
    body: "text-base sm:text-lg leading-relaxed",
    small: "text-sm sm:text-base leading-relaxed",
    caption: "text-xs sm:text-sm leading-normal"
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold"
  };

  const gradientClass = gradient 
    ? "bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
    : "";

  return (
    <Component 
      className={cn(
        variantClasses[variant],
        alignClasses[align],
        weightClasses[weight],
        gradientClass,
        className
      )}
    >
      {children}
    </Component>
  );
};
