import { Storage } from "@plasmohq/storage";
import type { UserSettings, FocusMode } from "./types";
import { DEFAULT_SETTINGS } from "./data/defaultSettings";
import { calculatePrayerTimes } from "./utils/prayerCalculator";
import {
  scheduleAllPrayerAlarms,
  scheduleMidnightReset,
  clearAllAlarms,
} from "./utils/alarmScheduler";

const storage = new Storage();

// Fetch settings helper
async function getSettings(): Promise<UserSettings> {
  const stored = await storage.get<UserSettings>("noortab-user-settings");
  if (!stored) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    perPrayerReminder: {
      ...DEFAULT_SETTINGS.perPrayerReminder,
      ...(stored.perPrayerReminder || {}),
    },
    prayerOffsets: {
      ...DEFAULT_SETTINGS.prayerOffsets,
      ...(stored.prayerOffsets || {}),
    },
  };
}

// Recalculate prayers and schedule alarms
async function refreshAlarms() {
  try {
    const settings = await getSettings();
    if (!settings.coordinates) {
      await clearAllAlarms();
      return;
    }

    const { lat, lng } = settings.coordinates;
    const prayers = calculatePrayerTimes(
      lat,
      lng,
      settings.method,
      settings.madhab,
      new Date(),
      settings.prayerOffsets
    );

    await scheduleAllPrayerAlarms(
      prayers,
      settings.reminderMinutes,
      settings.perPrayerReminder
    );
    scheduleMidnightReset();

    // Schedule morning adhkar reset at Fajr time + 30 min if enabled
    if (settings.remindMorningAdhkar) {
      const fajrTime = prayers.fajr;
      const adhkarTime = new Date(fajrTime.getTime() + 30 * 60 * 1000); // 30 min after Fajr
      const now = new Date();
      if (adhkarTime > now) {
        const delayMs = adhkarTime.getTime() - now.getTime();
        chrome.alarms.create("adhkar-morning-reset", { delayInMinutes: delayMs / 60000 });
      }
    }

    // Schedule evening adhkar reset at Asr time if enabled
    if (settings.remindEveningAdhkar) {
      const asrTime = prayers.asr;
      const now = new Date();
      if (asrTime > now) {
        const delayMs = asrTime.getTime() - now.getTime();
        chrome.alarms.create("adhkar-evening-reset", { delayInMinutes: delayMs / 60000 });
      }
    }

  } catch (error) {
    console.error("Error refreshing alarms:", error);
  }
}

// Runtime listeners
chrome.runtime.onInstalled.addListener(async () => {
  await refreshAlarms();
});

