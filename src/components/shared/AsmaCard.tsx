import React, { useState } from "react";
import { asmaUlHusna } from "../../data/asmaUlHusna";
import type { AsmaName } from "../../types";
import { cn } from "../../utils/cn";
import { BookOpen, ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";

export default function AsmaCard() {
  const [showAll, setShowAll] = useState(false);
  const [selectedName, setSelectedName] = useState<AsmaName | null>(null);

  // Pick name of the day based on day of the year
  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const todayName = asmaUlHusna[dayOfYear % 99];

  return (
    <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 flex flex-col space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Name of the Day
        </p>
        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
          No. {todayName.number}
        </span>
      </div>

      {/* Main card representation */}
      <div className="flex flex-col items-center py-2 space-y-2 border-b border-stone-100 dark:border-stone-800/50 pb-4">
        <div className="font-amiri text-5xl text-center text-emerald-700 dark:text-emerald-500 leading-loose" dir="rtl">
          {todayName.arabic}
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-extrabold text-stone-800 dark:text-stone-100 tracking-wide">
            {todayName.transliteration}
          </p>
          <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
            {todayName.meaning}
          </p>
          {todayName.benefit && (
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm italic mt-1 bg-stone-50 dark:bg-stone-800/40 p-2 rounded-lg border border-stone-100 dark:border-stone-800/30">
              <span className="font-bold not-italic text-stone-400 block text-[9px] uppercase tracking-wider mb-0.5">Benefit of Recitation</span>
              {todayName.benefit}
            </p>
          )}
        </div>
      </div>

      {/* Toggle View All */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-600 transition-colors bg-emerald-50/40 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 rounded-lg w-full"
      >
        {showAll ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Hide 99 Names</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            <span>View All 99 Names</span>
          </>
        )}
      </button>

      {/* All 99 Names Scrollable Grid */}
      {showAll && (
        <div className="grid grid-cols-3 gap-2 pt-2 max-h-60 overflow-y-auto pr-1">
          {asmaUlHusna.map((name) => (
            <button
              key={name.number}
              onClick={() => setSelectedName(name)}
              className="flex flex-col items-center p-2 rounded-lg border border-stone-100 hover:border-emerald-600/50 bg-stone-50/30 hover:bg-emerald-50/10 dark:border-stone-800/40 dark:bg-stone-900/30 dark:hover:bg-emerald-950/10 transition-all text-center"
            >
              <span className="text-[9px] font-bold text-stone-400 mb-0.5">
                {name.number}
              </span>
              <span className="font-amiri text-lg text-emerald-700 dark:text-emerald-500 leading-normal" dir="rtl">
                {name.arabic}
              </span>
              <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 truncate w-full">
                {name.transliteration}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Expanded Detail Modal/Overlay */}
      {selectedName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 rounded-xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Name Detail • No. {selectedName.number}
              </span>
              <button
                onClick={() => setSelectedName(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex flex-col items-center space-y-3 py-2">
              <div className="font-amiri text-6xl text-emerald-700 dark:text-emerald-500 leading-normal" dir="rtl">
                {selectedName.arabic}
              </div>
              <div className="text-center space-y-1 w-full">
                <p className="text-lg font-black text-stone-800 dark:text-stone-100">
                  {selectedName.transliteration}
                </p>
                <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
                  {selectedName.meaning}
                </p>
              </div>
              {selectedName.benefit && (
                <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-lg border border-stone-100 dark:border-stone-800/50 w-full">
                  <span className="font-bold text-[9px] text-stone-400 uppercase tracking-wider block mb-1">
                    Benefit of Recitation
                  </span>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed italic">
                    {selectedName.benefit}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedName(null)}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
