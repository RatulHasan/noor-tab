import { useMemo } from "react";
import {
  getHijriDateParts,
  getHijriDateString,
  getHijriArabicDateString,
} from "../utils/hijriConverter";

export function useHijriDate(date: Date = new Date()) {
  // Use the date string as a stable key to invalidate the memo cache when the date changes
  const dateKey = date.toDateString();

  return useMemo(() => {
    const parts = getHijriDateParts(date);
    const englishString = getHijriDateString(date);
    const arabicString = getHijriArabicDateString(date);

    return {
      ...parts,
      englishString,
      arabicString,
    };
  }, [dateKey]);
}
