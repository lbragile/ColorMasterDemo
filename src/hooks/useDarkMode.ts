import { useCallback, useEffect } from "react";
import { IUseDarkModeOutput } from "../types/darkmode";
import useLocalStorage from "./useLocalStorage";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export default function useDarkMode(defaultValue?: boolean): IUseDarkModeOutput {
  const preferredScheme = useCallback((): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(COLOR_SCHEME_QUERY).matches;
    }

    return !!defaultValue;
  }, [defaultValue]);

  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>("darkMode", preferredScheme());

  // Update darkMode if os prefers changes
  useEffect(() => {
    const handler = () => setDarkMode(preferredScheme);
    const matchMedia = window.matchMedia(COLOR_SCHEME_QUERY);

    matchMedia.addEventListener("change", handler);
    return () => matchMedia.removeEventListener("change", handler);
  }, [setDarkMode, preferredScheme]);

  return { isDarkMode, toggle: () => setDarkMode((prev) => !prev) };
}
