import type { DailyPrayers, PrayerName } from "../types";

export async function clearAllPrayerAlarms(): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.alarms) return;

  const alarms = await chrome.alarms.getAll();
  const prayerAlarms = alarms.filter(
    (alarm) => (alarm.name.startsWith("prayer-reminder-") || alarm.name.startsWith("prayer-time-")) && alarm.name !== "prayer-midnight-reset"
  );

  for (const alarm of prayerAlarms) {
    await chrome.alarms.clear(alarm.name);
  }
}

export async function scheduleAllPrayerAlarms(
  prayers: DailyPrayers,
  reminderMinutes: number,
  perPrayerReminder: Record<PrayerName, boolean>
): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.alarms) return;

  await clearAllPrayerAlarms();

  const now = Date.now();
  const prayerNames: PrayerName[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

  for (const name of prayerNames) {
    if (!perPrayerReminder[name]) continue;

    const prayerTime = new Date(prayers[name]).getTime();
    const reminderTime = prayerTime - reminderMinutes * 60 * 1000;

    // Schedule reminder alarm (before prayer time)
    if (reminderTime > now) {
      chrome.alarms.create(`prayer-reminder-${name}`, { when: reminderTime });
    }

    // Schedule actual prayer time alarm (for adhan/notification at 100% elapsed)
    if (prayerTime > now) {
      chrome.alarms.create(`prayer-time-${name}`, { when: prayerTime });
    }
  }
}

export function scheduleMidnightReset(): void {
  if (typeof chrome === "undefined" || !chrome.alarms) return;

  chrome.alarms.clear("prayer-midnight-reset");

  const now = new Date();
  // Set to 12:01 AM tomorrow to trigger recalculations
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    1,
    0
  );
  
  chrome.alarms.create("prayer-midnight-reset", { when: midnight.getTime() });
}
export async function clearAllAlarms(): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.alarms) return;
  await chrome.alarms.clearAll();
}
