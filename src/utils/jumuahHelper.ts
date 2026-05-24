import { isFriday, format } from "date-fns";

export interface JumuahVirtue {
  hadith: string;
  reference: string;
}

export const JUMUAH_VIRTUES: JumuahVirtue[] = [
  {
    hadith: "The best day on which the sun has risen is Friday; on it Adam was created, on it he was made to enter Paradise, and on it he was expelled from it. And the Last Hour will not take place on any day other than Friday.",
    reference: "Sahih Muslim 854"
  },
  {
    hadith: "Whoever recites Surah Al-Kahf on Friday, a light will shine for him from beneath his feet to the heights of heaven, which will shine for him on the Day of Resurrection, and his sins between the two Fridays will be forgiven.",
    reference: "Al-Targhib wat-Tarhib"
  },
  {
    hadith: "Send prayer upon me abundantly on Friday and Friday night, for whoever sends a prayer upon me once, Allah will send ten prayers upon him.",
    reference: "Al-Bayhaqi"
  }
];

/**
 * Checks if a given date is Friday.
 */
export function isTodayFriday(date: Date = new Date()): boolean {
  return isFriday(date);
}

/**
 * Returns a date-seeded Jumu'ah Hadith.
 */
export function getFridayVirtue(date: Date = new Date()): JumuahVirtue {
  const index = date.getDate() % JUMUAH_VIRTUES.length;
  return JUMUAH_VIRTUES[index];
}

/**
 * Converts a calculated Dhuhr time to a clean human-readable Jumu'ah prayer time.
 */
export function formatJumuahTime(dhuhrTime: Date | undefined): string {
  if (!dhuhrTime) return "1:15 PM";
  return dhuhrTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
