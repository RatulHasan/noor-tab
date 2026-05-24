import type { NoorTabBackup, DayPrayerRecord, UserSettings } from "../types";
import { SUPPORTED_BACKUP_VERSIONS } from "../types";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Storage } from "@plasmohq/storage";

// Helper to gather all data from Storage
async function gatherAllData(): Promise<NoorTabBackup> {
  const storage = new Storage();
  
  const [settings, prayerStreak, fastingData, quranBookmark, dhikrGoals, adhkarProgress, duaFavorites, quizRecord, widgetLayout] = await Promise.all([
    storage.get("noortab-user-settings"),
    storage.get("prayerStreak"),
    storage.get("fastingData"),
    storage.get("quranBookmark"),
    storage.get("dhikrGoals"),
    storage.get("adhkarProgress"),
    storage.get("duaFavorites"),
    storage.get("quizRecord"),
    storage.get("widgetLayout"),
  ]);

  return {
    version: "1.0",
    app: "NoorTab",
    exportedAt: new Date().toISOString(),
    settings: (settings || {}) as UserSettings,
    prayerStreak: (prayerStreak || {
      records: {},
      currentStreak: 0,
      longestStreak: 0,
      totalOnTime: 0,
      totalLate: 0,
      totalMissed: 0
    }) as any,
    fastingData: (fastingData || {
      isRamadanMode: false,
      records: {},
      currentFastingStreak: 0
    }) as any,
    quranBookmark: (quranBookmark || null) as any,
    dhikrGoals: (dhikrGoals || []) as any,
    adhkarProgress: (adhkarProgress || {
      date: "",
      morning: {},
      evening: {},
      morningCompleted: false,
      eveningCompleted: false
    }) as any,
    duaFavorites: (duaFavorites || []) as any,
    quizRecord: (quizRecord || {
      date: "",
      questionId: "",
      answeredCorrectly: false,
      totalCorrect: 0,
      totalAnswered: 0
    }) as any,
    widgetLayout: (widgetLayout || []) as any
  };
}

/**
 * Exports all storage data into a formatted JSON backup file.
 */
export async function exportBackup(): Promise<void> {
  const backup = await gatherAllData();
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const dateStr = new Date().toISOString().split("T")[0];
  saveAs(blob, `noortab-backup-${dateStr}.json`);
}

/**
 * Generates and downloads a clean, beautifully formatted monthly prayer log PDF table.
 */
