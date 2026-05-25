import { useState, useEffect, useMemo } from "react";
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

  const activeCoordinates = useMemo(() => devMockCoordinates || settings.coordinates, [devMockCoordinates, settings.coordinates]);
  
  const baseDate = useMemo(() => {
    if (devMockTime) {
      const d = new Date();
      const [h, m] = devMockTime.split(":").map(Number);
      d.setHours(h, m, 0, 0);
      return d;
    }
    return date;
  }, [devMockTime, date]);

  const targetDate = useMemo(() => {
    if (!activeCoordinates) return baseDate;
    return getCoordinatesLocalDate(activeCoordinates, baseDate);
  }, [activeCoordinates, baseDate]);

  const prayers = useMemo(() => {
    if (!activeCoordinates || isLoadingSettings) return null;
    return calculatePrayerTimes(
      activeCoordinates.lat,
      activeCoordinates.lng,
      settings.method,
      settings.madhab,
      targetDate,
      settings.prayerOffsets
    );
  }, [activeCoordinates, settings.method, settings.madhab, targetDate, isLoadingSettings, settings.prayerOffsets]);

  const tomorrowPrayers = useMemo(() => {
    if (!activeCoordinates || isLoadingSettings || !targetDate) return null;
    const tomorrowDate = new Date(targetDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return calculatePrayerTimes(
      activeCoordinates.lat,
      activeCoordinates.lng,
      settings.method,
      settings.madhab,
      tomorrowDate,
      settings.prayerOffsets
    );
  }, [activeCoordinates, settings.method, settings.madhab, targetDate, isLoadingSettings, settings.prayerOffsets]);

  const nextPrayer = useMemo(() => {
    if (!prayers || !tomorrowPrayers) return null;
    return getNextPrayer(prayers, tomorrowPrayers, baseDate);
  }, [prayers, tomorrowPrayers, baseDate]);

  const prayerStatuses = useMemo(() => {
    if (!prayers || !tomorrowPrayers) return null;
    return getPrayerStatuses(
      prayers,
      settings.perPrayerReminder,
      tomorrowPrayers,
      baseDate
    );
  }, [prayers, settings.perPrayerReminder, tomorrowPrayers, baseDate]);

  const isMocked = !!devMockCoordinates;

  if (isLoadingSettings || !settings.coordinates) {
    return {
      prayers: null,
      prayerStatuses: null,
      nextPrayer: null,
      tomorrowPrayers: null,
      isLoading: isLoadingSettings,
      settings,
      isMocked,
    };
  }

  return {
    prayers,
    prayerStatuses,
    nextPrayer,
    tomorrowPrayers,
    isLoading: false,
    settings,
    isMocked,
  };
}
