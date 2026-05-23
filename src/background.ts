import { Storage } from "@plasmohq/storage";
import type { UserSettings } from "./types";
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
  };
}

// Recalculate prayers and schedule alarms
async function refreshAlarms() {
  try {
    const settings = await getSettings();
    if (!settings.coordinates) {
      console.log("No coordinates set. Skipping alarm scheduling.");
      await clearAllAlarms();
      return;
    }

    const { lat, lng } = settings.coordinates;
    const prayers = calculatePrayerTimes(
      lat,
      lng,
      settings.method,
      settings.madhab
    );

    await scheduleAllPrayerAlarms(
      prayers,
      settings.reminderMinutes,
      settings.perPrayerReminder
    );
    scheduleMidnightReset();
    console.log("Alarms successfully rescheduled.");
  } catch (error) {
    console.error("Error refreshing alarms:", error);
  }
}

// Runtime listeners
chrome.runtime.onInstalled.addListener(async () => {
  console.log("NoorTab Extension installed. Initializing alarms...");
  await refreshAlarms();
});

// Alarm firing listener
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log(`Alarm fired: ${alarm.name}`);
  
  if (alarm.name === "prayer-midnight-reset") {
    console.log("Midnight reached. Recalculating times...");
    await refreshAlarms();
    return;
  }

  if (alarm.name.startsWith("prayer-")) {
    const prayerName = alarm.name.replace("prayer-", "");
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
          }, (response) => {
            // If message sending failed (e.g. no content script loaded on system pages),
            // fallback to opening new tab so the reminder is not missed
            if (chrome.runtime.lastError) {
              console.log(
                "Overlay message failed (e.g., active tab is system page). Falling back to new tab."
              );
              chrome.tabs.create({ url });
            }
          });
        } else {
          // No active tab or system tab, open new tab
          chrome.tabs.create({ url });
        }
      });
    }
  }
});

// Listen for settings update messages from Popup / New Tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SETTINGS_CHANGED") {
    console.log("Settings changed message received. Refreshing alarms...");
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
        if (tab.id) {
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
});
