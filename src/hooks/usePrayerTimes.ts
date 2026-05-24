import { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
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

  const [devMockTime] = useStorage<string>("devMockTime", "");
  const [devMockCoordinates] = useStorage<{ lat: number; lng: number } | null>("devMockCoordinates", null);

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

  // Allow dev tools to override coordinates for global location simulation
  const activeCoordinates = devMockCoordinates || settings.coordinates;
  const { lat, lng } = activeCoordinates;
  
  const baseDate = (() => {
    if (devMockTime) {
      const d = new Date();
      const [h, m] = devMockTime.split(":").map(Number);
      d.setHours(h, m, 0, 0);
      return d;
    }
    return date;
  })();

  const targetDate = getCoordinatesLocalDate(activeCoordinates, baseDate);

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

  const nextPrayer = getNextPrayer(prayers, tomorrowPrayers, baseDate);
  const prayerStatuses = getPrayerStatuses(
    prayers,
    settings.perPrayerReminder,
    tomorrowPrayers,
    baseDate
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
