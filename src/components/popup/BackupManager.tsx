import React, { useState, useRef } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { Download, Upload, FileText, CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import type { NoorTabBackup, PrayerStreakData } from "~types";
import {
  exportBackup,
  exportPrayerLogPDF,
  exportAnalyticsPDF,
  validateBackup,
  importBackup,
  parseBackupFile,
  getBackupSummary,
} from "~utils/backupManager";
import { cn } from "~utils/cn";
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "~utils/dateUtils";

type ImportMode = "replace" | "merge";
type Status = { type: "success" | "error"; message: string } | null;

export default function BackupManager() {
  const [prayerStreak] = useStorage<PrayerStreakData>("prayerStreak", {
    records: {},
    currentStreak: 0,
    longestStreak: 0,
    totalOnTime: 0,
    totalLate: 0,
    totalMissed: 0,
  });

  // Export states
  const [exportStatus, setExportStatus] = useState<Status>(null);
  const [isExporting, setIsExporting] = useState(false);

  // PDF export states
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), "yyyy-MM"));
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<Status>(null);

  // Import states
  const [validatedBackup, setValidatedBackup] = useState<NoorTabBackup | null>(null);
  const [importValidationError, setImportValidationError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>("merge");
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<Status>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate month options: "All" + all months with historical data
  const availableMonths = new Set<string>();
  Object.keys(prayerStreak.records || {}).forEach((dateStr) => {
    availableMonths.add(dateStr.substring(0, 7)); // YYYY-MM
  });

  // Add current month
  availableMonths.add(format(new Date(), "yyyy-MM"));

  // Convert to sorted array (newest first)
  const sortedMonths = Array.from(availableMonths).sort().reverse();

  const monthOptions = [
    { value: "all", label: "All Months" },
    ...sortedMonths.map((monthKey) => ({
      value: monthKey,
      label: new Date(monthKey + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }))
  ];

  const handleExportJSON = async () => {
    setIsExporting(true);
    setExportStatus(null);
    try {
      await exportBackup();
      setExportStatus({ type: "success", message: "Backup downloaded successfully." });
    } catch (e: any) {
      setExportStatus({ type: "error", message: e.message || "Export failed." });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsPdfExporting(true);
    setPdfStatus(null);
    try {
      let records: any[] = [];
      let label = "";

      if (selectedMonth === "all") {
        // Export all historical records
        const sortedDates = Object.keys(prayerStreak.records || {}).sort();
        records = sortedDates.map((dateStr) => ({
          date: dateStr,
          ...(prayerStreak.records[dateStr] || {
            fajr: null,
            dhuhr: null,
            asr: null,
            maghrib: null,
            isha: null,
          })
        }));
        label = "All Months";
      } else {
        // Export specific month
        const [year, month] = selectedMonth.split("-").map(Number);
        const monthStart = startOfMonth(new Date(year, month - 1));
        const monthEnd = endOfMonth(monthStart);
        const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

        records = allDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          return {
            date: dateStr,
            ...(prayerStreak.records[dateStr] || {
              fajr: null,
              dhuhr: null,
              asr: null,
              maghrib: null,
              isha: null,
            })
          };
        });

        label = format(monthStart, "MMMM yyyy");
      }

      await exportPrayerLogPDF(records, label, "");
      setPdfStatus({ type: "success", message: `PDF downloaded: ${label}` });
    } catch (e: any) {
      setPdfStatus({ type: "error", message: e.message || "PDF export failed." });
    } finally {
      setIsPdfExporting(false);
    }
  };

  const handleExportAnalytics = async () => {
    setIsPdfExporting(true);
    setPdfStatus(null);
    try {
      await exportAnalyticsPDF(prayerStreak);
      setPdfStatus({ type: "success", message: "Analytics PDF downloaded successfully." });
    } catch (e: any) {
      setPdfStatus({ type: "error", message: e.message || "PDF export failed." });
    } finally {
      setIsPdfExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportValidationError(null);
    setValidatedBackup(null);
    setImportStatus(null);
    try {
      const parsed = await parseBackupFile(file);
      const result = validateBackup(parsed);
      if (!result.valid || !result.backup) {
        setImportValidationError(result.error || "Invalid backup.");
      } else {
        setValidatedBackup(result.backup);
      }
    } catch (e: any) {
      setImportValidationError(e.message || "Could not read file.");
    }
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImport = async () => {
    if (!validatedBackup) return;
    setIsImporting(true);
    setImportStatus(null);
    try {
      await importBackup(validatedBackup, importMode);
      setImportStatus({ type: "success", message: `Data ${importMode === "replace" ? "replaced" : "merged"} successfully. Reload to see changes.` });
      setValidatedBackup(null);
    } catch (e: any) {
      setImportStatus({ type: "error", message: e.message || "Import failed." });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 block">
        Backup & Restore
      </span>

      {/* Export JSON */}
      <div className="rounded-xl border border-stone-200/60 dark:border-stone-800/60 p-3 space-y-2 bg-stone-50/50 dark:bg-stone-900/30">
        <p className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
          Export full data backup as JSON
        </p>
        <button
          type="button"
          onClick={handleExportJSON}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-60 transition-colors"
        >
          {isExporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          Export JSON Backup
        </button>
        {exportStatus && (
          <StatusMessage status={exportStatus} />
        )}
      </div>

      {/* Export PDF Monthly Log */}
      <div className="rounded-xl border border-stone-200/60 dark:border-stone-800/60 p-3 space-y-2 bg-stone-50/50 dark:bg-stone-900/30">
        <p className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
          Export monthly prayer log as PDF
        </p>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isPdfExporting}
            className="flex items-center gap-1.5 rounded-lg bg-stone-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-stone-600 disabled:opacity-60 transition-colors"
          >
            {isPdfExporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileText className="h-3.5 w-3.5" />
            )}
            PDF
          </button>
        </div>
        {pdfStatus && <StatusMessage status={pdfStatus} />}
      </div>

      {/* Export PDF Analytics */}
      <div className="rounded-xl border border-stone-200/60 dark:border-stone-800/60 p-3 space-y-2 bg-stone-50/50 dark:bg-stone-900/30">
        <p className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
          Export all-time prayer analytics as PDF
        </p>
        <button
          type="button"
          onClick={handleExportAnalytics}
          disabled={isPdfExporting}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-60 transition-colors"
        >
          {isPdfExporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <FileText className="h-3.5 w-3.5" />
          )}
          Export Analytics PDF
        </button>
      </div>

      {/* Import */}
      <div className="rounded-xl border border-stone-200/60 dark:border-stone-800/60 p-3 space-y-3 bg-stone-50/50 dark:bg-stone-900/30">
        <p className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
          Import from a backup file
        </p>

        <label className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-stone-300 dark:border-stone-700 p-3 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-700 transition-colors text-center">
          <Upload className="h-5 w-5 text-stone-400" />
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            Click to select a .json backup file
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>

        {importValidationError && (
          <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {importValidationError}
          </p>
        )}

        {validatedBackup && (() => {
          const summary = getBackupSummary(validatedBackup);
          return (
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 space-y-2">
              <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                ✓ Valid Backup Found
              </p>
              <div className="text-[10px] text-stone-600 dark:text-stone-400 space-y-0.5">
                <p>Exported: {summary.exportDate}</p>
                <p>Location: {summary.city}</p>
                <p>Days of prayer history: {summary.daysOfHistory}</p>
                <p>Current streak in backup: {summary.currentStreak} days</p>
              </div>

              {/* Import mode toggle */}
              <div className="flex gap-2 pt-1">
                {(["merge", "replace"] as ImportMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setImportMode(mode)}
                    className={cn(
                      "flex-1 py-1 rounded-lg text-[10px] font-bold border transition-colors",
                      importMode === mode
                        ? "bg-emerald-700 text-white border-emerald-800"
                        : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700"
                    )}
                  >
                    {mode === "merge" ? "Merge" : "Replace All"}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-stone-400 dark:text-stone-500 leading-relaxed">
                {importMode === "merge"
                  ? "Merges prayer history, keeps your current settings."
                  : "⚠️ Replaces ALL local data with the backup. Cannot be undone."}
              </p>

              <button
                type="button"
                onClick={handleImport}
                disabled={isImporting}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-60 transition-colors"
              >
                {isImporting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {importMode === "merge" ? "Merge Data" : "Replace & Restore"}
              </button>
            </div>
          );
        })()}

        {importStatus && <StatusMessage status={importStatus} />}
      </div>
    </div>
  );
}

function StatusMessage({ status }: { status: { type: "success" | "error"; message: string } }) {
  return (
    <p
      className={cn(
        "text-[10px] font-semibold flex items-center gap-1",
        status.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
      )}
    >
      {status.type === "success" ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5" />
      )}
      {status.message}
    </p>
  );
}
