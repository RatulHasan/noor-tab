export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export type NotificationStyle = "newtab" | "overlay" | "both";

export type CalculationMethodKey =
  | "muslimWorldLeague"
  | "egyptian"
  | "karachi"
  | "ummAlQura"
  | "dubai"
  | "qatar"
  | "kuwait"
  | "singapore"
  | "turkey"
  | "tehran"
  | "northAmerica";

export type MadhabKey = "standard" | "hanafi";

export interface UserSettings {
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  cityName: string | null;
  madhab: MadhabKey;
  method: CalculationMethodKey;
  notificationStyle: NotificationStyle;
  reminderMinutes: number; // general offset (e.g. 15 minutes before)
  perPrayerReminder: Record<PrayerName, boolean>;
  theme: "light" | "dark" | "system";
}

export type DailyPrayers = Record<PrayerName, Date>;

export interface PrayerStatus {
  name: PrayerName;
  arabicName: string;
  transliteration: string;
  time: Date;
  state: "passed" | "next" | "upcoming";
  reminderEnabled: boolean;
}

export interface Ayah {
  text: string;
  translation: string;
  transliteration: string;
  reference: string; // e.g. "Surah Al-Baqarah 2:186"
}

export interface Hadith {
  text: string;
  translation: string;
  reference: string; // e.g. "Sahih al-Bukhari 547"
}

export interface IslamicEvent {
  name: string;
  hijriDate: {
    month: number; // 1-indexed (1 = Muharram, etc.)
    day: number;
  };
  description: string;
}

export interface DhikrPhase {
  count: number;
  max: number;
  arabic: string;
  english: string;
  transliteration: string;
}
