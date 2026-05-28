import React, { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { usePrayerTimes } from "~hooks/usePrayerTimes";
import type { FastingData, FastType, FastingRecord } from "~types";
import { isTodayRamadan, isTodayMonday, isTodayThursday, isAyyamulBidh, getSuhoorTime, getIftarTime, calculateFastingStreak } from "~utils/fastingHelper";
import { getHijriDateParts, getHijriDateString } from "~utils/hijriConverter";
import { format, subDays, isSameDay, differenceInSeconds } from "~utils/dateUtils";
import { Moon, Sun, Flame, Check, X, ShieldAlert, Award, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "~utils/cn";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";

export default function FastingTracker() {
  const [settings] = useSettings();
  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const { prayers, nextPrayer, isLoading } = usePrayerTimes();
  
  const [fastingData, setFastingData] = useStorage<FastingData>("fastingData", {
    isRamadanMode: false,
    records: {},
    currentFastingStreak: 0
  });

  const [showLogs, setShowLogs] = useState(false);
  const [countdownText, setCountdownText] = useState("");
  const [countdownLabel, setCountdownLabel] = useState("");

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayRecord = fastingData.records[todayStr] || {
    date: todayStr,
    type: "custom",
    completed: false
  };

  const isRamadan = fastingData.isRamadanMode || isTodayRamadan();
  const hijri = getHijriDateParts();

  // 1. Live Countdown Loop (Updates every second)
  useEffect(() => {
    if (isLoading || !prayers) return;

    const timer = setInterval(() => {
      const now = new Date();
      const suhoorTime = getSuhoorTime(prayers.fajr);
      const iftarTime = getIftarTime(prayers.maghrib);

      if (now < suhoorTime) {
        // Before Suhoor (Fajr) -> Suhoor ends in
        const diff = differenceInSeconds(suhoorTime, now);
        setCountdownLabel("SUHOOR ends in");
        setCountdownText(formatDiff(diff));
      } else if (now >= suhoorTime && now < iftarTime) {
        // During Fasting -> Iftar in
        const diff = differenceInSeconds(iftarTime, now);
        setCountdownLabel("IFTAR in");
        setCountdownText(formatDiff(diff));
      } else {
        // After Iftar -> Fasting finishes
        setCountdownLabel("Fasting completed for today!");
        setCountdownText("");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayers, isLoading]);

  const formatDiff = (diffInSeconds: number) => {
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // 2. Mark / Unmark fast
  const handleToggleFast = (type: FastType, isCompleted: boolean) => {
    const updatedRecords = { ...fastingData.records };
    
    if (isCompleted) {
      const record: FastingRecord = {
        date: todayStr,
        type,
        completed: true
      };
      if (prayers) {
        record.suhoorTime = getSuhoorTime(prayers.fajr).toISOString();
        record.iftarTime = getIftarTime(prayers.maghrib).toISOString();
      }
      updatedRecords[todayStr] = record;
    } else {
      delete updatedRecords[todayStr];
    }

    const newStreak = calculateFastingStreak(updatedRecords);

    setFastingData({
      ...fastingData,
      records: updatedRecords,
      currentFastingStreak: newStreak
    });
  };

  // 3. Weekly Sunnah metrics
  const getWeeklySunnahStats = () => {
    let completedCount = 0;
    for (let i = 0; i < 7; i++) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, "yyyy-MM-dd");
      const rec = fastingData.records[dateStr];
      if (rec && rec.completed) {
        completedCount++;
      }
    }
    return completedCount;
  };

  // Ramadan Calendar Stats
  const getRamadanStats = () => {
    const records = Object.values(fastingData.records);
    const ramadanFasts = records.filter(r => r.type === "ramadan" && r.completed).length;
    return {
      ramadanFasts,
      remaining: Math.max(0, 30 - ramadanFasts)
    };
  };

  const ramadanStats = getRamadanStats();

  return (
    <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 flex flex-col space-y-4 font-sans select-none">
      
      {/* 1. Ramadan Takeover Layout */}
      {isRamadan ? (
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/10 dark:border-emerald-950/60 dark:bg-emerald-950/10 p-4 space-y-3.5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-emerald-800 dark:text-emerald-400">
                🌙 Ramadan Mubarak
              </h3>
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider block mt-0.5">
                Ramadan {hijri.year} • Day {hijri.day}
              </span>
            </div>
            {fastingData.currentFastingStreak > 0 && (
              <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
                <Flame className="h-4 w-4 fill-current" />
                <span>{fastingData.currentFastingStreak} Days</span>
              </div>
            )}
          </div>

          {/* Large Countdown widget */}
          {countdownText && (
            <div className="bg-white dark:bg-stone-950 p-3 rounded-lg border border-stone-200/20 text-center space-y-0.5 shadow-sm">
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest block">
                {countdownLabel}
              </span>
              <span className="text-2xl font-black font-mono text-emerald-700 tracking-wide block">
                {countdownText}
              </span>
            </div>
          )}

          {/* Quick Mark Ramadan Fast button */}
          <div className="flex items-center justify-between border-t border-stone-200/20 dark:border-stone-800/20 pt-3">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              Did you fast today?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleFast("ramadan", true)}
                disabled={todayRecord.completed}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all duration-200",
                  todayRecord.completed
                    ? "bg-emerald-700 text-white border-emerald-800"
                    : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
                )}
              >
                Mark Fasted
              </button>
              {todayRecord.completed && (
                <button
                  onClick={() => handleToggleFast("ramadan", false)}
                  className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 2. Normal Mode Fasting Layout */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-stone-800 dark:text-stone-100">
                🌙 {t("fastingTracker")}
              </h3>
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider block mt-0.5">
                Sunnah & Custom Fasts Log
              </span>
            </div>
            {fastingData.currentFastingStreak > 0 && (
              <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
                <Flame className="h-4 w-4 fill-current animate-pulse" />
                <span>{fastingData.currentFastingStreak} Fasts</span>
              </div>
            )}
          </div>

          {/* Quick toggle chips */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block">
              Fasting Today? Select Type:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(["monday", "thursday", "ayyamul_bidh", "custom"] as const).map((type) => {
                const isSelected = todayRecord.completed && todayRecord.type === type;
                const label = type.replace("_", " ").toUpperCase();
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleToggleFast(type, !isSelected)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all duration-200",
                      isSelected
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-sm"
                        : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-400"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sunnah stats card */}
          <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-3 border border-stone-200/20 dark:border-stone-800/20 flex justify-between items-center text-xs">
            <div className="flex gap-2.5 items-center">
              <Award className="h-5 w-5 text-emerald-700" />
              <div>
                <span className="font-bold text-stone-700 dark:text-stone-300 block">
                  Last 7 Days Compliance
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  Completed Sunnah checklist
                </span>
              </div>
            </div>
            <span className="text-sm font-black text-emerald-700">
              {getWeeklySunnahStats()} / 7
            </span>
          </div>
        </div>
      )}

      {/* 3. Fasting Logs History Toggle */}
      <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50">
        <button
          type="button"
          onClick={() => setShowLogs(!showLogs)}
          className="flex w-full items-center justify-between text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Fasting History Logs</span>
          </div>
          {showLogs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showLogs && (
          <div className="mt-3 max-h-[140px] overflow-y-auto space-y-1.5 pr-1">
            {Object.keys(fastingData.records).length === 0 ? (
              <span className="text-[10px] text-stone-400 dark:text-stone-600 italic block py-2 text-center">
                No fasting logs saved yet.
              </span>
            ) : (
              Object.keys(fastingData.records)
                .sort()
                .reverse()
                .map((dateStr) => {
                  const rec = fastingData.records[dateStr];
                  return (
                    <div
                      key={dateStr}
                      className="flex justify-between items-center rounded-lg border border-stone-100 bg-stone-50/10 p-2 dark:border-stone-800/50 dark:bg-stone-900/10 text-[10px] font-semibold"
                    >
                      <span className="text-stone-600 dark:text-stone-400">
                        {dateStr}
                      </span>
                      <span className="text-emerald-700 capitalize font-bold">
                        {rec.type.replace("_", " ")} Fast
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>

    </div>
  );
}
