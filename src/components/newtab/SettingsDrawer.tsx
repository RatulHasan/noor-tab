import React from "react";
import { X } from "lucide-react";
import { useSettings } from "~hooks/useSettings";
import SettingsPanel from "~components/popup/SettingsPanel";
import BackupManager from "~components/popup/BackupManager";
import BuyMeCoffee from "~components/shared/BuyMeCoffee";
import type { UserSettings } from "~types";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const [settings, updateSettings] = useSettings();

  const handleSaveSettings = async (newSettings: Partial<UserSettings>) => {
    await updateSettings(newSettings);

    // Broadcast setting change to background worker to update alarms
    try {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
        chrome.runtime.sendMessage({ type: "SETTINGS_CHANGED" });
      }
    } catch (e) {
      console.warn("Failed to broadcast settings change:", e);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col font-sans select-none animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 flex-shrink-0">
          <h2 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <SettingsPanel settings={settings} onSave={handleSaveSettings} />
          <BackupManager />
          <BuyMeCoffee variant="badge" className="w-full text-center flex justify-center py-2" />
        </div>
      </div>
    </>
  );
}
