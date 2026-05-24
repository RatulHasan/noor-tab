import React, { useState, useEffect } from "react";
import { Star, X, ExternalLink } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { getTranslation } from "../../data/translations";

function isJumuah(): boolean {
  return new Date().getDay() === 5; // Friday
}

function getTodayKey(): string {
  const d = new Date();
  return `jumuah-dismissed-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function JumuahBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [settings] = useSettings();

  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // On mount, check if already dismissed today
  useEffect(() => {
    try {
      const key = getTodayKey();
      if (localStorage.getItem(key) === "true") {
        setDismissed(true);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  if (!isJumuah() || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(getTodayKey(), "true");
    } catch {
      // noop
    }
  };

  return (
    <div className="relative rounded-xl border-l-4 border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-700/70 p-4 shadow-sm overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none"
        style={{ backgroundImage: "radial-gradient(circle, #065f46 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      />

      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-3 right-3 h-6 w-6 flex items-center justify-center rounded-lg text-emerald-600 dark:text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
        aria-label="Dismiss Jumu'ah banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="space-y-3 relative z-10">
        {/* Title row */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Star className="h-4 w-4 fill-current" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 block">
              Jumu&apos;ah Mubarak
            </span>
            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              {t("blessedFriday")}
            </span>
          </div>
        </div>

        {/* Quranic verse */}
        <div className="rounded-lg bg-white/60 dark:bg-emerald-950/30 p-3 space-y-2 border border-emerald-100 dark:border-emerald-900/30">
          <p
            className="font-amiri text-lg leading-loose text-right text-stone-800 dark:text-stone-100"
            dir="rtl"
            lang="ar"
          >
            يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed italic">
            "O you who have believed, when the call to prayer is made on the day of Jumu&apos;ah, then proceed to the remembrance of Allah"
            <span className="not-italic font-semibold text-stone-400 dark:text-stone-500 ml-1">— Al-Jumu&apos;ah 62:9</span>
          </p>
        </div>

        {/* Surah Al-Kahf suggestion */}
        <a
          href="https://quran.com/18"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors duration-200 w-fit"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t("readSurahKahf")}
        </a>
      </div>
    </div>
  );
}
