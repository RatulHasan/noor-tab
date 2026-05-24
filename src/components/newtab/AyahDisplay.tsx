import React from "react";
import { AYAHS } from "~data/ayahs";
import IslamicPattern from "../shared/IslamicPattern";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";
import { cn } from "~utils/cn";

/**
 * @param {Object} props
 * @param {string} [props.className] - Optional custom CSS class name.
 */
interface AyahDisplayProps {
  className?: string;
}

export default function AyahDisplay({ className = "" }: AyahDisplayProps) {
  const [settings] = useSettings();
  const lang = settings?.language || "en";

  // Select daily verse using date as a seed
  const today = new Date();
  const dateSeed = today.getDate() + today.getMonth() * 31 + today.getFullYear();
  const index = dateSeed % AYAHS.length;
  const ayah = AYAHS[index];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm dark:border-stone-800/60 dark:bg-stone-900/40 flex flex-col justify-between min-h-[160px]",
        className
      )}
    >
      {/* Subtle background decoration */}
      <IslamicPattern opacity={0.03} />

      <div className="relative z-10 space-y-4">
        {/* Arabic Text (RTL) */}
        <p
          className="text-right font-amiri text-2xl font-bold leading-loose text-stone-800 dark:text-stone-100 select-text"
          dir="rtl"
        >
          {ayah.text}
        </p>

        {/* Translation (LTR) */}
        <p className="text-left text-xs leading-relaxed text-stone-500 dark:text-stone-400 font-medium select-text">
          {ayah.translation}
        </p>
      </div>

      {/* Surah Reference */}
      <div className="relative z-10 mt-4 flex items-center justify-between text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
        <span>{getTranslation(lang, "dailyAyah")}</span>
        <span className="font-mono text-stone-400 dark:text-stone-500 select-text">
          {ayah.reference}
        </span>
      </div>
    </div>
  );
}
