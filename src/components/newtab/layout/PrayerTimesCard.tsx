import React, { useState } from "react";
import { MapPin, Bell, BellOff, Loader2, Pencil, Check, Plus, Minus } from "lucide-react";
import type { PrayerName } from "~types";
import { useSettings } from "~hooks/useSettings";
import { usePrayerTimes } from "~hooks/usePrayerTimes";
import { useCountdown } from "~hooks/useCountdown";
import { getHijriDateString } from "~utils/hijriConverter";
import { getTranslation } from "~data/translations";
import { cn } from "~utils/cn";

export function PrayerTimesCard() {
  const [settings, updateSettings] = useSettings();
  const { prayerStatuses, nextPrayer, isLoading, isMocked } = usePrayerTimes();
  const countdown = useCountdown(nextPrayer?.time || null);
  const [isEditing, setIsEditing] = useState(false);
  const t = (key: any) => getTranslation(settings.language, key);

  const hijriDate = getHijriDateString(new Date());
  const gregorianDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleToggleReminder = async (name: PrayerName) => {
    const current = settings.perPrayerReminder[name];
    await updateSettings({
      perPrayerReminder: {
        ...settings.perPrayerReminder,
        [name]: !current
      }
    });
  };

  const handleOffsetChange = async (name: PrayerName, delta: number) => {
    const current = settings.prayerOffsets?.[name] || 0;
    await updateSettings({
      prayerOffsets: {
        ...settings.prayerOffsets,
        [name]: current + delta
      }
    });
  };

  const progress = React.useMemo(() => {
    if (!nextPrayer || !prayerStatuses) return 0;
    
    const nextIdx = prayerStatuses.findIndex(p => p.name === nextPrayer.name);
    const prevIdx = nextIdx === 0 ? prayerStatuses.length - 1 : nextIdx - 1;
    const prevPrayer = prayerStatuses[prevIdx];
    
    const start = prevPrayer.time.getTime();
    const end = nextPrayer.time.getTime();
    const now = Date.now();
    
    let duration = end - start;
    let elapsed = now - start;
    
    if (duration < 0) duration += 24 * 60 * 60 * 1000;
    if (elapsed < 0) elapsed += 24 * 60 * 60 * 1000;

    return Math.min(100, Math.max(0, (elapsed / duration) * 100));
  }, [nextPrayer, prayerStatuses]);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col shrink-0">
      <div className="p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20">
        <div className="flex items-center justify-between mb-3">
           <h3 className="font-black text-stone-800 dark:text-stone-100 uppercase tracking-widest text-xs">
             {isMocked ? t("globalPrayerTimes") : t("prayerTimes")}
           </h3>
           <div className="flex items-center gap-2">
             <button 
               onClick={() => setIsEditing(!isEditing)}
               className={cn(
                 "p-1.5 rounded-lg transition-all active:scale-95",
                 isEditing ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
               )}
               title={isEditing ? "Done" : "Edit Prayer Times"}
             >
               {isEditing ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
             </button>
             <Bell className="w-4 h-4 text-emerald-600" />
           </div>
        </div>
        <button 
          onClick={() => chrome.runtime.sendMessage({ type: "OPEN_POPUP_SETTINGS" })}
          className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:opacity-80 transition-opacity mb-2"
        >
          <MapPin className="w-3 h-3" />
          {settings.cityName || "Detecting..."}
        </button>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-stone-700 dark:text-stone-300">{hijriDate}</p>
          <p className="text-[10px] text-stone-400 font-medium">{gregorianDate}</p>
        </div>
      </div>

      <div className="p-2 space-y-0.5">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
          </div>
        ) : prayerStatuses?.map((prayer) => {
          const isNext = prayer.state === "next";
          const isPassed = prayer.state === "passed";
          
          return (
            <div 
              key={prayer.name}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all",
                isNext ? "bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-600" : "hover:bg-stone-50 dark:hover:bg-stone-800/50"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-xs font-bold capitalize",
                  isNext ? "text-emerald-800 dark:text-emerald-300" : isPassed ? "text-stone-400" : "text-stone-600 dark:text-stone-400"
                )}>
                  {prayer.name}
                </span>
                {isNext && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />}
              </div>
              <div className="flex items-center gap-3">
                 <span className={cn(
                   "text-xs font-mono font-bold",
                   isNext ? "text-emerald-700 dark:text-emerald-400" : isPassed ? "text-stone-400" : "text-stone-500"
                 )}>
                   {prayer.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
                 {isEditing ? (
                   <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5 border border-stone-200 dark:border-stone-700">
                      <button 
                        onClick={() => handleOffsetChange(prayer.name, -1)}
                        className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded-md text-stone-500 transition-colors"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 min-w-[28px] text-center">
                        {(settings.prayerOffsets?.[prayer.name] || 0) > 0 ? `+${settings.prayerOffsets?.[prayer.name]}` : settings.prayerOffsets?.[prayer.name] || 0}
                      </span>
                      <button 
                        onClick={() => handleOffsetChange(prayer.name, 1)}
                        className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded-md text-stone-500 transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                   </div>
                 ) : (
                   <button 
                    onClick={() => handleToggleReminder(prayer.name)}
                    className={cn(
                      "p-1 rounded-lg transition-colors",
                      prayer.reminderEnabled ? "text-emerald-600 opacity-100" : "text-stone-300 opacity-40 hover:opacity-100"
                    )}
                   >
                     {prayer.reminderEnabled ? <Bell className="w-3 h-3 fill-current" /> : <BellOff className="w-3 h-3" />}
                   </button>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {nextPrayer && (
        <div className="p-5 mt-auto border-t border-stone-100 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-950/10">
          <div className="flex justify-between items-end mb-2">
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Next: <span className="text-emerald-700 dark:text-emerald-400">{nextPrayer.name}</span></span>
             <span className="text-sm font-mono font-black text-emerald-700 dark:text-emerald-400">{countdown?.formatted}</span>
          </div>
          <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
             <div 
              className="h-full bg-emerald-600 transition-all duration-1000"
              style={{ width: `${progress}%` }}
             />
          </div>
          <p className="text-right text-[9px] font-bold text-stone-400 mt-1">{Math.round(progress)}% elapsed</p>
        </div>
      )}
    </div>
  );
}
