import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan";
import type {
  PrayerName,
  CalculationMethodKey,
  MadhabKey,
  DailyPrayers,
  PrayerUIStatus,
} from "../types";
import { PRAYER_METADATA } from "../data/prayerNames";

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
  date: Date = new Date()
): DailyPrayers {
  const coordinates = new Coordinates(lat, lng);
  const methodFn = METHOD_MAP[methodKey] || CalculationMethod.MuslimWorldLeague;
  const params = methodFn();
  
  params.madhab = madhabKey === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  
  return {
    fajr: prayerTimes.fajr,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
  };
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
  const prayerNames: PrayerName[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  
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
