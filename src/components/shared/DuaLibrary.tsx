import React, { useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { duas } from "~data/duas";
import type { Dua, DuaCategory } from "~types";
import { cn } from "~utils/cn";
import { Heart, Search, ChevronRight, BookOpen, Star } from "lucide-react";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";

const CATEGORY_LABELS: Record<DuaCategory, string> = {
  morning_evening: "Morning & Evening",
  travel: "Travel",
  eating: "Eating & Drinking",
  sleeping: "Sleeping & Waking",
  stress: "Stress & Anxiety",
  gratitude: "Gratitude & Blessings",
  protection: "Protection",
  forgiveness: "Forgiveness",
  family: "Family & Loved Ones",
  knowledge: "Knowledge & Wisdom",
  general: "General & Essential"
};

export default function DuaLibrary() {
  const [favorites, setFavorites] = useStorage<string[]>("duaFavorites", []);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [settings] = useSettings();
  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
  };

  // Filter logic
  const filteredDuas = duas.filter((dua) => {
    // 1. Category Filter
    if (activeCategory === "favorites") {
      if (!favorites.includes(dua.id)) return false;
    } else if (activeCategory !== "all") {
      if (dua.category !== activeCategory) return false;
    }

    // 2. Text Search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchTitle = dua.title.toLowerCase().includes(query);
      const matchTranslation = dua.translation.toLowerCase().includes(query);
      const matchTransliteration = dua.transliteration.toLowerCase().includes(query);
      const matchCategory = CATEGORY_LABELS[dua.category].toLowerCase().includes(query);
      return matchTitle || matchTranslation || matchTransliteration || matchCategory;
    }

    return true;
  });

  const categories = Object.keys(CATEGORY_LABELS) as DuaCategory[];

  return (
    <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 flex flex-col space-y-4 font-sans select-none">
      <div className="flex flex-col space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          {t("duaLibrary")}
        </p>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search supplications by keyword..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(10); // reset pagination on search
            }}
            className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 pl-9 pr-4 py-2.5 outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Category Horizontal Filter Row */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-800 -mx-1 px-1">
          <button
            onClick={() => {
              setActiveCategory("all");
              setVisibleCount(10);
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold border whitespace-nowrap transition-colors duration-200",
              activeCategory === "all"
                ? "bg-emerald-700 text-white border-emerald-800 shadow-sm"
                : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
            )}
          >
            All Duas
          </button>
          <button
            onClick={() => {
              setActiveCategory("favorites");
              setVisibleCount(10);
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold border whitespace-nowrap flex items-center gap-1 transition-colors duration-200",
              activeCategory === "favorites"
                ? "bg-rose-700 text-white border-rose-800 shadow-sm"
                : "bg-rose-50/50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400 hover:bg-rose-50"
            )}
          >
            <Heart className={cn("w-3 h-3", activeCategory === "favorites" ? "fill-current" : "")} />
            Favorites ({favorites.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(10);
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-bold border whitespace-nowrap transition-colors duration-200",
                activeCategory === cat
                  ? "bg-emerald-700 text-white border-emerald-800 shadow-sm"
                  : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Supplications List */}
      <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
        {filteredDuas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-stone-400 space-y-2">
            <BookOpen className="w-8 h-8 opacity-40" />
            <p className="text-xs">No supplications found matching criteria.</p>
          </div>
        ) : (
          filteredDuas.slice(0, visibleCount).map((dua) => {
            const isFav = favorites.includes(dua.id);
            return (
              <div
                key={dua.id}
                className="bg-stone-50/50 dark:bg-stone-900/40 rounded-xl p-3 border border-stone-200/40 dark:border-stone-800/50 hover:shadow-sm transition-shadow duration-200 flex flex-col space-y-2.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-stone-800 dark:text-stone-100">
                      {dua.title}
                    </h4>
                    <span className="text-[9px] text-stone-400 dark:text-stone-500 font-semibold uppercase tracking-wider block mt-0.5">
                      {CATEGORY_LABELS[dua.category]}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(dua.id)}
                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <Heart className={cn("w-4 h-4", isFav ? "fill-rose-500 text-rose-500" : "")} />
                  </button>
                </div>

                {/* Arabic Supplication */}
                <div className="font-amiri text-xl text-right text-emerald-800 dark:text-emerald-400 leading-loose" dir="rtl">
                  {dua.arabic}
                </div>

                {/* Translation & Transliteration */}
                <div className="space-y-1.5 text-xs">
                  <p className="text-stone-500 dark:text-stone-400 italic font-medium leading-relaxed">
                    {dua.transliteration}
                  </p>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
                    {dua.translation}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[9px] text-stone-400 pt-1 border-t border-stone-200/20 dark:border-stone-800/20">
                  <span>Source: {dua.source}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Load More Button */}
      {filteredDuas.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 10)}
          className="py-2 text-xs font-bold text-center text-emerald-700 hover:text-emerald-600 transition-colors border border-stone-200/60 dark:border-stone-800/80 rounded-lg hover:bg-stone-50/50 dark:hover:bg-stone-900/40"
        >
          Show More Duas (+10)
        </button>
      )}
    </div>
  );
}
