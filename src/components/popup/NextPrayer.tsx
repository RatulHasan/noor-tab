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

      {/* Mosque Silhouette SVG element in background bottom-right */}
      <svg
        className="absolute bottom-0 right-0 h-28 w-44 text-emerald-900/[0.04] dark:text-emerald-400/[0.03] pointer-events-none select-none"
        viewBox="0 0 100 60"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        <path d="M0 60 L100 60 L100 50 C95 48 90 40 90 35 L90 20 L85 10 L80 20 L80 35 C80 40 75 48 70 50 C65 48 60 40 60 35 L60 15 L50 0 L40 15 L40 35 C40 40 35 48 30 50 C25 48 20 40 20 35 L20 20 L15 10 L10 20 L10 35 C10 40 5 48 0 50 Z" />
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
