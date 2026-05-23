import React, { useState } from "react";
import { useSettings } from "./hooks/useSettings";
import { usePrayerTimes } from "./hooks/usePrayerTimes";
import HijriDate from "./components/popup/HijriDate";
import NextPrayer from "./components/popup/NextPrayer";
import PrayerList from "./components/popup/PrayerList";
import QiblaCompass from "./components/popup/QiblaCompass";
import SettingsPanel from "./components/popup/SettingsPanel";
import { Clock, Compass, Settings, MapPin, Loader2 } from "lucide-react";
import { detectLocation } from "./utils/locationService";
import type { PrayerName, UserSettings } from "./types";
import { cn } from "./utils/cn";

// Import css styles
import "./style.css";

type Tab = "prayers" | "qibla" | "settings";

export default function Popup() {
  const [settings, updateSettings, isLoadingSettings] = useSettings();
  const {
    prayerStatuses,
    nextPrayer,
    isLoading: isLoadingPrayers,
  } = usePrayerTimes();

  const [activeTab, setActiveTab] = useState<Tab>("prayers");
  const [isOnboardingDetecting, setIsOnboardingDetecting] = useState(false);
  const [onboardingError, setOnboardingError] = useState("");

  const hasCoordinates = settings.coordinates !== null;

  const handleToggleReminder = async (name: PrayerName) => {
    const updated = {
      ...settings.perPrayerReminder,
      [name]: !settings.perPrayerReminder[name],
    };
    await updateSettings({ perPrayerReminder: updated });
    
    // Broadcast setting change to background worker to update chrome alarms
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: "SETTINGS_CHANGED" });
    }
  };

  const handleSaveSettings = async (newSettings: Partial<UserSettings>) => {
    await updateSettings(newSettings);
    
    // Broadcast setting change to background worker to update chrome alarms
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: "SETTINGS_CHANGED" });
    }
  };

  const handleOnboardingDetect = async () => {
    setIsOnboardingDetecting(true);
    setOnboardingError("");
    try {
      const loc = await detectLocation();
      await handleSaveSettings({
        coordinates: { lat: loc.lat, lng: loc.lng },
        cityName: loc.cityName || "Detected Location",
      });
    } catch (err: any) {
      console.error(err);
      setOnboardingError(err.message || "Could not detect location. Please input coordinates manually.");
      // Redirect to settings tab so they can input coordinates manually
      setActiveTab("settings");
    } finally {
      setIsOnboardingDetecting(false);
    }
  };

  return (
    <div className="w-[400px] h-[580px] flex flex-col bg-stone-50 text-stone-800 dark:bg-stone-950 dark:text-stone-100 overflow-hidden relative select-none">
      {/* Pattern background overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-5 pointer-events-none" />

      {/* Header (Only show if settings are loaded and not onboarding) */}
      {!isLoadingSettings && hasCoordinates && (
        <header className="relative z-10 flex items-center justify-between border-b border-stone-200/60 bg-white/70 px-4 py-3.5 backdrop-blur-md dark:border-stone-800/60 dark:bg-stone-950/70">
          <div className="flex flex-col">
            <h1 className="text-base font-extrabold text-emerald-800 dark:text-emerald-400 tracking-wide leading-none">
              NoorTab
            </h1>
            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold mt-1 uppercase tracking-wider">
              {settings.cityName || "Daily Prayers"}
            </span>
          </div>
          <HijriDate />
        </header>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-4">
        {isLoadingSettings ? (
          <div className="flex h-full flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-emerald-700 dark:text-emerald-400 animate-spin" />
            <span className="mt-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
              Loading Settings...
            </span>
          </div>
        ) : !hasCoordinates ? (
          /* Onboarding Screen */
          <div className="flex h-full flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-400">
                Welcome to NoorTab
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs leading-relaxed">
                Calculate precise prayer times, determine the Qibla, and receive reminders based on your exact location.
              </p>
            </div>

            <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
              <span className="text-4xl animate-bounce">🕌</span>
            </div>

            <div className="w-full space-y-3 pt-2">
              <button
                onClick={handleOnboardingDetect}
                disabled={isOnboardingDetecting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-600 transition-all duration-200 disabled:opacity-60"
              >
                {isOnboardingDetecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                Enable Location Access
              </button>

              <button
                onClick={() => {
                  // Direct to settings to input manually
                  setActiveTab("settings");
                  updateSettings({ coordinates: { lat: 0, lng: 0 } }); // Temporary trigger to pass screen
                }}
                className="text-xs font-semibold text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
              >
                Or configure manually in Settings
              </button>

              {onboardingError && (
                <p className="text-[10px] text-rose-500 font-medium">{onboardingError}</p>
              )}
            </div>
          </div>
        ) : (
          /* Standard App Tabs */
          <>
            {activeTab === "prayers" && (
              <div className="space-y-4">
                <NextPrayer nextPrayer={nextPrayer} isLoading={isLoadingPrayers} />
                <PrayerList
                  prayerStatuses={prayerStatuses}
                  isLoading={isLoadingPrayers}
                  onToggleReminder={handleToggleReminder}
                />
              </div>
            )}

            {activeTab === "qibla" && (
              <QiblaCompass coordinates={settings.coordinates} cityName={settings.cityName} />
            )}

            {activeTab === "settings" && (
              <SettingsPanel settings={settings} onSave={handleSaveSettings} />
            )}
          </>
        )}
      </main>

      {/* Navigation (Only show if settings are loaded and not onboarding) */}
      {!isLoadingSettings && hasCoordinates && (
        <nav className="relative z-10 flex border-t border-stone-200 bg-white dark:border-stone-800/80 dark:bg-stone-950">
          <button
            onClick={() => setActiveTab("prayers")}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2.5 text-[10px] font-semibold transition-colors duration-200",
              activeTab === "prayers"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
            )}
          >
            <Clock className="h-5 w-5 mb-0.5" />
            Prayers
          </button>
          <button
            onClick={() => setActiveTab("qibla")}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2.5 text-[10px] font-semibold transition-colors duration-200",
              activeTab === "qibla"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
            )}
          >
            <Compass className="h-5 w-5 mb-0.5" />
            Qibla
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2.5 text-[10px] font-semibold transition-colors duration-200",
              activeTab === "settings"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
            )}
          >
            <Settings className="h-5 w-5 mb-0.5" />
            Settings
          </button>
        </nav>
      )}
    </div>
  );
}
