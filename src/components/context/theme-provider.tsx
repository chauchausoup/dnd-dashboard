import {  useEffect, useState } from "react"
import { ThemeProviderContext } from "./theme-context"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export default function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      return storedTheme || defaultTheme;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return defaultTheme;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = (themeValue: Theme) => {
      root.classList.remove("light", "dark");

      if (themeValue === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(themeValue);
      }
    };

    updateTheme(theme);  

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        updateTheme("system"); 
      };

      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange); 
      };
    }
  }, [theme]);  

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);  
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}