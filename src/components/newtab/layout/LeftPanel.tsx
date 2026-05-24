import React from "react";
import { MapPin, Bell, BellOff, Loader2 } from "lucide-react";
import type { WidgetId, WidgetConfig, PrayerName, PrayerUIStatus } from "~types";
import { useSettings } from "~hooks/useSettings";
import { usePrayerTimes } from "~hooks/usePrayerTimes";
import { useCountdown } from "~hooks/useCountdown";
import { getHijriDateString } from "~utils/hijriConverter";
import { cn } from "~utils/cn";

// Import all widgets
import PrayerStreakWidget from "../PrayerStreakWidget";
import FastingTracker from "../../shared/FastingTracker";
import AdhkarPlayer from "../../shared/AdhkarPlayer";

interface LeftPanelProps {
  widgets: WidgetConfig[];
  renderWidget: (id: WidgetId) => React.ReactNode;
}

export default function LeftPanel({ widgets, renderWidget }: LeftPanelProps) {
  const [settings, updateSettings] = useSettings();
  const { prayers, prayerStatuses, nextPrayer, isLoading } = usePrayerTimes();
  const countdown = useCountdown(nextPrayer?.time || null);

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

  // Calculate progress percentage
  const progress = React.useMemo(() => {
    if (!nextPrayer || !prayerStatuses) return 0;
    
    // Find previous prayer
    const nextIdx = prayerStatuses.findIndex(p => p.name === nextPrayer.name);
    const prevIdx = nextIdx === 0 ? prayerStatuses.length - 1 : nextIdx - 1;
    const prevPrayer = prayerStatuses[prevIdx];
    
    const start = prevPrayer.time.getTime();
    const end = nextPrayer.time.getTime();
    const now = Date.now();
    
    // Handle wrap around for Isha -> Fajr
    let duration = end - start;
    let elapsed = now - start;
    
    if (duration < 0) {
        // end is next day
        duration += 24 * 60 * 60 * 1000;
    }
    if (elapsed < 0) {
        elapsed += 24 * 60 * 60 * 1000;
    }

    return Math.min(100, Math.max(0, (elapsed / duration) * 100));
  }, [nextPrayer, prayerStatuses]);

  return (
    <aside className="w-[280px] flex flex-col gap-4 overflow-y-auto no-scrollbar h-full">
      {/* Prayer Times Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col shrink-0">
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20">
          <div className="flex items-center justify-between mb-3">
             <h3 className="font-black text-stone-800 dark:text-stone-100 uppercase tracking-widest text-xs">Prayer Times</h3>
             <Bell className="w-4 h-4 text-emerald-600" />
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
                   <button 
                    onClick={() => handleToggleReminder(prayer.name)}
                    className={cn(
                      "p-1 rounded-lg transition-colors",
                      prayer.reminderEnabled ? "text-emerald-600 opacity-100" : "text-stone-300 opacity-0 group-hover:opacity-100"
                    )}
                   >
                     {prayer.reminderEnabled ? <Bell className="w-3 h-3 fill-current" /> : <BellOff className="w-3 h-3" />}
                   </button>
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

      {/* Additional Widgets */}
      {widgets.map(w => (
        <React.Fragment key={w.id}>
          {renderWidget(w.id)}
        </React.Fragment>
      ))}
    </aside>
  );
}
