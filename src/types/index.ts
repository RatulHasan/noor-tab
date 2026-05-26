export type PrayerName = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export type NotificationStyle = "newtab" | "overlay" | "both";

export type CalculationMethodKey =
  | "muslimWorldLeague"
  | "egyptian"
  | "karachi"
  | "ummAlQura"
  | "dubai"
  | "qatar"
  | "kuwait"
  | "singapore"
  | "turkey"
  | "tehran"
  | "northAmerica";

export type MadhabKey = "standard" | "hanafi";

export type SearchEngine = 'google' | 'duckduckgo' | 'bing' | 'ecosia';
export type AppLanguage = "en" | "bn" | "ar" | "hi" | "ur";

export interface UserSettings {
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  cityName: string | null;
  madhab: MadhabKey;
  method: CalculationMethodKey;
  notificationStyle: NotificationStyle;
  reminderMinutes: number; // general offset (e.g. 15 minutes before)
  perPrayerReminder: Record<PrayerName, boolean>;
  theme: "light" | "dark" | "system";
  language: AppLanguage;
  searchEngine: SearchEngine;
  adhanAudio: string; // "none" or name of the adhan file (e.g. "azan1")
  overlayPosition: "bottom" | "modal";
  // Phase 2 Settings
  enableAutoRamadan: boolean;
  trackSunnahFasts: boolean;
  showFastingCountdown: boolean;
  remindMorningAdhkar: boolean;
  remindEveningAdhkar: boolean;
  worldCities: string[];
  prayerOffsets: Record<PrayerName, number>;
}

export type DailyPrayers = Record<PrayerName, Date>;

export interface PrayerUIStatus {
  name: PrayerName;
  arabicName: string;
  transliteration: string;
  time: Date;
  state: "passed" | "next" | "upcoming";
  reminderEnabled: boolean;
}

export interface Ayah {
  text: string;
  translation: string;
  transliteration: string;
  reference: string; // e.g. "Surah Al-Baqarah 2:186"
}

export interface Hadith {
  text: string;
  translation: string;
  reference: string; // e.g. "Sahih al-Bukhari 547"
}

export interface IslamicEvent {
  name: string;
  hijriDate: {
    month: number; // 1-indexed (1 = Muharram, etc.)
    day: number;
  };
  description: string;
}

export interface DhikrPhase {
  count: number;
  max: number;
  ar: string;
  en: string;
  transliteration: string;
}

// ── Prayer Streak ──────────────────────────────────────────
export type PrayerStatus = 'on_time' | 'late' | 'missed' | null;

export interface DayPrayerRecord {
  date: string; // ISO date string "2026-05-24"
  fajr: PrayerStatus;
  dhuhr: PrayerStatus;
  asr: PrayerStatus;
  maghrib: PrayerStatus;
  isha: PrayerStatus;
}

export interface PrayerStreakData {
  records: Record<string, DayPrayerRecord>; // keyed by ISO date
  currentStreak: number;
  longestStreak: number;
  totalOnTime: number;
  totalLate: number;
  totalMissed: number;
}

// ── Fasting ────────────────────────────────────────────────
export type FastType = 'ramadan' | 'monday' | 'thursday' | 'ayyamul_bidh' | 'custom';

export interface FastingRecord {
  date: string;
  type: FastType;
  completed: boolean;
  suhoorTime?: string;
  iftarTime?: string;
}

export interface FastingData {
  isRamadanMode: boolean;
  records: Record<string, FastingRecord>;
  currentFastingStreak: number;
}

// ── Quran Bookmark ─────────────────────────────────────────
export interface QuranBookmark {
  surah: number;       // 1-114
  ayah: number;        // 1-N
  surahName: string;
  savedAt: string;     // ISO timestamp
  note?: string;
}

// ── Dhikr Goals ────────────────────────────────────────────
export interface DhikrGoal {
  id: string;
  label: string;
  arabicLabel: string;
  targetCount: number;
  todayCount: number;
  lastResetDate: string;
}

// ── Morning/Evening Adhkar ─────────────────────────────────
export type AdhkarSession = 'morning' | 'evening';

export interface AdhkarItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;         // required repetitions
  benefit?: string;
  source: string;        // e.g. "Hisnul Muslim #23"
}

