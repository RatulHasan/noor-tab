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
  arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { WidgetConfig, WidgetId } from "../../types";
import { GripVertical, Eye, EyeOff, X, RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "../../utils/cn";

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

export const WIDGET_LABELS: Record<WidgetId, string> = {
  ayah: "Daily Ayah",
  hadith: "Hadith of the Day",
  dhikr: "Tasbih Counter",
  islamicCalendar: "Islamic Calendar",
  adhkar: "Adhkar Player",
  asmaName: "Asma ul Husna",
  duaLibrary: "Dua Library",
  quiz: "Islamic Quiz",
  fastingTracker: "Fasting Tracker",
  quranBookmark: "Quran Bookmark",
  prayerStreak: "Prayer Streak",
};

interface WidgetCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WidgetCustomizer({ isOpen, onClose }: WidgetCustomizerProps) {
  const [widgets, setWidgets] = useStorage<WidgetConfig[]>("widgetLayout", DEFAULT_WIDGETS);
  const [showWarning, setShowWarning] = useState(false);

  // Setup sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!isOpen) return null;

  const handleToggleVisibility = (id: WidgetId) => {
    const target = widgets.find((w) => w.id === id);
    if (!target) return;

    if (!target.visible) {
      // Trying to enable
      const currentVisibleCount = widgets.filter((w) => w.visible).length;
      if (currentVisibleCount >= 6) {
        setShowWarning(true);
        return;
      }
    }

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
      const updated = reordered.map((w, index) => ({
        ...w,
        order: index,
      }));
      setWidgets(updated);
    }
  };

  const handleReset = () => {
    setShowWarning(false);
    setWidgets(DEFAULT_WIDGETS);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-850 shadow-2xl p-4 flex flex-col space-y-4 font-sans select-none animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Customize Dashboard
            </h3>
            <span className="text-[9px] text-stone-400 font-bold block mt-0.5">
              Active widgets: {widgets.filter((w) => w.visible).length} / 6
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Inline Warning Badge */}
        {showWarning && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 dark:border-amber-900/40 dark:bg-amber-950/20 text-[10px] text-amber-700 dark:text-amber-400 font-semibold leading-relaxed animate-in fade-in zoom-in-95 duration-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>
              Maximum 6 widgets visible at once. Hide another to enable this one.
            </span>
          </div>
        )}

        {/* Drag and Drop list container */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
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
                    onToggle={handleToggleVisibility}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Reset layout action */}
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 py-2 border border-stone-200/60 dark:border-stone-800 rounded-xl text-xs font-bold text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-850 transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Layout to Defaults</span>
        </button>

      </div>
    </>
  );
}

interface SortableItemProps {
  widget: WidgetConfig;
  onToggle: (id: WidgetId) => void;
}

function SortableItem({ widget, onToggle }: SortableItemProps) {
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
          : "border-stone-150 dark:border-stone-800/60"
      )}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-250"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-stone-850 dark:text-stone-105">
          {WIDGET_LABELS[widget.id]}
        </span>
      </div>

      <button
        onClick={() => onToggle(widget.id)}
        className={cn(
          "p-1.5 rounded-lg border transition-all duration-200",
          widget.visible
            ? "border-emerald-200/60 bg-emerald-50/20 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-950/40 dark:bg-emerald-950/20 dark:text-emerald-400"
            : "border-stone-200 bg-white text-stone-400 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-850"
        )}
      >
        {widget.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
