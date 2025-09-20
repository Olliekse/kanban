/**
 * Theme Context Provider
 *
 * This context manages the application's theme state (light/dark mode).
 * It handles:
 * 1. Theme state management (light/dark)
 * 2. Persisting theme preference to localStorage
 * 3. Detecting system theme preference
 * 4. Applying theme to the document
 *
 * Key Features:
 * - Light and dark theme support
 * - Persistent theme storage
 * - System preference detection
 * - Document-level theme application
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Theme Type
 *
 * Defines the available theme options in our application.
 */
type Theme = "light" | "dark";

/**
 * Theme Context Type
 *
 * Defines the shape of the context value that will be provided
 * to all consuming components.
 */
interface ThemeContextType {
  theme: Theme; // Current theme
  toggleTheme: () => void; // Function to switch between themes
  setTheme: (theme: Theme) => void; // Function to set a specific theme
}

// Create the context with undefined as default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Provider Component
 *
 * This component provides theme-related state and functions to all child components.
 * It manages theme persistence and applies the theme to the document.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme state with light as default
  const [theme, setThemeState] = useState<Theme>("light");

  /**
   * Load theme from localStorage on mount
   *
   * This effect runs once when the component mounts. It:
   * 1. Checks localStorage for a saved theme preference
   * 2. Falls back to system preference if no saved theme exists
   * 3. Sets the initial theme state
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem("kanban-theme") as Theme;
    if (savedTheme) {
      // Use saved theme if available
      setThemeState(savedTheme);
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setThemeState(prefersDark ? "dark" : "light");
    }
  }, []);

  /**
   * Apply theme to document and save to localStorage
   *
   * This effect runs whenever the theme changes. It:
   * 1. Sets the data-theme attribute on the document element
   * 2. Saves the theme preference to localStorage for persistence
   */
  useEffect(() => {
    // Apply theme to document - this is used by CSS to switch themes
    document.documentElement.setAttribute("data-theme", theme);
    // Save theme preference for future visits
    localStorage.setItem("kanban-theme", theme);
  }, [theme]);

  /**
   * Toggle between light and dark themes
   *
   * This function switches the current theme to the opposite theme.
   */
  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  /**
   * Set a specific theme
   *
   * This function allows setting the theme to a specific value.
   *
   * @param newTheme - The theme to set
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Provide the context value to all child components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to use the Theme context
 *
 * This hook provides easy access to the theme context. It includes
 * error handling to ensure the hook is only used within a ThemeProvider.
 *
 * @returns The theme context value
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
