import React, { useState } from "react";
import type { UserSettings, CalculationMethodKey, MadhabKey, NotificationStyle, PrayerName } from "../../types";
import { detectLocation } from "../../utils/locationService";
import { Compass, MapPin, Loader2, Save, Bell } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * @param {Object} props
 * @param {UserSettings} props.settings - Current settings.
 * @param {(newSettings: Partial<UserSettings>) => Promise<void>} props.onSave - Callback when settings are saved.
 */
interface SettingsPanelProps {
  settings: UserSettings;
  onSave: (newSettings: Partial<UserSettings>) => Promise<void>;
}

const CALCULATION_METHODS: { key: CalculationMethodKey; label: string }[] = [
  { key: "muslimWorldLeague", label: "Muslim World League" },
  { key: "egyptian", label: "Egyptian General Authority" },
  { key: "karachi", label: "U.I.S. Karachi" },
  { key: "ummAlQura", label: "Umm al-Qura, Makkah" },
  { key: "dubai", label: "Dubai Authority" },
  { key: "qatar", label: "Qatar Authority" },
  { key: "kuwait", label: "Kuwait Authority" },
  { key: "singapore", label: "MUIS, Singapore" },
  { key: "turkey", label: "Diyanet, Turkey" },
  { key: "tehran", label: "Tehran Geophysics" },
  { key: "northAmerica", label: "ISNA (North America)" },
];

const MADHABS: { key: MadhabKey; label: string }[] = [
  { key: "standard", label: "Standard (Shafi, Maliki, Hanbali)" },
  { key: "hanafi", label: "Hanafi" },
];

const NOTIFICATION_STYLES: { key: NotificationStyle; label: string }[] = [
  { key: "newtab", label: "New Tab Takeover" },
  { key: "overlay", label: "Toast Overlay" },
  { key: "both", label: "Both" },
];

const THEMES: { key: UserSettings["theme"]; label: string }[] = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
];

export default function SettingsPanel({ settings, onSave }: SettingsPanelProps) {
  // Local state for forms
  const [lat, setLat] = useState(settings.coordinates?.lat?.toString() || "");
  const [lng, setLng] = useState(settings.coordinates?.lng?.toString() || "");
  const [cityName, setCityName] = useState(settings.cityName || "");
  const [madhab, setMadhab] = useState<MadhabKey>(settings.madhab);
  const [method, setMethod] = useState<CalculationMethodKey>(settings.method);
  const [notificationStyle, setNotificationStyle] = useState<NotificationStyle>(settings.notificationStyle);
  const [reminderMinutes, setReminderMinutes] = useState(settings.reminderMinutes);
  const [perPrayerReminder, setPerPrayerReminder] = useState<Record<PrayerName, boolean>>(
    settings.perPrayerReminder
  );
  const [theme, setTheme] = useState<UserSettings["theme"]>(settings.theme);

  // Status states
  const [isDetecting, setIsDetecting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [locError, setLocError] = useState("");

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setLocError("");
    try {
      const loc = await detectLocation();
      setLat(loc.lat.toString());
      setLng(loc.lng.toString());
      setCityName(loc.cityName || "Detected Location");
    } catch (err: any) {
      console.error(err);
      setLocError(err.message || "Failed to detect location.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleTogglePrayerReminder = (name: PrayerName) => {
    setPerPrayerReminder((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setSaveStatus("error");
      setLocError("Invalid latitude or longitude.");
      return;
    }

    try {
      await onSave({
        coordinates: { lat: parsedLat, lng: parsedLng },
        cityName: cityName || "Custom Location",
        madhab,
        method,
        notificationStyle,
        reminderMinutes,
        perPrayerReminder,
        theme,
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 pb-6">
      {/* 1. Location Settings */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Location
        </label>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-600/20 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-500/10 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
          >
            {isDetecting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <MapPin className="h-3.5 w-3.5" />
            )}
            Auto-Detect Location
          </button>
        </div>

        {locError && <p className="text-[10px] font-medium text-rose-500">{locError}</p>}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g. 21.42"
              className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 font-mono text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
              required
            />
          </div>
          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="e.g. 39.82"
              className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 font-mono text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
            City Name
          </label>
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="e.g. Makkah"
            className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
          />
        </div>
      </div>

      {/* 2. Calculation Parameters */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Calculation settings
        </label>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as CalculationMethodKey)}
              className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
            >
              {CALCULATION_METHODS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              Madhab
            </label>
            <select
              value={madhab}
              onChange={(e) => setMadhab(e.target.value as MadhabKey)}
              className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
            >
              {MADHABS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Alarm and Reminders */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Reminders
        </label>
        
        <div>
          <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400">
            <span>Global Offset</span>
            <span className="font-semibold">{reminderMinutes} min before</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={reminderMinutes}
            onChange={(e) => setReminderMinutes(parseInt(e.target.value, 10))}
            className="mt-2 w-full accent-emerald-700 cursor-pointer"
          />
        </div>

        {/* Per-Prayer Toggles */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
            Active Prayers
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(["fajr", "dhuhr", "asr", "maghrib", "isha"] as PrayerName[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleTogglePrayerReminder(p)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all duration-200",
                  perPrayerReminder[p]
                    ? "bg-emerald-50 text-emerald-800 border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/20"
                    : "bg-white text-stone-400 border-stone-200 dark:bg-stone-900 dark:text-stone-600 dark:border-stone-800"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Display & System Theme */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Preferences
        </label>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              Notifications
            </label>
            <select
              value={notificationStyle}
              onChange={(e) => setNotificationStyle(e.target.value as NotificationStyle)}
              className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
            >
              {NOTIFICATION_STYLES.map((n) => (
                <option key={n.key} value={n.key}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as UserSettings["theme"])}
              className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
            >
              {THEMES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Form Submission Action */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={saveStatus === "saving"}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-white shadow-md transition-all duration-200",
            saveStatus === "saving" && "bg-stone-400 cursor-not-allowed",
            saveStatus === "success" && "bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
            saveStatus === "error" && "bg-rose-600",
            saveStatus === "idle" && "bg-emerald-700 hover:bg-emerald-600 hover:shadow-lg"
          )}
        >
          {saveStatus === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
          {saveStatus === "success" && "Settings Saved ✓"}
          {saveStatus === "error" && "Error Saving!"}
          {saveStatus === "idle" && (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
