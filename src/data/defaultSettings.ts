import type { UserSettings } from "../types";

export const DEFAULT_SETTINGS: UserSettings = {
  coordinates: null,
  cityName: null,
  madhab: "standard",
  method: "muslimWorldLeague",
  notificationStyle: "both",
  reminderMinutes: 15,
  perPrayerReminder: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
  theme: "system",
  language: "en",
};
