import type { PrayerName } from "../types";

export interface PrayerMetadata {
  name: PrayerName;
  arabicName: string;
  transliteration: string;
  displayName: string;
  description: string;
}

export const PRAYER_METADATA: Record<PrayerName, PrayerMetadata> = {
  fajr: {
    name: "fajr",
    arabicName: "الفجر",
    transliteration: "Fajr",
    displayName: "Fajr",
    description: "Dawn prayer, performed before sunrise.",
  },
  dhuhr: {
    name: "dhuhr",
    arabicName: "الظهر",
    transliteration: "Dhuhr",
    displayName: "Dhuhr",
    description: "Midday/Noon prayer, performed after the sun passes its zenith.",
  },
  asr: {
    name: "asr",
    arabicName: "العصر",
    transliteration: "Asr",
    displayName: "Asr",
    description: "Afternoon prayer, performed when the shadow of an object is equal to its length.",
  },
  maghrib: {
    name: "maghrib",
    arabicName: "المغرب",
    transliteration: "Maghrib",
    displayName: "Maghrib",
    description: "Sunset prayer, performed immediately after the sun sets.",
  },
  isha: {
    name: "isha",
    arabicName: "العشاء",
    transliteration: "Isha",
    displayName: "Isha",
    description: "Night prayer, performed after twilight has disappeared.",
  },
};
