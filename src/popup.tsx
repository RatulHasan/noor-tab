import React, { useState } from "react";
import { useSettings } from "./hooks/useSettings";
import { usePrayerTimes } from "./hooks/usePrayerTimes";
import { useStorage } from "@plasmohq/storage/hook";
import HijriDate from "./components/popup/HijriDate";
import NextPrayer from "./components/popup/NextPrayer";
import PrayerList from "./components/popup/PrayerList";
import QiblaCompass from "./components/popup/QiblaCompass";
import SettingsPanel from "./components/popup/SettingsPanel";
import IslamicEventCard from "./components/popup/IslamicEventCard";
import { Clock, Compass, Settings, MapPin, Loader2, Search, VolumeX, BookOpen, Sparkles } from "lucide-react";
import { detectLocation, geocodeLocation, getCoordinatesLocalDate } from "./utils/locationService";
import { getTranslation } from "./data/translations";
import { POPULAR_LOCATIONS } from "./data/popularLocations";
import type { PrayerName, UserSettings } from "./types";
import { cn } from "./utils/cn";

// Import new Phase 2 components
import AdhkarPlayer from "./components/shared/AdhkarPlayer";
import PrayerStreakTracker from "./components/shared/PrayerStreakTracker";
import FastingTracker from "./components/shared/FastingTracker";
import QuranBookmark from "./components/shared/QuranBookmark";
import FocusModeToggle from "./components/popup/FocusModeToggle";
import BackupManager from "./components/popup/BackupManager";
import BuyMeCoffee from "./components/shared/BuyMeCoffee";


// Import CSS style
import "./style.css";

type Tab = "prayers" | "adhkar" | "quran" | "qibla" | "settings";

