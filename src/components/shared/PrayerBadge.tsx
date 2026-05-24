import React from "react";
import type { PrayerName, PrayerUIStatus } from "../../types";
import { PRAYER_METADATA } from "../../data/prayerNames";
import { cn } from "../../utils/cn";

/**
 * @param {Object} props
 * @param {PrayerName} props.name - The prayer identifier (fajr, dhuhr, etc.)
 * @param {PrayerUIStatus['state']} props.state - The state of the prayer (passed, next, upcoming)
 * @param {string} [props.className] - Optional custom CSS class name.
 */
interface PrayerBadgeProps {
  name: PrayerName;
  state: PrayerUIStatus["state"];
  className?: string;
}

export default function PrayerBadge({
  name,
  state,
  className = "",
}: PrayerBadgeProps) {
  const meta = PRAYER_METADATA[name];
  if (!meta) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300",
        state === "passed" &&
          "bg-stone-100 text-stone-400 dark:bg-stone-800/40 dark:text-stone-600 opacity-60 line-through",
        state === "next" &&
          "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)] animate-pulse",
        state === "upcoming" &&
          "bg-stone-50 text-stone-700 dark:bg-stone-900/60 dark:text-stone-300 border border-stone-200/40 dark:border-stone-800/50",
        className
      )}
    >
      <span className="font-medium">{meta.displayName}</span>
      <span className="opacity-40">•</span>
      <span className="font-amiri font-bold text-sm tracking-wide leading-none pt-0.5">
        {meta.arabicName}
      </span>
    </div>
  );
}
