import React, { useState, Suspense, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { defaultHubTabs, type HubTab } from "~data/hubTabs";
import { cn } from "~utils/cn";
import { Loader2 } from "lucide-react";

interface QuickAccessHubProps {
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
}

export default function QuickAccessHub({ activeTabId: externalTabId, onTabChange }: QuickAccessHubProps) {
  const [internalTabId, setInternalTabId] = useStorage<string>("activeHubTab", "quran");
  
  // Use external tab ID if provided, otherwise use internal storage state
  // If both are loading, default to "quran" to avoid flickering/stuck loaders
  const activeTabId = externalTabId || internalTabId || "quran";
  const setActiveTabId = onTabChange || setInternalTabId;
  
  // Sync internal storage if external tab changes (e.g. from search)
  useEffect(() => {
    if (externalTabId && externalTabId !== internalTabId) {
      setInternalTabId(externalTabId);
    }
  }, [externalTabId, internalTabId]);

  const activeTab = defaultHubTabs.find(t => t.id === activeTabId) || defaultHubTabs[0];

  const handleTabClick = (id: string) => {
    if (onTabChange) {
      onTabChange(id);
    } else {
      setInternalTabId(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-stone-900/50 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-2 bg-stone-50 dark:bg-stone-950/40 border-b border-stone-100 dark:border-stone-800 overflow-x-auto no-scrollbar">
        {defaultHubTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                isActive 
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-900/20" 
                  : "text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 dark:text-stone-400"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-stone-400")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[500px]">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center h-full p-20 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm font-medium">Preparing {activeTab.label}...</p>
          </div>
        }>
          <activeTab.component key={activeTab.id} />
        </Suspense>
      </div>
    </div>
  );
}