export default function Popup() {
  const [settings, updateSettings, isLoadingSettings] = useSettings();
  const {
    prayerStatuses,
    nextPrayer,
    isLoading: isLoadingPrayers,
  } = usePrayerTimes();

  // Track whether adhan is actively playing (written by NoorTabHero)
  const [adhanIsPlaying] = useStorage<boolean>("adhanIsPlaying", false);

  const [activeTab, setActiveTab] = useState<Tab>("prayers");
  
  // Onboarding Location Access Detection states
  const [isOnboardingDetecting, setIsOnboardingDetecting] = useState(false);
  const [onboardingError, setOnboardingError] = useState("");

  // Onboarding popular dropdown states
  const [onboardingCountryName, setOnboardingCountryName] = useState("");
  const [onboardingCityName, setOnboardingCityName] = useState("");

  // Onboarding Geocode Search states
  const [onboardingCity, setOnboardingCity] = useState("");
  const [onboardingCountry, setOnboardingCountry] = useState("");
  const [isOnboardingSearching, setIsOnboardingSearching] = useState(false);

  const hasCoordinates = settings.coordinates !== null;
  const lang = settings?.language || "en";

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

  const handleStopAllAdhan = () => {
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: "STOP_ALL_ADHAN" });
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
      setOnboardingError(err.message);
    } finally {
      setIsOnboardingDetecting(false);
    }
  };

  const handleOnboardingSearch = async () => {
    if (!onboardingCity || !onboardingCountry) return;
    setIsOnboardingSearching(true);
    setOnboardingError("");
    try {
      const result = await geocodeLocation(onboardingCity, onboardingCountry);
      if (result) {
        await handleSaveSettings({
          coordinates: { lat: result.lat, lng: result.lng },
          cityName: result.cityName,
        });
      } else {
        setOnboardingError("Location not found. Please try a different query or enter coordinates in settings.");
      }
    } catch (err) {
      console.error(err);
      setOnboardingError("Search failed. Check your internet connection.");
    } finally {
      setIsOnboardingSearching(false);
    }
  };

  const handleOnboardingCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setOnboardingCountryName(val);
    setOnboardingCityName("");
    if (val !== "custom" && val !== "") {
      const country = POPULAR_LOCATIONS.find(c => c.countryName === val);
      if (country && country.cities.length > 0) {
        const firstCity = country.cities[0];
        setOnboardingCityName(firstCity.name);
        handleSaveSettings({
          coordinates: { lat: firstCity.lat, lng: firstCity.lng },
          cityName: firstCity.name,
        });
      }
    }
  };

  const handleOnboardingCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setOnboardingCityName(val);
    if (val !== "custom" && val !== "") {
      const country = POPULAR_LOCATIONS.find(c => c.countryName === onboardingCountryName);
      const city = country?.cities.find(ct => ct.name === val);
      if (city) {
        handleSaveSettings({
          coordinates: { lat: city.lat, lng: city.lng },
          cityName: city.name,
        });
      }
    }
  };

  // Translation helper
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  return (
    <div className="w-[400px] h-[580px] flex flex-col bg-stone-50 text-stone-800 dark:bg-stone-950 dark:text-stone-100 overflow-hidden relative select-none">
      {/* Pattern background overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-5 pointer-events-none" />

      {/* Header (Always show if settings are loaded) */}
      {!isLoadingSettings && (
        <header className="relative z-20 overflow-visible flex items-center justify-between border-b border-stone-200/60 bg-white/70 px-4 py-3.5 backdrop-blur-md dark:border-stone-800/60 dark:bg-stone-950/70">
          <div className="flex flex-col">
            <h1 className="text-base font-extrabold text-emerald-800 dark:text-emerald-400 tracking-wide leading-none">
              NoorTab
            </h1>
            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold mt-1 uppercase tracking-wider">
              {settings.cityName || t("calcSettings")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HijriDate date={getCoordinatesLocalDate(settings.coordinates)} />
            {/* Only show mute button while adhan is actually playing */}
            {adhanIsPlaying && (
              <button
                type="button"
                onClick={handleStopAllAdhan}
                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400 transition-colors animate-pulse"
                title={t("stopAdhanGlobal")}
              >
                <VolumeX className="h-3.5 w-3.5" />
              </button>
            )}
            <FocusModeToggle />
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-4">
        {isLoadingSettings ? (
          <div className="flex h-full flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-emerald-700 dark:text-emerald-400 animate-spin" />
            <span className="mt-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
              {t("loadingSettings")}
            </span>
          </div>
        ) : (
          <>
            {/* Settings Tab (Always accessible) */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                <SettingsPanel settings={settings} onSave={handleSaveSettings} />
                <BackupManager />
                <BuyMeCoffee variant="badge" className="w-full text-center flex justify-center py-2" />
              </div>
            )}

            {/* Adhkar Tab */}
            {activeTab === "adhkar" && (
              <div className="space-y-4">
                <AdhkarPlayer />
              </div>
            )}

            {/* Quran Tab */}
            {activeTab === "quran" && (
              <div className="space-y-4">
                <QuranBookmark />
                <PrayerStreakTracker />
                <FastingTracker />
              </div>
            )}

            {/* Prayers Tab */}
            {activeTab === "prayers" && (
              <>
                {!hasCoordinates ? (
                  /* Onboarding Panel */
                  <div className="flex h-full flex-col items-center justify-center text-center p-4 space-y-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-black text-emerald-800 dark:text-emerald-400">
                        {t("welcome")}
                      </h2>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 max-w-xs leading-relaxed">
                        {t("welcomeSub")}
                      </p>
                    </div>

                    <div className="w-full space-y-3">
                      <button
                        onClick={handleOnboardingDetect}
                        disabled={isOnboardingDetecting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-600 transition-all duration-200 disabled:opacity-60"
                      >
                        {isOnboardingDetecting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        {t("enableLocation")}
                      </button>

                      {/* Dropdown selectors for location */}
                      <div className="rounded-xl border border-stone-200 bg-stone-100/40 p-3 dark:border-stone-800 dark:bg-stone-900/20 space-y-2 text-left">
                        <span className="text-[9px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                          {t("selectCountryCity")}
                        </span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <select
                              value={onboardingCountryName}
                              onChange={handleOnboardingCountryChange}
                              className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                            >
                              <option value="">{t("countryPlaceholder")}</option>
                              {POPULAR_LOCATIONS.map((c) => (
                                <option key={c.countryName} value={c.countryName}>
                                  {c.countryName}
                                </option>
                              ))}
                              <option value="custom">{t("otherSearch")}</option>
                            </select>
                          </div>

                          <div>
                            <select
                              value={onboardingCityName}
                              onChange={handleOnboardingCityChange}
                              disabled={!onboardingCountryName || onboardingCountryName === "custom"}
                              className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 disabled:opacity-50"
                            >
                              <option value="">{t("cityPlaceholder")}</option>
                              {POPULAR_LOCATIONS.find(c => c.countryName === onboardingCountryName)?.cities.map((city) => (
                                <option key={city.name} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                              {onboardingCountryName && onboardingCountryName !== "custom" && (
                                <option value="custom">{t("otherSearch")}</option>
                              )}
                            </select>
                          </div>
                        </div>

                        {/* Search Location inputs only if custom selected */}
                        {(onboardingCountryName === "custom" || onboardingCityName === "custom") && (
                          <div className="pt-1.5 space-y-2 border-t border-stone-200/50 dark:border-stone-800/50 mt-1.5">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder={t("city")}
                                value={onboardingCity}
                                onChange={(e) => setOnboardingCity(e.target.value)}
                                className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                              />
                              <input
                                type="text"
                                placeholder={t("country")}
                                value={onboardingCountry}
                                onChange={(e) => setOnboardingCountry(e.target.value)}
                                className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleOnboardingSearch}
                              disabled={isOnboardingSearching || !onboardingCity || !onboardingCountry}
                              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-50"
                            >
                              {isOnboardingSearching ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Search className="h-3.5 w-3.5" />
                              )}
                              {isOnboardingSearching ? t("searching") : t("searchLocation")}
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveTab("settings")}
                        className="text-xs font-semibold text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 block w-full text-center"
                      >
                        {t("configureManually")}
                      </button>

                      {onboardingError && (
                        <p className="text-[10px] text-rose-500 font-medium leading-normal">{onboardingError}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <NextPrayer nextPrayer={nextPrayer} isLoading={isLoadingPrayers} />
                    <PrayerList
                      prayerStatuses={prayerStatuses}
                      isLoading={isLoadingPrayers}
                      onToggleReminder={handleToggleReminder}
                    />
                    <IslamicEventCard />
                  </div>
                )}
              </>
            )}

            {/* Qibla Tab */}
            {activeTab === "qibla" && (
              <QiblaCompass coordinates={settings.coordinates} cityName={settings.cityName} />
            )}
          </>
        )}
      </main>

      {/* Navigation (Always show if settings are loaded) */}
      {!isLoadingSettings && (
        <nav className="relative z-10 flex border-t border-stone-200 bg-white dark:border-stone-800/80 dark:bg-stone-950">
          <button
            onClick={() => setActiveTab("prayers")}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2.5 text-[9px] font-semibold transition-colors duration-200",
              activeTab === "prayers"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
            )}
          >
            <Clock className="h-5 w-5 mb-0.5" />
            {t("prayers")}
          </button>
          <button
            onClick={() => setActiveTab("adhkar")}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2.5 text-[9px] font-semibold transition-colors duration-200",
              activeTab === "adhkar"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
            )}
          >
            <Sparkles className="h-5 w-5 mb-0.5" />
            {t("adhkar")}
          </button>
          <button
            onClick={() => setActiveTab("quran")}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2.5 text-[9px] font-semibold transition-colors duration-200",
              activeTab === "quran"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
            )}
          >
            <BookOpen className="h-5 w-5 mb-0.5" />
            {t("quran")}
          </button>
          <button
            onClick={() => setActiveTab("qibla")}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2.5 text-[9px] font-semibold transition-colors duration-200",
              activeTab === "qibla"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
            )}
          >
            <Compass className="h-5 w-5 mb-0.5" />
            {t("qibla")}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2.5 text-[9px] font-semibold transition-colors duration-200",
              activeTab === "settings"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
            )}
          >
            <Settings className="h-5 w-5 mb-0.5" />
            {t("settings")}
          </button>
        </nav>
      )}
    </div>
  );
}
