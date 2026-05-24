import React, { useState, useEffect } from "react";
import { gregorianToHijri, hijriToGregorian, getHijriDateParts } from "~utils/hijriConverter";
import { format } from "~utils/dateUtils";
import { Calendar, ArrowRightLeft, RefreshCw } from "lucide-react";
import { cn } from "~utils/cn";

export default function HijriConverter() {
  const [isGregToHijri, setIsGregToHijri] = useState(true);
  
  // Gregorian state
  const [gregDate, setGregDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [hijriResult, setHijriResult] = useState("");

  // Hijri state
  const todayHijri = getHijriDateParts(new Date());
  const [hijriYear, setHijriYear] = useState(todayHijri.year);
  const [hijriMonth, setHijriMonth] = useState(todayHijri.month);
  const [hijriDay, setHijriDay] = useState(todayHijri.day);
  const [gregResult, setGregResult] = useState("");

  const [error, setError] = useState<string | null>(null);

  // Perform Gregorian to Hijri conversion
  useEffect(() => {
    if (isGregToHijri) {
      try {
        setError(null);
        if (!gregDate) return;
        const date = new Date(gregDate);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid Gregorian date");
        }
        const hijri = gregorianToHijri(date);
        setHijriResult(`${hijri.day} ${hijri.monthName} ${hijri.year} AH`);
      } catch (err) {
        setError("Invalid date input");
        setHijriResult("");
      }
    }
  }, [gregDate, isGregToHijri]);

  // Perform Hijri to Gregorian conversion
  useEffect(() => {
    if (!isGregToHijri) {
      try {
        setError(null);
        if (!hijriYear || !hijriMonth || !hijriDay) return;
        
        // Basic validation
        if (hijriMonth < 1 || hijriMonth > 12) throw new Error("Month must be 1-12");
        if (hijriDay < 1 || hijriDay > 30) throw new Error("Day must be 1-30");
        if (hijriYear < 1) throw new Error("Year must be greater than 0");

        const date = hijriToGregorian(hijriYear, hijriMonth, hijriDay);
        if (isNaN(date.getTime())) {
          throw new Error("Could not calculate Gregorian date");
        }
        setGregResult(format(date, "EEEE, MMMM dd, yyyy"));
      } catch (err: any) {
        setError(err.message || "Invalid Hijri date values");
        setGregResult("");
      }
    }
  }, [hijriYear, hijriMonth, hijriDay, isGregToHijri]);

  const toggleDirection = () => {
    setIsGregToHijri(!isGregToHijri);
    setError(null);
  };

  const HIJRI_MONTH_NAMES = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah"
  ];

  return (
    <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 flex flex-col space-y-4 font-sans select-none">
      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Date Converter
        </p>
        <button
          onClick={toggleDirection}
          className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-600 transition-colors uppercase tracking-widest"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>{isGregToHijri ? "Gregorian ➔ Hijri" : "Hijri ➔ Gregorian"}</span>
        </button>
      </div>

      {isGregToHijri ? (
        /* Gregorian to Hijri Form */
        <div className="space-y-3">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">
              Gregorian Date
            </label>
            <input
              type="date"
              value={gregDate}
              onChange={(e) => setGregDate(e.target.value)}
              className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 px-3 py-2.5 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="rounded-xl bg-emerald-50/20 border border-emerald-200/40 dark:bg-emerald-950/10 dark:border-emerald-900/30 p-3.5 text-center space-y-1">
            <span className="text-[9px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest block">
              Hijri Equivalent Date
            </span>
            {error ? (
              <span className="text-xs text-rose-500 font-bold block">{error}</span>
            ) : (
              <span className="text-base font-black text-emerald-700 dark:text-emerald-400 block">
                {hijriResult || "---"}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Hijri to Gregorian Form */
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {/* Day */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">
                Day
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={hijriDay}
                onChange={(e) => setHijriDay(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 px-3 py-2 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Month */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">
                Month
              </label>
              <select
                value={hijriMonth}
                onChange={(e) => setHijriMonth(parseInt(e.target.value))}
                className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 px-2 py-2 outline-none focus:border-emerald-500 transition-colors"
              >
                {HIJRI_MONTH_NAMES.map((name, idx) => (
                  <option key={idx} value={idx + 1}>
                    {idx + 1}. {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">
                Year (AH)
              </label>
              <input
                type="number"
                min={1}
                value={hijriYear}
                onChange={(e) => setHijriYear(Math.max(1, parseInt(e.target.value) || 1445))}
                className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 px-3 py-2 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50/20 border border-emerald-200/40 dark:bg-emerald-950/10 dark:border-emerald-900/30 p-3.5 text-center space-y-1">
            <span className="text-[9px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest block">
              Gregorian Equivalent Date
            </span>
            {error ? (
              <span className="text-xs text-rose-500 font-bold block">{error}</span>
            ) : (
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 block">
                {gregResult || "---"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