export interface AdhkarProgress {
  date: string;
  morning: Record<string, number>; // adhkarId → completedCount
  evening: Record<string, number>;
  morningCompleted: boolean;
  eveningCompleted: boolean;
}

// ── 99 Names ───────────────────────────────────────────────
export interface AsmaName {
  number: number;       // 1-99
  arabic: string;
  transliteration: string;
  meaning: string;
  benefit: string;
}

// ── Dua Library ────────────────────────────────────────────
export type DuaCategory =
  | "morning_evening"
  | "travel"
  | "eating"
  | "sleeping"
  | "stress"
  | "gratitude"
  | "protection"
  | "forgiveness"
  | "family"
  | "knowledge"
  | "general"
  | "rizq"
  | "tawhid"
  | "salah"
  | "mosque"
  | "daily"
  | "purification"
  | "health"
  | "death"
  | "nature"
  | "guidance"
  | "masnun"
  | "ayat"
  | "surah"

export interface Dua {
  id: string;
  category: DuaCategory;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  isFavorite?: boolean;
}

// ── Islamic Quiz ────────────────────────────────────────────
export type QuizCategory = 'quran' | 'history' | 'fiqh' | 'seerah' | 'general';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizRecord {
  date: string;
  questionId: string;
  answeredCorrectly: boolean;
  totalCorrect: number;
  totalAnswered: number;
  selectedIndex?: number;
}

// ── Focus / DND Mode ───────────────────────────────────────
export interface FocusMode {
  enabled: boolean;
  snoozedUntil: string | null; // ISO timestamp
  snoozeDuration: 60 | 120 | 240; // minutes
}

// ── Widget Layout ──────────────────────────────────────────
export type WidgetId =
  | 'ayah' | 'hadith' | 'dhikr' | 'islamicCalendar'
  | 'adhkar' | 'asmaName' | 'duaLibrary' | 'quiz'
  | 'fastingTracker' | 'quranBookmark' | 'prayerStreak'
  | 'globalPrayer';

export interface WidgetConfig {
  id: WidgetId;
  visible: boolean;
  order: number;
  panel: 'left' | 'center' | 'right' | 'bottom';
}

// ── Backup / Export / Import ───────────────────────────────
export interface NoorTabBackup {
  version: '1.0';
  app: 'NoorTab';
  exportedAt: string;       // ISO timestamp
  settings: UserSettings;
  prayerStreak: PrayerStreakData;
  fastingData: FastingData;
  quranBookmark: QuranBookmark | null;
  dhikrGoals: DhikrGoal[];
  adhkarProgress: AdhkarProgress;
  duaFavorites: string[];   // dua IDs
  quizRecord: QuizRecord;
  widgetLayout: WidgetConfig[];
  layoutState?: LayoutState;
  // Additional user data
  focusMode?: FocusMode;
  zakatHistory?: ZakatCalculation[];
  quizQuestionOffset?: number;
}

// Zakat calculation type for backup
export interface ZakatCalculation {
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
  nisabThreshold: number;
  isEligible: boolean;
  zakatDue: number;
  currency: string;
  savedAt: string;
}

// ── Panel Layout ───────────────────────────────────────────

export type PanelId = 'left' | 'center' | 'right' | 'bottom';

export type BreakpointId = 'xl' | 'lg' | 'md' | 'sm';

export interface PanelItem {
  id: string;           // unique: 'widget-prayerStreak', 'hub-quran', 'fixed-prayerTimes'
  type: 'widget' | 'hub' | 'fixed';
  widgetId?: WidgetId;  // if type === 'widget'
  hubTabId?: string;    // if type === 'hub'
  visible: boolean;
  order: number;        // sort order within panel
  panel: PanelId;
  locked?: boolean;     // if true: cannot be dragged (e.g. Prayer Times in left, Ayah in center)
}

export interface PanelLayout {
  left: PanelItem[];
  center: PanelItem[];
  right: PanelItem[];
  bottom: PanelItem[];
}

export interface LayoutState {
  panels: PanelLayout;
  activeBreakpoint: BreakpointId;
  lastModified: string; // ISO timestamp
  version: '1.0';
}

export type BackupVersion = '1.0';
export const SUPPORTED_BACKUP_VERSIONS: BackupVersion[] = ['1.0'];
