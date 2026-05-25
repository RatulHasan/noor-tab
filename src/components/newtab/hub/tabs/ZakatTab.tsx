import React, { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { calculateZakat, type ZakatAssets, type ZakatLiabilities, type ZakatCalculation } from "~services/zakat/zakatCalculator";
import { Calculator, Save, RotateCcw, Info, CheckCircle2 } from "lucide-react";
import { cn } from "~utils/cn";
import { getTranslation } from "~data/translations";
import { useSettings } from "~hooks/useSettings";

export default function ZakatTab() {
  const [settings] = useSettings();
  const lang = settings?.language || 'en';
  const t = (key: any) => getTranslation(lang, key);

  const [assets, setAssets] = useState<ZakatAssets>({
    cash: 0,
    goldValue: 0,
    silverValue: 0,
    businessAssets: 0,
    receivables: 0,
  });

  const [liabilities, setLiabilities] = useState<ZakatLiabilities>({
    debtsDue: 0,
  });

  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("USD");
  const currencySymbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : currency === "EUR" ? "€" : currency === "SAR" ? "ر.س" : currency === "AED" ? "د.إ" : currency === "BDT" ? "৳" : "$";
  const [savedCalculations, setSavedCalculations] = useStorage<ZakatCalculation[]>("zakat_history", []);

  const nisabThreshold = goldPrice * 87.48; // 87.48g of gold is a common threshold
  const result = calculateZakat(assets, liabilities, nisabThreshold);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'assets' | 'liabilities', field: string) => {
    const val = parseFloat(e.target.value) || 0;
    if (category === 'assets') {
      setAssets(prev => ({ ...prev, [field]: val }));
    } else {
      setLiabilities(prev => ({ ...prev, [field]: val }));
    }
  };

  const handleSave = () => {
    const calculation: ZakatCalculation = {
      ...result,
      currency,
      savedAt: new Date().toISOString(),
    };
    setSavedCalculations([calculation, ...(savedCalculations || [])].slice(0, 10));
  };

  const handleReset = () => {
    setAssets({ cash: 0, goldValue: 0, silverValue: 0, businessAssets: 0, receivables: 0 });
    setLiabilities({ debtsDue: 0 });
    setGoldPrice(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-600" />
            {t("zakatCalculator")}
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {t("zakatSub")}
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="EUR">EUR (€)</option>
            <option value="SAR">SAR (ر.س)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="BDT">BDT (৳)</option>
          </select>
          <button onClick={handleReset} className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nisab Section */}
          <div className="bg-emerald-50/30 dark:bg-emerald-950/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              {t("nisabThreshold")}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">{t("goldPricePerGram")}</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 text-sm">{currencySymbol}</span>
                  <input 
                    type="number" 
                    value={goldPrice || ""} 
                    onChange={(e) => setGoldPrice(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800 rounded-lg py-2 pl-7 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">{t("currentNisab")}</label>
                <div className="py-2 text-lg font-mono font-bold text-emerald-900 dark:text-emerald-100">
                  {currency} {nisabThreshold.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">{t("yourAssets")}</h3>
              <div className="space-y-3">
                {[
                  { label: t("cashAndSavings"), field: "cash" },
                  { label: t("goldValue"), field: "goldValue" },
                  { label: t("silverValue"), field: "silverValue" },
                  { label: t("businessAssets"), field: "businessAssets" },
                  { label: t("receivables"), field: "receivables" },
                ].map(item => (
                  <div key={item.field}>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{item.label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-stone-400 text-xs">{currencySymbol}</span>
                      <input 
                        type="number" 
                        value={(assets as any)[item.field] || ""} 
                        onChange={(e) => handleInputChange(e, 'assets', item.field)}
                        placeholder="0.00"
                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg py-2 pl-7 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">{t("yourLiabilities")}</h3>
              <div className="space-y-3">
                {[
                  { label: t("debtsDueNow"), field: "debtsDue" },
                ].map(item => (
                  <div key={item.field}>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{item.label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-stone-400 text-xs">{currencySymbol}</span>
                      <input 
                        type="number" 
                        value={(liabilities as any)[item.field] || ""} 
                        onChange={(e) => handleInputChange(e, 'liabilities', item.field)}
                        placeholder="0.00"
                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg py-2 pl-7 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-6">
          <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl border border-stone-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Calculator className="w-24 h-24" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{t("netZakatableAssets")}</p>
                <h4 className="text-3xl font-mono font-bold">
                  {currency} {result.netAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h4>
              </div>

              <div className="pt-6 border-t border-stone-800">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t("eligibility")}</p>
                  {result.isEligible ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase">
                      <CheckCircle2 className="w-3 h-3" /> {t("eligible")}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-stone-500 uppercase">{t("belowNisab")}</span>
                  )}
                </div>
                <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500", result.isEligible ? "bg-emerald-500" : "bg-stone-700")} 
                    style={{ width: `${Math.min(100, (result.netAssets / Math.max(1, result.nisabThreshold)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">{t("totalZakatDue")}</p>
                <h4 className="text-4xl font-mono font-black text-emerald-500">
                  {currency} {result.zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h4>
              </div>

              <button 
                onClick={handleSave}
                disabled={result.zakatDue <= 0}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-600 rounded-xl transition-all font-bold shadow-lg"
              >
                <Save className="w-4 h-4" />
                {t("saveCalculation")}
              </button>
            </div>
          </div>

          {/* History */}
          {savedCalculations && savedCalculations.length > 0 && (
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
               <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-4 text-sm">{t("recentHistory")}</h3>
               <div className="space-y-3">
                  {savedCalculations.map((calc, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                       <span className="text-stone-500">{new Date(calc.savedAt).toLocaleDateString()}</span>
                       <span className="font-mono font-bold text-stone-700 dark:text-stone-300">
                         {calc.currency} {calc.zakatDue.toLocaleString()}
                       </span>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
