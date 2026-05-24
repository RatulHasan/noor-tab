import React, { useState, useEffect } from "react";
import { useSettings } from "./hooks/useSettings";
import { usePrayerTimes } from "./hooks/usePrayerTimes";
import NoorTabHero from "./components/newtab/NoorTabHero";
import AyahDisplay from "./components/newtab/AyahDisplay";
import DhikrCounter from "./components/newtab/DhikrCounter";
import HadithOfDay from "./components/newtab/HadithOfDay";
import IslamicCalendar from "./components/newtab/IslamicCalendar";
import { getTranslation } from "./data/translations";
import { MapPin, Loader2, Search, Settings2 } from "lucide-react";
import { detectLocation, geocodeLocation } from "./utils/locationService";
import { POPULAR_LOCATIONS } from "./data/popularLocations";
import type { UserSettings, WidgetConfig, WidgetId, FastingData } from "./types";
import { useStorage } from "@plasmohq/storage/hook";

// Import Phase 2 widgets and components
import PrayerStreakWidget from "./components/newtab/PrayerStreakWidget";
import AsmaUlHusna from "./components/newtab/AsmaUlHusna";
import GlobalPrayerWidget from "./components/newtab/GlobalPrayerWidget";
import JumuahBanner from "./components/newtab/JumuahBanner";
import WidgetCustomizer, { DEFAULT_WIDGETS } from "./components/newtab/WidgetCustomizer";
import AdhkarPlayer from "./components/shared/AdhkarPlayer";
import FastingTracker from "./components/shared/FastingTracker";
import QuranBookmark from "./components/shared/QuranBookmark";
import IslamicQuiz from "./components/shared/IslamicQuiz";
import AsmaCard from "./components/shared/AsmaCard";
import DuaLibrary from "./components/shared/DuaLibrary";
import BuyMeCoffee from "./components/shared/BuyMeCoffee";

