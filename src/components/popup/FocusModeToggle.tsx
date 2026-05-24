import React, { useState, useEffect, useRef } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { Moon, MoonStar, X, ChevronDown } from "lucide-react";
import type { FocusMode } from "../../types";
import { cn } from "../../utils/cn";

type SnoozeDuration = 60 | 120 | 240;

const SNOOZE_OPTIONS: { label: string; minutes: SnoozeDuration }[] = [
  { label: "Snooze 1 hour", minutes: 60 },
  { label: "Snooze 2 hours", minutes: 120 },
  { label: "Snooze 4 hours", minutes: 240 },
];

function formatRemaining(isoUntil: string): string {
  const diff = new Date(isoUntil).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const totalMin = Math.floor(diff / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

export default function FocusModeToggle() {
  const [focusMode, setFocusMode] = useStorage<FocusMode>("focusMode", {
    enabled: false,
    snoozedUntil: null,
    snoozeDuration: 60,
  });

  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentFocus = focusMode || { enabled: false, snoozedUntil: null, snoozeDuration: 60 };

  const isActive =
    currentFocus.enabled &&
    currentFocus.snoozedUntil !== null &&
    new Date(currentFocus.snoozedUntil) > new Date();

  // Update remaining time every minute
  useEffect(() => {
    if (!isActive || !currentFocus.snoozedUntil) return;
    setRemaining(formatRemaining(currentFocus.snoozedUntil));
    const interval = setInterval(() => {
      if (!currentFocus.snoozedUntil) return;
      setRemaining(formatRemaining(currentFocus.snoozedUntil));
    }, 60000);
    return () => clearInterval(interval);
  }, [isActive, currentFocus.snoozedUntil]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSnooze = async (minutes: SnoozeDuration) => {
    const snoozedUntil = new Date(Date.now() + minutes * 60000).toISOString();
    const newMode: FocusMode = { enabled: true, snoozedUntil, snoozeDuration: minutes };
    await setFocusMode(newMode);
    if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: "TOGGLE_FOCUS_MODE", enabled: true, snoozedUntil });
    }
    setOpen(false);
  };

  const handleDisable = async () => {
    const newMode: FocusMode = { enabled: false, snoozedUntil: null, snoozeDuration: 60 };
    await setFocusMode(newMode);
    if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: "TOGGLE_FOCUS_MODE", enabled: false, snoozedUntil: null });
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        title={isActive ? `Focus Mode active — ${remaining}` : "Enable Focus Mode (snooze reminders)"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex items-center gap-1 p-1.5 rounded-lg border transition-colors duration-200",
          isActive
            ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-400"
            : "border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900/20 dark:text-stone-400"
        )}
      >
        {isActive ? (
          <MoonStar className="h-3.5 w-3.5" />
        ) : (
          <Moon className="h-3.5 w-3.5" />
        )}
        {isActive && (
          <span className="text-[9px] font-bold leading-none hidden sm:inline">
            {remaining}
          </span>
        )}
        {isActive && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-[9999] w-48 rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950 shadow-xl overflow-hidden">
          <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
              Silence Reminders
            </span>
          </div>
          {SNOOZE_OPTIONS.map((opt) => (
            <button
              key={opt.minutes}
              type="button"
              onClick={() => handleSnooze(opt.minutes)}
              className="w-full flex items-center px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
            >
              <Moon className="h-3.5 w-3.5 mr-2 text-stone-400" />
              {opt.label}
            </button>
          ))}
          {isActive && (
            <button
              type="button"
              onClick={handleDisable}
              className="w-full flex items-center px-3 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-t border-stone-100 dark:border-stone-800 transition-colors"
            >
              <X className="h-3.5 w-3.5 mr-2" />
              Disable Focus Mode
            </button>
          )}
        </div>
      )}
    </div>
  );
}
