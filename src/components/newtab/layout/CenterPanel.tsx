import React, { useState } from "react";
import PurposeSearch from "../search/PurposeSearch";
import QuickAccessHub from "../hub/QuickAccessHub";
import { AYAHS } from "~data/ayahs";
import type { WidgetId, WidgetConfig } from "~types";
import { cn } from "~utils/cn";

interface CenterPanelProps {
  widgets: WidgetConfig[];
  renderWidget: (id: WidgetId) => React.ReactNode;
}

export default function CenterPanel({ widgets, renderWidget }: CenterPanelProps) {
  const [activeTabId, setActiveTabId] = useState<string | undefined>(undefined);

  // Daily Ayah Selection
  const ayah = React.useMemo(() => {
    const today = new Date();
    const dateSeed = today.getDate() + today.getMonth() * 31 + today.getFullYear();
    const index = dateSeed % AYAHS.length;
    return AYAHS[index];
  }, []);

  const handleSearchTabChange = (tabId: string, query?: string) => {
    setActiveTabId(tabId);
    // You might want to pass the query to the hub too, but for now just changing tab
  };

  return (
    <main className="flex-1 min-w-[400px] flex flex-col gap-8 overflow-y-auto no-scrollbar h-full">
      {/* Prominent Ayah Section */}
      <section className="py-10 px-4 text-center space-y-6">
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
      </section>

      {/* Purpose Search */}
      <section className="px-4">
        <PurposeSearch onTabChange={handleSearchTabChange} />
      </section>

      {/* Quick Access Hub */}
      <section className="flex-1 px-4 pb-8">
        <QuickAccessHub activeTabId={activeTabId} onTabChange={(id) => setActiveTabId(id)} />
      </section>

      {/* Bottom widgets (if any assigned to center, though specs say center is managed by itself) */}
      {widgets.length > 0 && (
        <section className="px-4 space-y-6">
          {widgets.map(w => (
            <React.Fragment key={w.id}>
              {renderWidget(w.id)}
            </React.Fragment>
          ))}
        </section>
      )}
    </main>
  );
}
