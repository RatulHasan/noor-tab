import React, { useState } from "react";
import { X, BookOpen } from "lucide-react";
import { asmaUlHusna as ASMA_UL_HUSNA } from "../../data/asmaUlHusna";
import type { AsmaName } from "../../types";
import { cn } from "../../utils/cn";

export default function AsmaUlHusna() {
  const [showAll, setShowAll] = useState(false);
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null);

  // Date-seeded name of the day (same each day, rotates daily)
  const seed = Math.floor(Date.now() / 86400000);
  const name: AsmaName = ASMA_UL_HUSNA[seed % 99];

  return (
    <>
      {/* Daily Name Card */}
      <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 space-y-3">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            Name of the Day
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

        {/* Benefit (visible on hover or always shown subtly) */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            hoveredNumber === name.number ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <p className="text-[11px] text-stone-400 dark:text-stone-500 leading-relaxed italic pt-1 border-t border-stone-100 dark:border-stone-800/50">
            ✦ {name.benefit}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800/50">
          <button
            type="button"
            onMouseEnter={() => setHoveredNumber(name.number)}
            onMouseLeave={() => setHoveredNumber(null)}
            onFocus={() => setHoveredNumber(name.number)}
            onBlur={() => setHoveredNumber(null)}
            className="text-[11px] text-stone-400 dark:text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors duration-200"
          >
            {hoveredNumber === name.number ? "Hide benefit" : "Show benefit ↓"}
          </button>

          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors duration-200"
          >
            <BookOpen className="h-3.5 w-3.5" />
            View all 99 names
          </button>
        </div>
      </div>

      {/* Full 99 names modal */}
      {showAll && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowAll(false)}
            aria-hidden="true"
          />

          {/* Bottom sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto w-full max-w-3xl rounded-t-2xl bg-white dark:bg-stone-900 shadow-2xl border-t border-stone-200/50 dark:border-stone-800/60 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 dark:border-stone-800/50 sticky top-0 bg-white dark:bg-stone-900">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 block">
                    Asma ul-Husna
                  </span>
                  <span className="text-sm font-bold text-stone-700 dark:text-stone-200">
                    The 99 Names of Allah
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
              <div className="overflow-y-auto max-h-[70vh] p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ASMA_UL_HUSNA.map((asma) => (
                    <div
                      key={asma.number}
                      className={cn(
                        "rounded-xl p-3 border transition-all duration-200 space-y-1.5 cursor-default",
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
                        <p className="text-[10px] text-stone-400 dark:text-stone-500 leading-snug">
                          {asma.meaning}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