export async function exportPrayerLogPDF(
  records: DayPrayerRecord[],
  monthLabel: string,
  cityName: string
): Promise<void> {
  const doc = new jsPDF();
  
  // 1. Header Styling (Dark Emerald Banner Theme)
  doc.setFillColor(4, 120, 87); // Emerald-700
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("NoorTab - Monthly Prayer Log", 14, 20);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Location: ${cityName || "Detected Location"}   |   Reporting Month: ${monthLabel}`, 14, 32);

  // 2. Build Table Data
  const columns = [
    { title: "Date", dataKey: "date" },
    { title: "Fajr", dataKey: "fajr" },
    { title: "Dhuhr", dataKey: "dhuhr" },
    { title: "Asr", dataKey: "asr" },
    { title: "Maghrib", dataKey: "maghrib" },
    { title: "Isha", dataKey: "isha" },
    { title: "Daily Score", dataKey: "score" }
  ];

  let totalOnTime = 0;
  let totalLate = 0;
  let totalMissed = 0;
  let totalPrayersLogged = 0;

  const rows = records.map((rec) => {
    let dailyScore = 0;
    const prayers: (keyof Omit<DayPrayerRecord, "date">)[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
    
    prayers.forEach((p) => {
      const status = rec[p];
      if (status === "on_time") {
        dailyScore++;
        totalOnTime++;
        totalPrayersLogged++;
      } else if (status === "late") {
        dailyScore++;
        totalLate++;
        totalPrayersLogged++;
      } else if (status === "missed") {
        totalMissed++;
        totalPrayersLogged++;
      }
    });

    const formatStatus = (status: string | null) => {
      if (!status) return "-";
      return status.replace("_", " ").toUpperCase();
    };

    return {
      date: rec.date,
      fajr: formatStatus(rec.fajr),
      dhuhr: formatStatus(rec.dhuhr),
      asr: formatStatus(rec.asr),
      maghrib: formatStatus(rec.maghrib),
      isha: formatStatus(rec.isha),
      score: `${dailyScore}/5`
    };
  });

  // 3. Render Table with Custom Cell Colors
  autoTable(doc, {
    columns: columns,
    body: rows,
    startY: 50,
    theme: "striped",
    headStyles: {
      fillColor: [6, 95, 70], // Emerald-800
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    bodyStyles: {
      fontSize: 9
    },
    didParseCell: (data) => {
      // Don't color head cells or date/score column cells
      if (data.section === "head" || data.column.dataKey === "date" || data.column.dataKey === "score") {
        return;
      }
      
      const val = data.cell.text[0];
      if (val === "ON TIME") {
        data.cell.styles.fillColor = [209, 250, 229]; // Light emerald bg
        data.cell.styles.textColor = [6, 95, 70]; // Dark emerald text
      } else if (val === "LATE") {
        data.cell.styles.fillColor = [254, 243, 199]; // Light amber bg
        data.cell.styles.textColor = [146, 64, 14]; // Amber-800
      } else if (val === "MISSED") {
        data.cell.styles.fillColor = [254, 226, 226]; // Light red bg
        data.cell.styles.textColor = [153, 27, 27]; // Red-800
      }
    }
  });

  // 4. Summary & Footer Section (Aesthetic Statistics Cards)
  const currentY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFillColor(245, 245, 244); // Stone-100 bg
  doc.rect(14, currentY, 182, 35, "F");

  doc.setTextColor(68, 64, 60); // Stone-700
  doc.setFontSize(11);
  doc.setFont("Helvetica", "bold");
  doc.text("Salah Compliance Summary", 20, currentY + 8);

  const complianceRate = totalPrayersLogged > 0 
    ? Math.round(((totalOnTime + totalLate) / totalPrayersLogged) * 100) 
    : 0;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Total Prayers Logged: ${totalPrayersLogged}`, 20, currentY + 18);
  doc.text(`On Time: ${totalOnTime}   |   Late: ${totalLate}   |   Missed: ${totalMissed}`, 20, currentY + 24);
  doc.text(`Salah Compliance Rating: ${complianceRate}%`, 20, currentY + 30);

  // Download PDF
  doc.save(`noortab-prayer-log-${monthLabel.replace(/\s+/g, "-")}.pdf`);
}

/**
 * Validates whether the imported file matches the NoorTab backup structure.
 */
export function validateBackup(raw: unknown): {
  valid: boolean;
  backup?: NoorTabBackup;
  error?: string;
} {
  if (!raw || typeof raw !== "object") {
    return { valid: false, error: "Invalid file format." };
  }
  const d = raw as Record<string, any>;
  if (d.app !== "NoorTab") {
    return { valid: false, error: "This file is not a NoorTab backup." };
  }
  if (!SUPPORTED_BACKUP_VERSIONS.includes(d.version)) {
    return { valid: false, error: `Unsupported backup version: ${d.version}` };
  }
  if (!d.exportedAt || !d.settings) {
    return { valid: false, error: "Backup file is incomplete or corrupted." };
  }
  return { valid: true, backup: d as NoorTabBackup };
}

/**
 * Performs local backup restoration. Supports both standard "replace" and a flexible "merge" mode.
 */
