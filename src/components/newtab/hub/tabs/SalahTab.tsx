import React, { useState } from "react";
import { cn } from "~utils/cn";
import { BookOpen, CheckCircle2, Info, ListChecks, Table as TableIcon } from "lucide-react";
import { useSettings } from "~hooks/useSettings";
import { getTranslation } from "~data/translations";
import { masnunDuas } from "~data/masnun";

export default function SalahTab() {
  const [activeSubTab, setActiveSubTab] = useState("howTo");
  const [settings] = useSettings();
  const lang = settings?.language || 'en';
  const t = (key: any) => getTranslation(lang, key);

  const subTabs = [
    { id: "howTo", label: t("salahHowTo"), icon: ListChecks },
    { id: "useful", label: t("salahUsefulDuas"), icon: BookOpen },
    { id: "rakat", label: t("salahRakatTable"), icon: TableIcon },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
              {t("howToPraySalah")}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Guide to performing the daily ritual prayers
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-2 p-1 bg-stone-100 dark:bg-stone-800/50 rounded-2xl w-fit">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  isActive
                    ? "bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                    : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900/40 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
        {activeSubTab === "howTo" && <HowToContent />}
        {activeSubTab === "useful" && <UsefulContent />}
        {activeSubTab === "rakat" && <RakatTableContent />}
      </div>
    </div>
  );
}

function HowToContent() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs">1</span>
          Preparation (Cleanliness)
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <li className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700/50">
            <p className="font-bold text-sm mb-1 text-emerald-700 dark:text-emerald-400">Wudu (Ablution)</p>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Wash hands, mouth, nose, face, arms to elbows, wipe head, and wash feet.
            </p>
          </li>
          <li className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700/50">
            <p className="font-bold text-sm mb-1 text-emerald-700 dark:text-emerald-400">Cleanliness</p>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Ensure your clothes and the prayer area are completely clean from impurities.
            </p>
          </li>
          <li className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700/50">
            <p className="font-bold text-sm mb-1 text-emerald-700 dark:text-emerald-400">Qibla</p>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Face towards the Ka'bah in Mecca using a compass or Qibla finder.
            </p>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs">2</span>
          Intention (Niyat)
        </h3>
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30">
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            Form an intention in your heart about which prayer you are performing, how many units (Rakah), and whether it is obligatory (Fard) or voluntary (Sunnah).
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs">3</span>
          Step-by-Step for One Rakah
        </h3>
        <div className="space-y-4">
          <StepBox 
            title="Step 1: Takbir" 
            desc="Raise both hands to your ears and say: 'Allahu Akbar' (God is the Greatest). Place hands on chest/navel (right over left) and look at the prostration spot."
          />
          <StepBox 
            title="Step 2: Recitation (Qiyaam)" 
            desc="Recite the opening prayer, Surah Al-Fatiha. After completing it, say 'Ameen'. Recite any other short Surah or verses from the Quran."
          />
          <StepBox 
            title="Step 3: Bowing (Ruku)" 
            desc="Say 'Allahu Akbar' and bow down. Say 3 times: 'Subhana Rabbiyal Adheem'. Stand up saying: 'Sami'a Allahu liman Hamidah' then 'Rabbana wa lakal Hamd'."
          />
          <StepBox 
            title="Step 4: Prostration (Sujud)" 
            desc="Say 'Allahu Akbar' and drop to the floor (forehead, nose, palms, knees, toes touch ground). Say 3 times: 'Subhana Rabbiyal A'la'."
          />
          <StepBox 
            title="Step 5: Sitting and Second Prostration" 
            desc="Say 'Allahu Akbar' and sit up straight briefly. Say 'Allahu Akbar' again, and perform the second prostration just like the first one."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs">4</span>
          The Sitting Posture (Tashahhud)
        </h3>
        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700/50 text-sm text-stone-700 dark:text-stone-300 space-y-2">
          <p>After completing the required number of Rakahs, remain seated:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Recite the Attahiyyat (greetings upon Prophet and Allah).</li>
            <li>In the final sitting, also recite Darood and a personal Dua.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs">5</span>
          Ending the Prayer (Tasleem)
        </h3>
        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700/50 text-sm text-stone-700 dark:text-stone-300">
          <p>Turn your head to the right and say: <span className="text-emerald-600 font-bold">"Assalamu Alaikum wa Rahmatullah"</span>. Then turn head to the left and repeat.</p>
        </div>
      </section>
    </div>
  );
}

function StepBox({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700/50 transition-all hover:border-emerald-500/30">
      <p className="font-bold text-sm mb-1 text-stone-800 dark:text-stone-100">{title}</p>
      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function UsefulContent() {
  const salahDuas = masnunDuas.filter(d => 
    ["salah", "forgiveness", "purification", "mosque"].includes(d.id.includes("masnoon_02") ? "salah" : "other") || 
    d.id.includes("masnoon_02") || d.id.includes("masnoon_03") || d.id.includes("masnoon_04") || d.id.includes("masnoon_05") || d.id.includes("masnoon_06") || d.id.includes("masnoon_11") || d.id.includes("masnoon_12")
  );

  // Fallback to specific IDs if filter is too broad
  const specificIds = ["masnoon_02", "masnoon_03", "masnoon_04", "masnoon_05", "masnoon_06", "masnoon_11", "masnoon_12"];
  const displayDuas = masnunDuas.filter(d => specificIds.includes(d.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-4">
        {displayDuas.map((dua) => (
          <div key={dua.id} className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/50 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">{dua.title}</h4>
              <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">{dua.source}</span>
            </div>
            <p className="text-lg text-right font-arabic leading-loose text-stone-800 dark:text-stone-100" dir="rtl">{dua.arabic}</p>
            <p className="text-xs italic text-stone-500 dark:text-stone-400">{dua.transliteration}</p>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">{dua.translation}</p>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-amber-50 dark:bg-amber-950/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
          These are some of the essential supplications recited within or around the prayer. For a full library of supplications, visit the <b>Duas</b> tab.
        </p>
      </div>
    </div>
  );
}

function RakatTableContent() {
  const columns = ["Prayer", "Sunnah", "Fard", "Sunnah", "Nafl", "Witr", "Nafl"];
  const rakatData = [
    { name: "Fajr", rakats: [2, 2, "-", "-", "-", "-"] },
    { name: "Zuhr", rakats: [4, 4, 2, 2, "-", "-"] },
    { name: "Asr", rakats: ["4*", 4, "-", "-", "-", "-"] },
    { name: "Maghrib", rakats: ["-", 3, 2, 2, "-", "-"] },
    { name: "Isha", rakats: ["4*", 4, 2, 2, 3, 2] },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 dark:bg-stone-800/80">
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-200 dark:border-stone-800">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {rakatData.map((row, i) => (
              <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                <td className="px-4 py-4 text-sm font-bold text-stone-800 dark:text-stone-100">{row.name}</td>
                {row.rakats.map((val, j) => (
                  <td key={j} className={cn(
                    "px-4 py-4 text-sm text-stone-600 dark:text-stone-400",
                    val !== "-" && "font-medium text-emerald-600 dark:text-emerald-400"
                  )}>
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-700/50">
        <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed italic">
          * 4 Sunnah in Asr and Isha are Sunnah Ghayr Muakkadah (recommended but not emphasized). 
          Witr is performed in Isha and is highly emphasized (Wajib).
        </p>
      </div>
    </div>
  );
}
