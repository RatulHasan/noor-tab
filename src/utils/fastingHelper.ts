import type { FastingRecord, FastType } from "../types";
import { getHijriDateParts, type HijriDateParts } from "./hijriConverter";
import { format, subDays, isMonday, isThursday, parseISO } from "./dateUtils";

/**
 * Checks if the current date is in the month of Ramadan.
 */
export function isTodayRamadan(date: Date = new Date()): boolean {
  const parts = getHijriDateParts(date);
  return parts.month === 9; // Ramadan is 9th month
}

/**
 * Checks if today is Monday.
 */
export function isTodayMonday(date: Date = new Date()): boolean {
  return isMonday(date);
}

/**
 * Checks if today is Thursday.
 */
export function isTodayThursday(date: Date = new Date()): boolean {
  return isThursday(date);
}

/**
 * Checks if a Hijri day is part of Ayyam al-Bidh (13th, 14th, 15th of Hijri month).
 */
export function isAyyamulBidh(day: number): boolean {
  return day === 13 || day === 14 || day === 15;
}

/**
 * Calculates Suhoor end time (Imzak) by subtracting an offset from Fajr.
 * Default offset is 10 minutes.
 */
export function getSuhoorTime(fajrTime: Date, offsetMinutes: number = 10): Date {
  const suhoor = new Date(fajrTime);
  suhoor.setMinutes(suhoor.getMinutes() - offsetMinutes);
  return suhoor;
}

/**
 * Calculates Iftar time, which corresponds exactly to Maghrib time.
 */
export function getIftarTime(maghribTime: Date): Date {
  return new Date(maghribTime);
}

/**
 * Calculates the current consecutive fasting streak by walking backwards from today/yesterday.
 */
export function calculateFastingStreak(records: Record<string, FastingRecord>): number {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");

  let checkDate = new Date();
  let streak = 0;

  const todayRecord = records[todayStr];
  const yesterdayRecord = records[yesterdayStr];

  const isTodayFast = todayRecord && todayRecord.completed;
  const isYesterdayFast = yesterdayRecord && yesterdayRecord.completed;

  if (!isTodayFast && !isYesterdayFast) {
    return 0;
  }

  if (!isTodayFast && isYesterdayFast) {
    checkDate = subDays(new Date(), 1);
  }

  while (true) {
    const dateStr = format(checkDate, "yyyy-MM-dd");
    const record = records[dateStr];

    if (record && record.completed) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return streak;
}
