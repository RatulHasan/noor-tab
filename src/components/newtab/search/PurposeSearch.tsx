import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";

interface PurposeSearchProps {
  onTabChange?: (tabId: string, query?: string) => void;
}

export default function PurposeSearch({ onTabChange }: PurposeSearchProps) {
  const [query, setQuery] = useState("");
  const [settings] = useSettings();
  const lang = settings?.language || 'en';
  const t = (key: any) => getTranslation(lang, key);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchEngines = {
    google: "https://www.google.com/search?q=",
    duckduckgo: "https://duckduckgo.com/?q=",
    bing: "https://www.bing.com/search?q=",
    ecosia: "https://www.ecosia.org/search?q=",
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery.startsWith("quran:")) {
      const q = query.slice(6).trim();
      onTabChange?.("quran", q);
      setQuery("");
      return;
    }

    if (lowerQuery.startsWith("hadith:")) {
      const q = query.slice(7).trim();
      onTabChange?.("hadith", q);
      setQuery("");
      return;
    }

    if (lowerQuery.startsWith("dua:")) {
      const q = query.slice(4).trim();
      onTabChange?.("dua", q);
      setQuery("");
      return;
    }

    const engine = settings?.searchEngine || "google";
    const baseUrl = searchEngines[engine as keyof typeof searchEngines] || searchEngines.google;
    window.open(`${baseUrl}${encodeURIComponent(query)}`, "_blank");
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-2xl mx-auto group"
    >
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-stone-400 group-focus-within:text-emerald-600 transition-colors" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchWithPurpose")}
        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-800 dark:text-stone-100 placeholder-stone-400"
      />
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-stone-400 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md">
          /
        </kbd>
      </div>
    </form>
  );
}
