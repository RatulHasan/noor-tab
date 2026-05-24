import React, { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import type { DayPrayerRecord, PrayerStreakData, PrayerStatus } from "../../types";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isFuture } from "../../utils/dateUtils";
import { Flame, Trophy, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { getDayScore, calculateCurrentStreak, calculateLongestStreak } from "../../utils/streakCalculator";
import { cn } from "../../utils/cn";
import { useSettings } from "../../hooks/useSettings";
import { getTranslation } from "../../data/translations";

export default function PrayerStreakTracker() {
  const [streakData, setStreakData] = useStorage<PrayerStreakData>("prayerStreak", {
    records: {},
    currentStreak: 0,
    longestStreak: 0,
    totalOnTime: 0,
    totalLate: 0,
    totalMissed: 0
  });

  const [settings] = useSettings();
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [showMonthView, setShowMonthView] = useState(false);

  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const activeRecord: DayPrayerRecord = streakData.records[selectedDate] || {
    date: selectedDate,
    fajr: null,
    dhuhr: null,
    asr: null,
    maghrib: null,
    isha: null
  };

  const currentScore = getDayScore(activeRecord);

  // Update status for a specific prayer
  const handleMarkPrayer = (prayer: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha", status: PrayerStatus) => {
    const updatedRecords = { ...streakData.records };
    const dateRecord = { ...activeRecord };
    
    // Track stats changes
    const previousStatus = dateRecord[prayer];
    let onTimeDiff = 0;
    let lateDiff = 0;
    let missedDiff = 0;

    if (previousStatus === "on_time") onTimeDiff--;
    else if (previousStatus === "late") lateDiff--;
    else if (previousStatus === "missed") missedDiff--;

    if (status === "on_time") onTimeDiff++;
    else if (status === "late") lateDiff++;
    else if (status === "missed") missedDiff++;

    dateRecord[prayer] = status;
    updatedRecords[selectedDate] = dateRecord;

    // Recalculate streak values
    const newCurrent = calculateCurrentStreak(updatedRecords);
    const newLongest = Math.max(streakData.longestStreak, newCurrent, calculateLongestStreak(updatedRecords));

    setStreakData({
      records: updatedRecords,
      currentStreak: newCurrent,
      longestStreak: newLongest,
      totalOnTime: Math.max(0, (streakData.totalOnTime || 0) + onTimeDiff),
      totalLate: Math.max(0, (streakData.totalLate || 0) + lateDiff),
      totalMissed: Math.max(0, (streakData.totalMissed || 0) + missedDiff)
    });

    // Notify background worker of status update
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({
        type: "MARK_PRAYER",
        date: selectedDate,
        prayer,
        status
      });
    }
  };

  // Get last 7 days elements
  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const d = subDays(new Date(), 6 - idx);
    const dateStr = format(d, "yyyy-MM-dd");
    const rec = streakData.records[dateStr];
    const { score, label } = getDayScore(rec);
    return {
      dateStr,
      dayLabel: format(d, "EEE"),
      score,
      label
    };
  });

  // Calculate monthly stats
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getScoreColor = (score: number, label: string, isFutureDate: boolean) => {
    if (isFutureDate) return "bg-stone-100 text-stone-300 dark:bg-stone-800 dark:text-stone-700 cursor-not-allowed";
    if (label === "Unmarked") return "bg-stone-50 border border-stone-200 text-stone-400 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-600";
    if (score === 5) return "bg-emerald-700 text-white shadow-sm";
    if (score >= 3) return "bg-emerald-500 text-white";
    if (score >= 1) return "bg-emerald-300 text-emerald-950";
    return "bg-rose-500 text-white"; // Missed all
  };

  const getScoreTranslation = (lbl: string) => {
    if (lbl === "Perfect") return t("perfect");
    if (lbl === "Good") return t("good");
    if (lbl === "Partial") return t("partial");
    if (lbl === "Missed") return t("missed");
    return t("unmarked");
  };

  return (
    <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 flex flex-col space-y-4 font-sans select-none">
      {/* 1. Header: Streak Indicators */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center animate-pulse">
            <Flame className="h-6 w-6 fill-current" />
          </div>
          <div>
            <span className="text-xs text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider block">
              {t("currentStreak")}
            </span>
            <span className="text-lg font-black text-stone-800 dark:text-stone-100 leading-none block">
              {streakData.currentStreak} {t("days")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400 border border-stone-200/50 dark:border-stone-800/30 text-xs font-semibold">
          <Trophy className="h-4 w-4 text-amber-500 fill-current" />
          <span>{t("longestStreak")}: {streakData.longestStreak} {t("days")}</span>
        </div>
      </div>

      {/* 2. Mini Row: Last 7 Days */}
      <div className="grid grid-cols-7 gap-1 bg-stone-50 dark:bg-stone-900/50 p-2 rounded-lg border border-stone-200/20 dark:border-stone-800/20 text-center">
        {last7Days.map((day) => {
          const isSelected = day.dateStr === selectedDate;
          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => setSelectedDate(day.dateStr)}
              className={cn(
                "flex flex-col items-center gap-1.5 py-1 rounded-md transition-all duration-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/30",
                isSelected && "bg-stone-200 dark:bg-stone-800"
              )}
            >
              <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase">
                {day.dayLabel}
              </span>
              <div
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300",
                  getScoreColor(day.score, day.label, false)
                )}
              >
                {day.score > 0 ? day.score : "•"}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Center Section: Mark Today */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
            {t("prayersLoggedToday")}: {format(parseISO(selectedDate), "MMMM dd, yyyy")}
          </span>
          <span className={cn(
            "text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border",
            currentScore.label === "Perfect" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
            currentScore.label === "Good" && "bg-emerald-50/50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/10 dark:text-emerald-500 dark:border-emerald-900/20",
            currentScore.label === "Partial" && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/10 dark:text-amber-400 dark:border-amber-900/20",
            currentScore.label === "Missed" && "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/10 dark:text-rose-400 dark:border-rose-900/20",
            currentScore.label === "Unmarked" && "bg-stone-50 text-stone-400 border-stone-200 dark:bg-stone-900/20 dark:text-stone-500 dark:border-stone-800"
          )}>
            {getScoreTranslation(currentScore.label)}
          </span>
        </div>

        <div className="space-y-2">
          {(["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).map((prayer) => {
            const status = activeRecord[prayer];
            return (
              <div
                key={prayer}
                className="flex items-center justify-between rounded-xl border border-stone-200/50 bg-stone-50/10 p-2.5 dark:border-stone-800/40 dark:bg-stone-900/10"
              >
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 capitalize">
                  {t(prayer)}
                </span>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleMarkPrayer(prayer, "on_time")}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all duration-200",
                      status === "on_time"
                        ? "bg-emerald-700 border-emerald-800 text-white"
                        : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
                    )}
                  >
                    {t("onTime")}
                  </button>
                  <button
                    onClick={() => handleMarkPrayer(prayer, "late")}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all duration-200",
                      status === "late"
                        ? "bg-amber-500 border-amber-600 text-white"
                        : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
                    )}
                  >
                    {t("late")}
                  </button>
                  <button
                    onClick={() => handleMarkPrayer(prayer, "missed")}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all duration-200",
                      status === "missed"
                        ? "bg-rose-500 border-rose-600 text-white"
                        : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
                    )}
                  >
                    {t("missed")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Expandable Monthly Grid Calendar */}
      <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50">
        <button
          type="button"
          onClick={() => setShowMonthView(!showMonthView)}
          className="flex w-full items-center justify-between text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{t("monthlyHeatmap")}</span>
          </div>
          {showMonthView ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showMonthView && (
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((l, i) => (
                <span key={i} className="text-[10px] font-bold text-stone-400 dark:text-stone-600">
                  {l}
                </span>
              ))}

              {monthDays.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const rec = streakData.records[dateStr];
                const { score, label } = getDayScore(rec);
                const isFutureDate = isFuture(day);
                const isSelected = dateStr === selectedDate;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={isFutureDate}
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      "h-6 w-6 rounded flex items-center justify-center text-[10px] font-semibold transition-all duration-200",
                      getScoreColor(score, label, isFutureDate),
                      isSelected && "ring-2 ring-stone-700 dark:ring-stone-200"
                    )}
                    title={`${format(day, "MMM dd")}: ${score}/5 marked`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
            
            {/* Color key guide */}
            <div className="flex justify-between items-center text-[9px] text-stone-400 dark:text-stone-500 font-medium">
              <span>{t("missed")} (0/5)</span>
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded bg-rose-500" />
                <div className="h-2 w-2 rounded bg-stone-100 border border-stone-200" />
                <div className="h-2 w-2 rounded bg-emerald-300" />
                <div className="h-2 w-2 rounded bg-emerald-500" />
                <div className="h-2 w-2 rounded bg-emerald-700" />
              </div>
              <span>{t("perfect")} (5/5)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
