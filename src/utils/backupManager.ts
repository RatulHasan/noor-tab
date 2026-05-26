import type { NoorTabBackup, DayPrayerRecord, UserSettings, FocusMode, ZakatCalculation, PrayerStreakData } from "../types";
import { SUPPORTED_BACKUP_VERSIONS } from "../types";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Storage } from "@plasmohq/storage";

/**
 * Batch write multiple keys to storage to avoid quota errors.
 * Chrome storage has a MAX_WRITE_OPERATIONS_PER_HOUR quota, so batching is essential.
 * We write keys sequentially with a small delay to avoid hitting quota limits.
 */
async function batchStorageWrite(
  storage: Storage,
  items: Record<string, any>
): Promise<void> {
  const entries = Object.entries(items);
  console.log("[NoorTab] batchStorageWrite: Writing", entries.length, "keys");

  // Write keys sequentially with a small delay between each
  // This prevents hitting the MAX_WRITE_OPERATIONS_PER_HOUR quota
  for (const [key, value] of entries) {
    console.log("[NoorTab] Writing key:", key);
    await storage.set(key, value);
    // Small delay to avoid quota issues (100ms between writes)
    if (entries[entries.length - 1][0] !== key) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log("[NoorTab] batchStorageWrite: Successfully wrote all keys");
}

// Helper to gather all data from Storage
async function gatherAllData(): Promise<NoorTabBackup> {
  const storage = new Storage();

  const [settings, prayerStreak, fastingData, quranBookmark, dhikrGoals, adhkarProgress, duaFavorites, quizRecord, widgetLayout, layoutState, focusMode, zakatHistory, quizQuestionOffset] = await Promise.all([
    storage.get("noortab-user-settings"),
    storage.get("prayerStreak"),
    storage.get("fastingData"),
    storage.get("quranBookmark"),
    storage.get("dhikrGoals"),
    storage.get("adhkarProgress"),
    storage.get("duaFavorites"),
    storage.get("quizRecord"),
    storage.get("widgetLayout"),
    storage.get("noorTabLayoutState"),
    storage.get("focusMode"),
    storage.get("zakat_history"),
    storage.get("quizQuestionOffset"),
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
    widgetLayout: (widgetLayout || []) as any,
    layoutState: (layoutState || null) as any,
    focusMode: (focusMode || { enabled: false, snoozedUntil: null, snoozeDuration: 60 }) as FocusMode,
    zakatHistory: (zakatHistory || []) as ZakatCalculation[],
    quizQuestionOffset: (quizQuestionOffset || 0) as number
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
  monthLabel: string
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
  doc.text(`Reporting Month: ${monthLabel}`, 14, 32);

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
 * Generates and downloads a comprehensive analytics PDF with all-time statistics
 * and multi-page prayer history records.
 */
export async function exportAnalyticsPDF(
  streakData: PrayerStreakData
): Promise<void> {
  const doc = new jsPDF();
  let pageNum = 1;

  // Helper to add page footer
  const addFooter = (pageNo: number, totalPages: number) => {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `NoorTab Prayer Analytics - Page ${pageNo} of ${totalPages}`,
      105,
      pageHeight - 10,
      { align: "center" }
    );
  };

  // Helper to add new page
  const addNewPage = () => {
    doc.addPage();
    pageNum++;
  };

  // ── PAGE 1: Overview Statistics Dashboard ────────────────────────────────

  // Header
  doc.setFillColor(4, 120, 87); // Emerald-700
  doc.rect(0, 0, 210, 45, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(24);
  doc.text("NoorTab - Prayer Analytics", 14, 22);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38);

  // ── Statistics Cards Grid ─────────────────────────────────────────────────
  let yPos = 60;
  const cardWidth = 88;
  const cardHeight = 32;
  const gap = 8;

  // Card 1: Current Streak
  doc.setFillColor(251, 146, 60); // Orange-500
  doc.roundedRect(14, yPos, cardWidth, cardHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.text("CURRENT STREAK", 20, yPos + 10);
  doc.setFontSize(20);
  doc.setFont("Helvetica", "bold");
  doc.text(`${streakData.currentStreak} Days`, 20, yPos + 24);

  // Card 2: Longest Streak
  doc.setFillColor(245, 158, 11); // Amber-500
  doc.roundedRect(14 + cardWidth + gap, yPos, cardWidth, cardHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.text("LONGEST STREAK", 20 + cardWidth + gap, yPos + 10);
  doc.setFontSize(20);
  doc.setFont("Helvetica", "bold");
  doc.text(`${streakData.longestStreak} Days`, 20 + cardWidth + gap, yPos + 24);

  yPos += cardHeight + gap;

  // Card 3: Total Prayers Logged
  const totalPrayers = (streakData.totalOnTime || 0) + (streakData.totalLate || 0) + (streakData.totalMissed || 0);
  doc.setFillColor(16, 185, 129); // Emerald-500
  doc.roundedRect(14, yPos, cardWidth, cardHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.text("TOTAL PRAYERS LOGGED", 20, yPos + 10);
  doc.setFontSize(20);
  doc.setFont("Helvetica", "bold");
  doc.text(`${totalPrayers}`, 20, yPos + 24);

  // Card 4: Compliance Rate
  const complianceRate = totalPrayers > 0
    ? Math.round(((streakData.totalOnTime || 0) + (streakData.totalLate || 0)) / totalPrayers * 100)
    : 0;
  doc.setFillColor(5, 150, 105); // Emerald-600
  doc.roundedRect(14 + cardWidth + gap, yPos, cardWidth, cardHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.text("COMPLIANCE RATE", 20 + cardWidth + gap, yPos + 10);
  doc.setFontSize(20);
  doc.setFont("Helvetica", "bold");
  doc.text(`${complianceRate}%`, 20 + cardWidth + gap, yPos + 24);

  yPos += cardHeight + 15;

  // ── Breakdown Chart ───────────────────────────────────────────────────────
  doc.setFillColor(243, 244, 246); // Stone-100
  doc.rect(14, yPos, 182, 50, "F");

  doc.setTextColor(71, 85, 105); // Slate-700
  doc.setFontSize(12);
  doc.setFont("Helvetica", "bold");
  doc.text("Prayer Status Breakdown", 20, yPos + 10);

  const barWidth = 50;
  const barHeight = 12;
  const barStartY = yPos + 20;
  const maxBarWidth = 70;

  // On Time Bar
  const onTimePercent = totalPrayers > 0 ? (streakData.totalOnTime || 0) / totalPrayers : 0;
  const onTimeWidth = maxBarWidth * Math.max(onTimePercent, 0.05);
  doc.setFillColor(220, 252, 231); // Emerald-100
  doc.rect(20, barStartY, onTimeWidth, barHeight, "F");
  doc.setFillColor(16, 185, 129); // Emerald-500
  doc.rect(20, barStartY, onTimeWidth, barHeight, "FD");
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.text(`On Time: ${streakData.totalOnTime || 0} (${Math.round(onTimePercent * 100)}%)`, 20, barStartY - 3);

  // Late Bar
  const latePercent = totalPrayers > 0 ? (streakData.totalLate || 0) / totalPrayers : 0;
  const lateWidth = maxBarWidth * Math.max(latePercent, 0.05);
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.rect(20, barStartY + 18, lateWidth, barHeight, "F");
  doc.setFillColor(245, 158, 11); // Amber-500
  doc.rect(20, barStartY + 18, lateWidth, barHeight, "FD");
  doc.setTextColor(71, 85, 105);
  doc.text(`Late: ${streakData.totalLate || 0} (${Math.round(latePercent * 100)}%)`, 20, barStartY + 15);

  // Missed Bar
  const missedPercent = totalPrayers > 0 ? (streakData.totalMissed || 0) / totalPrayers : 0;
  const missedWidth = maxBarWidth * Math.max(missedPercent, 0.05);
  doc.setFillColor(254, 226, 226); // Red-100
  doc.rect(20, barStartY + 36, missedWidth, barHeight, "F");
  doc.setFillColor(239, 68, 68); // Red-500
  doc.rect(20, barStartY + 36, missedWidth, barHeight, "FD");
  doc.setTextColor(71, 85, 105);
  doc.text(`Missed: ${streakData.totalMissed || 0} (${Math.round(missedPercent * 100)}%)`, 20, barStartY + 33);

  // ── Monthly Summary Table (Right Side) ─────────────────────────────────────
  const monthlyData = calculateMonthlyStats(streakData.records);
  const tableX = 110;
  const tableY = yPos + 8;
  const tableRowHeight = 8;

  doc.setFillColor(255, 255, 255);
  doc.rect(tableX, yPos, 82, 50, "F");

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
  doc.setFont("Helvetica", "bold");
  doc.text("Monthly Summary", tableX + 5, tableY);

  doc.setFontSize(8);
  doc.setFont("Helvetica", "normal");
  let tableRowY = tableY + 10;
  monthlyData.slice(0, 5).forEach((month) => {
    doc.text(`${month.month}`, tableX + 5, tableRowY);
    doc.text(`${month.onTime}/${month.total}`, tableX + 70, tableRowY, { align: "right" });
    tableRowY += tableRowHeight;
  });

  addFooter(pageNum, 3); // We'll have at least 3 pages (overview + records + details)

  // ── PAGE 2: Detailed Prayer Records Table ──────────────────────────────────
  if (Object.keys(streakData.records).length > 0) {
    addNewPage();

    doc.setFillColor(4, 120, 87);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Prayer History Records", 14, 18);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total Days: ${Object.keys(streakData.records).length}`, 14, 28);

    // Sort records by date (newest first)
    const sortedDates = Object.keys(streakData.records).sort().reverse();
    const allRecords = sortedDates.map((date) => ({
      date,
      ...streakData.records[date]
    }));

    // Build table data
    const columns = [
      { title: "Date", dataKey: "date" },
      { title: "Fajr", dataKey: "fajr" },
      { title: "Dhuhr", dataKey: "dhuhr" },
      { title: "Asr", dataKey: "asr" },
      { title: "Maghrib", dataKey: "maghrib" },
      { title: "Isha", dataKey: "isha" },
      { title: "Score", dataKey: "score" }
    ];

    const rows = allRecords.map((rec) => {
      let score = 0;
      const formatStatus = (status: string | null) => {
        if (status === "on_time") { score++; return "✓"; }
        if (status === "late") { score++; return "L"; }
        if (status === "missed") return "✗";
        return "-";
      };

      return {
        date: rec.date,
        fajr: formatStatus(rec.fajr),
        dhuhr: formatStatus(rec.dhuhr),
        asr: formatStatus(rec.asr),
        maghrib: formatStatus(rec.maghrib),
        isha: formatStatus(rec.isha),
        score: `${score}/5`
      };
    });

    autoTable(doc, {
      columns,
      body: rows,
      startY: 45,
      theme: "striped",
      headStyles: {
        fillColor: [6, 95, 70],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2
      },
      didParseCell: (data) => {
        if (data.section === "head" || data.column.dataKey === "date" || data.column.dataKey === "score") {
          return;
        }
        const val = data.cell.text[0];
        if (val === "✓") {
          data.cell.styles.textColor = [6, 95, 70];
          data.cell.styles.fontStyle = "bold";
        } else if (val === "L") {
          data.cell.styles.textColor = [146, 64, 14];
        } else if (val === "✗") {
          data.cell.styles.textColor = [153, 27, 27];
        }
      },
      pageBreak: "auto"
    });

    addFooter(2, 3);
  }

  // ── PAGE 3: Monthly Comparison Chart ───────────────────────────────────────
  if (monthlyData.length > 0) {
    addNewPage();

    doc.setFillColor(4, 120, 87);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Monthly Performance Analysis", 14, 18);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Comparison of prayer compliance across months", 14, 28);

    // Monthly table
    const monthlyColumns = [
      { title: "Month", dataKey: "month" },
      { title: "Days", dataKey: "days" },
      { title: "On Time", dataKey: "onTime" },
      { title: "Late", dataKey: "late" },
      { title: "Missed", dataKey: "missed" },
      { title: "Rate", dataKey: "rate" }
    ];

    const monthlyRows = monthlyData.map((m) => ({
      month: m.month,
      days: m.days,
      onTime: m.onTime,
      late: m.late,
      missed: m.missed,
      rate: `${m.rate}%`
    }));

    autoTable(doc, {
      columns: monthlyColumns,
      body: monthlyRows,
      startY: 45,
      theme: "striped",
      headStyles: {
        fillColor: [6, 95, 70],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      bodyStyles: {
        fontSize: 9
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.dataKey === "rate") {
          const rateVal = parseInt(data.cell.text[0]);
          if (rateVal >= 80) {
            data.cell.styles.textColor = [6, 95, 70];
            data.cell.styles.fontStyle = "bold";
          } else if (rateVal >= 60) {
            data.cell.styles.textColor = [146, 64, 14];
          } else {
            data.cell.styles.textColor = [153, 27, 27];
          }
        }
      }
    });

    // Add insights box at the bottom
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    const insightsY = Math.max(finalY + 20, 150);

    doc.setFillColor(243, 244, 246);
    doc.roundedRect(14, insightsY, 182, 35, 3, 3, "F");

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(11);
    doc.setFont("Helvetica", "bold");
    doc.text("Key Insights", 20, insightsY + 10);

    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");

    const bestMonth = monthlyData.reduce((best, current) =>
      current.rate > best.rate ? current : best
    , monthlyData[0]);

    const avgRate = Math.round(
      monthlyData.reduce((sum, m) => sum + m.rate, 0) / monthlyData.length
    );

    let insightY = insightsY + 20;
    doc.text(`• Best performing month: ${bestMonth.month} (${bestMonth.rate}% compliance)`, 20, insightY);
    doc.text(`• Average monthly compliance: ${avgRate}%`, 20, insightY + 7);
    doc.text(`• Total days tracked: ${Object.keys(streakData.records).length}`, 20, insightY + 14);

    addFooter(3, 3);
  }

  // Download PDF
  const dateStr = new Date().toISOString().split("T")[0];
  doc.save(`noortab-analytics-${dateStr}.pdf`);
}

/**
 * Helper to calculate monthly statistics from prayer records
 */
function calculateMonthlyStats(records: Record<string, DayPrayerRecord>): Array<{
  month: string;
  days: number;
  onTime: number;
  late: number;
  missed: number;
  total: number;
  rate: number;
}> {
  const monthlyMap: Record<string, {
    onTime: number;
    late: number;
    missed: number;
    days: Set<string>;
  }> = {};

  Object.entries(records).forEach(([date, record]) => {
    const monthKey = date.substring(0, 7); // YYYY-MM
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { onTime: 0, late: 0, missed: 0, days: new Set() };
    }

    const prayers: (keyof Omit<DayPrayerRecord, "date">)[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
    prayers.forEach((p) => {
      const status = record[p];
      if (status === "on_time") monthlyMap[monthKey].onTime++;
      else if (status === "late") monthlyMap[monthKey].late++;
      else if (status === "missed") monthlyMap[monthKey].missed++;
    });

    monthlyMap[monthKey].days.add(date);
  });

  return Object.entries(monthlyMap)
    .map(([month, data]) => {
      const total = data.onTime + data.late + data.missed;
      return {
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        days: data.days.size,
        onTime: data.onTime,
        late: data.late,
        missed: data.missed,
        total,
        rate: total > 0 ? Math.round(((data.onTime + data.late) / total) * 100) : 0
      };
    })
    .sort((a, b) => b.month.localeCompare(a.month)); // Sort by month descending
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
 * Uses batch writes to avoid MAX_WRITE_OPERATIONS_PER_HOUR quota errors.
 */
export async function importBackup(
  backup: NoorTabBackup,
  mode: "replace" | "merge"
): Promise<void> {
  const storage = new Storage();

  if (mode === "replace") {
    // Prepare all backup data with defaults for missing values
    // Note: We overwrite all keys directly instead of clearing storage first
    // This is safer and avoids timing issues
    const allData: Record<string, any> = {
      "noortab-user-settings": backup.settings,
      "prayerStreak": backup.prayerStreak || {
        records: {},
        currentStreak: 0,
        longestStreak: 0,
        totalOnTime: 0,
        totalLate: 0,
        totalMissed: 0
      },
      "fastingData": backup.fastingData || {
        isRamadanMode: false,
        records: {},
        currentFastingStreak: 0
      },
      "quranBookmark": backup.quranBookmark || null,
      "dhikrGoals": backup.dhikrGoals || [],
      "adhkarProgress": backup.adhkarProgress || {
        date: "",
        morning: {},
        evening: {},
        morningCompleted: false,
        eveningCompleted: false
      },
      "duaFavorites": backup.duaFavorites || [],
      "quizRecord": backup.quizRecord || {
        date: "",
        questionId: "",
        answeredCorrectly: false,
        totalCorrect: 0,
        totalAnswered: 0
      },
      "widgetLayout": backup.widgetLayout || [],
      "noorTabLayoutState": backup.layoutState || null,
      "focusMode": backup.focusMode || { enabled: false, snoozedUntil: null, snoozeDuration: 60 },
      "zakat_history": backup.zakatHistory || [],
      "quizQuestionOffset": backup.quizQuestionOffset || 0
    };

    // Write all data in a single operation
    await batchStorageWrite(storage, allData);

    // Verify the settings were actually saved by reading them back
    const savedSettings = await storage.get("noortab-user-settings");
    if (!savedSettings || !savedSettings.coordinates) {
      throw new Error("Import verification failed: Settings were not saved properly. Please try again.");
    }
  } else {
    // ── MERGE MODE ──
    const [settings, prayerStreak, fastingData, quranBookmark, dhikrGoals, adhkarProgress, duaFavorites, quizRecord, widgetLayout, focusMode, zakatHistory, quizQuestionOffset] = await Promise.all([
      storage.get("noortab-user-settings"),
      storage.get("prayerStreak"),
      storage.get("fastingData"),
      storage.get("quranBookmark"),
      storage.get("dhikrGoals"),
      storage.get("adhkarProgress"),
      storage.get("duaFavorites"),
      storage.get("quizRecord"),
      storage.get("widgetLayout"),
      storage.get("focusMode"),
      storage.get("zakat_history"),
      storage.get("quizQuestionOffset"),
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

    // 7. Focus Mode: keep backup focus mode if current is default
    const currentFocus = (focusMode as any) || { enabled: false, snoozedUntil: null, snoozeDuration: 60 };
    const mergedFocusMode = backup.focusMode || currentFocus;

    // 8. Zakat History: keep most recent 10 from both
    const currentZakat = (zakatHistory as any) || [];
    const backupZakat = backup.zakatHistory || [];
    const allZakat = [...currentZakat, ...backupZakat].sort((a: ZakatCalculation, b: ZakatCalculation) =>
      new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    ).slice(0, 10);

    // 9. Quiz Question Offset: keep the maximum (most progress)
    const currentOffset = (quizQuestionOffset as any) || 0;
    const backupOffset = backup.quizQuestionOffset || 0;
    const mergedOffset = Math.max(currentOffset, backupOffset);

    // Batch write all merged data sequentially to avoid quota
    const mergedData: Record<string, any> = {
      "noortab-user-settings": mergedSettings,
      "prayerStreak": mergedStreak,
      "fastingData": mergedFasting,
      "quranBookmark": mergedBookmark,
      "dhikrGoals": mergedGoals,
      "duaFavorites": mergedDuas,
      "adhkarProgress": (adhkarProgress as any) || backup.adhkarProgress || {},
      "quizRecord": (quizRecord as any) || backup.quizRecord || {},
      "widgetLayout": (widgetLayout as any) || backup.widgetLayout || [],
      "focusMode": mergedFocusMode,
      "zakat_history": allZakat,
      "quizQuestionOffset": mergedOffset
    };

    // Write all merged data in a single operation (counts as 1 write)
    await batchStorageWrite(storage, mergedData);
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
