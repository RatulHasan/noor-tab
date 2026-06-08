import { BookOpen, ChevronDown, Home, Sparkles, Star, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";



import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";



import { getTranslation } from "~data/translations";
import { useSettings } from "~hooks/useSettings";
import { cn } from "~utils/cn";





function isJumuah(): boolean {
  return new Date().getDay() === 5; // Friday
}

function getTodayKey(): string {
  const d = new Date();
  return `jumuah-dismissed-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

const globalStorage = new Storage();

export default function JumuahBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [settings] = useSettings();
  const [, setPendingSurah] = useStorage<number | null>("pendingQuranSurah", null);
  const [, setTargetTab] = useStorage<string>("targetHubTab", "quranHadith");

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

  const handleReadSurahKahf = useCallback(async () => {
    // Set the pending surah to 18 (Al-Kahf)
    await setPendingSurah(18)
    // Set the target tab to quranHadith
    await setTargetTab("quranHadith")
    // Also update via global storage for cross-context sync
    await globalStorage.set("pendingQuranSurah", 18)
    await globalStorage.set("targetHubTab", "quranHadith")

    // Collapse the banner after clicking
    setExpanded(false)

    // Scroll to the hub section
    const hubElement = document.querySelector("[data-hub-container]")
    if (hubElement) {
      hubElement.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [setPendingSurah, setTargetTab])

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
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 dark:from-emerald-950 dark:via-emerald-900 dark:to-emerald-950 shadow-xl shadow-emerald-900/30 border border-emerald-600/30 dark:border-emerald-800/50">
      {/* Animated Islamic pattern overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-emerald-900 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Home className="h-5 w-5" />
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-400 rounded-full flex items-center justify-center">
              <Sparkles className="h-2.5 w-2.5 text-emerald-900" />
            </div>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block">
              {t("jumuahMubarak")}
            </span>
            <span className="text-sm font-bold text-white">
              {t("blessedFriday")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            aria-label={expanded ? t("collapse") : t("expand")}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded ? "rotate-180" : "")} />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            aria-label={t("dismissBanner")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="relative z-10 p-5 space-y-4">
          {/* Quranic verse card */}
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 space-y-3 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <BookOpen className="h-3 w-3" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80">
                {t("surahJumuahRef")}
              </span>
            </div>
            <p
              className="font-amiri text-xl leading-loose text-right text-white/95 drop-shadow-sm"
              dir="rtl"
              lang="ar"
            >
              يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              {t("jumuahAyah")}
            </p>
          </div>

          {/* Surah Al-Kahf CTA */}
          <div className="rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/10 backdrop-blur-sm p-4 border border-amber-400/30">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                  <h4 className="text-sm font-bold text-amber-100">
                    {t("readSurahKahf")}
                  </h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed max-w-sm">
                  {t("surahKahfDescription")}
                </p>
              </div>
              <button
                onClick={handleReadSurahKahf}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-900 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/30 transition-all duration-200 active:scale-95"
              >
                <BookOpen className="h-4 w-4" />
                {t("readNow")}
              </button>
            </div>
          </div>

          {/* Benefits badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-medium flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t("lightOfGuidance")}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-medium flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {t("protectionFromFitnah")}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-medium flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t("spiritualBlessings")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
