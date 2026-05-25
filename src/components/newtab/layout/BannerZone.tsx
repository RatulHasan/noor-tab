import React from "react";
import JumuahBanner from "../JumuahBanner";
import { Info, X, Bell } from "lucide-react";
import { cn } from "~utils/cn";
import { getTranslation } from "~data/translations";
import { useSettings } from "~hooks/useSettings";

interface BannerZoneProps {
  reminder?: string | null;
  isJumuah: boolean;
  isRamadan: boolean;
}

export default function BannerZone({ reminder, isJumuah, isRamadan }: BannerZoneProps) {
  const [showReminder, setShowReminder] = React.useState(!!reminder);
  const [settings] = useSettings();
  const lang = settings?.language || 'en';
  const t = (key: any) => getTranslation(lang, key);

  return (
    <div className="w-full space-y-4 px-6 pt-6">
      {/* Reminder Banner */}
      {showReminder && reminder && (
        <div className="bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-900/20 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Bell className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold">
              {t("timeForPrayer")} <span className="capitalize">{reminder}</span> {t("prayer")}. 
              <span className="ml-2 opacity-80 font-medium">{t("mayAllahAccept")}</span>
            </p>
          </div>
          <button onClick={() => setShowReminder(false)} className="p-1 hover:bg-emerald-600 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
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
