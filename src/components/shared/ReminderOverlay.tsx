import React, { useMemo } from "react";
import type { PrayerName, PrayerStatus } from "~types";
import { PRAYER_METADATA } from "~data/prayerNames";
import { HADITHS } from "~data/hadiths";
import { Bell, X, ExternalLink, Play, Pause, Check } from "lucide-react";
import { cn } from "~utils/cn";

/**
 * @param {Object} props
 * @param {PrayerName} props.prayerName - The name of the prayer.
 * @param {string} [props.timeRemaining] - Time remaining string (e.g. "15 minutes").
 * @param {() => void} props.onDismiss - Callback when notification is dismissed.
 * @param {() => void} [props.onAction] - Optional action callback (e.g., open New Tab).
 * @param {boolean} [props.isAdhanPlaying] - Whether Adhan is currently playing.
 * @param {() => void} [props.onToggleAdhan] - Callback to toggle Adhan sound.
 * @param {boolean} [props.showAdhanControls] - Whether to show the Adhan control buttons.
 * @param {boolean} [props.isModal] - Whether this overlay is rendered as a center modal.
 * @param {(status: PrayerStatus) => void} [props.onTrackPrayer] - Callback to track prayer status.
 */
interface ReminderOverlayProps {
  prayerName: PrayerName;
  timeRemaining?: string;
  onDismiss: () => void;
  onAction?: () => void;
  isAdhanPlaying?: boolean;
  onToggleAdhan?: () => void;
  showAdhanControls?: boolean;
  isModal?: boolean;
  onTrackPrayer?: (status: PrayerStatus) => void;
}

export default function ReminderOverlay({
  prayerName,
  timeRemaining = "15 minutes",
  onDismiss,
  onAction,
  isAdhanPlaying = false,
  onToggleAdhan,
  showAdhanControls = false,
  isModal = false,
  onTrackPrayer,
}: ReminderOverlayProps) {
  const meta = PRAYER_METADATA[prayerName];

  // Select Hadith of the day based on date seed
  const hadith = useMemo(() => {
    const today = new Date();
    const dateSeed = today.getDate() + today.getMonth() * 31 + today.getFullYear();
    const index = dateSeed % HADITHS.length;
    return HADITHS[index];
  }, []);

  if (!meta) return null;

  // Render centered modal layout
  if (isModal) {
    return (
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 dark:border-stone-800/80 dark:bg-stone-900/95 text-stone-850 dark:text-stone-100 flex flex-col space-y-5 animate-scale-up select-none">
        {/* Pattern background overlay */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 pointer-events-none" />

        {/* Mosque Silhouette SVG Watermark */}
        <div className="absolute bottom-0 right-0 h-28 w-44 text-emerald-950/[0.04] dark:text-emerald-400/[0.03] pointer-events-none select-none z-0">
          <svg
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
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 space-y-4">
          {/* Badge & Prayer Info */}
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-sm border border-emerald-500/10">
              <Bell className="h-5.5 w-5.5 animate-bounce" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mt-2">
              Prayer Alert
            </span>
            <h2 className="text-xl font-black text-stone-800 dark:text-stone-50">
              It is time for {meta.displayName}
            </h2>
            <span className="font-amiri font-bold text-2xl text-emerald-800 dark:text-emerald-300 mt-0.5">
              {meta.arabicName}
            </span>
          </div>

          {/* Hadith Section */}
          <div className="rounded-2xl border border-stone-200/50 bg-stone-50/50 p-4 dark:border-stone-800 dark:bg-stone-900/40 space-y-2">
            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block">
              Hadith of the Day
            </span>
            <p className="text-right font-amiri text-base font-bold leading-relaxed text-stone-800 dark:text-stone-100 select-text" dir="rtl">
              « {hadith.text} »
            </p>
            <p className="text-left text-xs leading-relaxed text-stone-500 dark:text-stone-400 select-text">
              "{hadith.translation}"
            </p>
            <span className="block text-right text-[9px] font-mono text-stone-450 dark:text-stone-500 font-bold select-text">
              - {hadith.reference}
            </span>
          </div>
        </div>

        {/* Button controls */}
        <div className="relative z-10 space-y-3 pt-3 border-t border-stone-150 dark:border-stone-800/60">
          {/* Prayer tracking buttons */}
          {onTrackPrayer && (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onTrackPrayer("on_time")}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm transition-colors hover:bg-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
              >
                <Check className="h-3 w-3" />
                On Time
              </button>
              <button
                type="button"
                onClick={() => onTrackPrayer("late")}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 border border-amber-200 shadow-sm transition-colors hover:bg-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400 dark:hover:bg-amber-950/30"
              >
                <Check className="h-3 w-3" />
                Late
              </button>
              <button
                type="button"
                onClick={() => onTrackPrayer("missed")}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 border border-rose-200 shadow-sm transition-colors hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/30"
              >
                <X className="h-3 w-3" />
                Missed
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3">
            {showAdhanControls && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
              >
                <Play className="h-4 w-4 fill-current" />
                Play Adhan
              </button>
            )}
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-xl px-4 py-2 text-sm font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-750 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render original compact overlay layout
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-stone-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-stone-800/80 dark:bg-stone-900/90 text-stone-800 dark:text-stone-100 select-none">
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
            <div className="flex items-center gap-1.5">
              {showAdhanControls && onToggleAdhan && (
                <button
                  type="button"
                  onClick={onToggleAdhan}
                  className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-stone-300 transition-colors"
                  title={isAdhanPlaying ? "Pause Adhan" : "Play Adhan"}
                >
                  {isAdhanPlaying ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-stone-300 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
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
                type="button"
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
    </div>
  );
}
