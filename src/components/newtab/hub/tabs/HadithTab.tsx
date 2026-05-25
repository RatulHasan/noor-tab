import React, { useState, useEffect, useMemo } from "react";
import { getHadithBooks, getHadith, getHadiths, type HadithBook, type Hadith } from "~services/api/hadithApi";
import { HADITHS as LOCAL_HADITHS } from "~data/hadiths";
import { BookMarked, ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";
import { cn } from "~utils/cn";
import { getTranslation } from "~data/translations";
import { useSettings } from "~hooks/useSettings";

export default function HadithTab() {
  const [settings] = useSettings();
  const lang = settings?.language || 'en';
  const t = (key: any) => getTranslation(lang, key);

  const [books, setBooks] = useState<HadithBook[]>([]);
  const [selectedBookId, setSelectedBookId] = useState("bukhari");
  const [hadithNumber, setHadithNumber] = useState(1);
  const [currentHadith, setCurrentHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(false);

  // Daily Hadith
  const dailyHadith = useMemo(() => {
    const today = new Date();
    const dateSeed = today.getDate() + today.getMonth() * 31 + today.getFullYear();
    const index = dateSeed % LOCAL_HADITHS.length;
    return LOCAL_HADITHS[index];
  }, []);

  useEffect(() => {
    getHadithBooks().then(setBooks);
  }, []);

  useEffect(() => {
    setLoading(true);
    getHadith(selectedBookId, hadithNumber)
      .then(setCurrentHadith)
      .finally(() => setLoading(false));
  }, [selectedBookId, hadithNumber]);

  const handlePrev = () => {
    if (hadithNumber > 1) setHadithNumber(hadithNumber - 1);
  };

  const handleNext = () => {
    const book = books.find(b => b.id === selectedBookId);
    if (book && hadithNumber < book.available) {
      setHadithNumber(hadithNumber + 1);
    } else {
        setHadithNumber(hadithNumber + 1);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-emerald-600" />
            {t("hadithExplorer")}
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {t("hadithExplorerSub")}
          </p>
        </div>
        <div className="flex gap-2">
           <select 
            value={selectedBookId} 
            onChange={(e) => {
                setSelectedBookId(e.target.value);
                setHadithNumber(1);
            }}
            className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {books.map(book => (
              <option key={book.id} value={book.id}>{book.name}</option>
            ))}
          </select>
          <div className="relative">
             <input 
                type="number"
                value={hadithNumber}
                onChange={(e) => setHadithNumber(parseInt(e.target.value) || 1)}
                className="w-24 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
             />
             <span className="absolute -top-6 left-0 text-[10px] font-bold text-stone-400 uppercase">{t("number")}</span>
          </div>
        </div>
      </div>

      {/* Daily Hadith Pin */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <BookMarked className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <span className="inline-block px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded uppercase tracking-widest mb-4">
            {t("todaysHadith")}
          </span>
          <p className="font-amiri text-2xl text-right text-emerald-900 dark:text-emerald-100 leading-loose mb-4" dir="rtl">
            {dailyHadith.text}
          </p>
          <p className="text-stone-700 dark:text-stone-300 italic text-sm mb-2">
            "{dailyHadith.translation}"
          </p>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            — {dailyHadith.reference}
          </p>
        </div>
      </div>

      {/* Explorer Content */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-stone-400">
             <Loader2 className="w-8 h-8 animate-spin mb-2" />
             <p className="text-sm">{t("fetchingFromCollection")}</p>
          </div>
        ) : currentHadith ? (
          <div className="flex-1 p-8 space-y-8">
             <div className="flex justify-between items-center pb-4 border-b border-stone-100 dark:border-stone-800">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  {books.find(b => b.id === selectedBookId)?.name} #{hadithNumber}
                </span>
             </div>
             <div className="space-y-6">
                <p className="font-amiri text-3xl text-right text-stone-800 dark:text-stone-100 leading-relaxed" dir="rtl">
                  {currentHadith.arab}
                </p>
                <div className="pt-6 border-t border-stone-50 dark:border-stone-800">
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {currentHadith.id}
                  </p>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-stone-400">
             <Search className="w-12 h-12 opacity-20 mb-4" />
             <p className="text-sm">{t("hadithNotFound")}</p>
          </div>
        )}

        <div className="p-4 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
           <button 
            onClick={handlePrev}
            disabled={hadithNumber <= 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
           >
             <ChevronLeft className="w-4 h-4" /> {t("prev")}
           </button>
           <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-600 hover:text-stone-900 transition-colors"
           >
             {t("next")} <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
