import React from "react";
import { HADITHS } from "~data/hadiths";
import IslamicPattern from "../shared/IslamicPattern";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";
import { cn } from "~utils/cn";

/**
 * @param {Object} props
 * @param {string} [props.className] - Optional custom CSS class name.
 */
interface HadithOfDayProps {
  className?: string;
}

export default function HadithOfDay({ className = "" }: HadithOfDayProps) {
  const [settings] = useSettings();
  const lang = settings?.language || "en";

  // Select daily hadith based on date seed
  const today = new Date();
  const dateSeed = today.getDate() + today.getMonth() * 31 + today.getFullYear();
  const index = dateSeed % HADITHS.length;
  const hadith = HADITHS[index];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-stone-200/60 bg-white p-5 shadow-sm dark:border-stone-800/60 dark:bg-stone-900/40 flex flex-col justify-between min-h-[220px]",
        className
      )}
    >
      {/* Pattern background decoration */}
      <IslamicPattern opacity={0.03} />

      <div className="relative z-10 space-y-3">
        {/* Arabic Narration */}
        <p
          className="text-right font-amiri text-lg font-bold leading-relaxed text-stone-800 dark:text-stone-100 select-text"
          dir="rtl"
        >
          « {hadith.text} »
        </p>

        {/* English Translation */}
        <p className="text-left text-xs leading-relaxed text-stone-500 dark:text-stone-400 font-medium select-text">
          "{hadith.translation}"
        </p>
      </div>

      {/* Hadith citation reference */}
      <div className="relative z-10 mt-3 flex items-center justify-between text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
        <span>{getTranslation(lang, "hadithOfDay")}</span>
        <span className="font-mono text-stone-400 dark:text-stone-500 select-text">
          {hadith.reference}
        </span>
      </div>
    </div>
  );
}