// Alarm firing listener
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "prayer-midnight-reset") {
    await refreshAlarms();
    return;
  }

  if (alarm.name === "adhkar-morning-reset") {
    await refreshAlarms(); // Reschedule for tomorrow
    return;
  }

  if (alarm.name === "adhkar-evening-reset") {
    await refreshAlarms();
    return;
  }

  // Check Focus Mode - skip prayer notifications if snoozed
  if (alarm.name.startsWith("prayer-reminder-") || alarm.name.startsWith("prayer-time-")) {
    const focusMode = await storage.get<FocusMode>("focusMode");
    if (focusMode?.enabled && focusMode?.snoozedUntil) {
      const snoozedUntil = new Date(focusMode.snoozedUntil);
      if (snoozedUntil > new Date()) {
        return;
      } else {
        // Snooze expired, disable focus mode
        await storage.set("focusMode", { enabled: false, snoozedUntil: null, snoozeDuration: 60 });
      }
    }
  }

  // Handle prayer time alarms (actual prayer time - for adhan)
  if (alarm.name.startsWith("prayer-time-")) {
    const prayerName = alarm.name.replace("prayer-time-", "");
    const settings = await getSettings();

    // Only play adhan/show notification if adhan audio is configured
    const configuredAdhan = settings.adhanAudio || "none";
    if (configuredAdhan !== "none") {
      const url = chrome.runtime.getURL(`newtab.html?reminder=${prayerName}&adhanOnly=true`);

      // For prayer-time alarms, prefer newtab to play adhan
      if (settings.notificationStyle === "newtab" || settings.notificationStyle === "both") {
        chrome.tabs.create({ url });
      }

      // Also try overlay for prayer-time
      if (settings.notificationStyle === "overlay" || settings.notificationStyle === "both") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab && activeTab.id) {
            chrome.tabs.sendMessage(activeTab.id, {
              type: "SHOW_PRAYER_OVERLAY",
              prayer: prayerName,
              minutes: 0, // 0 means it's prayer time
              isPrayerTime: true,
            }).catch(() => {
              // Content script not loaded (e.g. system page), fallback to new tab
              chrome.tabs.create({ url });
            });
          }
        });
      }
    }
    return;
  }

  // Handle prayer reminder alarms (before prayer time)
  if (alarm.name.startsWith("prayer-reminder-")) {
    const prayerName = alarm.name.replace("prayer-reminder-", "");
    const settings = await getSettings();

    const url = chrome.runtime.getURL(`newtab.html?reminder=${prayerName}`);

    // Action 1: New Tab Takeover
    if (settings.notificationStyle === "newtab" || settings.notificationStyle === "both") {
      chrome.tabs.create({ url });
    }

    // Action 2: Inject/Trigger Content Overlay
    if (settings.notificationStyle === "overlay" || settings.notificationStyle === "both") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.id) {
          // Send message to the active tab content script
          chrome.tabs.sendMessage(activeTab.id, {
            type: "SHOW_PRAYER_OVERLAY",
            prayer: prayerName,
            minutes: settings.reminderMinutes,
          }).catch(() => {
            // Content script not loaded (e.g. system page), fallback to new tab
            chrome.tabs.create({ url });
          });
        } else {
          // No active tab or system tab, open new tab
          chrome.tabs.create({ url });
        }
      });
    }
    return;
  }
});

// Listen for settings update messages from Popup / New Tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SETTINGS_CHANGED") {
    refreshAlarms().then(() => sendResponse({ success: true }));
    return true; // Keep channel open for async response
  }

  if (message.type === "OPEN_NEW_TAB") {
    const url = chrome.runtime.getURL(`newtab.html?reminder=${message.prayer}`);
    chrome.tabs.create({ url });
    sendResponse({ success: true });
    return true;
  }

  if (message.type === "STOP_ALL_ADHAN") {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
          // Only send to http/https pages where content script can be injected
          chrome.tabs.sendMessage(tab.id, { type: "STOP_ALL_ADHAN" }).catch(() => {
            // Ignore error for pages without content script loaded
          });
        }
      });
    });
    // Broadcast to internal extension views (e.g. New Tab)
    chrome.runtime.sendMessage({ type: "STOP_ALL_ADHAN_INTERNAL" }).catch(() => {});
    sendResponse({ success: true });
    return true;
  }

  if (message.type === "TOGGLE_FOCUS_MODE") {
    const { enabled, snoozedUntil } = message;
    storage.set("focusMode", { enabled, snoozedUntil, snoozeDuration: 60 }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === "CHECK_FOCUS_MODE") {
    storage.get<FocusMode>("focusMode").then((focusMode) => {
      sendResponse({ focusMode: focusMode || { enabled: false, snoozedUntil: null, snoozeDuration: 60 } });
    });
    return true;
  }

  if (message.type === "MARK_PRAYER") {
    // Storage update handled by component directly via @plasmohq/storage
    // Background just logs for debugging
    sendResponse({ success: true });
    return true;
  }

  if (message.type === "GET_BACKUP_DATA") {
    Promise.all([
      storage.get("noortab-user-settings"),
      storage.get("prayerStreak"),
      storage.get("fastingData"),
      storage.get("quranBookmark"),
      storage.get("dhikrGoals"),
      storage.get("adhkarProgress"),
      storage.get("duaFavorites"),
      storage.get("quizRecord"),
      storage.get("widgetLayout"),
    ]).then(([settings, prayerStreak, fastingData, quranBookmark, dhikrGoals, adhkarProgress, duaFavorites, quizRecord, widgetLayout]) => {
      sendResponse({ settings, prayerStreak, fastingData, quranBookmark, dhikrGoals, adhkarProgress, duaFavorites, quizRecord, widgetLayout });
    });
    return true;
  }
});
