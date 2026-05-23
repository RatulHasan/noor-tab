import { useState, useEffect } from "react";
import { useSettings } from "./useSettings";
import {
  calculatePrayerTimes,
  getNextPrayer,
  getPrayerStatuses,
} from "../utils/prayerCalculator";
import { getCoordinatesLocalDate } from "../utils/locationService";

export function usePrayerTimes() {
  const [settings, , isLoadingSettings] = useSettings();
  const [date, setDate] = useState(() => new Date());

  // Handle midnight date rollover
  useEffect(() => {
    const now = new Date();
    // Schedule update for 12:00:05 AM tomorrow
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      5
    );
    const msToMidnight = tomorrow.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      setDate(new Date());
    }, msToMidnight);

    return () => clearTimeout(timeoutId);
  }, [date]);

  if (isLoadingSettings || !settings.coordinates) {
    return {
      prayers: null,
      prayerStatuses: null,
      nextPrayer: null,
      tomorrowPrayers: null,
      isLoading: isLoadingSettings,
      settings,
    };
  }

  const { lat, lng } = settings.coordinates;
  const targetDate = getCoordinatesLocalDate(settings.coordinates);
  
  const prayers = calculatePrayerTimes(
    lat,
    lng,
    settings.method,
    settings.madhab,
    targetDate
  );

  // Compute tomorrow's prayers to resolve correct wrapping for the "next" prayer after Isha
  const tomorrowDate = new Date(targetDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowPrayers = calculatePrayerTimes(
    lat,
    lng,
    settings.method,
    settings.madhab,
    tomorrowDate
  );

  const nextPrayer = getNextPrayer(prayers, tomorrowPrayers);
  const prayerStatuses = getPrayerStatuses(
    prayers,
    settings.perPrayerReminder,
    tomorrowPrayers
  );

  return {
    prayers,
    prayerStatuses,
    nextPrayer,
    tomorrowPrayers,
    isLoading: false,
    settings,
  };
}
