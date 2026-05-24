import React, { useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { WidgetConfig, WidgetId } from "../../types";
import { GripVertical, Eye, EyeOff, X, RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "../../utils/cn";
import { POPULAR_LOCATIONS } from "../../data/popularLocations";
import { useSettings } from "../../hooks/useSettings";
import { getTranslation } from "../../data/translations";
import type { TranslationKey } from "../../data/translations";

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "ayah", visible: true, order: 0 },
  { id: "prayerStreak", visible: true, order: 1 },
  { id: "hadith", visible: true, order: 2 },
  { id: "islamicCalendar", visible: true, order: 3 },
  { id: "adhkar", visible: true, order: 4 },
  { id: "asmaName", visible: true, order: 5 },
  { id: "duaLibrary", visible: false, order: 6 },
  { id: "quiz", visible: false, order: 7 },
  { id: "fastingTracker", visible: false, order: 8 },
  { id: "quranBookmark", visible: false, order: 9 },
  { id: "dhikr", visible: false, order: 10 },
];

export const WIDGET_TRANSLATION_KEYS: Record<WidgetId, TranslationKey> = {
  ayah: "dailyAyah",
  hadith: "hadithOfDay",
  dhikr: "tasbihCounter",
  islamicCalendar: "islamicCalendar",
  adhkar: "adhkarTitle",
  asmaName: "asmaUlHusnaTitle",
  duaLibrary: "duaLibrary",
  quiz: "dailyIslamicQuiz",
  fastingTracker: "fastingTracker",
  quranBookmark: "quranBookmarkTitle",
  prayerStreak: "prayerStreakTitle",
};

interface WidgetCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WidgetCustomizer({ isOpen, onClose }: WidgetCustomizerProps) {
  const [widgets, setWidgets] = useStorage<WidgetConfig[]>("widgetLayout", DEFAULT_WIDGETS);
  const [showWarning, setShowWarning] = useState(false);
  const [settings] = useSettings();
  const lang = settings?.language || "en";
  const t = (key: TranslationKey) => getTranslation(lang, key);

  // ── Developer mock storage (shared across the whole extension) ─────────────
  const [devMockTime, setDevMockTime] = useStorage<string>("devMockTime", "");
  const [devMockCoordinates, setDevMockCoordinates] = useStorage<{ lat: number; lng: number } | null>("devMockCoordinates", null);
  const [devMockCityName, setDevMockCityName] = useStorage<string>("devMockCityName", "");

  // Local-only dropdown state for the location simulator (no need to persist)
  const [devSimCountry, setDevSimCountry] = useState("");
  const [devSimCity, setDevSimCity] = useState("");

  const isDev = process.env.PLASMO_PUBLIC_DEV_MODE === "true";

