import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan";
import type {
  PrayerName,
  CalculationMethodKey,
  MadhabKey,
  DailyPrayers,
  PrayerUIStatus,
} from "../types";
import { PRAYER_METADATA } from "../data/prayerNames";

/**
 * Get the timezone offset in hours for a given longitude.
 * This is an approximation - actual timezones may vary due to political boundaries.
 */
export function getTimezoneOffsetForLongitude(lng: number): number {
  return Math.round(lng / 15);
}

/**
 * Adjust a Date from one timezone to another based on longitude offsets.
 * This is used to convert prayer times calculated in UTC to the target location's timezone.
 */
export function adjustDateToTimezone(date: Date, targetLng: number): Date {
  const targetOffsetHours = getTimezoneOffsetForLongitude(targetLng);
  const browserOffsetMinutes = date.getTimezoneOffset(); // in minutes, inverted sign
  const targetOffsetMinutes = targetOffsetHours * 60;

  // Calculate the difference between browser timezone and target timezone
  const offsetDiffMinutes = targetOffsetMinutes + browserOffsetMinutes;

  // Create new Date adjusted by the difference
  return new Date(date.getTime() + offsetDiffMinutes * 60 * 1000);
}

const METHOD_MAP: Record<CalculationMethodKey, () => any> = {
  muslimWorldLeague: CalculationMethod.MuslimWorldLeague,
  egyptian: CalculationMethod.Egyptian,
  karachi: CalculationMethod.Karachi,
  ummAlQura: CalculationMethod.UmmAlQura,
  dubai: CalculationMethod.Dubai,
  qatar: CalculationMethod.Qatar,
  kuwait: CalculationMethod.Kuwait,
  singapore: CalculationMethod.Singapore,
  turkey: CalculationMethod.Turkey,
  tehran: CalculationMethod.Tehran,
  northAmerica: CalculationMethod.NorthAmerica,
};

export function calculatePrayerTimes(
  lat: number,
  lng: number,
  methodKey: CalculationMethodKey,
  madhabKey: MadhabKey,
  date: Date = new Date(),
  offsets?: Record<string, number>
): DailyPrayers {
  const coordinates = new Coordinates(lat, lng);
  const methodFn = METHOD_MAP[methodKey] || CalculationMethod.MuslimWorldLeague;
  const params = methodFn();

  params.madhab = madhabKey === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;

  // Calculate prayer times - the adhan library uses the date's timezone internally
  // The calculation is based on the day of year and coordinates, not the timezone
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  const prayers = {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
  };

  // Adjust prayer times to target timezone if browser timezone differs from location
  // This ensures prayer times display correctly for the selected location
  const targetLng = lng;
  const browserOffsetMinutes = date.getTimezoneOffset(); // Browser's UTC offset (inverted sign)
  const targetOffsetHours = getTimezoneOffsetForLongitude(targetLng);
  const targetOffsetMinutes = targetOffsetHours * 60;

  // If browser timezone doesn't match target timezone, adjust prayer times
  const offsetDiffMinutes = targetOffsetMinutes + browserOffsetMinutes;
  const needsAdjustment = Math.abs(offsetDiffMinutes) > 30; // More than 30 min difference

  const adjustedPrayers = { ...prayers };

  if (needsAdjustment) {
    // Adjust each prayer time to target timezone
    (Object.keys(adjustedPrayers) as PrayerName[]).forEach((name) => {
      const prayerDate = adjustedPrayers[name];
      if (prayerDate) {
        adjustedPrayers[name] = new Date(prayerDate.getTime() + offsetDiffMinutes * 60 * 1000);
      }
    });
  }

  // Apply manual offsets (user adjustments)
  if (offsets) {
    (Object.keys(offsets) as PrayerName[]).forEach((name) => {
      if (adjustedPrayers[name] && offsets[name] !== 0) {
        adjustedPrayers[name] = new Date(adjustedPrayers[name].getTime() + offsets[name] * 60000);
      }
    });
  }

  return adjustedPrayers;
}

export function getNextPrayer(
  prayers: DailyPrayers,
  tomorrowPrayers?: DailyPrayers,
  now: Date = new Date()
): { name: PrayerName; time: Date } {
  const prayerNames: PrayerName[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  
  for (const name of prayerNames) {
    if (prayers[name] > now) {
      return { name, time: prayers[name] };
    }
  }
  
  // If all prayers today have passed, the next prayer is Fajr tomorrow
  if (tomorrowPrayers) {
    return { name: "fajr", time: tomorrowPrayers.fajr };
  } else {
    // Fallback: estimate Fajr tomorrow by adding 1 day
    const tomorrowFajr = new Date(prayers.fajr);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    return { name: "fajr", time: tomorrowFajr };
  }
}

export function getPrayerStatuses(
  prayers: DailyPrayers,
  perPrayerReminder: Record<PrayerName, boolean>,
  tomorrowPrayers?: DailyPrayers,
  now: Date = new Date()
): PrayerUIStatus[] {
  const nextPrayerInfo = getNextPrayer(prayers, tomorrowPrayers, now);
  const prayerNames: PrayerName[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  
  return prayerNames.map((name) => {
    const meta = PRAYER_METADATA[name];
    const time = prayers[name];
    
    let state: PrayerUIStatus["state"] = "upcoming";
    
    // Check if this prayer matches the next prayer name and time
    // (Ensure we correctly match Fajr if next prayer is Fajr tomorrow)
    const isNext = nextPrayerInfo.name === name && 
      (nextPrayerInfo.time.getTime() === time.getTime() || 
       (name === "fajr" && nextPrayerInfo.time.getDate() !== time.getDate()));
    
    if (isNext) {
      state = "next";
    } else if (time < now) {
      state = "passed";
    }
    
    return {
      name,
      arabicName: meta.arabicName,
      transliteration: meta.transliteration,
      time,
      state,
      reminderEnabled: perPrayerReminder[name],
    };
  });
}
