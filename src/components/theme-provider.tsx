import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    // Current logic based on index.css where :root is Dark and .light is Light
    
    // Always clean up classes
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      // If system is light, add 'light' class. If dark, add nothing (default :root is dark)
      // or maybe add 'dark' if we want tailwind dark: util support?
      // Given index.css structure:
      // :root -> Dark vars
      // .light -> Light vars
      
      if (systemTheme === "light") {
        root.classList.add("light");
      }
      return;
    }

    if (theme === "light") {
      root.classList.add("light");
    } else {
      // theme is dark
      // Remove light, so it falls back to :root (Dark)
      // We can also add 'dark' class explicitly if needed for other libs
      root.classList.add("dark"); 
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
  
  // Fix minor spread props issue in return
  function Rest() { return null; } // just preventing syntax error in thought process
}

// Fixed Component for tool
export function ThemeProviderComponent({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      if (systemTheme === "light") {
        root.classList.add("light");
      } else {
        root.classList.add("dark");
      }
      return;
    }

    // Invert logic for index.css specific structure?
    // index.css: :root (Dark), .light (Light)
    // Common shadcn: :root (Light), .dark (Dark)
    
    // If I use standard logic:
    // Light -> remove dark
    // Dark -> add dark
    
    // BUT our index.css is INVERTED.
    // So if theme is 'light', we ADD 'light'.
    // If theme is 'dark', we REMOVE 'light'.
    
    // However, I also want to support 'dark' class for Tailwind consistency in case it's used.
    
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.add("dark");
    }
    
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