// Import helpers
import { isTodayFriday } from "./utils/jumuahHelper";
import { isTodayRamadan } from "./utils/fastingHelper";

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

  const [showCustomizer, setShowCustomizer] = useState(false);
  const [widgetLayout] = useStorage<WidgetConfig[]>("widgetLayout", DEFAULT_WIDGETS);
  const [fastingData] = useStorage<FastingData>("fastingData");
  const isRamadan = fastingData?.isRamadanMode || isTodayRamadan();
  const isFriday = isTodayFriday();
  
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

  const lang = settings?.language || "en";

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
        setOnboardingError("Location not found. Please try a different query or enter coordinates.");
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

  const getBackgroundGradient = () => {
    if (isRamadan) {
      return "from-emerald-950/20 via-stone-900 to-stone-950 dark:from-emerald-950/20 dark:via-stone-950 dark:to-stone-950";
    }
    if (isFriday) {
      return "from-emerald-50/20 via-stone-50 to-stone-100 dark:from-emerald-950/20 dark:via-stone-950 dark:to-stone-900";
    }

    if (!nextPrayer) return "from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900";
    
    switch (nextPrayer.name.toLowerCase()) {
      case "fajr":
        // Night (Isha to Fajr): deep indigo / slate / dark green hues
        return "from-slate-100 via-stone-50 to-emerald-50 dark:from-slate-950 dark:via-stone-950 dark:to-emerald-950";
      case "dhuhr":
        // Sunrise/Morning (Fajr to Dhuhr): amber dawn/morning glow
        return "from-amber-50/40 via-stone-50 to-emerald-50/40 dark:from-stone-950 dark:via-stone-950 dark:to-amber-950";
      case "asr":
        // Midday (Dhuhr to Asr): sky/emerald hues
        return "from-sky-50/40 via-stone-50 to-emerald-50/40 dark:from-stone-950 dark:via-stone-950 dark:to-emerald-950";
      case "maghrib":
        // Afternoon (Asr to Maghrib): sunset/warm copper/amber
        return "from-orange-50/40 via-stone-50 to-amber-50/40 dark:from-stone-950 dark:via-stone-950 dark:to-orange-950";
      case "isha":
        // Evening/Dusk (Maghrib to Isha): rose / indigo twilight
        return "from-rose-50/40 via-indigo-50/40 to-stone-50 dark:from-rose-950 dark:via-indigo-950 dark:to-stone-950";
      default:
        return "from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900";
    }
  };

  const bgGradient = getBackgroundGradient();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);
  const hasCoordinates = settings.coordinates !== null;

  if (isLoadingSettings) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-700 dark:text-emerald-400 animate-spin" />
        <span className="mt-4 text-sm text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">
          {t("openingNoorTab")}
        </span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient} text-stone-800 dark:text-stone-100 flex flex-col font-sans transition-all duration-1000 relative px-6 py-8 overflow-x-hidden`}>
      {/* Pattern background overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-5 pointer-events-none" />

      {/* Mosque Silhouette at bottom-right of the screen */}
      {hasCoordinates && (
        <svg
          className="absolute bottom-0 right-0 h-48 md:h-72 w-80 md:w-[480px] text-emerald-900/10 dark:text-emerald-400/10 pointer-events-none select-none z-0"
          viewBox="0 0 200 100"
          fill="currentColor"
        >
          <rect x="0" y="96" width="200" height="4" />
          <path d="M 40 96 L 40 70 C 40 65, 45 60, 50 60 L 150 60 C 155 60, 160 65, 160 70 L 160 96 Z" />
          <path d="M 80 60 C 80 50, 75 42, 100 32 C 125 42, 120 50, 120 60 Z" />
          <line x1="100" y1="32" x2="100" y2="16" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 98.5 17 C 98.5 15.5, 100 14.5, 101.5 15 C 100.5 15.5, 100.5 16.5, 101.5 17 C 100 17.5, 98.5 18.5, 98.5 17 Z" />
          <path d="M 54 60 C 54 52, 50 46, 66 38 C 82 46, 78 52, 78 60 Z" />
          <line x1="66" y1="38" x2="66" y2="28" stroke="currentColor" strokeWidth="1.2" />
          <path d="M 122 60 C 122 52, 118 46, 134 38 C 150 46, 146 52, 146 60 Z" />
          <line x1="134" y1="38" x2="134" y2="28" stroke="currentColor" strokeWidth="1.2" />
          <rect x="26" y="30" width="8" height="66" />
          <rect x="24" y="55" width="12" height="3" rx="0.5" />
          <rect x="24" y="30" width="12" height="3" rx="0.5" />
          <path d="M 26 30 C 26 22, 34 22, 34 30 Z" />
          <line x1="30" y1="22" x2="30" y2="12" stroke="currentColor" strokeWidth="1" />
          <rect x="166" y="30" width="8" height="66" />
          <rect x="164" y="55" width="12" height="3" rx="0.5" />
          <rect x="164" y="30" width="12" height="3" rx="0.5" />
          <path d="M 166 30 C 166 22, 174 22, 174 30 Z" />
          <line x1="170" y1="22" x2="170" y2="12" stroke="currentColor" strokeWidth="1" />
          
          {/* Archway details */}
          <path d="M 92 96 L 92 82 C 92 78, 108 78, 108 82 L 108 96 Z" />
          <path d="M 72 96 L 72 85 C 72 82, 84 82, 84 85 L 84 96 Z" />
          <path d="M 116 96 L 116 85 C 116 82, 128 82, 128 85 L 128 96 Z" />
        </svg>
      )}

      {!hasCoordinates ? (
        /* Full-screen Onboarding */
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6 relative z-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-emerald-800 dark:text-emerald-400 tracking-wide">
              NoorTab
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              {t("welcomeSub")}
            </p>
          </div>

          <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
            <span className="text-5xl animate-bounce">🕌</span>
          </div>

          <div className="w-full space-y-4">
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
              {t("enableLocation")}
            </button>

            {/* Dropdown selectors for location */}
            <div className="rounded-xl border border-stone-200 bg-stone-100/40 p-4 dark:border-stone-800 dark:bg-stone-900/20 space-y-3 text-left">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                {t("selectCountryCity")}
              </span>
              
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <select
                    value={onboardingCountryName}
                    onChange={handleOnboardingCountryChange}
                    className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
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
                    className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 disabled:opacity-50"
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
                <div className="pt-2.5 space-y-3 border-t border-stone-200/50 dark:border-stone-800/50 mt-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder={t("city")}
                      value={onboardingCity}
                      onChange={(e) => setOnboardingCity(e.target.value)}
                      className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                    />
                    <input
                      type="text"
                      placeholder={t("country")}
                      value={onboardingCountry}
                      onChange={(e) => setOnboardingCountry(e.target.value)}
                      className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleOnboardingSearch}
                    disabled={isOnboardingSearching || !onboardingCity || !onboardingCountry}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {isOnboardingSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {isOnboardingSearching ? t("searching") : t("searchLocation")}
                  </button>
                </div>
              )}
            </div>

            {onboardingError && (
              <p className="text-xs text-rose-500 font-medium leading-normal">{onboardingError}</p>
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

          {/* Friday Jumu'ah Banner */}
          <JumuahBanner />

          {/* Dynamic Widget Grid */}
          {(() => {
            const sortedVisible = [...widgetLayout]
              .filter((w) => w.visible)
              .sort((a, b) => a.order - b.order);

            const renderWidget = (id: WidgetId) => {
              switch (id) {
                case "ayah":
                  return <AyahDisplay key={id} />;
                case "hadith":
                  return <HadithOfDay key={id} />;
                case "dhikr":
                  return <DhikrCounter key={id} />;
                case "islamicCalendar":
                  return <IslamicCalendar key={id} />;
                case "adhkar":
                  return <AdhkarPlayer key={id} />;
                case "asmaName":
                  return <AsmaUlHusna key={id} />;
                case "duaLibrary":
                  return <DuaLibrary key={id} />;
                case "quiz":
                  return <IslamicQuiz key={id} />;
                case "fastingTracker":
                  return <FastingTracker key={id} />;
                case "quranBookmark":
                  return <QuranBookmark key={id} />;
                case "prayerStreak":
                  return <PrayerStreakWidget key={id} />;
                default:
                  return null;
              }
            };

            // Full-width widgets (ayah always full width)
            const fullWidthIds: WidgetId[] = ["ayah", "adhkar", "duaLibrary", "prayerStreak", "fastingTracker", "quranBookmark"];
            const gridIds = sortedVisible.filter((w) => !fullWidthIds.includes(w.id));
            const fullIds = sortedVisible.filter((w) => fullWidthIds.includes(w.id));

            return (
              <div className="space-y-6">
                {fullIds.map((w) => renderWidget(w.id))}
                {gridIds.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {gridIds.map((w) => renderWidget(w.id))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Global Prayer Times */}
          <GlobalPrayerWidget />

          {/* Buy Me a Coffee + Customize button */}
          <div className="flex items-center justify-between pt-2">
            <BuyMeCoffee variant="badge" />
            <button
              onClick={() => setShowCustomizer(true)}
              className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white/80 dark:border-stone-850 dark:bg-stone-900/80 px-4 py-2.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 shadow-sm transition-all duration-200"
            >
              <Settings2 className="h-4 w-4" />
              {t("customizeDashboard")}
            </button>
          </div>

          {/* Widget Customizer Drawer */}
          <WidgetCustomizer isOpen={showCustomizer} onClose={() => setShowCustomizer(false)} />

          {/* Floating Buy Me a Coffee Button */}
          <BuyMeCoffee variant="floating" />
        </div>
      )}
    </div>
  );
}
