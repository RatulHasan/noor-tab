import React, { useMemo } from "react";
import { ISLAMIC_EVENTS } from "../../data/islamicEvents";
import { getHijriDateParts } from "../../utils/hijriConverter";
import { useSettings } from "../../hooks/useSettings";
import { getTranslation } from "../../data/translations";
import { Calendar } from "lucide-react";
import { getCoordinatesLocalDate } from "../../utils/locationService";

export default function IslamicEventCard() {
  const [settings] = useSettings();
  const lang = settings?.language || "en";

  const upcomingEventInfo = useMemo(() => {
    const today = getCoordinatesLocalDate(settings.coordinates);
    today.setHours(0, 0, 0, 0);

    const eventDates = ISLAMIC_EVENTS.map((event) => {
      const checkDate = new Date(today);
      let matchedDate: Date | null = null;

      for (let d = 0; d <= 366; d++) {
        const hParts = getHijriDateParts(checkDate);
        if (hParts.month === event.hijriDate.month && hParts.day === event.hijriDate.day) {
          matchedDate = new Date(checkDate);
          break;
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }

      const target = matchedDate || new Date();
      const diffMs = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return {
        event,
        gregorianDate: target,
        daysRemaining: diffDays,
      };
    });

    const validEvents = eventDates
      .filter((e) => e.daysRemaining >= 0)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    return validEvents[0] || null;
  }, []);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  if (!upcomingEventInfo) return null;

  const { event, gregorianDate, daysRemaining } = upcomingEventInfo;

  const localeMap = {
    en: "en-US",
    bn: "bn-BD",
    ar: "ar-EG",
    hi: "hi-IN",
    ur: "ur-PK"
  };
  const currentLocale = localeMap[lang] || "en-US";

  const formattedExpectedDate = gregorianDate.toLocaleDateString(currentLocale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getDaysRemainingText = () => {
    if (daysRemaining === 0) {
      return t("today");
    }
    
    if (lang === "ar") {
      const arabicDigits = daysRemaining.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d, 10)]);
      return `متبقي ${arabicDigits} ${daysRemaining === 1 ? "يوم" : daysRemaining === 2 ? "يومان" : "أيام"}`;
    }
    if (lang === "bn") {
      const bengaliDigits = daysRemaining.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d, 10)]);
      return `${bengaliDigits} ${t("daysLeft")}`;
    }
    if (lang === "hi") {
      const hindiDigits = daysRemaining.toString().replace(/\d/g, (d) => "०१२३४५६७८९"[parseInt(d, 10)]);
      return `${hindiDigits} ${t("daysLeft")}`;
    }
    if (lang === "ur") {
      const urduDigits = daysRemaining.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵٦۷۸۹"[parseInt(d, 10)]);
      return `${urduDigits} ${t("daysLeft")}`;
    }

    return `${daysRemaining} ${t("daysLeft")}`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200/60 bg-white p-4 shadow-sm dark:border-stone-850 dark:bg-stone-900/40">
      <div className="flex w-full justify-between items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2.5">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {t("islamicEvents")}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">🗓️</span>
        <div className="flex-1 space-y-1">
          <h3 className="text-xs font-extrabold text-stone-800 dark:text-stone-100 flex items-center justify-between">
            <span>{event.name}</span>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
              {getDaysRemainingText()}
            </span>
          </h3>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-normal">
            {event.description}
          </p>
          <div className="flex justify-between items-center pt-2 text-[10px] text-stone-400 dark:text-stone-500 font-semibold border-t border-stone-100 dark:border-stone-800/40 mt-2">
            <span>Approx. {event.hijriDate.day}/{event.hijriDate.month} Hijri</span>
            <span className="text-stone-600 dark:text-stone-300 font-bold">{formattedExpectedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
