import React, { useState, useEffect, useCallback } from "react";
import { useSettings } from "./hooks/useSettings";
import { usePrayerTimes } from "./hooks/usePrayerTimes";
import NoorTabHero from "./components/newtab/NoorTabHero";
import AyahDisplay from "./components/newtab/AyahDisplay";
import DhikrCounter from "./components/newtab/DhikrCounter";
import HadithOfDay from "./components/newtab/HadithOfDay";
import IslamicCalendar from "./components/newtab/IslamicCalendar";
import { getTranslation } from "./data/translations";
import { MapPin, Loader2, Search, Settings2, ChevronRight, ChevronLeft, Check, ChevronDown, Sparkles, RotateCcw, Eye } from "lucide-react";
import { detectLocation, geocodeLocation } from "./utils/locationService";
import { POPULAR_LOCATIONS } from "./data/popularLocations";
import type { UserSettings, WidgetConfig, WidgetId, FastingData, PanelId, PanelItem } from "./types";
import { useStorage } from "@plasmohq/storage/hook";

// Import DnD Kit
import { type DragEndEvent, type DragOverEvent } from "@dnd-kit/core";

// Import Phase 2 widgets and components
import PrayerStreakWidget from "./components/newtab/PrayerStreakWidget";
import AsmaUlHusna from "./components/newtab/AsmaUlHusna";
import GlobalPrayerWidget from "./components/newtab/GlobalPrayerWidget";
import JumuahBanner from "./components/newtab/JumuahBanner";
import WidgetCustomizer from "./components/newtab/WidgetCustomizer";
import AdhkarPlayer from "./components/shared/AdhkarPlayer";
import FastingTracker from "./components/shared/FastingTracker";
import QuranBookmark from "./components/shared/QuranBookmark";
import IslamicQuiz from "./components/shared/IslamicQuiz";
import AsmaCard from "./components/shared/AsmaCard";
import DuaLibrary from "./components/shared/DuaLibrary";
import BuyMeCoffee from "./components/shared/BuyMeCoffee";
import { ADHAN_AUDIO_OPTIONS } from "./data/adhanAudios";
import { Storage } from "@plasmohq/storage";

// Import Layout components
import LeftPanel from "./components/newtab/layout/LeftPanel";
import CenterPanel from "./components/newtab/layout/CenterPanel";
import RightPanel from "./components/newtab/layout/RightPanel";
import BannerZone from "./components/newtab/layout/BannerZone";
import BottomWidgetRow from "./components/newtab/layout/BottomWidgetRow";
import { DragProvider } from "./components/newtab/layout/DragProvider";
import { MobilePanelDrawer } from "./components/newtab/layout/MobilePanelDrawer";
import { PrayerTimesCard } from "./components/newtab/layout/PrayerTimesCard";
import { QiblaCard } from "./components/newtab/layout/QiblaCard";
import { HeroSection } from "./components/newtab/layout/HeroSection";
import PurposeSearch from "./components/newtab/search/PurposeSearch";
import QuickAccessHub from "./components/newtab/hub/QuickAccessHub";

