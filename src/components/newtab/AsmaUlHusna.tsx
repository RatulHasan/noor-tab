import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, BookOpen } from "lucide-react";
import { asmaUlHusna as ASMA_UL_HUSNA } from "../../data/asmaUlHusna";
import type { AsmaName } from "../../types";
import { cn } from "../../utils/cn";
import { useSettings } from "../../hooks/useSettings";
import { getTranslation } from "../../data/translations";

export default function AsmaUlHusna() {
  const [showAll, setShowAll] = useState(false);
  const [showBenefit, setShowBenefit] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings] = useSettings();

  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // Ensure portal target is available
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAll]);

  // Date-seeded name of the day (same each day, rotates daily)
  const seed = Math.floor(Date.now() / 86400000);
  const name: AsmaName = ASMA_UL_HUSNA[seed % 99];

  const modal = mounted && showAll
    ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAll(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t("the99NamesOfAllah")}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200/50 dark:border-stone-800/60 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 dark:border-stone-800/50 bg-white dark:bg-stone-900 shrink-0">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 block">
                  {t("asmaUlHusnaTitle")}
                </span>
                <span className="text-sm font-bold text-stone-700 dark:text-stone-200">
                  {t("the99NamesOfAllah")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Close 99 names"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 3-column grid of all names */}
            <div className="overflow-y-auto p-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ASMA_UL_HUSNA.map((asma) => (
                  <div
                    key={asma.number}
                    className={cn(
                       "rounded-xl p-3 border transition-all duration-200 space-y-1.5",
                      asma.number === name.number
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                        : "border-stone-100 dark:border-stone-800/40 bg-stone-50/50 dark:bg-stone-800/20 hover:border-stone-200 dark:hover:border-stone-700"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-[9px] font-black text-stone-500 dark:text-stone-400 shrink-0 mt-0.5">
                        {asma.number}
                      </span>
                      <div
                        className="font-amiri text-xl leading-loose text-right text-stone-800 dark:text-stone-100 flex-1"
                        dir="rtl"
                        lang="ar"
                      >
                        {asma.arabic}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        {asma.transliteration}
                      </p>
                      <p className="text-[10px] text-stone-400 dark:text-stone-550 leading-snug">
                        {asma.meaning}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {/* Daily Name Card */}
      <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 space-y-3">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            {t("nameOfTheDay")}
          </span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black">
            {name.number}
          </span>
        </div>

        {/* Arabic name */}
        <div
          className="font-amiri text-3xl leading-loose text-right text-stone-800 dark:text-stone-100 select-text"
          dir="rtl"
          lang="ar"
        >
          {name.arabic}
        </div>

        {/* Transliteration & meaning */}
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {name.transliteration}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            {name.meaning}
          </p>
        </div>

        {/* Benefit - uses CSS grid transition to avoid max-h glitch */}
        <div
          className="grid transition-all duration-300 ease-out"
          style={{ gridTemplateRows: showBenefit ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed italic pt-2 border-t border-stone-100 dark:border-stone-800/50 mt-1">
              ✦ {name.benefit}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1.5 border-t border-stone-100 dark:border-stone-800/50">
          <button
            type="button"
            onClick={() => setShowBenefit((v) => !v)}
            className="text-[11px] text-stone-400 dark:text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors duration-200 cursor-pointer"
          >
            {showBenefit ? t("hideBenefit") : t("showBenefit")}
          </button>

          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            {t("viewAll99Names")}
          </button>
        </div>
      </div>

      {/* Portal-rendered modal - escapes overflow-x-hidden parent */}
      {modal}
    </>
  );
}
