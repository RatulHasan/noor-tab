import type { LayoutState, UserSettings } from "../types";

export const DEFAULT_SETTINGS: UserSettings = {
  coordinates: null,
  cityName: null,
  madhab: "standard",
  method: "muslimWorldLeague",
  notificationStyle: "both",
  reminderMinutes: 15,
  perPrayerReminder: {
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
  theme: "system",
  language: "en",
  searchEngine: "google",
  adhanAudio: "none",
  overlayPosition: "bottom",
  // Phase 2 Settings
  enableAutoRamadan: true,
  trackSunnahFasts: true,
  showFastingCountdown: true,
  remindMorningAdhkar: true,
  remindEveningAdhkar: true,
  worldCities: ["Makkah", "Madinah", "Istanbul"],
};

export const defaultLayoutState: LayoutState = {
  version: '1.0',
  lastModified: new Date().toISOString(),
  activeBreakpoint: 'xl',
  panels: {
    left: [
      { id: 'fixed-prayerTimes',   type: 'fixed',  visible: true,  order: 0, panel: 'left',  locked: true  },
      { id: 'widget-prayerStreak', type: 'widget', widgetId: 'prayerStreak',   visible: true,  order: 1, panel: 'left'  },
      { id: 'widget-fasting',      type: 'widget', widgetId: 'fastingTracker', visible: true,  order: 2, panel: 'left'  },
      { id: 'widget-adhkar',       type: 'widget', widgetId: 'adhkar',         visible: false, order: 3, panel: 'left'  },
    ],
    center: [
      { id: 'fixed-ayah',          type: 'fixed',  visible: true,  order: 0, panel: 'center', locked: true  },
      { id: 'fixed-search',        type: 'fixed',  visible: true,  order: 1, panel: 'center', locked: true  },
      { id: 'fixed-hub',           type: 'fixed',  visible: true,  order: 2, panel: 'center', locked: true  },
    ],
    right: [
      { id: 'fixed-qibla',         type: 'fixed',  visible: true,  order: 0, panel: 'right',  locked: true  },
      { id: 'widget-asmaName',     type: 'widget', widgetId: 'asmaName',        visible: true,  order: 1, panel: 'right' },
      { id: 'widget-islamicCal',   type: 'widget', widgetId: 'islamicCalendar', visible: true,  order: 2, panel: 'right' },
      { id: 'widget-globalPrayer', type: 'widget', widgetId: 'globalPrayer',    visible: false, order: 3, panel: 'right' },
    ],
    bottom: [
      { id: 'widget-dhikr',        type: 'widget', widgetId: 'dhikr',          visible: true,  order: 0, panel: 'bottom' },
      { id: 'widget-hadith',       type: 'widget', widgetId: 'hadith',         visible: true,  order: 1, panel: 'bottom' },
      { id: 'widget-quiz',         type: 'widget', widgetId: 'quiz',           visible: false, order: 2, panel: 'bottom' },
      { id: 'widget-quranBkmk',    type: 'widget', widgetId: 'quranBookmark',  visible: false, order: 3, panel: 'bottom' },
    ],
  },
};
