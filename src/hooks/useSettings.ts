import { useStorage } from "@plasmohq/storage/hook";
import { useEffect } from "react";
import type { UserSettings } from "../types";
import { DEFAULT_SETTINGS } from "../data/defaultSettings";

export function useSettings() {
  const [settings, setSettings] = useStorage<UserSettings>(
    "noortab-user-settings",
    (storedVal) => {
      if (!storedVal) return DEFAULT_SETTINGS;
      
      // Ensure migration safety by merging defaults
      return {
        ...DEFAULT_SETTINGS,
        ...storedVal,
        perPrayerReminder: {
          ...DEFAULT_SETTINGS.perPrayerReminder,
          ...(storedVal.perPrayerReminder || {}),
        },
      };
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
    if (!settings) return;
    const merged = { ...settings, ...newSettings };
    await setSettings(merged);
  };

  // Return loading state if settings is not loaded yet
  const isLoading = settings === undefined;

  return [settings || DEFAULT_SETTINGS, updateSettings, isLoading] as const;
}
