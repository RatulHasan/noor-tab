import { useStorage } from "@plasmohq/storage/hook";
import { format } from "../../utils/dateUtils";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, Save } from "lucide-react";
import { useState } from "react";

import type { QuranBookmark as QuranBookmarkType } from "../../types";
import { SURAH_LIST, getSurahAyahCount } from "../../utils/quranData";
import { cn } from "../../utils/cn";

export default function QuranBookmark() {
  const [bookmark, setBookmark] = useStorage<QuranBookmarkType | null>("quranBookmark", null);
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedAyah, setSelectedAyah] = useState(1);
  const [note, setNote] = useState("");

  const filteredSurahs = SURAH_LIST.filter((s) =>
    `${s.number} ${s.name}`.toLowerCase().includes(search.toLowerCase())
  );

  const maxAyah = getSurahAyahCount(selectedSurah);

  const handleSave = () => {
    const surah = SURAH_LIST.find((s) => s.number === selectedSurah);
    if (!surah) return;
    const newBookmark: QuranBookmarkType = {
      surah: selectedSurah,
      ayah: Math.min(selectedAyah, maxAyah),
      surahName: surah.name,
      savedAt: new Date().toISOString(),
      note: note.trim() || undefined,
    };
    setBookmark(newBookmark);
    setExpanded(false);
    setNote("");
  };

  return (
    <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 space-y-3">
      {/* Header */}
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        Quran Bookmark
      </p>

      {/* Current bookmark display */}
      {bookmark ? (
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                {bookmark.surahName}{" "}
                <span className="text-stone-500 font-normal">
                  {bookmark.surah}:{bookmark.ayah}
                </span>
              </p>
              {bookmark.note && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 italic">
                  {bookmark.note}
                </p>
              )}
              <p className="text-[10px] text-stone-400 mt-0.5">
                Saved {format(new Date(bookmark.savedAt), "MMM dd, yyyy")}
              </p>
            </div>
            <a
              href={`https://quran.com/${bookmark.surah}/${bookmark.ayah}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-600 transition-colors shrink-0"
            >
              Open <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-3 text-stone-400">
          <BookOpen className="w-6 h-6" />
          <p className="text-xs">No bookmark saved yet</p>
        </div>
      )}

      {/* Toggle update section */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-600 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {bookmark ? "Update Bookmark" : "Set Bookmark"}
      </button>

      {/* Expandable form */}
      {expanded && (
        <div className="space-y-3 pt-1 border-t border-stone-100 dark:border-stone-800">
          {/* Surah searchable select */}
          <div className="relative">
            <label className="text-[10px] text-stone-400 uppercase tracking-widest block mb-1">
              Surah
            </label>
            <input
              type="text"
              placeholder="Search surah..."
              value={search}
              onFocus={() => setDropdownOpen(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setDropdownOpen(true);
              }}
              className="w-full text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 px-3 py-2 outline-none focus:border-emerald-500 transition-colors"
            />
            {dropdownOpen && filteredSurahs.length > 0 && (
              <div className="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-md">
                {filteredSurahs.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => {
                      setSelectedSurah(s.number);
                      setSelectedAyah(1);
                      setSearch(`${s.number}. ${s.name}`);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors",
                      selectedSurah === s.number && "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700"
                    )}
                  >
                    {s.number}. {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ayah input */}
          <div>
            <label className="text-[10px] text-stone-400 uppercase tracking-widest block mb-1">
              Ayah (1–{maxAyah})
            </label>
            <input
              type="number"
              min={1}
              max={maxAyah}
              value={selectedAyah}
              onChange={(e) =>
                setSelectedAyah(Math.max(1, Math.min(maxAyah, Number(e.target.value))))
              }
              className="w-full text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 px-3 py-2 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Note textarea */}
          <div>
            <label className="text-[10px] text-stone-400 uppercase tracking-widest block mb-1">
              Note (optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Started reading tafsir here…"
              className="w-full text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 px-3 py-2 outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg px-3 py-2 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Bookmark
          </button>
        </div>
      )}
    </div>
  );
}
