import React, { useState, useEffect } from "react";
import { AYAHS } from "~data/ayahs";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";

export function HeroSection() {
  const [settings] = useSettings();
  const [time, setTime] = useState(new Date());

  const lang = settings?.language || "en";
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const ayah = React.useMemo(() => {
    const today = new Date();
    const dateSeed = today.getDate() + today.getMonth() * 31 + today.getFullYear();
    const index = dateSeed % AYAHS.length;
    return AYAHS[index];
  }, []);

  return (
    <section className="py-10 px-4 text-center space-y-8 select-none">
      <div className="space-y-2">
        <h1 className="font-amiri text-5xl font-black tracking-wide text-emerald-800 dark:text-emerald-400 select-text leading-tight">
          {t("assalamuAlaikum")}
        </h1>
        <div className="font-mono text-6xl font-black tracking-widest text-stone-800 dark:text-stone-100 drop-shadow-sm select-text tabular-nums">
          {formattedTime}
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">
          {t("peaceBeUponYou")}
        </p>
      </div>

      <div className="space-y-6 pt-4">
        <p className="font-amiri text-4xl md:text-5xl leading-relaxed text-stone-800 dark:text-stone-100 select-text" dir="rtl">
          {ayah.text}
        </p>
        <div className="space-y-2">
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed italic">
            "{ayah.translation}"
          </p>
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-widest opacity-60">
            {ayah.reference}
          </p>
        </div>
      </div>
    </section>
  );
}
