import React, { useMemo } from "react";
import { ISLAMIC_EVENTS } from "~data/islamicEvents";
import { getHijriDateParts } from "~utils/hijriConverter";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";
import IslamicPattern from "../shared/IslamicPattern";
import { Calendar } from "lucide-react";
import { cn } from "~utils/cn";
import { getCoordinatesLocalDate } from "~utils/locationService";

/**
 * @param {Object} props
 * @param {string} [props.className] - Optional custom CSS class name.
 */
interface IslamicCalendarProps {
  className?: string;
}

export default function IslamicCalendar({ className = "" }: IslamicCalendarProps) {
  const [settings] = useSettings();
  const lang = settings?.language || "en";

  const upcomingEventInfo = useMemo(() => {
    const today = getCoordinatesLocalDate(settings.coordinates);
    today.setHours(0, 0, 0, 0);

    const eventDates = ISLAMIC_EVENTS.map((event) => {
      // Find the next Gregorian occurrence of this Hijri date
      // Scan forward from today up to 365 days
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

    // Filter out events in the past (daysRemaining < 0) and sort by proximity
    const validEvents = eventDates
      .filter((e) => e.daysRemaining >= 0)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    return validEvents[0] || null;
  }, []);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  if (!upcomingEventInfo) return null;

  const { event, gregorianDate, daysRemaining } = upcomingEventInfo;

  // Localized date formatting
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
    
    // Format numbers based on language context if needed, otherwise string interpolation
    if (lang === "ar") {
      // Arabic dual/plural forms or simple digits
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
      const urduDigits = daysRemaining.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)]);
      return `${urduDigits} ${t("daysLeft")}`;
    }

    return `${daysRemaining} ${t("daysLeft")}`;
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-stone-200/60 bg-white p-5 shadow-sm dark:border-stone-800/60 dark:bg-stone-900/40 flex flex-col justify-between min-h-[220px]",
        className
      )}
    >
      {/* Pattern background decoration */}
      <IslamicPattern opacity={0.03} />

      <div className="relative z-10 flex w-full justify-between items-center text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
        <span>{t("islamicEvents")}</span>
        <Calendar className="h-3.5 w-3.5" />
      </div>

      <div className="relative z-10 my-auto py-2 space-y-2">
        <div className="flex items-center gap-1.5 justify-center">
          <span className="text-3xl">🗓️</span>
          <div className="text-left">
            <h3 className="text-sm font-extrabold text-stone-800 dark:text-stone-100">
              {event.name}
            </h3>
            <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mt-0.5">
              Approx. {event.hijriDate.day}/{event.hijriDate.month} Hijri
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs mx-auto">
          {event.description}
        </p>
      </div>

      <div className="relative z-10 w-full pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
        <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase tracking-wider">
          {t("expectedDate")}
        </span>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
            {formattedExpectedDate}
          </span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse mt-0.5">
            {getDaysRemainingText()}
          </span>
        </div>
      </div>
    </div>
  );
}
