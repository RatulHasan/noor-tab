import type { DayPrayerRecord, PrayerStatus } from "../types";
import { subDays, format, parseISO, startOfDay, differenceInDays } from "./dateUtils";

/**
 * Calculates the score for a single day.
 * Score: Count of prayers marked 'on_time' or 'late'.
 */
export function getDayScore(record: DayPrayerRecord | undefined): { score: number; label: "Perfect" | "Good" | "Partial" | "Missed" | "Unmarked" } {
  if (!record) {
    return { score: 0, label: "Unmarked" };
  }

  const prayers: (keyof Omit<DayPrayerRecord, "date">)[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  let score = 0;
  let markedCount = 0;
  let missedCount = 0;

  prayers.forEach((p) => {
    const status = record[p];
    if (status !== null) {
      markedCount++;
      if (status === "on_time" || status === "late") {
        score++;
      } else if (status === "missed") {
        missedCount++;
      }
    }
  });

  if (markedCount === 0) {
    return { score: 0, label: "Unmarked" };
  }

  if (score === 5) return { score, label: "Perfect" };
  if (score >= 3) return { score, label: "Good" };
  if (score >= 1) return { score, label: "Partial" };
  return { score, label: "Missed" };
}

/**
 * Walks backwards from today/yesterday, counting consecutive days where
 * at least 4 of 5 prayers are 'on_time' or 'late'.
 */
export function calculateCurrentStreak(records: Record<string, DayPrayerRecord>): number {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");

  let checkDate = new Date();
  let streak = 0;

  // If today is empty/not started or doesn't meet streak criteria, we can check yesterday as start
  const todayRecord = records[todayStr];
  const todayScore = getDayScore(todayRecord);
  
  // If today has started but hasn't reached 4 prayers yet AND yesterday was perfect/good,
  // we check if yesterday is a valid streak to preserve it during the day.
  const isTodayValid = todayScore.score >= 4;
  const yesterdayRecord = records[yesterdayStr];
  const yesterdayScore = getDayScore(yesterdayRecord);
  const isYesterdayValid = yesterdayScore.score >= 4;

  if (!isTodayValid && !isYesterdayValid) {
    return 0;
  }

  // If today isn't valid but yesterday is, start scanning from yesterday
  if (!isTodayValid && isYesterdayValid) {
    checkDate = subDays(new Date(), 1);
  }

  while (true) {
    const dateStr = format(checkDate, "yyyy-MM-dd");
    const record = records[dateStr];
    const { score } = getDayScore(record);

    if (score >= 4) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Full historical scan to find the longest consecutive streak of days
 * where at least 4 prayers are marked as on_time or late.
 */
export function calculateLongestStreak(records: Record<string, DayPrayerRecord>): number {
  const dates = Object.keys(records).sort();
  if (dates.length === 0) return 0;

  let longest = 0;
  let current = 0;
  let lastDate: Date | null = null;

  for (const dateStr of dates) {
    const record = records[dateStr];
    const { score } = getDayScore(record);
    const isValid = score >= 4;

    if (isValid) {
      const currentDate = parseISO(dateStr);
      if (lastDate === null) {
        current = 1;
      } else {
        const diff = differenceInDays(currentDate, lastDate);
        if (diff === 1) {
          current++;
        } else if (diff > 1) {
          // Streak broken by gap
          if (current > longest) longest = current;
          current = 1;
        }
      }
      lastDate = currentDate;
    } else {
      if (current > longest) longest = current;
      current = 0;
      lastDate = null;
    }
  }

  if (current > longest) longest = current;
  return longest;
}

/**
 * Returns prayer metrics (on time, late, missed) grouped by week for the last 4 weeks.
 */
export function getWeeklyStats(records: Record<string, DayPrayerRecord>): { weekLabel: string; onTime: number; late: number; missed: number }[] {
  const stats: { weekLabel: string; onTime: number; late: number; missed: number }[] = [];
  const prayers: (keyof Omit<DayPrayerRecord, "date">)[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

  for (let i = 3; i >= 0; i--) {
    const startOfWeekDate = subDays(new Date(), (i + 1) * 7 - 1);
    const endOfWeekDate = subDays(new Date(), i * 7);
    
    let onTime = 0;
    let late = 0;
    let missed = 0;

    for (let d = 0; d < 7; d++) {
      const checkDate = subDays(endOfWeekDate, d);
      const dateStr = format(checkDate, "yyyy-MM-dd");
      const record = records[dateStr];

      if (record) {
        prayers.forEach((p) => {
          const status = record[p];
          if (status === "on_time") onTime++;
          else if (status === "late") late++;
          else if (status === "missed") missed++;
        });
      }
    }

    const label = i === 0 ? "This Week" : `${i}w Ago`;
    stats.push({
      weekLabel: label,
      onTime,
      late,
      missed,
    });
  }

  return stats;
}

/**
 * Filters records for a specific year and month (1-indexed).
 */
export function getMonthlyRecords(records: Record<string, DayPrayerRecord>, year: number, month: number): DayPrayerRecord[] {
  const targetPrefix = `${year}-${String(month).padStart(2, "0")}`;
  return Object.keys(records)
    .filter((dateStr) => dateStr.startsWith(targetPrefix))
    .sort()
    .map((dateStr) => records[dateStr]);
}
