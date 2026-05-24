import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import type { DhikrPhase } from "~types";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";
import { cn } from "~utils/cn";

/**
 * @param {Object} props
 * @param {string} [props.className] - Optional custom CSS class name.
 */
interface DhikrCounterProps {
  className?: string;
}

const PHASES: DhikrPhase[] = [
  { count: 33, max: 33, ar: "سُبْحَانَ ٱللَّٰهِ", en: "SubhanAllah", transliteration: "Glory be to Allah" },
  { count: 33, max: 66, ar: "ٱلْحَمْدُ لِلَّٰهِ", en: "Alhamdulillah", transliteration: "Praise be to Allah" },
  { count: 34, max: 100, ar: "ٱللَّٰهُ أَكْبَرُ", en: "Allahu Akbar", transliteration: "Allah is the Greatest" },
];

const TRANSLATED_MEANINGS = {
  en: [
    "Glory be to Allah",
    "Praise be to Allah",
    "Allah is the Greatest"
  ],
  bn: [
    "আল্লাহ পরম পবিত্র",
    "সকল প্রশংসা আল্লাহর জন্য",
    "আল্লাহ সবচেয়ে মহান"
  ],
  ar: [
    "سبحان الله",
    "الحمد لله",
    "الله أكبر"
  ],
  hi: [
    "अल्लाह पवित्र है",
    "सब तारीफें अल्लाह के लिए हैं",
    "अल्लाह सबसे बड़ा है"
  ],
  ur: [
    "اللہ پاک ہے",
    "تمام تعریفیں اللہ کے لیے ہیں",
    "اللہ سب سے بڑا ہے"
  ]
};

export default function DhikrCounter({ className = "" }: DhikrCounterProps) {
  const [settings] = useSettings();
  const [count, setCount] = useState(0); // 0 to 100 representing cycle
  const [totalCount, setTotalCount] = useState(0); // overall lifetime clicks in session

  const lang = settings?.language || "en";

  // Load persisted states from session storage
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
          const res = await chrome.storage.session.get(["dhikr-count", "dhikr-total"]);
          setCount(res["dhikr-count"] || 0);
          setTotalCount(res["dhikr-total"] || 0);
        } else {
          const localCount = sessionStorage.getItem("dhikr-count");
          const localTotal = sessionStorage.getItem("dhikr-total");
          if (localCount) setCount(parseInt(localCount, 10));
          if (localTotal) setTotalCount(parseInt(localTotal, 10));
        }
      } catch (err) {
        console.error("Failed to load session dhikr count:", err);
      }
    };
    loadSessionData();
  }, []);

  // Save changes to session storage
  const saveSessionData = async (newCount: number, newTotal: number) => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
        await chrome.storage.session.set({
          "dhikr-count": newCount,
          "dhikr-total": newTotal,
        });
      } else {
        sessionStorage.setItem("dhikr-count", newCount.toString());
        sessionStorage.setItem("dhikr-total", newTotal.toString());
      }
    } catch (err) {
      console.error("Failed to save session dhikr count:", err);
    }
  };

  // Determine current active remembrance phase
  // count ranges: 0–32 = SubhanAllah (33 clicks), 33–65 = Alhamdulillah (33 clicks), 66–99 = Allahu Akbar (34 clicks)
  const getActivePhase = (currentVal: number): { phase: DhikrPhase; index: number; relativeCount: number } => {
    if (currentVal < 33) {
      return { phase: PHASES[0], index: 0, relativeCount: currentVal };
    }
    if (currentVal < 66) {
      return { phase: PHASES[1], index: 1, relativeCount: currentVal - 33 };
    }
    return { phase: PHASES[2], index: 2, relativeCount: currentVal - 66 };
  };

  const { phase, index, relativeCount } = getActivePhase(count);

  const handleIncrement = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(30);
    }

    // After 100 clicks (indices 0–99), reset to 0 for the next cycle
    const nextCount = count >= 99 ? 0 : count + 1;
    const nextTotal = totalCount + 1;
    setCount(nextCount);
    setTotalCount(nextTotal);
    saveSessionData(nextCount, nextTotal);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering increment
    setCount(0);
    setTotalCount(0);
    saveSessionData(0, 0);
  };

  // Circular progress ring calculations
  const radius = 54;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  // Progress within the current active phase (handle 0 case gracefully)
  const progressPercent = relativeCount === 0 ? 0 : (relativeCount / phase.count) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Retrieve translation meanings
  const phaseTranslations = TRANSLATED_MEANINGS[lang] || TRANSLATED_MEANINGS.en;
  const localizedMeaning = phaseTranslations[index] || phase.transliteration;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-between rounded-2xl border border-stone-200/60 bg-white p-5 shadow-sm dark:border-stone-800/60 dark:bg-stone-900/40 text-center min-h-[220px]",
        className
      )}
    >
      <div className="flex w-full justify-between items-center text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
        <span>{getTranslation(lang, "tasbihCounter")}</span>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 rounded p-1 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
          title={getTranslation(lang, "resetSession")}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Large Circular Tap Target */}
      <div
        onClick={handleIncrement}
        className="relative mt-2 flex h-32 w-32 cursor-pointer items-center justify-center rounded-full bg-stone-50/80 shadow-sm border border-stone-200/30 hover:shadow-md transition-all duration-300 select-none active:scale-95 dark:bg-stone-900/30 dark:border-stone-800/50"
      >
        {/* Animated Progress Ring */}
        <svg className="absolute h-full w-full rotate-[-90deg]">
          <circle
            cx="64"
            cy="64"
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            className="text-stone-100 dark:text-stone-800/30"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            className="text-emerald-600 dark:text-emerald-500 transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center Label Display */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-3xl font-black text-stone-800 dark:text-stone-100">
            {relativeCount}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500">
            of {phase.count}
          </span>
        </div>
      </div>

      {/* Arabic and English texts */}
      <div className="mt-3 space-y-0.5">
        <h3 className="font-amiri text-lg font-bold text-emerald-800 dark:text-emerald-400 leading-none">
          {phase.ar}
        </h3>
        <p className="text-[11px] font-bold text-stone-700 dark:text-stone-300 leading-none">
          {phase.en}
        </p>
        <p className="text-[9px] text-stone-400 dark:text-stone-500 italic leading-none">
          {localizedMeaning}
        </p>
      </div>

      <div className="mt-2 text-[9px] font-semibold text-stone-400 dark:text-stone-600 uppercase tracking-widest">
        {getTranslation(lang, "sessionTotal")}:{" "}
        <span className="font-mono text-stone-500 dark:text-stone-400 font-bold">{totalCount}</span>
      </div>
    </div>
  );
}