  // Setup sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!isOpen) return null;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleToggleVisibility = (id: WidgetId) => {
    const target = widgets.find((w) => w.id === id);
    if (!target) return;
    setShowWarning(false);
    const updated = widgets.map((w) =>
      w.id === id ? { ...w, visible: !w.visible } : w
    );
    setWidgets(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      const reordered = arrayMove(widgets, oldIndex, newIndex);
      const updated = reordered.map((w, index) => ({ ...w, order: index }));
      setWidgets(updated);
    }
  };

  const handleReset = () => {
    setShowWarning(false);
    setWidgets(DEFAULT_WIDGETS);
  };

  /** Clear every developer mock value back to its real-world defaults. */
  const handleResetAllMocks = () => {
    setDevMockTime("");
    setDevMockCoordinates(null);
    setDevMockCityName("");
    setDevSimCountry("");
    setDevSimCity("");
  };

  /** Trigger simulated prayer notifications instantly for testing. */
  const handleTestNotification = (type: "overlay" | "newtab" | "alarm") => {
    if (type === "overlay") {
      if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab && activeTab.id) {
            chrome.tabs.sendMessage(
              activeTab.id,
              {
                type: "SHOW_PRAYER_OVERLAY",
                prayer: "fajr",
                minutes: settings.reminderMinutes,
              },
              (response) => {
                if (chrome.runtime.lastError || !response?.received) {
                  alert(
                    "Notice: The Overlay Reminder cannot be shown on browser settings, blank tabs, or chrome:// pages. " +
                    "Open a normal webpage (e.g. https://google.com), make sure it is fully loaded, then try again."
                  );
                } else {
                  alert("Success! Check your active webpage — the prayer reminder overlay should be visible.");
                }
              }
            );
          } else {
            alert("No active webpage detected. Open a normal webpage first.");
          }
        });
      }
    } else if (type === "newtab") {
      if (typeof chrome !== "undefined" && chrome.runtime) {
        const url = chrome.runtime.getURL("newtab.html?reminder=fajr");
        chrome.tabs.create({ url });
      }
    } else if (type === "alarm") {
      if (typeof chrome !== "undefined" && chrome.alarms) {
        chrome.alarms.create("prayer-maghrib", { when: Date.now() + 5000 });
        alert("Mock alarm scheduled! It will fire in 5 seconds and trigger your configured notification style.");
      }
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl p-4 flex flex-col space-y-4 font-sans select-none animate-in slide-in-from-right duration-300 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Customize Dashboard
            </h3>
            <span className="text-[9px] text-stone-400 font-bold block mt-0.5">
              Active widgets: {widgets.filter((w) => w.visible).length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Warning Badge */}
        {showWarning && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 dark:border-amber-900/40 dark:bg-amber-950/20 text-[10px] text-amber-700 dark:text-amber-400 font-semibold leading-relaxed animate-in fade-in zoom-in-95 duration-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>Maximum 6 widgets visible at once. Hide another to enable this one.</span>
          </div>
        )}

        {/* Drag and Drop list */}
        <div className="flex-1 space-y-2 pr-0.5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={widgets.map((w) => w.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {widgets.map((widget) => (
                  <SortableItem
                    key={widget.id}
                    widget={widget}
                    label={t(WIDGET_TRANSLATION_KEYS[widget.id])}
                    onToggle={handleToggleVisibility}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Reset layout */}
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 py-2 border border-stone-200/60 dark:border-stone-800 rounded-xl text-xs font-bold text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Layout to Defaults</span>
        </button>

        {/* ── Developer Testing Tools (dev mode only) ─────────────────────── */}
        {isDev && (
          <div className="p-3 rounded-xl border border-rose-200/60 bg-rose-50/10 dark:border-rose-900/30 dark:bg-rose-950/10 space-y-3">

            {/* Header row */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                🛠️ Dev Testing Tools
              </span>
              {(devMockTime || devMockCoordinates) && (
                <button
                  onClick={handleResetAllMocks}
                  className="text-[9px] text-rose-600 dark:text-rose-400 hover:underline font-bold"
                >
                  Reset All Mocks
                </button>
              )}
            </div>

            {/* 1. Simulate Local Time */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                <span>Simulate Local Time:</span>
                <span className="text-stone-800 dark:text-stone-200 font-bold tabular-nums">
                  {devMockTime || "Realtime"}
                </span>
              </div>
              <input
                type="time"
                value={devMockTime || ""}
                onChange={(e) => setDevMockTime(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-100 px-2 py-1.5 outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors"
              />
            </div>

            {/* 2. Simulate Location */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                <span>Simulate Location:</span>
                {devMockCoordinates && devMockCityName ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold truncate max-w-[120px]">
                    {devMockCityName}
                  </span>
                ) : (
                  <span className="text-stone-800 dark:text-stone-200 font-bold">Real GPS</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {/* Country selector */}
                <select
                  value={devSimCountry}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDevSimCountry(val);
                    setDevSimCity("");
                    if (val) {
                      const country = POPULAR_LOCATIONS.find((c) => c.countryName === val);
                      if (country && country.cities.length > 0) {
                        const firstCity = country.cities[0];
                        setDevSimCity(firstCity.name);
                        setDevMockCoordinates({ lat: firstCity.lat, lng: firstCity.lng });
                        setDevMockCityName(`${firstCity.name}, ${val}`);
                      }
                    } else {
                      setDevMockCoordinates(null);
                      setDevMockCityName("");
                    }
                  }}
                  className="w-full text-[10px] rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-100 px-1.5 py-1 outline-none focus:border-rose-500 transition-colors"
                >
                  <option value="">Country…</option>
                  {POPULAR_LOCATIONS.map((c) => (
                    <option key={c.countryName} value={c.countryName}>
                      {c.countryName}
                    </option>
                  ))}
                </select>

                {/* City selector */}
                <select
                  value={devSimCity}
                  disabled={!devSimCountry}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDevSimCity(val);
                    const country = POPULAR_LOCATIONS.find((c) => c.countryName === devSimCountry);
                    const city = country?.cities.find((ct) => ct.name === val);
                    if (city) {
                      setDevMockCoordinates({ lat: city.lat, lng: city.lng });
                      setDevMockCityName(`${city.name}, ${devSimCountry}`);
                    }
                  }}
                  className="w-full text-[10px] rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-100 px-1.5 py-1 outline-none focus:border-rose-500 disabled:opacity-40 transition-colors"
                >
                  <option value="">City…</option>
                  {POPULAR_LOCATIONS.find((c) => c.countryName === devSimCountry)?.cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Test Notifications */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider block">
                Test Notifications:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTestNotification("overlay")}
                  className="py-1.5 px-2 bg-stone-50 hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[10px] font-bold rounded-lg transition-colors"
                >
                  Overlay (Fajr)
                </button>
                <button
                  type="button"
                  onClick={() => handleTestNotification("newtab")}
                  className="py-1.5 px-2 bg-stone-50 hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[10px] font-bold rounded-lg transition-colors"
                >
                  New Tab (Fajr)
                </button>
                <button
                  type="button"
                  onClick={() => handleTestNotification("alarm")}
                  className="col-span-2 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg transition-colors"
                >
                  🔔 Trigger Alarm in 5s (Maghrib)
                </button>
              </div>
            </div>

            <p className="text-[8px] text-stone-400 dark:text-stone-500 italic leading-relaxed">
              Time &amp; location mocks affect prayer times, background gradient, and clock instantly. They are <strong>not</strong> saved to real settings. Use "Reset All Mocks" to restore defaults.
            </p>
          </div>
        )}

      </div>
    </>
  );
}

// ── SortableItem ─────────────────────────────────────────────────────────────

interface SortableItemProps {
  widget: WidgetConfig;
  label: string;
  onToggle: (id: WidgetId) => void;
}

function SortableItem({ widget, label, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border bg-stone-50/50 dark:bg-stone-900/40 transition-all duration-200 select-none",
        isDragging
          ? "border-emerald-600 shadow-md bg-white dark:bg-stone-900 scale-[1.02]"
          : "border-stone-200/60 dark:border-stone-800/60"
      )}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">
          {label}
        </span>
      </div>

      <button
        onClick={() => onToggle(widget.id)}
        className={cn(
          "p-1.5 rounded-lg border transition-all duration-200",
          widget.visible
            ? "border-emerald-200/60 bg-emerald-50/20 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-950/40 dark:bg-emerald-950/20 dark:text-emerald-400"
            : "border-stone-200 bg-white text-stone-400 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
        )}
      >
        {widget.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
