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
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
  theme: "system",
  language: "en",
  searchEngine: "google",
  adhanAudio: "none",
  overlayPosition: "bottom",
  // Phase 2 Settings
  enableAutoRamadan: true,
  trackSunnahFasts: true,
  showFastingCountdown: true,
  remindMorningAdhkar: true,
  remindEveningAdhkar: true,
  worldCities: ["Makkah", "Madinah", "Istanbul"],
};