// Import hooks
import { useLayoutState } from "./hooks/useLayoutState";
import { useBreakpoint } from "./hooks/useBreakpoint";

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
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [fastingData] = useStorage<FastingData>("fastingData");
  const [devMockCityName] = useStorage<string>("devMockCityName", "");
  const isRamadan = fastingData?.isRamadanMode || isTodayRamadan();
  const isFriday = isTodayFriday();
  
  // Layout and Responsive hooks
  const { layoutState, reorderWithinPanel, moveBetweenPanels, resetLayout } = useLayoutState();
  const breakpoint = useBreakpoint();
  const [isDragMode, setIsDragMode] = useState(false);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [activeHubTabId, setActiveHubTabId] = useStorage<string>("activeHubTab", "quran");
  const [isBottomPanelCollapsed, setIsBottomPanelCollapsed] = useStorage<boolean>("isBottomPanelCollapsed", true);

  // Drag Orchestration
  const findPanel = (id: string): PanelId | null => {
    for (const [panelId, items] of Object.entries(layoutState.panels)) {
      if (items.find(i => i.id === id)) return panelId as PanelId;
    }
    return null;
  };

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const sourcePanel = findPanel(active.id as string);
    const targetPanel = over.id.toString().startsWith('panel-')
      ? over.id.toString().replace('panel-', '') as PanelId
      : findPanel(over.id as string);

    if (!sourcePanel || !targetPanel || sourcePanel === targetPanel) return;
  }, [layoutState.panels]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sourcePanel = findPanel(active.id as string);
    const overIsPanel = over.id.toString().startsWith('panel-');
    const targetPanel = overIsPanel
      ? over.id.toString().replace('panel-', '') as PanelId
      : findPanel(over.id as string);

    if (!sourcePanel || !targetPanel) return;

    if (sourcePanel === targetPanel) {
      reorderWithinPanel(sourcePanel, active.id as string, over.id as string);
    } else {
      const targetItems = layoutState.panels[targetPanel];
      const overIndex = overIsPanel
        ? targetItems.length 
        : targetItems.findIndex(i => i.id === over.id);
      moveBetweenPanels(active.id as string, sourcePanel, targetPanel, overIndex);
    }
  }, [layoutState.panels, reorderWithinPanel, moveBetweenPanels]);
  
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
        
        // Auto-play Adhan if configured
        const configuredAdhan = settings.adhanAudio || "none";
        if (configuredAdhan !== "none") {
          const option = ADHAN_AUDIO_OPTIONS.find((o) => o.key === configuredAdhan);
          if (option && option.url) {
            const audio = new Audio(option.url);
            audioRef.current = audio;
            audio.play().catch((err) => console.error("Adhan autoplay blocked:", err));
            
            const globalStorage = new Storage();
            globalStorage.set("adhanIsPlaying", true).catch(() => {});
            
            audio.onended = () => {
                globalStorage.set("adhanIsPlaying", false).catch(() => {});
            };
          }
        }
      }
    }
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, [settings.adhanAudio]);

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
        cityName: loc.cityName || t("detectedLocation"),
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
        setOnboardingError(t("locationNotFound"));
      }
    } catch (err) {
      console.error(err);
      setOnboardingError(t("searchFailed"));
    } finally {
      setIsOnboardingSearching(false);
    }
  };

  const handleOnboardingCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setOnboardingCountryName(val);
    setOnboardingCityName("");
    setOnboardingError("");
  };

  const handleOnboardingCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setOnboardingCityName(val);
    setOnboardingError("");
  };

  const handleConfirmOnboarding = async () => {
    if (!onboardingCountryName || !onboardingCityName || onboardingCountryName === "custom" || onboardingCityName === "custom") return;
    
    const country = POPULAR_LOCATIONS.find(c => c.countryName === onboardingCountryName);
    const city = country?.cities.find(ct => ct.name === onboardingCityName);
    
    if (city) {
      setIsOnboardingSearching(true);
      try {
        await handleSaveSettings({
          coordinates: { lat: city.lat, lng: city.lng },
          cityName: city.name,
        });
      } catch (err) {
        setOnboardingError(t("errorSaving"));
      } finally {
        setIsOnboardingSearching(false);
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
      case "globalPrayer":
        return <GlobalPrayerWidget key={id} />;
      default:
        return null;
    }
  };

  const handleHubTabChange = useCallback((id: string) => {
    setActiveHubTabId(id);
  }, [setActiveHubTabId]);

  const renderPanelItem = useCallback((item: PanelItem) => {
    if (item.type === 'fixed') {
      switch (item.id) {
        case 'fixed-prayerTimes': return <PrayerTimesCard />;
        case 'fixed-ayah': return <HeroSection />;
        case 'fixed-search': return (
          <div className="px-4">
            <PurposeSearch onTabChange={handleHubTabChange} />
          </div>
        );
        case 'fixed-hub': return (
          <div className="flex-1 px-4 pb-8">
            <QuickAccessHub activeTabId={activeHubTabId} onTabChange={handleHubTabChange} />
          </div>
        );
        case 'fixed-qibla': return <QiblaCard />;
        default: return null;
      }
    }

    if (item.type === 'widget' && item.widgetId) {
      return renderWidget(item.widgetId);
    }

    return null;
  }, [activeHubTabId, handleHubTabChange]);


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
    <DragProvider 
      onDragEnd={handleDragEnd} 
      onDragOver={handleDragOver}
      panels={layoutState.panels}
    >
      <div className={`h-screen flex flex-col bg-gradient-to-br ${bgGradient} text-stone-800 dark:text-stone-100 font-sans transition-all duration-1000 relative overflow-hidden`}>
        {/* Pattern background overlay */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-[0.03] pointer-events-none" />

      {!hasCoordinates ? (
        /* Full-screen Onboarding */
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6 relative z-10 px-6">
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

            {onboardingCountryName && onboardingCityName && onboardingCountryName !== "custom" && onboardingCityName !== "custom" && (
              <button
                onClick={handleConfirmOnboarding}
                disabled={isOnboardingSearching}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all duration-200"
              >
                {isOnboardingSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
                {t("saveSettings")}
              </button>
            )}

            {onboardingError && (
              <p className="text-xs text-rose-500 font-medium leading-normal">{onboardingError}</p>
            )}
          </div>
        </div>
      ) : (
        /* Full App 3-Column Dashboard */
        <div className="flex-1 flex flex-col h-full relative z-10">
          {/* Mobile Drawers (md/sm breakpoints) */}
          <MobilePanelDrawer
            isOpen={isLeftDrawerOpen}
            onClose={() => setIsLeftDrawerOpen(false)}
            title={t("prayerTimesAndWidgets")}
            side="left"
          >
            <LeftPanel 
              items={layoutState.panels.left} 
              isDragMode={isDragMode && breakpoint === 'xl'} 
              renderPanelItem={renderPanelItem} 
            />
          </MobilePanelDrawer>

          <MobilePanelDrawer
            isOpen={isRightDrawerOpen}
            onClose={() => setIsRightDrawerOpen(false)}
            title={t("qiblaAndWidgets")}
            side="right"
          >
            <RightPanel 
              items={layoutState.panels.right} 
              isDragMode={isDragMode && breakpoint === 'xl'} 
              renderPanelItem={renderPanelItem} 
            />
          </MobilePanelDrawer>

          <BannerZone 
            reminder={reminderPrayer}
            isJumuah={isFriday}
            isRamadan={isRamadan}
          />

          <div className="flex flex-1 gap-4 p-6 overflow-hidden relative">
             {/* Mobile Drawer Toggles */}
             {breakpoint === 'md' && (
                <>
                  <button 
                    onClick={() => setIsLeftDrawerOpen(true)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white/80 dark:bg-stone-900/80 p-2 rounded-r-2xl border-y border-r border-stone-200 dark:border-stone-800 text-emerald-700 shadow-md hover:pl-4 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => setIsRightDrawerOpen(true)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white/80 dark:bg-stone-900/80 p-2 rounded-l-2xl border-y border-l border-stone-200 dark:border-stone-800 text-emerald-700 shadow-md hover:pr-4 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                </>
             )}

             <LeftPanel 
                items={layoutState.panels.left} 
                isDragMode={isDragMode && breakpoint !== 'sm'}
                renderPanelItem={renderPanelItem}
                collapsed={breakpoint === 'lg'}
                hidden={breakpoint === 'md' || breakpoint === 'sm'}
             />

             <CenterPanel 
                items={layoutState.panels.center} 
                isDragMode={isDragMode && breakpoint !== 'sm'} 
                renderPanelItem={renderPanelItem} 
             />

             <RightPanel 
                items={layoutState.panels.right} 
                isDragMode={isDragMode && breakpoint !== 'sm'}
                renderPanelItem={renderPanelItem}
                collapsed={breakpoint === 'lg'}
                hidden={breakpoint === 'md' || breakpoint === 'sm'}
             />
          </div>

          {layoutState.panels.bottom.some(i => i.visible) && (
            <div className="px-6 pb-6 overflow-hidden">
               <button 
                 onClick={() => setIsBottomPanelCollapsed(!isBottomPanelCollapsed)}
                 className="flex items-center gap-2 mb-3 transition-all group px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-sm shadow-emerald-200/50 dark:shadow-none"
               >
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 animate-pulse">
                   {t("dailyActivities")}
                 </span>
                 {isBottomPanelCollapsed ? <ChevronRight size={14} className="text-emerald-600" /> : <ChevronDown size={14} className="text-emerald-600" />}
               </button>
               
               {isBottomPanelCollapsed === false && (
                 <div className="overflow-x-auto pb-2">
                    <BottomWidgetRow 
                     items={layoutState.panels.bottom} 
                     isDragMode={isDragMode && breakpoint !== 'sm'} 
                     renderPanelItem={renderPanelItem} 
                    />
                 </div>
               )}
            </div>
          )}

          {/* Floating Action Bar / Footer */}
          <div className="px-6 py-3 bg-white/50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
             {isDragMode ? (
                <div className="flex-1 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                       <Sparkles size={14} className="animate-pulse" />
                       {t("editMode")}
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowCustomizer(true)}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 rounded-lg transition-colors"
                      >
                        <Eye size={14} />
                        {t("showHide")}
                      </button>
                      <button
                        onClick={resetLayout}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                      >
                        <RotateCcw size={14} />
                        {t("reset")}
                      </button>
                      <button
                        onClick={() => setIsDragMode(false)}
                        className="flex items-center gap-2 px-6 py-1.5 text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-600 rounded-lg transition-all shadow-md active:scale-95"
                      >
                        <Check size={14} />
                        {t("done")}
                      </button>
                   </div>
                </div>
             ) : (
                <>
                   <div className="flex items-center gap-6">
                      <BuyMeCoffee variant="badge" />
                      <button
                        onClick={() => setShowCustomizer(true)}
                        className="flex items-center gap-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-3 py-1.5 text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-all active:scale-95"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                        {t("customizeDashboard")}
                      </button>
                      <span className="hidden md:inline text-[10px] text-stone-500 font-bold uppercase tracking-widest">
                        {t("noorTabSlogan")}
                      </span>
                   </div>
                   
                   <button
                    onClick={() => setIsDragMode(true)}
                    className="group flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black bg-emerald-700 text-white hover:bg-emerald-600 shadow-md hover:shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                    {t("dragAndCustomize")}
                  </button>
                </>
             )}
          </div>
        </div>
      )}

      <WidgetCustomizer isOpen={showCustomizer} onClose={() => setShowCustomizer(false)} />
    </div>
    </DragProvider>
  );
}
