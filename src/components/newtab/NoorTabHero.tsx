import React, { useState, useEffect, useRef } from "react";
import type { DailyPrayers, PrayerName, PrayerUIStatus } from "../../types";
import { useHijriDate } from "../../hooks/useHijriDate";
import { useSettings } from "../../hooks/useSettings";
import { getTranslation } from "../../data/translations";
import CountdownTimer from "../shared/CountdownTimer";
import { Clock, MapPin, Bell, X, Calendar, Play, Pause } from "lucide-react";
import { PRAYER_METADATA } from "../../data/prayerNames";
import { cn } from "../../utils/cn";
import { ADHAN_AUDIO_OPTIONS } from "../../data/adhanAudios";
import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";

const globalStorage = new Storage();

/**
 * @param {Object} props
 * @param {DailyPrayers} props.prayers - Computed prayer times.
 * @param {PrayerUIStatus[]} props.prayerStatuses - Status metadata for each prayer.
 * @param {{ name: PrayerName, time: Date } | null} props.nextPrayer - The next prayer details.
 * @param {string | null} props.cityName - Detected city name.
 * @param {string | null} props.reminderPrayer - The prayer name passed via URL reminder parameter.
 */
interface NoorTabHeroProps {
  prayers: DailyPrayers;
  prayerStatuses: PrayerUIStatus[];
  nextPrayer: { name: PrayerName; time: Date } | null;
  cityName: string | null;
  reminderPrayer: string | null;
}

