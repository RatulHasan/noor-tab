import React from 'react';
import { Sparkles, Check, RotateCcw, Eye } from 'lucide-react';
import { cn } from '~utils/cn';

interface CustomizeFABProps {
  isDragMode: boolean;
  onToggle: () => void;
  onReset: () => void;
  onShowWidgets: () => void;
}

export function CustomizeFAB({
  isDragMode,
  onToggle,
  onReset,
  onShowWidgets
}: CustomizeFABProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {/* Edit Bar - Slides up when in Drag Mode */}
      <div className={cn(
        "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl rounded-2xl p-2 flex items-center gap-2 transition-all duration-500 transform",
        isDragMode ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}>
        <div className="px-4 py-2 border-r border-stone-100 dark:border-stone-800 mr-2 hidden md:block">
          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={14} className="animate-pulse" />
            Edit Mode
          </span>
        </div>

        <button
          onClick={onShowWidgets}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-colors"
        >
          <Eye size={16} />
          Show/Hide
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-600 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Check size={16} />
          Done
        </button>
      </div>

      {/* Main Customize Toggle Button */}
      {!isDragMode && (
        <button
          onClick={onToggle}
          className="group flex items-center gap-2 px-5 py-3 rounded-full text-sm font-black bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300"
        >
          <Sparkles size={18} className="text-emerald-600 group-hover:rotate-12 transition-transform" />
          Drag to Customize
        </button>
      )}
    </div>
  );
}
