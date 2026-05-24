import React, { useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { Flame, Trophy, X } from "lucide-react";
import { format, subDays } from "../../utils/dateUtils";
import type { PrayerStreakData } from "../../types";
import { getDayScore } from "../../utils/streakCalculator";
import { cn } from "../../utils/cn";
import PrayerStreakTracker from "../shared/PrayerStreakTracker";
import { useSettings } from "../../hooks/useSettings";
import { getTranslation } from "../../data/translations";

export default function PrayerStreakWidget() {
  const [streakData] = useStorage<PrayerStreakData>("prayerStreak", {
    records: {},
    currentStreak: 0,
    longestStreak: 0,
    totalOnTime: 0,
    totalLate: 0,
    totalMissed: 0,
  });

  const [settings] = useSettings();
  const [showFull, setShowFull] = useState(false);

  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // Build last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const d = subDays(new Date(), 6 - idx);
    const dateStr = format(d, "yyyy-MM-dd");
    const rec = streakData?.records?.[dateStr];
    const { score, label } = getDayScore(rec);
    return { dateStr, dayLabel: format(d, "EEE"), score, label };
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayRecord = streakData?.records?.[todayStr];
  const todayScore = getDayScore(todayRecord);

  const getDotColor = (score: number, label: string) => {
    if (label === "Unmarked") return "bg-stone-200 dark:bg-stone-700";
    if (score >= 3) return "bg-emerald-600";
    if (score >= 1) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getTodayBadge = () => {
    if (todayScore.label === "Unmarked")
      return { text: t("unmarked"), cls: "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400" };
    if (todayScore.label === "Perfect")
      return { text: t("perfect") + " ✦", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" };
    if (todayScore.label === "Good")
      return { text: t("good"), cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-500" };
    if (todayScore.label === "Partial")
      return { text: t("partial"), cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400" };
    return { text: t("missed"), cls: "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" };
  };

  const badge = getTodayBadge();

  return (
    <>
      {/* Compact Widget Card */}
      <button
        type="button"
        onClick={() => setShowFull(true)}
        className="w-full text-left rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 hover:shadow-md transition-all duration-200 space-y-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        aria-label="Open prayer streak tracker"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            {t("prayerStreakTitle")}
          </span>
          <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", badge.cls)}>
            {badge.text}
          </span>
        </div>

        {/* Streak count */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center">
            <Flame className="h-5 w-5 fill-current" />
          </div>
          <div>
            <span className="text-2xl font-black text-stone-800 dark:text-stone-100 leading-none">
              {streakData?.currentStreak ?? 0}
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500 ml-1">{t("days")}</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
            <Trophy className="h-3.5 w-3.5 text-amber-500 fill-current" />
            <span>{t("longestStreak")}: {streakData?.longestStreak ?? 0}</span>
          </div>
        </div>

        {/* 7-day dots */}
        <div className="flex items-end gap-1.5">
          {last7Days.map((day) => (
            <div key={day.dateStr} className="flex flex-col items-center gap-1">
              <span className="text-[9px] text-stone-300 dark:text-stone-600 uppercase font-bold">
                {day.dayLabel.charAt(0)}
              </span>
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors duration-300",
                  getDotColor(day.score, day.label)
                )}
                title={`${day.dayLabel}: ${day.score}/5`}
              />
            </div>
          ))}
        </div>
      </button>

      {/* Bottom sheet modal */}
      {showFull && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowFull(false)}
            aria-hidden="true"
          />

          {/* Bottom sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto w-full max-w-2xl rounded-t-2xl bg-white dark:bg-stone-900 shadow-2xl border-t border-stone-200/50 dark:border-stone-800/60 overflow-hidden">
              {/* Handle bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 dark:border-stone-800/50">
                <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                  {t("prayerStreakTitle")}
                </span>
                <button
                  type="button"
                  onClick={() => setShowFull(false)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  aria-label="Close prayer streak tracker"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[75vh] p-4">
                <PrayerStreakTracker />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
