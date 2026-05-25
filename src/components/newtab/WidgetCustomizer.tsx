import React, { useState, useMemo } from "react";
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
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { WidgetId, PanelItem, PanelId } from "~types";
import { GripVertical, Eye, EyeOff, X, RotateCcw, AlertTriangle, Lock } from "lucide-react";
import { cn } from "~utils/cn";
import { POPULAR_LOCATIONS } from "~data/popularLocations";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";
import type { TranslationKey } from "~data/translations";
import { useLayoutState } from "~hooks/useLayoutState";

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
  globalPrayer: "globalPrayerTimes",
};

interface WidgetCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WidgetCustomizer({ isOpen, onClose }: WidgetCustomizerProps) {
  const { layoutState, toggleVisibility, moveBetweenPanels, resetLayout, reorderWithinPanel } = useLayoutState();
  const [showWarning, setShowWarning] = useState(false);
  const [settings] = useSettings();
  const lang = settings?.language || "en";
  const t = (key: TranslationKey) => getTranslation(lang, key);

  const widgetItems = useMemo(() => {
    const items: PanelItem[] = [];
    Object.values(layoutState.panels).forEach(panel => {
        items.push(...panel.filter(i => i.type === 'widget'));
    });
    return items.sort((a, b) => {
        // Sort by panel first, then by order
        const panelOrder = { left: 0, center: 1, right: 2, bottom: 3 };
        if (a.panel !== b.panel) return panelOrder[a.panel] - panelOrder[b.panel];
        return a.order - b.order;
    });
  }, [layoutState.panels]);

  const [devMockTime, setDevMockTime] = useStorage<string>("devMockTime", "");
  const [devMockCoordinates, setDevMockCoordinates] = useStorage<{ lat: number; lng: number } | null>("devMockCoordinates", null);
  const [devMockCityName, setDevMockCityName] = useStorage<string>("devMockCityName", "");

  const [devSimCountry, setDevSimCountry] = useState("");
  const [devSimCity, setDevSimCity] = useState("");

  const isDev = process.env.PLASMO_PUBLIC_DEV_MODE === "true";

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!isOpen) return null;

  const handleToggleVisibility = (id: string, panel: PanelId) => {
    const item = layoutState.panels[panel].find(i => i.id === id);
    const wasVisible = item?.visible;

    toggleVisibility(id, panel);

    // If we are hiding global prayer times, also clear developer mocks
    // because users often use them together and expect "hiding" the global feature 
    // to restore their "default" (local) prayer times.
    if (id === 'widget-globalPrayer' && wasVisible) {
      handleResetAllMocks();
    }
  };

  const handlePanelChange = (id: string, sourcePanel: PanelId, targetPanel: PanelId) => {
    if (sourcePanel === targetPanel) return;
    const targetItems = layoutState.panels[targetPanel];
    moveBetweenPanels(id, sourcePanel, targetPanel, targetItems.length);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeItem = widgetItems.find(i => i.id === active.id);
      const overItem = widgetItems.find(i => i.id === over.id);
      
      if (activeItem && overItem) {
          if (activeItem.panel === overItem.panel) {
              reorderWithinPanel(activeItem.panel, activeItem.id, overItem.id);
          } else {
              const overIndex = layoutState.panels[overItem.panel].findIndex(i => i.id === overItem.id);
              moveBetweenPanels(activeItem.id, activeItem.panel, overItem.panel, overIndex);
          }
      }
    }
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
                  alert("Success! Check your active webpage - the prayer reminder overlay should be visible.");
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
              Active widgets: {widgetItems.filter((w) => w.visible).length}
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
              items={widgetItems.map((w) => w.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {widgetItems.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    label={item.widgetId ? t(WIDGET_TRANSLATION_KEYS[item.widgetId]) : item.id}
                    onToggle={handleToggleVisibility}
                    onPanelChange={handlePanelChange}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Reset layout */}
        <button
          onClick={resetLayout}
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
  item: PanelItem;
  label: string;
  onToggle: (id: string, panel: PanelId) => void;
  onPanelChange: (id: string, sourcePanel: PanelId, targetPanel: PanelId) => void;
}

function SortableItem({ item, label, onToggle, onPanelChange }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

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
        "flex items-center justify-between p-3 rounded-xl border bg-white dark:bg-stone-900 transition-all duration-200 select-none",
        isDragging
          ? "border-emerald-600 shadow-md scale-[1.02]"
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

      <div className="flex items-center gap-2">
        <select
          value={item.panel}
          onChange={(e) => onPanelChange(item.id, item.panel, e.target.value as any)}
          className="text-[10px] bg-stone-50 dark:bg-stone-800 border-none rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500/30 text-stone-500 dark:text-stone-400 font-bold uppercase"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="bottom">Bottom</option>
        </select>

        <button
          onClick={() => onToggle(item.id, item.panel)}
          className={cn(
            "p-1.5 rounded-lg border transition-all duration-200",
            item.visible
              ? "border-emerald-200/60 bg-emerald-50/20 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-950/40 dark:bg-emerald-950/20 dark:text-emerald-400"
              : "border-stone-200 bg-white text-stone-400 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
          )}
        >
          {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
