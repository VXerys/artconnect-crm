import { useEffect } from "react";

interface ForceDarkModeProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that forces dark mode on specific pages
 * (landing page, auth pages) regardless of user theme preference.
 * The theme is restored when the component unmounts.
 */
export const ForceDarkMode = ({ children }: ForceDarkModeProps) => {
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Store current classes to restore later
    const hadLightClass = root.classList.contains("light");
    
    // Force dark mode by removing light class
    root.classList.remove("light");
    if (!root.classList.contains("dark")) {
      root.classList.add("dark");
    }
    
    // Cleanup: restore previous state when unmounting
    return () => {
      if (hadLightClass) {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    };
  }, []);

  return <>{children}</>;
};

export default ForceDarkMode;
