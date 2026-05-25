import { useStorage } from "@plasmohq/storage/hook";
import { useEffect } from "react";
import type { UserSettings } from "../types";
import { DEFAULT_SETTINGS } from "../data/defaultSettings";

export function useSettings() {
  const [settings, setSettings] = useStorage<UserSettings>(
    "noortab-user-settings",
    (storedVal) => {
      if (!storedVal) return DEFAULT_SETTINGS;
      
      // Ensure migration safety by merging defaults carefully
      const merged = { ...DEFAULT_SETTINGS };
      
      // Only overwrite if property exists in storedVal and is not undefined
      Object.keys(DEFAULT_SETTINGS).forEach(key => {
        if (storedVal[key] !== undefined) {
          if (typeof DEFAULT_SETTINGS[key] === 'object' && DEFAULT_SETTINGS[key] !== null && !Array.isArray(DEFAULT_SETTINGS[key])) {
             merged[key] = { ...DEFAULT_SETTINGS[key], ...storedVal[key] };
          } else {
             merged[key] = storedVal[key];
          }
        }
      });

      return merged as UserSettings;
    }
  );

  // Synchronize dark/light theme on <html> root
  useEffect(() => {
    if (!settings) return;

    const applyTheme = (theme: UserSettings["theme"]) => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      if (theme === "system") {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.add(isSystemDark ? "dark" : "light");
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme(settings.theme);

    // Watch for system color scheme changes if theme is set to 'system'
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme("system");
      
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [settings?.theme]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    await setSettings((prev) => {
      const current = prev || settings || DEFAULT_SETTINGS;
      return { ...current, ...newSettings };
    });
  };

  // Return loading state if settings is not loaded yet
  const isLoading = settings === undefined;

  return [settings || DEFAULT_SETTINGS, updateSettings, isLoading] as const;
}
