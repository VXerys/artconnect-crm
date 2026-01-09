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
    
    // Add dark class
    const hadDark = root.classList.contains("dark");
    if (!hadDark) root.classList.add("dark");
    
    // Cleanup: only remove if it wasn't there before
    return () => {
      if (!hadDark) {
        root.classList.remove("dark");
      }
    };
  }, []);

  return <>{children}</>;
};

export default ForceDarkMode;
