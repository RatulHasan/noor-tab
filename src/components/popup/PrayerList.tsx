import React from "react";
import type { PrayerName, PrayerUIStatus } from "../../types";
import { Bell, BellOff } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * @param {Object} props
 * @param {PrayerUIStatus[] | null} props.prayerStatuses - Array of prayer statuses.
 * @param {boolean} props.isLoading - Whether the component is in a loading state.
 * @param {(name: PrayerName) => void} props.onToggleReminder - Callback when the reminder bell is clicked.
 */
interface PrayerListProps {
  prayerStatuses: PrayerUIStatus[] | null;
  isLoading: boolean;
  onToggleReminder: (name: PrayerName) => void;
}

export default function PrayerList({
  prayerStatuses,
  isLoading,
  onToggleReminder,
}: PrayerListProps) {
  if (isLoading || !prayerStatuses) {
    return (
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-stone-200/40 bg-stone-50/20 p-3.5 dark:border-stone-800/40 dark:bg-stone-900/10 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-stone-200 dark:bg-stone-800" />
              <div className="h-4 w-16 rounded bg-stone-200 dark:bg-stone-800" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-12 rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-5 w-10 rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-8 w-8 rounded-lg bg-stone-200 dark:bg-stone-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {prayerStatuses.map((prayer) => {
        const isPassed = prayer.state === "passed";
        const isNext = prayer.state === "next";

        return (
          <div
            key={prayer.name}
            className={cn(
              "flex items-center justify-between rounded-xl border p-3.5 transition-all duration-300",
              isPassed &&
                "border-stone-200/50 bg-stone-50/30 dark:border-stone-800/30 dark:bg-stone-950/10 opacity-55",
              isNext &&
                "border-emerald-600/30 bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-stone-900/20 shadow-sm ring-1 ring-emerald-500/20 font-semibold",
              prayer.state === "upcoming" &&
                "border-stone-200/60 bg-white hover:border-stone-300 dark:border-stone-800/60 dark:bg-stone-900/40 dark:hover:border-stone-700"
            )}
          >
            {/* Left side: English name & icon indicator */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  isPassed && "bg-stone-300 dark:bg-stone-700",
                  isNext && "bg-emerald-600 dark:bg-emerald-400 animate-ping",
                  prayer.state === "upcoming" && "bg-stone-400 dark:bg-stone-600"
                )}
              />
              <span
                className={cn(
                  "text-sm tracking-wide text-stone-700 dark:text-stone-300",
                  isNext && "text-emerald-800 dark:text-emerald-300 font-bold",
                  isPassed && "line-through text-stone-400"
                )}
              >
                {prayer.transliteration}
              </span>
            </div>

            {/* Right side: Time, Arabic name, and Bell Toggle */}
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "text-xs font-mono font-medium text-stone-500 dark:text-stone-400",
                  isNext && "text-emerald-700 dark:text-emerald-400 font-bold"
                )}
              >
                {prayer.time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              <span
                className={cn(
                  "font-amiri font-bold text-sm tracking-wide text-stone-600 dark:text-stone-400",
                  isNext && "text-emerald-800 dark:text-emerald-300"
                )}
              >
                {prayer.arabicName}
              </span>

              <button
                onClick={() => onToggleReminder(prayer.name)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border border-transparent transition-all duration-200 hover:bg-stone-100 dark:hover:bg-stone-800",
                  prayer.reminderEnabled
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                    : "text-stone-400 dark:text-stone-500 hover:text-stone-600"
                )}
                title={prayer.reminderEnabled ? "Disable Reminder" : "Enable Reminder"}
              >
                {prayer.reminderEnabled ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