export async function importBackup(
  backup: NoorTabBackup,
  mode: "replace" | "merge"
): Promise<void> {
  const storage = new Storage();

  if (mode === "replace") {
    await storage.clear();
    await Promise.all([
      storage.set("noortab-user-settings", backup.settings),
      storage.set("prayerStreak", backup.prayerStreak),
      storage.set("fastingData", backup.fastingData),
      storage.set("quranBookmark", backup.quranBookmark),
      storage.set("dhikrGoals", backup.dhikrGoals),
      storage.set("adhkarProgress", backup.adhkarProgress),
      storage.set("duaFavorites", backup.duaFavorites),
      storage.set("quizRecord", backup.quizRecord),
      storage.set("widgetLayout", backup.widgetLayout)
    ]);
  } else {
    // ── MERGE MODE ──
    const [settings, prayerStreak, fastingData, quranBookmark, dhikrGoals, adhkarProgress, duaFavorites, quizRecord, widgetLayout] = await Promise.all([
      storage.get("noortab-user-settings"),
      storage.get("prayerStreak"),
      storage.get("fastingData"),
      storage.get("quranBookmark"),
      storage.get("dhikrGoals"),
      storage.get("adhkarProgress"),
      storage.get("duaFavorites"),
      storage.get("quizRecord"),
      storage.get("widgetLayout"),
    ]);

    // 1. Settings: current active settings win
    const mergedSettings = {
      ...(backup.settings || {}),
      ...((settings as any) || {})
    };

    // 2. Quran Bookmarks: keep the most recent savedAt
    let mergedBookmark = (quranBookmark as any) || null;
    if (backup.quranBookmark) {
      if (!mergedBookmark) {
        mergedBookmark = backup.quranBookmark;
      } else {
        const currentSaved = new Date(mergedBookmark.savedAt).getTime();
        const backupSaved = new Date(backup.quranBookmark.savedAt).getTime();
        if (backupSaved > currentSaved) {
          mergedBookmark = backup.quranBookmark;
        }
      }
    }

    // 3. Prayer Streak: union dates together
    const currentStreakData = (prayerStreak as any) || { records: {} };
    const backupStreakRecords = backup.prayerStreak?.records || {};
    const mergedRecords = { ...backupStreakRecords, ...currentStreakData.records };

    const mergedStreak = {
      records: mergedRecords,
      currentStreak: Math.max(currentStreakData.currentStreak || 0, backup.prayerStreak?.currentStreak || 0),
      longestStreak: Math.max(currentStreakData.longestStreak || 0, backup.prayerStreak?.longestStreak || 0),
      totalOnTime: (currentStreakData.totalOnTime || 0) + (backup.prayerStreak?.totalOnTime || 0),
      totalLate: (currentStreakData.totalLate || 0) + (backup.prayerStreak?.totalLate || 0),
      totalMissed: (currentStreakData.totalMissed || 0) + (backup.prayerStreak?.totalMissed || 0)
    };

    // 4. Fasting Data: union dates
    const currentFasting = (fastingData as any) || { records: {} };
    const backupFastingRecords = backup.fastingData?.records || {};
    const mergedFastingRecords = { ...backupFastingRecords, ...currentFasting.records };
    const mergedFasting = {
      isRamadanMode: currentFasting.isRamadanMode || backup.fastingData?.isRamadanMode || false,
      records: mergedFastingRecords,
      currentFastingStreak: Math.max(currentFasting.currentFastingStreak || 0, backup.fastingData?.currentFastingStreak || 0)
    };

    // 5. Dhikr Goals: merge goals (keep unique IDs, merge todayCount if match)
    const currentGoals = (dhikrGoals as any) || [];
    const backupGoals = backup.dhikrGoals || [];
    const mergedGoals = [...currentGoals];
    backupGoals.forEach((bg: any) => {
      const exists = mergedGoals.find((g: any) => g.id === bg.id);
      if (!exists) {
        mergedGoals.push(bg);
      }
    });

    // 6. Dua Favorites: union
    const mergedDuas = Array.from(new Set([...((duaFavorites as any) || []), ...(backup.duaFavorites || [])]));

    // Write merged keys
    await Promise.all([
      storage.set("noortab-user-settings", mergedSettings),
      storage.set("prayerStreak", mergedStreak),
      storage.set("fastingData", mergedFasting),
      storage.set("quranBookmark", mergedBookmark),
      storage.set("dhikrGoals", mergedGoals),
      storage.set("duaFavorites", mergedDuas),
      storage.set("adhkarProgress", (adhkarProgress as any) || backup.adhkarProgress || {}),
      storage.set("quizRecord", (quizRecord as any) || backup.quizRecord || {}),
      storage.set("widgetLayout", (widgetLayout as any) || backup.widgetLayout || [])
    ]);
  }
}

/**
 * Parses File to JSON.
 */
export function parseBackupFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target?.result as string));
      } catch {
        reject(new Error("Could not parse file. Make sure it is a valid JSON backup."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
}

/**
 * Extracts and returns a preview summary of the backup metadata.
 */
export function getBackupSummary(backup: NoorTabBackup): {
  exportDate: string;
  city: string;
  daysOfHistory: number;
  currentStreak: number;
  hasSettings: boolean;
  hasQuranBookmark: boolean;
} {
  const days = Object.keys(backup.prayerStreak?.records || {}).length;
  return {
    exportDate: new Date(backup.exportedAt).toLocaleDateString(),
    city: backup.settings?.cityName || "Unknown",
    daysOfHistory: days,
    currentStreak: backup.prayerStreak?.currentStreak || 0,
    hasSettings: !!backup.settings,
    hasQuranBookmark: !!backup.quranBookmark
  };
}
