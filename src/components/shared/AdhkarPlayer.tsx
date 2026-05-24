import React, { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import type { AdhkarProgress, AdhkarItem, AdhkarSession } from "../../types";
import { morningAdhkar, eveningAdhkar } from "../../data/adhkar";
import { format } from "../../utils/dateUtils";
import { Sun, Moon, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, Heart } from "lucide-react";
import { cn } from "../../utils/cn";
import { useSettings } from "../../hooks/useSettings";
import { getTranslation } from "../../data/translations";

interface AdhkarPlayerProps {
  currentPrayer?: string | null;
}

export default function AdhkarPlayer({ currentPrayer = null }: AdhkarPlayerProps) {
  const [session, setSession] = useState<AdhkarSession>("morning");
  const [index, setIndex] = useState(0);
  const [settings] = useSettings();

  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const [progress, setProgress] = useStorage<AdhkarProgress>("adhkarProgress", {
    date: format(new Date(), "yyyy-MM-dd"),
    morning: {},
    evening: {},
    morningCompleted: false,
    eveningCompleted: false
  });

  // Daily reset check at midnight or session opening
  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    if (progress.date !== today) {
      setProgress({
        date: today,
        morning: {},
        evening: {},
        morningCompleted: false,
        eveningCompleted: false
      });
      setIndex(0);
    }
  }, [progress.date]);

  // Auto-suggest session based on current prayer if provided
  useEffect(() => {
    if (currentPrayer) {
      const name = currentPrayer.toLowerCase();
      if (name === "fajr" || name === "dhuhr") {
        setSession("morning");
      } else if (name === "asr" || name === "maghrib" || name === "isha") {
        setSession("evening");
      }
      setIndex(0);
    }
  }, [currentPrayer]);

  const items = session === "morning" ? morningAdhkar : eveningAdhkar;
  const currentItem = items[index];

  // Completed reps count
  const completedCounts = session === "morning" ? progress.morning : progress.evening;
  const completedCount = completedCounts[currentItem?.id] || 0;
  
  const isSessionCompleted = session === "morning" ? progress.morningCompleted : progress.eveningCompleted;

  const handleIncrement = () => {
    if (!currentItem) return;
    const isMorning = session === "morning";
    const newCount = Math.min(currentItem.count, completedCount + 1);
    const updatedCounts = { ...completedCounts, [currentItem.id]: newCount };
    
    // Check if session is fully complete (all items completed)
    const isAllDone = items.every((item) => {
      const c = item.id === currentItem.id ? newCount : completedCounts[item.id] || 0;
      return c >= item.count;
    });

    setProgress({
      ...progress,
      morning: isMorning ? updatedCounts : progress.morning,
      evening: !isMorning ? updatedCounts : progress.evening,
      morningCompleted: isMorning ? isAllDone : progress.morningCompleted,
      eveningCompleted: !isMorning ? isAllDone : progress.eveningCompleted
    });

    // Auto-advance to next item if completed current reps
    if (newCount === currentItem.count && index < items.length - 1) {
      setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 300);
    }
  };

  const handleDecrement = () => {
    if (!currentItem) return;
    const isMorning = session === "morning";
    const newCount = Math.max(0, completedCount - 1);
    const updatedCounts = { ...completedCounts, [currentItem.id]: newCount };

    setProgress({
      ...progress,
      morning: isMorning ? updatedCounts : progress.morning,
      evening: !isMorning ? updatedCounts : progress.evening,
      morningCompleted: isMorning ? false : progress.morningCompleted,
      eveningCompleted: !isMorning ? false : progress.eveningCompleted
    });
  };

  const handleResetSession = () => {
    const isMorning = session === "morning";
    setProgress({
      ...progress,
      morning: isMorning ? {} : progress.morning,
      evening: !isMorning ? {} : progress.evening,
      morningCompleted: isMorning ? false : progress.morningCompleted,
      eveningCompleted: !isMorning ? false : progress.eveningCompleted
    });
    setIndex(0);
  };

  // Progress percentage
  const totalRepsToComplete = items.reduce((acc, curr) => acc + curr.count, 0);
  const totalCompletedReps = items.reduce((acc, curr) => acc + (completedCounts[curr.id] || 0), 0);
  const progressPercent = Math.round((totalCompletedReps / totalRepsToComplete) * 100) || 0;

  return (
    <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 flex flex-col space-y-4 font-sans select-none">
      {/* 1. Header Toggles */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg bg-stone-100 p-0.5 dark:bg-stone-950 border border-stone-200/20 dark:border-stone-800/20">
          <button
            type="button"
            onClick={() => { setSession("morning"); setIndex(0); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200",
              session === "morning"
                ? "bg-white text-emerald-800 shadow-sm dark:bg-stone-800 dark:text-emerald-400"
                : "text-stone-400 dark:text-stone-500"
            )}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>{t("morningAdhkar")}</span>
          </button>
          <button
            type="button"
            onClick={() => { setSession("evening"); setIndex(0); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200",
              session === "evening"
                ? "bg-white text-emerald-800 shadow-sm dark:bg-stone-800 dark:text-emerald-400"
                : "text-stone-400 dark:text-stone-500"
            )}
          >
            <Moon className="h-3.5 w-3.5" />
            <span>{t("eveningAdhkar")}</span>
          </button>
        </div>

        {totalCompletedReps > 0 && (
          <button
            type="button"
            onClick={handleResetSession}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            title="Reset Session"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 2. Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-wider">
          <span>{t("sessionProgress")}</span>
          <span>{progressPercent}% {t("completed")}</span>
        </div>
        <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-950 rounded-full overflow-hidden border border-stone-200/10 dark:border-stone-800/10">
          <div
            className="h-full bg-emerald-700 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Session Completed State Card */}
      {isSessionCompleted ? (
        <div className="flex flex-col items-center justify-center text-center p-8 border border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/30 dark:bg-emerald-950/10 rounded-xl space-y-3">
          <CheckCircle2 className="h-12 w-12 text-emerald-700" />
          <div className="space-y-1">
            <h3 className="font-amiri font-black text-2xl text-emerald-800 leading-normal">
              تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold tracking-wide">
              {t("sessionCompletedTitle")}
            </p>
            <p className="text-[10px] text-stone-400 dark:text-stone-500 max-w-xs leading-relaxed pt-1.5">
              May Allah accept your supplications, grant you protection, and fill your day with barakah and divine blessings.
            </p>
          </div>
        </div>
      ) : (
        /* 4. Active Adhkar Card */
        <div className="flex-1 flex flex-col space-y-4">
          <div className="rounded-xl border border-stone-200/60 bg-white dark:border-stone-800/60 dark:bg-stone-900/40 p-4 min-h-[180px] flex flex-col justify-between">
            {/* Supplication text fields */}
            <div className="space-y-3">
              <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 tracking-widest block uppercase">
                Adhkar {index + 1} of {items.length}
              </span>
              
              <p className="font-amiri text-lg leading-loose text-stone-800 dark:text-stone-100 text-right font-semibold" dir="rtl">
                {currentItem?.arabic}
              </p>
              
              <p className="text-[11px] text-stone-400 dark:text-stone-555 italic leading-relaxed pt-1 border-t border-stone-200/20 dark:border-stone-800/20">
                {currentItem?.transliteration}
              </p>
              
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                {currentItem?.translation}
              </p>
            </div>

            {/* Repetitions counters */}
            <div className="mt-4 flex items-center justify-between border-t border-stone-200/20 dark:border-stone-800/20 pt-3">
              {/* Left: display counters indicator */}
              <div className="flex flex-col">
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase tracking-wider leading-none">
                  {t("required")}: {currentItem?.count}
                </span>
                <span className="text-sm font-black text-stone-700 dark:text-stone-300 mt-1">
                  {t("completed")}: {completedCount} / {currentItem?.count}
                </span>
              </div>

              {/* Right: counter controls */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={completedCount === 0}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800 transition-colors disabled:opacity-50"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={completedCount === currentItem?.count}
                  className="px-6 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 text-white shadow-sm hover:bg-emerald-600 transition-all duration-200 disabled:bg-stone-200 disabled:text-stone-400 dark:disabled:bg-stone-800 dark:disabled:text-stone-600"
                >
                  {completedCount === currentItem?.count ? t("done") : "+"}
                </button>
              </div>
            </div>
          </div>

          {/* Benefit / Source */}
          {currentItem?.benefit && (
            <div className="rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200/40 dark:border-stone-800/50 p-3 flex gap-2.5 items-start">
              <Heart className="h-4.5 w-4.5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-normal font-medium">
                  {currentItem.benefit}
                </p>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block mt-1.5">
                  {currentItem.source}
                </span>
              </div>
            </div>
          )}

          {/* 5. Footer Swipe Actions */}
          <div className="flex justify-between items-center mt-2.5">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((prev) => prev - 1)}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{t("previous")}</span>
            </button>
            <button
              type="button"
              disabled={index === items.length - 1}
              onClick={() => setIndex((prev) => prev + 1)}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 disabled:opacity-40 transition-colors"
            >
              <span>{t("next")}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
