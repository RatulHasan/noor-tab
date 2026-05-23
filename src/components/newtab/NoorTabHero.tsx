import React, { useState, useEffect } from "react";
import type { DailyPrayers, PrayerName, PrayerStatus } from "../../types";
import { useHijriDate } from "../../hooks/useHijriDate";
import CountdownTimer from "../shared/CountdownTimer";
import { Clock, MapPin, Bell, X, Calendar } from "lucide-react";
import { PRAYER_METADATA } from "../../data/prayerNames";
import { cn } from "../../utils/cn";

/**
 * @param {Object} props
 * @param {DailyPrayers} props.prayers - Computed prayer times.
 * @param {PrayerStatus[]} props.prayerStatuses - Status metadata for each prayer.
 * @param {{ name: PrayerName, time: Date } | null} props.nextPrayer - The next prayer details.
 * @param {string | null} props.cityName - Detected city name.
 * @param {string | null} props.reminderPrayer - The prayer name passed via URL reminder parameter.
 */
interface NoorTabHeroProps {
  prayers: DailyPrayers;
  prayerStatuses: PrayerStatus[];
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
  const [time, setTime] = useState(() => new Date());
  const [showReminder, setShowReminder] = useState(!!reminderPrayer);
  const hijri = useHijriDate(time);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-dismiss reminder banner after 10 seconds
  useEffect(() => {
    if (reminderPrayer) {
      setShowReminder(true);
      const timer = setTimeout(() => setShowReminder(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [reminderPrayer]);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedGregorian = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const activeReminderMeta = reminderPrayer ? PRAYER_METADATA[reminderPrayer as PrayerName] : null;

  return (
    <div className="w-full flex flex-col space-y-6 relative z-10 select-none">
      {/* Reminder Banner (Alert Overlay) */}
      {showReminder && activeReminderMeta && (
        <div className="mx-auto w-full max-w-lg bg-emerald-800 text-white rounded-2xl p-4 shadow-xl border border-emerald-700/50 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Bell className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-emerald-200 uppercase font-semibold tracking-wider">
                Adhan Reminder
              </p>
              <h4 className="text-sm font-bold">
                It is time for {activeReminderMeta.displayName} ({activeReminderMeta.arabicName})
              </h4>
            </div>
          </div>
          <button
            onClick={() => setShowReminder(false)}
            className="p-1 rounded-full text-emerald-300 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Bar: Dates & Location */}
      <div className="flex flex-col md:flex-row justify-between items-center px-2 py-3 border-b border-stone-200/50 dark:border-stone-800/40 text-stone-500 dark:text-stone-400 gap-2">
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
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="font-amiri text-5xl font-black tracking-wide text-emerald-800 dark:text-emerald-400 select-text leading-tight">
          السلام عليكم
        </h1>
        <p className="mt-1 text-xs text-stone-400 dark:text-stone-500 font-medium uppercase tracking-widest">
          Peace be upon you
        </p>

        {/* Large Monospace Digital Clock */}
        <div className="mt-4 font-mono text-6xl font-black tracking-widest text-stone-800 dark:text-stone-100 drop-shadow-sm select-text tabular-nums">
          {formattedTime}
        </div>

        {/* Next Prayer Countdown Widget */}
        {nextPrayer && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-sm">
            <Clock className="h-3.5 w-3.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
            <span>Next:</span>
            <span className="font-bold capitalize">{nextPrayer.name}</span>
            <span>in</span>
            <CountdownTimer targetTime={nextPrayer.time} className="font-bold text-emerald-700 dark:text-emerald-400" />
          </div>
        )}
      </div>

      {/* Horizontal Prayer Times Bar */}
      <div className="grid grid-cols-5 gap-2.5">
        {prayerStatuses.map((prayer) => {
          const isNext = prayer.state === "next";
          const isPassed = prayer.state === "passed";
          
          return (
            <div
              key={prayer.name}
              className={cn(
                "flex flex-col items-center p-3 rounded-2xl border transition-all duration-300",
                isPassed && "bg-stone-50/50 border-stone-200/40 opacity-45 dark:bg-stone-900/10 dark:border-stone-900/30",
                isNext && "bg-white border-emerald-600/30 ring-1 ring-emerald-500/20 shadow-md scale-105 dark:bg-stone-900/60",
                prayer.state === "upcoming" && "bg-white border-stone-200/60 dark:bg-stone-900/40 dark:border-stone-800/60"
              )}
            >
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
                {prayer.time.toLocaleTimeString([], {
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
