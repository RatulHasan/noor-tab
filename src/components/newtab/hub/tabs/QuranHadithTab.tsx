import React, { useState, useEffect } from "react";
import QuranTab from "./QuranTab";
import HadithTab from "./HadithTab";
import { cn } from "~utils/cn";
import { BookOpen, BookMarked } from "lucide-react";
import { getTranslation } from "~data/translations";
import { useSettings } from "~hooks/useSettings";
import { useStorage } from "@plasmohq/storage/hook";
import { Storage } from "@plasmohq/storage";

export default function QuranHadithTab() {
  const [activeSubTab, setActiveSubTab] = useState<"quran" | "hadith">("quran");
  const [settings] = useSettings();
  const lang = settings?.language || "en";
  const t = (key: any) => getTranslation(lang, key);
  const [targetTab] = useStorage<string>("targetHubTab", "quranHadith");

  // Auto-switch to Quran sub-tab when target is quranHadith and pending surah exists
  useEffect(() => {
    if (targetTab === "quranHadith") {
      setActiveSubTab("quran");
      // Clear the target tab after processing
      const storage = new Storage();
      storage.set("targetHubTab", "").catch(() => {});
    }
  }, [targetTab]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 bg-stone-50/50 dark:bg-stone-900/30 border-b border-stone-100 dark:border-stone-800">
        <button
          onClick={() => setActiveSubTab("quran")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all",
            activeSubTab === "quran"
              ? "bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-500 shadow-sm border border-stone-200 dark:border-stone-700"
              : "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800/50"
          )}
        >
          <BookOpen className="w-4 h-4" />
          {t("quran")}
        </button>
        <button
          onClick={() => setActiveSubTab("hadith")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all",
            activeSubTab === "hadith"
              ? "bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-500 shadow-sm border border-stone-200 dark:border-stone-700"
              : "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800/50"
          )}
        >
          <BookMarked className="w-4 h-4" />
          {t("hadith")}
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {activeSubTab === "quran" ? <QuranTab /> : <HadithTab />}
      </div>
    </div>
  );
}
