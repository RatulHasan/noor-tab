import React, { useState, useEffect } from "react";
import { useSettings } from "./hooks/useSettings";
import { usePrayerTimes } from "./hooks/usePrayerTimes";
import NoorTabHero from "./components/newtab/NoorTabHero";
import AyahDisplay from "./components/newtab/AyahDisplay";
import DhikrCounter from "./components/newtab/DhikrCounter";
import HadithOfDay from "./components/newtab/HadithOfDay";
import IslamicCalendar from "./components/newtab/IslamicCalendar";
import { MapPin, Loader2 } from "lucide-react";
import { detectLocation } from "./utils/locationService";
import type { UserSettings } from "./types";

// Import CSS style
import "./style.css";

export default function NewTab() {
  const [settings, updateSettings, isLoadingSettings] = useSettings();
  const {
    prayers,
    prayerStatuses,
    nextPrayer,
    isLoading: isLoadingPrayers,
  } = usePrayerTimes();

  const [reminderPrayer, setReminderPrayer] = useState<string | null>(null);
  const [isOnboardingDetecting, setIsOnboardingDetecting] = useState(false);
  const [onboardingError, setOnboardingError] = useState("");

  // Parse "?reminder=" parameter from the URL query
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const reminder = params.get("reminder");
      if (reminder) {
        setReminderPrayer(reminder);
      }
    }
  }, []);

  const handleSaveSettings = async (newSettings: Partial<UserSettings>) => {
    await updateSettings(newSettings);
    
    // Broadcast setting change to background worker to update alarms
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
      setOnboardingError(
        err.message || "Failed to detect location. Please open the extension popup to set coordinates manually."
      );
    } finally {
      setIsOnboardingDetecting(false);
    }
  };

  const hasCoordinates = settings.coordinates !== null;

  if (isLoadingSettings) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-700 dark:text-emerald-400 animate-spin" />
        <span className="mt-4 text-sm text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">
          Opening NoorTab...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans transition-colors duration-300 relative px-6 py-8 overflow-x-hidden">
      {/* Pattern background overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-5 pointer-events-none" />

      {!hasCoordinates ? (
        /* Full-screen Onboarding */
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6 relative z-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-emerald-800 dark:text-emerald-400 tracking-wide">
              NoorTab
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Assalamu Alaikum. Please allow location access to calculate daily prayer times, Hijri dates, and Qibla directions.
            </p>
          </div>

          <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
            <span className="text-5xl animate-bounce">🕌</span>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={handleOnboardingDetect}
              disabled={isOnboardingDetecting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all duration-200 disabled:opacity-60"
            >
              {isOnboardingDetecting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <MapPin className="h-5 w-5" />
              )}
              Detect My Location
            </button>
            <p className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              You can also input manual coordinates in the extension popup menu.
            </p>
            {onboardingError && (
              <p className="text-xs text-rose-500 font-medium">{onboardingError}</p>
            )}
          </div>
        </div>
      ) : (
        /* Full App Dashboard */
        <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col justify-center space-y-6 relative z-10">
          {/* Main Clock, Greeting, Dates, Countdown, and Alarms */}
          {prayers && prayerStatuses && (
            <NoorTabHero
              prayers={prayers}
              prayerStatuses={prayerStatuses}
              nextPrayer={nextPrayer}
              cityName={settings.cityName}
              reminderPrayer={reminderPrayer}
            />
          )}

          {/* Daily Quranic Verse display */}
          <AyahDisplay />

          {/* Bottom row grid: Tasbih counter, Hadith, Calendar events */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DhikrCounter />
            <HadithOfDay />
            <IslamicCalendar />
          </div>
        </div>
      )}
    </div>
  );
}
