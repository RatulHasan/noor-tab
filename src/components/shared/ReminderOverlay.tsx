import React, { useState, useEffect } from "react";
import type { PrayerName } from "../../types";
import { PRAYER_METADATA } from "../../data/prayerNames";
import { Bell, X, ExternalLink } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * @param {Object} props
 * @param {PrayerName} props.prayerName - The name of the prayer.
 * @param {string} [props.timeRemaining] - Time remaining string (e.g. "15 minutes").
 * @param {() => void} props.onDismiss - Callback when notification is dismissed.
 * @param {() => void} [props.onAction] - Optional action callback (e.g., open New Tab).
 * @param {number} [props.autoDismissMs] - Automatically close after these milliseconds. Default is 30000 (30s).
 */
interface ReminderOverlayProps {
  prayerName: PrayerName;
  timeRemaining?: string;
  onDismiss: () => void;
  onAction?: () => void;
  autoDismissMs?: number;
}

export default function ReminderOverlay({
  prayerName,
  timeRemaining = "15 minutes",
  onDismiss,
  onAction,
  autoDismissMs = 30000,
}: ReminderOverlayProps) {
  const [progress, setProgress] = useState(100);
  const meta = PRAYER_METADATA[prayerName];

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / autoDismissMs) * 100);
      setProgress(remainingPct);

      if (elapsed >= autoDismissMs) {
        clearInterval(timer);
        onDismiss();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [autoDismissMs, onDismiss]);

  if (!meta) return null;

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-stone-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-stone-800/80 dark:bg-stone-900/90">
      {/* Pattern background overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-5 pointer-events-none" />

      <div className="relative flex gap-3 z-10">
        {/* Decorative Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          <Bell className="h-5 w-5 animate-bounce" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Prayer Reminder
            </span>
            <button
              onClick={onDismiss}
              className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-stone-300"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h3 className="mt-0.5 text-base font-bold text-stone-800 dark:text-stone-100">
            {meta.displayName} is in {timeRemaining}
          </h3>

          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            Prepare for prayer. Arabic:{" "}
            <span className="font-amiri font-bold text-sm text-stone-800 dark:text-stone-200">
              {meta.arabicName}
            </span>
          </p>

          {onAction && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={onAction}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                Open NoorTab
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
    </div>
  );
}