export default function NoorTabHero({
  prayers,
  prayerStatuses,
  nextPrayer,
  cityName,
  reminderPrayer,
}: NoorTabHeroProps) {
  const [settings] = useSettings();
  const [time, setTime] = useState(() => new Date());
  const [showReminder, setShowReminder] = useState(!!reminderPrayer);
  const [devMockTime] = useStorage<string>("devMockTime", "");
  const [devMockCoordinates] = useStorage<{ lat: number; lng: number } | null>("devMockCoordinates", null);

  const reminderAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isReminderAudioPlaying, setIsReminderAudioPlaying] = useState(false);

  // Listen for global STOP_ALL_ADHAN from popup/background
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "STOP_ALL_ADHAN_INTERNAL") {
        if (reminderAudioRef.current) {
          reminderAudioRef.current.pause();
          setIsReminderAudioPlaying(false);
        }
      }
    };

    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage);
    }
    return () => {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.removeListener(handleMessage);
      }
    };
  }, []);

  const setAdhanPlayingInStorage = (playing: boolean) => {
    globalStorage.set("adhanIsPlaying", playing).catch(() => {});
  };

  const handleToggleReminderAudio = () => {
    if (reminderAudioRef.current) {
      if (isReminderAudioPlaying) {
        reminderAudioRef.current.pause();
        setIsReminderAudioPlaying(false);
        setAdhanPlayingInStorage(false);
      } else {
        reminderAudioRef.current.play().catch(() => {});
        setIsReminderAudioPlaying(true);
        setAdhanPlayingInStorage(true);
      }
    }
  };

  const handleCloseReminder = () => {
    setShowReminder(false);
    if (reminderAudioRef.current) {
      reminderAudioRef.current.pause();
      setIsReminderAudioPlaying(false);
      setAdhanPlayingInStorage(false);
    }
  };

  // Compute timezone-adjusted local time for the coordinates
  const getCoordinatesLocalTime = (baseTime: Date) => {
    if (devMockTime) return baseTime;
    const activeCoords = devMockCoordinates || settings?.coordinates;
    if (!activeCoords) return baseTime;
    const estimatedOffsetHours = Math.round(activeCoords.lng / 15);
    const utcTime = baseTime.getTime() + (baseTime.getTimezoneOffset() * 60 * 1000);
    return new Date(utcTime + (estimatedOffsetHours * 60 * 60 * 1000));
  };

  const localTime = getCoordinatesLocalTime(time);
  const hijri = useHijriDate(localTime);

  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // Live ticking clock (unless time is mocked by developer tools)
  useEffect(() => {
    if (devMockTime) {
      const d = new Date();
      const [h, m] = devMockTime.split(":").map(Number);
      d.setHours(h, m, 0, 0);
      setTime(d);
      return;
    }
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [devMockTime]);

  // Auto-dismiss reminder banner after 15 seconds & play Adhan audio if configured
  useEffect(() => {
    if (reminderPrayer) {
      setShowReminder(true);

      const configuredAdhan = settings.adhanAudio || "none";
      if (configuredAdhan !== "none") {
        const option = ADHAN_AUDIO_OPTIONS.find((o) => o.key === configuredAdhan);
        if (option && option.url) {
          const audio = new Audio(option.url);
          reminderAudioRef.current = audio;
          setIsReminderAudioPlaying(true);
          setAdhanPlayingInStorage(true);
          audio.play().catch((err) => {
            console.error("Autoplay of Adhan sound blocked or failed:", err);
            setIsReminderAudioPlaying(false);
            setAdhanPlayingInStorage(false);
          });
          audio.onended = () => {
            setIsReminderAudioPlaying(false);
            setAdhanPlayingInStorage(false);
          };
        }
      }

      return () => {
        if (reminderAudioRef.current) {
          reminderAudioRef.current.pause();
          reminderAudioRef.current = null;
          setIsReminderAudioPlaying(false);
          setAdhanPlayingInStorage(false);
        }
      };
    }
  }, [reminderPrayer, settings.adhanAudio]);

  // Localized date & time formatting
  const localeMap = {
    en: "en-US",
    bn: "bn-BD",
    ar: "ar-EG", // Arabic digits
    hi: "hi-IN",
    ur: "ur-PK"
  };
  const currentLocale = localeMap[lang] || "en-US";

  const formattedTime = time.toLocaleTimeString(currentLocale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedGregorian = localTime.toLocaleDateString(currentLocale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const activeReminderMeta = reminderPrayer ? PRAYER_METADATA[reminderPrayer as PrayerName] : null;

  return (
    <div className="w-full flex flex-col space-y-6 relative select-none bg-gradient-to-br from-white/95 via-stone-50/80 to-white/95 border border-stone-200/60 shadow-sm rounded-3xl p-6 dark:from-stone-900/40 dark:via-stone-950/20 dark:to-stone-900/40 dark:border-stone-800/80 dark:shadow-none overflow-hidden">

      {/* Reminder Banner (Alert Overlay) */}
      {showReminder && activeReminderMeta && (
        <div className="mx-auto w-full max-w-lg bg-emerald-800 text-white rounded-2xl p-4 shadow-xl border border-emerald-700/50 flex items-center justify-between animate-pulse relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Bell className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-emerald-200 uppercase font-semibold tracking-wider">
                Adhan Reminder
              </p>
              <h4 className="text-sm font-bold text-left">
                It is time for {activeReminderMeta.displayName} ({activeReminderMeta.arabicName})
              </h4>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0 ml-4">
            {settings.adhanAudio !== "none" && (
              <button
                type="button"
                onClick={handleToggleReminderAudio}
                className="p-1.5 rounded-full text-emerald-300 hover:bg-white/10 hover:text-white transition-colors"
                title={isReminderAudioPlaying ? t("stop") : t("preview")}
              >
                {isReminderAudioPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleCloseReminder}
              className="p-1.5 rounded-full text-emerald-300 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Bar: Dates & Location */}
      <div className="flex flex-col md:flex-row justify-between items-center px-2 py-3 border-b border-stone-200/50 dark:border-stone-800/40 text-stone-500 dark:text-stone-400 gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          <span className="text-xs font-semibold">{hijri.englishString}</span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="font-amiri font-bold text-xs text-emerald-800/80 dark:text-emerald-300/80">
            {hijri.arabicString}
          </span>
        </div>
        
        {cityName && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">{cityName}</span>
          </div>
        )}

        <div className="text-xs font-medium font-mono text-stone-400 dark:text-stone-500">
          {formattedGregorian}
        </div>
      </div>

      {/* Center Section: Greeting & Large Clock */}
      <div className="flex flex-col items-center justify-center py-6 text-center relative z-10">
        <h1 className="font-amiri text-5xl font-black tracking-wide text-emerald-800 dark:text-emerald-400 select-text leading-tight animate-fade-in">
          {t("assalamuAlaikum")}
        </h1>
        <p className="mt-1 text-xs text-stone-400 dark:text-stone-500 font-medium uppercase tracking-widest">
          {t("peaceBeUponYou")}
        </p>

        {/* Large Monospace Digital Clock */}
        <div className="mt-4 font-mono text-6xl font-black tracking-widest text-stone-800 dark:text-stone-100 drop-shadow-sm select-text tabular-nums">
          {formattedTime}
        </div>

        {/* Next Prayer Countdown Widget */}
        {nextPrayer && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-sm transition-all duration-300 hover:shadow-md">
            <Clock className="h-3.5 w-3.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
            <span>{t("nextPrayer")}:</span>
            <span className="font-bold capitalize">{nextPrayer.name}</span>
            <span>{t("timeRemaining").toLowerCase()}</span>
            <CountdownTimer targetTime={nextPrayer.time} className="font-bold text-emerald-700 dark:text-emerald-400" />
          </div>
        )}
      </div>

      {/* Horizontal Prayer Times Bar */}
      <div className="grid grid-cols-5 gap-2.5 relative z-10">
        {prayerStatuses.map((prayer) => {
          const isNext = prayer.state === "next";
          const isPassed = prayer.state === "passed";
          
          return (
            <div
              key={prayer.name}
              className={cn(
                "relative overflow-hidden flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 select-none",
                isPassed && "bg-stone-50/30 border-stone-200/30 opacity-45 dark:bg-stone-900/10 dark:border-stone-900/20",
                isNext && "bg-white border-emerald-600/30 ring-1 ring-emerald-500/10 shadow-md scale-[1.03] dark:bg-stone-900/80 dark:border-emerald-500/30",
                prayer.state === "upcoming" && "bg-white/60 border-stone-200/50 dark:bg-stone-900/30 dark:border-stone-800/50"
              )}
            >
              {/* Mini Background Mosque Silhouette on Active Next Salat Card */}
              {isNext && (
                <svg
                  className="absolute bottom-0 right-0 h-10 w-16 text-emerald-950/[0.04] dark:text-emerald-400/[0.03] pointer-events-none select-none"
                  viewBox="0 0 200 100"
                  fill="currentColor"
                >
                  <rect x="0" y="96" width="200" height="4" />
                  <path d="M 40 96 L 40 70 C 40 65, 45 60, 50 60 L 150 60 C 155 60, 160 65, 160 70 L 160 96 Z" />
                  <path d="M 80 60 C 80 50, 75 42, 100 32 C 125 42, 120 50, 120 60 Z" />
                  <line x1="100" y1="32" x2="100" y2="20" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="26" y="30" width="8" height="66" />
                  <path d="M 26 30 C 26 22, 34 22, 34 30 Z" />
                  <rect x="166" y="30" width="8" height="66" />
                  <path d="M 166 30 C 166 22, 174 22, 174 30 Z" />
                </svg>
              )}

              <span
                className={cn(
                  "text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500",
                  isNext && "text-emerald-700 dark:text-emerald-400"
                )}
              >
                {prayer.transliteration}
              </span>
              <span className="font-amiri font-bold text-base text-stone-600 dark:text-stone-300 mt-1">
                {prayer.arabicName}
              </span>
              <span
                className={cn(
                  "text-xs font-mono font-bold text-stone-700 dark:text-stone-300 mt-2",
                  isNext && "text-emerald-700 dark:text-emerald-400"
                )}
              >
                {prayer.time.toLocaleTimeString(currentLocale, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
