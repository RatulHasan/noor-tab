import React, { useState, useRef, useEffect } from "react";
import type { UserSettings, CalculationMethodKey, MadhabKey, NotificationStyle, PrayerName, AppLanguage } from "../../types";
import { detectLocation, geocodeLocation } from "../../utils/locationService";
import { getTranslation } from "../../data/translations";
import { POPULAR_LOCATIONS } from "../../data/popularLocations";
import { MapPin, Loader2, Save, Trash2, Search, Play, Pause, Volume2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { ADHAN_AUDIO_OPTIONS } from "../../data/adhanAudios";

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

const LANGUAGES: { key: AppLanguage; label: string }[] = [
  { key: "en", label: "English" },
  { key: "bn", label: "বাংলা (Bangla)" },
  { key: "ar", label: "العربية (Arabic)" },
  { key: "hi", label: "हिन्दी (Hindi)" },
  { key: "ur", label: "اردو (Urdu)" },
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
  const [language, setLanguage] = useState<AppLanguage>(settings.language || "en");
  const [adhanAudio, setAdhanAudio] = useState(settings.adhanAudio || "none");
  const [overlayPosition, setOverlayPosition] = useState(settings.overlayPosition || "bottom");
  const [enableAutoRamadan, setEnableAutoRamadan] = useState(settings.enableAutoRamadan ?? true);
  const [trackSunnahFasts, setTrackSunnahFasts] = useState(settings.trackSunnahFasts ?? true);
  const [showFastingCountdown, setShowFastingCountdown] = useState(settings.showFastingCountdown ?? true);
  const [remindMorningAdhkar, setRemindMorningAdhkar] = useState(settings.remindMorningAdhkar ?? true);
  const [remindEveningAdhkar, setRemindEveningAdhkar] = useState(settings.remindEveningAdhkar ?? true);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTogglePlayPreview = (audioKey: string) => {
    if (audioKey === "none") return;
    const option = ADHAN_AUDIO_OPTIONS.find((opt) => opt.key === audioKey);
    if (!option || !option.url) return;

    if (isPlayingPreview && audioRef.current && audioRef.current.src === option.url) {
      audioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(option.url);
      audioRef.current = audio;
      setIsPlayingPreview(true);

      audio.play().catch((err) => {
        console.error("Audio playback blocked or failed:", err);
        setIsPlayingPreview(false);
      });

      audio.onended = () => {
        setIsPlayingPreview(false);
      };
    }
  };

  const handleAdhanChange = (audioKey: string) => {
    setAdhanAudio(audioKey);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingPreview(false);
    }
  };

  // Country & City Dropdown states
  const initialCountry = settings.coordinates ? POPULAR_LOCATIONS.find(c =>
    c.cities.some(city => 
      Math.abs(city.lat - (settings.coordinates?.lat || 0)) < 0.01 && 
      Math.abs(city.lng - (settings.coordinates?.lng || 0)) < 0.01
    )
  ) : null;
  
  const initialCity = initialCountry && settings.coordinates ? initialCountry.cities.find(city => 
    Math.abs(city.lat - (settings.coordinates?.lat || 0)) < 0.01 && 
    Math.abs(city.lng - (settings.coordinates?.lng || 0)) < 0.01
  ) : null;

  const [selectedCountryName, setSelectedCountryName] = useState(initialCountry?.countryName || "");
  const [selectedCityName, setSelectedCityName] = useState(initialCity?.name || "");

  // Geocoding manual search states
  const [searchCity, setSearchCity] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

  // Status states
  const [isDetecting, setIsDetecting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [locError, setLocError] = useState("");

  const isDevMode = process.env.PLASMO_PUBLIC_DEV_MODE === "true";

  const handleTestNotification = (type: "overlay" | "newtab" | "alarm") => {
    if (type === "overlay") {
      if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab && activeTab.id) {
            chrome.tabs.sendMessage(
              activeTab.id,
              {
                type: "SHOW_PRAYER_OVERLAY",
                prayer: "fajr",
                minutes: reminderMinutes,
              },
              (response) => {
                if (chrome.runtime.lastError || !response?.received) {
                    alert(
                      "Notice: The Overlay Reminder cannot be displayed on browser settings, blank tabs (about:blank), or standard chrome:// pages because extensions are restricted there. Please open a normal webpage (e.g., https://google.com or https://github.com), make sure it is fully loaded, and try clicking this button again!"
                    );
                  } else {
                    const positionDesc = overlayPosition === "modal"
                      ? "as a centered modal overlay"
                      : "in the bottom-right corner";
                    alert(`Success! Check your active webpage; you should see the premium prayer reminder ${positionDesc}.`);
                  }
              }
            );
          } else {
            alert("No active web page detected. Please open a standard webpage first.");
          }
        });
      }
    } else if (type === "newtab") {
      if (typeof chrome !== "undefined" && chrome.runtime) {
        const url = chrome.runtime.getURL("newtab.html?reminder=fajr");
        chrome.tabs.create({ url });
      }
    } else if (type === "alarm") {
      if (typeof chrome !== "undefined" && chrome.alarms) {
        chrome.alarms.create("prayer-maghrib", { when: Date.now() + 5000 });
        alert("Mock alarm scheduled! It will fire in 5 seconds and trigger your configured notification style.");
      }
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryVal = e.target.value;
    setSelectedCountryName(countryVal);
    setSelectedCityName(""); // Reset city selection
    
    if (countryVal !== "custom" && countryVal !== "") {
      const country = POPULAR_LOCATIONS.find(c => c.countryName === countryVal);
      // Auto-select the first city if there are cities
      if (country && country.cities.length > 0) {
        const firstCity = country.cities[0];
        setSelectedCityName(firstCity.name);
        setLat(firstCity.lat.toString());
        setLng(firstCity.lng.toString());
        setCityName(firstCity.name);
      }
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityVal = e.target.value;
    setSelectedCityName(cityVal);

    if (cityVal !== "custom" && cityVal !== "") {
      const country = POPULAR_LOCATIONS.find(c => c.countryName === selectedCountryName);
      const city = country?.cities.find(ct => ct.name === cityVal);
      if (city) {
        setLat(city.lat.toString());
        setLng(city.lng.toString());
        setCityName(city.name);
      }
    }
  };

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setLocError("");
    try {
      const loc = await detectLocation();
      setLat(loc.lat.toString());
      setLng(loc.lng.toString());
      setCityName(loc.cityName || "Detected Location");
      setSelectedCountryName("");
      setSelectedCityName("");
    } catch (err: any) {
      console.error(err);
      setLocError(err.message || "Failed to detect location.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleGeocodeSearch = async () => {
    if (!searchCity || !searchCountry) return;
    setIsSearchingGeocode(true);
    setGeocodeError("");
    setLocError("");
    try {
      const result = await geocodeLocation(searchCity, searchCountry);
      if (result) {
        setLat(result.lat.toString());
        setLng(result.lng.toString());
        setCityName(result.cityName);
        setSelectedCountryName("");
        setSelectedCityName("");
      } else {
        setGeocodeError("Location not found. Try correcting spelling or checking connection.");
      }
    } catch (e) {
      console.error(e);
      setGeocodeError("Search failed. Check your internet connection.");
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  const handleResetLocation = async () => {
    setLat("");
    setLng("");
    setCityName("");
    setSelectedCountryName("");
    setSelectedCityName("");
    setSearchCity("");
    setSearchCountry("");
    setLocError("");
    setGeocodeError("");

    await onSave({
      coordinates: null,
      cityName: null,
    });
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
        language,
        adhanAudio,
        overlayPosition,
        enableAutoRamadan,
        trackSunnahFasts,
        showFastingCountdown,
        remindMorningAdhkar,
        remindEveningAdhkar,
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  };

  // Label translations helper
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const selectedCountryObj = POPULAR_LOCATIONS.find(c => c.countryName === selectedCountryName);

  return (
    <div className="space-y-5 pb-6">
    <form onSubmit={handleSave} className="space-y-5">
      {/* 1. Location Settings */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            {t("location")}
          </label>
          {(lat || lng) && (
            <button
              type="button"
              onClick={handleResetLocation}
              className="text-[10px] text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-bold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Reset Location
            </button>
          )}
        </div>
        
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
            {t("autoDetect")}
          </button>
        </div>

        {locError && <p className="text-[10px] font-medium text-rose-500 leading-normal">{locError}</p>}

        {/* Country and City dropdown select fields */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              {t("country")}
            </label>
            <select
              value={selectedCountryName}
              onChange={handleCountryChange}
              className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
            >
              <option value="">Select Country...</option>
              {POPULAR_LOCATIONS.map((c) => (
                <option key={c.countryName} value={c.countryName}>
                  {c.countryName}
                </option>
              ))}
              <option value="custom">Other (Custom Search)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              {t("city")}
            </label>
            <select
              value={selectedCityName}
              onChange={handleCityChange}
              disabled={!selectedCountryName || selectedCountryName === "custom"}
              className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 disabled:opacity-50"
            >
              <option value="">Select City...</option>
              {selectedCountryObj?.cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
              {selectedCountryName && selectedCountryName !== "custom" && (
                <option value="custom">Other (Custom Search)</option>
              )}
            </select>
          </div>
        </div>

        {/* Manual Geocoding Form Box (only when custom is selected or if nothing is selected yet) */}
        {(selectedCountryName === "custom" || selectedCityName === "custom") && (
          <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-3 dark:border-stone-800 dark:bg-stone-900/30 space-y-2">
            <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
              {t("searchLocation")}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder={t("city")}
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
              />
              <input
                type="text"
                placeholder={t("country")}
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
              />
            </div>
            <button
              type="button"
              onClick={handleGeocodeSearch}
              disabled={isSearchingGeocode || !searchCity || !searchCountry}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-600/10 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-600/20 disabled:opacity-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
            >
              {isSearchingGeocode ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              {isSearchingGeocode ? t("searching") : t("searchLocation")}
            </button>
            {geocodeError && (
              <p className="text-[9px] text-rose-500 font-medium leading-normal">{geocodeError}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              {t("latitude")}
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
              {t("longitude")}
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
            {t("cityName")}
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
          {t("calcSettings")}
        </label>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              {t("method")}
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
              {t("madhab")}
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
          {t("prayers")}
        </label>
        
        <div>
          <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400">
            <span>{t("timeRemaining")}</span>
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
            {t("calcSettings")}
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
                    : "bg-white text-stone-400 border-stone-200 dark:bg-stone-900/30 dark:text-stone-600 dark:border-stone-800"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Display, System Theme, and Language Preferences */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          {t("preferences")}
        </label>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
              {t("notifications")}
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
              {t("theme")}
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

        <div>
          <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase">
            {t("language")}
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as AppLanguage)}
            className="mt-0.5 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
          >
            {LANGUAGES.map((langOpt) => (
              <option key={langOpt.key} value={langOpt.key}>
                {langOpt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Adhan Sound Alert & Play/Pause preview */}
        <div className="pt-1.5 space-y-1.5 border-t border-stone-100 dark:border-stone-800/60 mt-1">
          <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase block">
            {t("adhanSound")}
          </label>
          <div className="flex items-center gap-2">
            <select
              value={adhanAudio}
              onChange={(e) => handleAdhanChange(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
            >
              {ADHAN_AUDIO_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.name}
                </option>
              ))}
            </select>

            {adhanAudio !== "none" && (
              <button
                type="button"
                onClick={() => handleTogglePlayPreview(adhanAudio)}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all border",
                  isPlayingPreview
                    ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 hover:bg-rose-100"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400 hover:bg-emerald-100"
                )}
                title={isPlayingPreview ? t("stop") : t("preview")}
              >
                {isPlayingPreview ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                )}
              </button>
            )}
          </div>
          {adhanAudio !== "none" && (
            <div className="text-[9px] text-stone-400 dark:text-stone-500 font-medium">
              Reciter: <span className="font-bold text-stone-600 dark:text-stone-300">{ADHAN_AUDIO_OPTIONS.find(o => o.key === adhanAudio)?.reciter}</span>
            </div>
          )}
        </div>

        {/* Overlay Position Settings */}
        <div className="pt-1.5 space-y-1.5 border-t border-stone-100 dark:border-stone-800/60 mt-1">
          <label className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold uppercase block">
            {t("overlayPosition")}
          </label>
          <select
            value={overlayPosition}
            onChange={(e) => setOverlayPosition(e.target.value as "bottom" | "modal")}
            className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
          >
            <option value="bottom">{t("overlayPositionBottom")}</option>
            <option value="modal">{t("overlayPositionModal")}</option>
          </select>
        </div>
      </div>

      {/* 5. Islamic Features */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Islamic Features
        </label>
        
        <div className="space-y-3 rounded-xl border border-stone-200 dark:border-stone-800 p-3 bg-stone-50/50 dark:bg-stone-900/20">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                Ramadan Auto-Mode
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">
                Automatic suhoor/iftar countdowns
              </span>
            </div>
            <input
              type="checkbox"
              checked={enableAutoRamadan}
              onChange={(e) => setEnableAutoRamadan(e.target.checked)}
              className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-500 h-4 w-4 accent-emerald-700"
            />
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-2.5">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                Track Sunnah Fasts
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">
                Monday/Thursday, Ayyam al-Bidh logs
              </span>
            </div>
            <input
              type="checkbox"
              checked={trackSunnahFasts}
              onChange={(e) => setTrackSunnahFasts(e.target.checked)}
              className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-500 h-4 w-4 accent-emerald-700"
            />
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-2.5">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                Morning Adhkar Reminders
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">
                Show reminder notification after Fajr
              </span>
            </div>
            <input
              type="checkbox"
              checked={remindMorningAdhkar}
              onChange={(e) => setRemindMorningAdhkar(e.target.checked)}
              className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-500 h-4 w-4 accent-emerald-700"
            />
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-2.5">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                Evening Adhkar Reminders
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">
                Show reminder notification after Asr
              </span>
            </div>
            <input
              type="checkbox"
              checked={remindEveningAdhkar}
              onChange={(e) => setRemindEveningAdhkar(e.target.checked)}
              className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-500 h-4 w-4 accent-emerald-700"
            />
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
          {saveStatus === "success" && t("settingsSaved")}
          {saveStatus === "error" && t("errorSaving")}
          {saveStatus === "idle" && (
            <>
              <Save className="h-4 w-4" />
              {t("saveSettings")}
            </>
          )}
        </button>
      </div>
    </form>

      {/* Developer Testing Tools */}
      {isDevMode && (
        <div className="space-y-2.5 pt-4 mt-4 border-t border-stone-200 dark:border-stone-800 text-left">
          <h3 className="text-xs font-black uppercase tracking-wider text-rose-500">
            Developer Testing Tools
          </h3>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-normal">
            Trigger simulated reminders instantly to test all notifications without waiting for real prayer times.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTestNotification("overlay")}
              className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-[10px] font-bold rounded-lg transition-colors"
            >
              Test Overlay (Fajr)
            </button>
            <button
              type="button"
              onClick={() => handleTestNotification("newtab")}
              className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-[10px] font-bold rounded-lg transition-colors"
            >
              Test New Tab (Fajr)
            </button>
            <button
              type="button"
              onClick={() => handleTestNotification("alarm")}
              className="col-span-2 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg transition-colors"
            >
              Trigger Background Alarm in 5s (Maghrib)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

