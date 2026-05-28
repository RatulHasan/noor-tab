import React, { useState, useEffect } from "react";
import JumuahBanner from "../JumuahBanner";
import { Info, X, Bell, Play, Pause } from "lucide-react";
import { cn } from "~utils/cn";
import { getTranslation } from "~data/translations";
import { useSettings } from "~hooks/useSettings";
import { useStorage } from "@plasmohq/storage/hook";
import { Storage } from "@plasmohq/storage";

interface BannerZoneProps {
  reminder?: string | null;
  isJumuah: boolean;
  isRamadan: boolean;
}

const globalStorage = new Storage();

export default function BannerZone({ reminder, isJumuah, isRamadan }: BannerZoneProps) {
  const [showReminder, setShowReminder] = useState(!!reminder);
  const [settings] = useSettings();

  // Track adhan playing state from storage
  const [adhanIsPlaying, setAdhanIsPlaying] = useStorage<boolean>("adhanIsPlaying", false);

  const lang = settings?.language || 'en';
  const t = (key: any) => getTranslation(lang, key);

  // Handle play/pause toggle - sends message to stop adhan globally
  const handleToggleAudio = () => {
    if (adhanIsPlaying) {
      // Pause: Send stop message to all views
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ type: "STOP_ALL_ADHAN" }).catch(() => {});
      }
      setAdhanIsPlaying(false);
      globalStorage.set("adhanIsPlaying", false).catch(() => {});
    } else {
      // Play: Update storage state - the audio component should handle playing
      setAdhanIsPlaying(true);
      globalStorage.set("adhanIsPlaying", true).catch(() => {});
    }
  };

  // Close banner and stop audio
  const handleCloseReminder = () => {
    setShowReminder(false);
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: "STOP_ALL_ADHAN" }).catch(() => {});
    }
    setAdhanIsPlaying(false);
    globalStorage.set("adhanIsPlaying", false).catch(() => {});
  };

  return (
    <div className="w-full space-y-4 px-6 pt-6">
      {/* Reminder Banner */}
      {showReminder && reminder && (
        <div className="bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-900/20 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Bell className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold">
              {t("timeForPrayer")} <span className="capitalize">{reminder}</span> {t("prayer")}.
              <span className="ml-2 opacity-80 font-medium">{t("mayAllahAccept")}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Show play/pause button if adhan audio is configured and playing */}
            {settings.adhanAudio !== "none" && adhanIsPlaying && (
              <button
                onClick={handleToggleAudio}
                className="p-1.5 hover:bg-emerald-600 rounded-lg transition-colors animate-pulse"
                title={t("stop")}
              >
                <Pause className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleCloseReminder}
              className="p-1 hover:bg-emerald-600 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Ramadan Banner */}
      {isRamadan && (
        <div className="bg-stone-900 text-amber-200 px-6 py-4 rounded-2xl flex items-center justify-between border border-amber-900/30 relative overflow-hidden">
           <div className="absolute inset-0 bg-islamic-pattern opacity-5 pointer-events-none" />
           <div className="flex items-center gap-4 relative z-10">
              <span className="text-2xl">🌙</span>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest">{t("ramadanKareem")}</h4>
                <p className="text-xs text-amber-200/60 font-medium">{t("ramadanSub")}</p>
              </div>
           </div>
        </div>
      )}

      {/* Jumuah Banner */}
      {isJumuah && <JumuahBanner />}
    </div>
  );
}
