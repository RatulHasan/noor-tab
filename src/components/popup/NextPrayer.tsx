import React from "react";
import type { PrayerName } from "../../types";
import { PRAYER_METADATA } from "../../data/prayerNames";
import CountdownTimer from "../shared/CountdownTimer";
import IslamicPattern from "../shared/IslamicPattern";
import { cn } from "../../utils/cn";

/**
 * @param {Object} props
 * @param {{ name: PrayerName, time: Date } | null} props.nextPrayer - The next prayer details.
 * @param {boolean} props.isLoading - Whether the component is in a loading state.
 */
interface NextPrayerProps {
  nextPrayer: { name: PrayerName; time: Date } | null;
  isLoading: boolean;
}

export default function NextPrayer({ nextPrayer, isLoading }: NextPrayerProps) {
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-stone-200/60 bg-stone-50/50 p-6 dark:border-stone-800/50 dark:bg-stone-900/50">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-6 w-16 rounded bg-stone-200 dark:bg-stone-800" />
          </div>
          <div className="h-10 w-48 rounded bg-stone-300 dark:bg-stone-800" />
          <div className="h-6 w-32 rounded bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>
    );
  }

  if (!nextPrayer) return null;

  const meta = PRAYER_METADATA[nextPrayer.name];
  if (!meta) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-600/10 bg-gradient-to-br from-emerald-50/80 to-stone-50/80 p-6 shadow-md dark:border-emerald-500/10 dark:from-emerald-950/20 dark:to-stone-900/30">
      {/* Decorative Islamic Pattern */}
      <IslamicPattern opacity={0.06} />

      <svg
        className="absolute bottom-0 right-0 h-28 w-48 text-emerald-900/[0.04] dark:text-emerald-400/[0.03] pointer-events-none select-none"
        viewBox="0 0 200 100"
        fill="currentColor"
      >
        {/* Ground/Floor base line */}
        <rect x="0" y="96" width="200" height="4" />
        
        {/* Main building block */}
        <path d="M 40 96 L 40 70 C 40 65, 45 60, 50 60 L 150 60 C 155 60, 160 65, 160 70 L 160 96 Z" />
        
        {/* Main Central Onion Dome */}
        <path d="M 80 60 C 80 50, 75 42, 100 32 C 125 42, 120 50, 120 60 Z" />
        {/* Central Spire */}
        <line x1="100" y1="32" x2="100" y2="20" stroke="currentColor" strokeWidth="1.5" />
        {/* Crescent */}
        <path d="M 98.5 21 C 98.5 19.5, 100 18.5, 101.5 19 C 100.5 19.5, 100.5 20.5, 101.5 21 C 100 21.5, 98.5 22.5, 98.5 21 Z" />
        
        {/* Left Side Onion Dome */}
        <path d="M 54 60 C 54 52, 50 46, 66 38 C 82 46, 78 52, 78 60 Z" />
        <line x1="66" y1="38" x2="66" y2="28" stroke="currentColor" strokeWidth="1.2" />
        
        {/* Right Side Onion Dome */}
        <path d="M 122 60 C 122 52, 118 46, 134 38 C 150 46, 146 52, 146 60 Z" />
        <line x1="134" y1="38" x2="134" y2="28" stroke="currentColor" strokeWidth="1.2" />

        {/* Left Minaret */}
        <rect x="26" y="30" width="8" height="66" />
        <rect x="24" y="55" width="12" height="3" rx="0.5" />
        <rect x="24" y="30" width="12" height="3" rx="0.5" />
        <path d="M 26 30 C 26 22, 34 22, 34 30 Z" />
        <line x1="30" y1="22" x2="30" y2="12" stroke="currentColor" strokeWidth="1" />

        {/* Right Minaret */}
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

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Next Prayer
          </span>
          <span className="font-amiri font-bold text-lg text-emerald-800/80 dark:text-emerald-300/80">
            {meta.arabicName}
          </span>
        </div>

        <div className="mt-4">
          <h2 className="text-3xl font-extrabold text-stone-800 dark:text-stone-100 tracking-tight">
            {meta.displayName}
          </h2>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            Prepared time:{" "}
            {nextPrayer.time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Time Remaining
          </span>
          <CountdownTimer
            targetTime={nextPrayer.time}
            className="text-2xl font-bold tracking-widest text-emerald-700 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
}
