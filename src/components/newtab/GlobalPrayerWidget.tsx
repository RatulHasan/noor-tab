import React, { useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { calculatePrayerTimes } from "~utils/prayerCalculator";
import { POPULAR_LOCATIONS } from "~data/popularLocations";
import { format } from "~utils/dateUtils";
import { Globe, Settings2, Check, Plus, X } from "lucide-react";
import { cn } from "~utils/cn";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";

export default function GlobalPrayerWidget() {
  const [worldCities, setWorldCities] = useStorage<string[]>("worldCities", ["Istanbul", "London", "New York"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings] = useSettings();

  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  // Coordinates
  const MAKKAH = { name: "Makkah", lat: 21.3891, lng: 39.8579 };
  const MADINAH = { name: "Madinah", lat: 24.5247, lng: 39.5692 };

  // Flatten cities from popular locations
  const allCities = POPULAR_LOCATIONS.reduce((acc, country) => {
    const citiesWithCountry = country.cities.map((city) => ({
      ...city,
      country: country.countryName
    }));
    return [...acc, ...citiesWithCountry];
  }, [] as Array<{ name: string; lat: number; lng: number; country: string }>);

  // Exclude Makkah and Madinah from the selectable list as they are default
  const selectableCities = allCities.filter(
    (c) => c.name !== "Makkah" && c.name !== "Madinah"
  );

  const filteredCities = selectableCities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleCity = (cityName: string) => {
    const list = worldCities || [];
    if (list.includes(cityName)) {
      setWorldCities(list.filter((name) => name !== cityName));
    } else {
      if (list.length >= 3) {
        // Automatically cycle: remove the oldest city and add the new one
        setWorldCities([...list.slice(1), cityName]);
      } else {
        setWorldCities([...list, cityName]);
      }
    }
  };

  // Compile full list of cities to display
  const citiesToDisplay = [
    MAKKAH,
    MADINAH,
    ...(worldCities || []).map((cityName) => {
      const found = selectableCities.find((c) => c.name === cityName);
      return found || { name: cityName, lat: 0, lng: 0 };
    }).filter((c) => c.lat !== 0)
  ];

  const formatTime = (time: Date) => {
    try {
      return format(time, "hh:mm a");
    } catch {
      return "--:--";
    }
  };

  const currentCitiesLength = (worldCities || []).length;

  return (
    <div className="rounded-xl shadow-sm bg-white dark:bg-stone-900 p-4 border border-stone-200/50 dark:border-stone-800/60 flex flex-col space-y-4 font-sans select-none">
      <div className="flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-500" />
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            {t("globalPrayerTimes")}
          </p>
        </div>

        {/* Settings gear toggle */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-1.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors flex items-center gap-1 text-[10px] font-bold"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{t("manageCities")} ({currentCitiesLength}/3)</span>
          </button>

          {/* Select Cities Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 z-[9999] w-64 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-xl p-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  {t("selectCustomCities")}
                </span>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                placeholder={t("searchCities")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 px-3 py-2 outline-none focus:border-emerald-500 transition-colors"
              />

              <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                {filteredCities.length === 0 ? (
                  <span className="text-[10px] text-stone-400 italic block text-center py-2">
                    {t("noCitiesFound")}
                  </span>
                ) : (
                  filteredCities.map((city) => {
                    const list = worldCities || [];
                    const isSelected = list.includes(city.name);
                    return (
                      <button
                        key={city.name}
                        onClick={() => handleToggleCity(city.name)}
                        className={cn(
                          "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                          isSelected
                            ? "bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/50"
                            : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        )}
                      >
                        <div>
                          <span>{city.name}</span>
                          <span className="text-[9px] text-stone-400 dark:text-stone-500 font-normal block">
                            {city.country}
                          </span>
                        </div>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        ) : (
                          list.length < 3 ? (
                            <Plus className="w-3.5 h-3.5 text-stone-400 hover:text-stone-600 dark:text-stone-550 dark:hover:text-stone-300" />
                          ) : (
                            <span className="text-[8px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Replace</span>
                          )
                        )}
                      </button>
                    );
                  })
                )}
              </div>
              {currentCitiesLength >= 3 && (
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[9px] text-stone-400 dark:text-stone-500 text-center italic">
                  3/3 custom cities chosen. Selecting a new one replaces the oldest.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid Table display */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 font-bold uppercase tracking-wider">
              <th className="py-2.5 font-bold">{t("cityLabel")}</th>
              <th className="py-2.5 text-center font-bold">{t("fajr")}</th>
              <th className="py-2.5 text-center font-bold">{t("dhuhr")}</th>
              <th className="py-2.5 text-center font-bold">{t("asr")}</th>
              <th className="py-2.5 text-center font-bold">{t("maghrib")}</th>
              <th className="py-2.5 text-center font-bold">{t("isha")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100/50 dark:divide-stone-800/40">
            {citiesToDisplay.map((city) => {
              const times = calculatePrayerTimes(city.lat, city.lng, "ummAlQura", "standard");
              return (
                <tr key={city.name} className="hover:bg-stone-50/20 dark:hover:bg-stone-900/20">
                  <td className="py-3 font-bold text-stone-850 dark:text-stone-100">
                    {city.name}
                  </td>
                  <td className="py-3 text-center text-stone-600 dark:text-stone-300 font-medium">
                    {formatTime(times.fajr)}
                  </td>
                  <td className="py-3 text-center text-stone-600 dark:text-stone-300 font-medium">
                    {formatTime(times.dhuhr)}
                  </td>
                  <td className="py-3 text-center text-stone-600 dark:text-stone-300 font-medium">
                    {formatTime(times.asr)}
                  </td>
                  <td className="py-3 text-center text-stone-600 dark:text-stone-300 font-medium font-bold text-emerald-700 dark:text-emerald-400">
                    {formatTime(times.maghrib)}
                  </td>
                  <td className="py-3 text-center text-stone-600 dark:text-stone-300 font-medium">
                    {formatTime(times.isha)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
