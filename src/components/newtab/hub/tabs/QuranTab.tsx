import React, { useState, useEffect, useMemo } from "react";
import { getSurahList, getSurah, searchQuran, type Surah, type SurahContent, type SearchResult } from "~services/api/quranApi";
import { useStorage } from "@plasmohq/storage/hook";
import type { QuranBookmark } from "~types";
import { BookOpen, Search, ChevronRight, Loader2, Bookmark, ArrowRight } from "lucide-react";
import { cn } from "~utils/cn";
import { getTranslation } from "~data/translations";
import { useSettings } from "~hooks/useSettings";

export default function QuranTab() {
  const [settings] = useSettings();
  const lang = settings?.language || 'en';
  const t = (key: any) => getTranslation(lang, key);

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahContent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleAyahs, setVisibleAyahs] = useState(10);
  const [isListLoading, setIsListLoading] = useState(true);
  const [bookmark, setBookmark] = useStorage<QuranBookmark | null>("quranBookmark", null);
  const [pendingSurah, setPendingSurah] = useStorage<number | null>("pendingQuranSurah", null);

  useEffect(() => {
    setIsListLoading(true);
    getSurahList().then(data => {
      setSurahs(data);
      setIsListLoading(false);
    });
  }, []);

  // Handle pending surah selection (e.g., from Jumu'ah banner)
  useEffect(() => {
    if (pendingSurah && surahs.length > 0) {
      const surahExists = surahs.some(s => s.number === pendingSurah);
      if (surahExists) {
        handleSurahSelect(pendingSurah);
        // Clear the pending surah after selection
        setPendingSurah(null);
      }
    }
  }, [pendingSurah, surahs]);

  const handleSurahSelect = async (num: number) => {
    setLoading(true);
    setSearchQuery("");
    setSearchResults([]);
    const content = await getSurah(num);
    setSelectedSurah(content);
    setVisibleAyahs(10);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSelectedSurah(null);
    const results = await searchQuran(searchQuery);
    setSearchResults(results);
    setLoading(false);
  };

  const handleSaveBookmark = (ayah: { number: number, text: string, translation: string }, surahName: string, surahNum: number) => {
    if (bookmark?.surah === surahNum && bookmark?.ayah === ayah.number) {
      setBookmark(null);
    } else {
      setBookmark({
        surah: surahNum,
        ayah: ayah.number,
        surahName: surahName,
        savedAt: new Date().toISOString(),
      });
    }
  };

  const filteredSurahs = useMemo(() => {
    if (!searchQuery || searchResults.length > 0) return surahs;
    return surahs.filter(s => 
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery)
    );
  }, [surahs, searchQuery, searchResults]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            {t("quranExplorer")}
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {t("quranExplorerSub")}
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchQuranPlaceholder")}
            className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </form>
      </div>

      {/* Continue Reading Banner */}
      {bookmark && !selectedSurah && searchResults.length === 0 && (
        <div className="bg-emerald-700 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-900/20">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t("continueReading")}</p>
              <h4 className="font-bold">{bookmark.surahName} • Ayah {bookmark.ayah}</h4>
            </div>
          </div>
          <button 
            onClick={() => handleSurahSelect(bookmark.surah)}
            className="bg-white text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-50 transition-colors"
          >
            {t("openSurah")} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Surah List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-stone-800 dark:text-stone-100 text-sm px-2">{t("surahs")}</h3>
          <div className="max-h-[600px] overflow-y-auto space-y-1 pr-2 custom-scrollbar">
            {isListLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-16 w-full bg-stone-50 dark:bg-stone-800/50 animate-pulse rounded-xl" />
              ))
            ) : filteredSurahs.map(surah => (
              <button
                key={surah.number}
                onClick={() => handleSurahSelect(surah.number)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl text-left transition-all",
                  selectedSurah?.number === surah.number 
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800" 
                    : "hover:bg-stone-50 dark:hover:bg-stone-800 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-stone-400 w-5">{surah.number}</span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">{surah.englishName}</h4>
                    <p className="text-[10px] text-stone-500">{surah.revelationType} • {surah.numberOfAyahs} {t("ayahsCount")}</p>
                  </div>
                </div>
                <span className="font-amiri text-lg text-emerald-700 dark:text-emerald-400">{surah.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content View */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 min-h-[600px] flex flex-col shadow-sm">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-stone-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>{t("loadingVerses")}</p>
              </div>
            ) : selectedSurah ? (
              <div className="flex-1 flex flex-col">
                <div className="p-8 border-b border-stone-100 dark:border-stone-800 text-center">
                  <h3 className="text-3xl font-amiri text-emerald-800 dark:text-emerald-400 mb-2">{selectedSurah.name}</h3>
                  <h4 className="text-xl font-bold text-stone-800 dark:text-stone-100">{selectedSurah.englishName}</h4>
                </div>
                <div className="flex-1 p-8 space-y-12">
                  {selectedSurah.ayahs.slice(0, visibleAyahs).map((ayah, i) => (
                    <div key={i} className="space-y-6 group relative">
                      <div className="flex justify-between items-start gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-stone-50 dark:bg-stone-800 text-[10px] font-bold text-stone-400 transition-colors">
                          {i + 1}
                        </span>
                        <button 
                          onClick={() => handleSaveBookmark(ayah, selectedSurah.englishName, selectedSurah.number)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-stone-400 hover:text-emerald-600 transition-all"
                          title="Bookmark this position"
                        >
                          <Bookmark className={cn("w-4 h-4", bookmark?.surah === selectedSurah.number && bookmark?.ayah === ayah.number ? "fill-current text-emerald-600" : "")} />
                        </button>
                      </div>
                      <p className="font-amiri text-3xl text-right leading-loose text-stone-800 dark:text-stone-100" dir="rtl">
                        {ayah.text}
                      </p>
                      <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-3xl">
                        {ayah.translation}
                      </p>
                    </div>
                  ))}
                  
                  {visibleAyahs < selectedSurah.ayahs.length && (
                    <button 
                      onClick={() => setVisibleAyahs(prev => prev + 10)}
                      className="w-full py-4 border-2 border-dashed border-stone-100 dark:border-stone-800 rounded-2xl text-stone-400 font-bold hover:border-emerald-200 hover:text-emerald-600 transition-all"
                    >
                      {t("loadMoreAyahs")}
                    </button>
                  )}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="flex-1 p-8 space-y-8">
                <h3 className="font-bold text-stone-400 text-xs uppercase tracking-widest">{t("searchResultsFor")} "{searchQuery}"</h3>
                {searchResults.map((result, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-stone-100 dark:border-stone-800 hover:border-emerald-200 transition-all space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-emerald-700">{result.surah.englishName} : {result.ayah.numberInSurah}</span>
                       <button 
                        onClick={() => handleSurahSelect(result.surah.number)}
                        className="text-xs font-bold text-stone-400 hover:text-emerald-600 flex items-center gap-1"
                       >
                         {t("viewSurah")} <ChevronRight className="w-3 h-3" />
                       </button>
                    </div>
                    <p className="font-amiri text-2xl text-right" dir="rtl">{result.ayah.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-stone-400 text-center">
                <BookOpen className="w-16 h-16 opacity-10 mb-6" />
                <h3 className="text-lg font-bold text-stone-300 dark:text-stone-700">{t("selectSurahToBegin")}</h3>
                <p className="max-w-xs mt-2 text-sm">{t("quranSearchSub")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
