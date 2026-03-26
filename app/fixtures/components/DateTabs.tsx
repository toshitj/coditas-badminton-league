"use client";

import type { FixturesTab } from "../types";

type DateTabsProps = {
  tabs: FixturesTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
};

export function DateTabs({ tabs, activeTab, onTabChange }: DateTabsProps) {
  if (tabs.length === 0) return null;

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="inline-flex gap-2 rounded-2xl border border-border bg-white/70 p-2 backdrop-blur-md min-w-full">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={[
                "px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors",
                isActive
                  ? "bg-neon-blue text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-900/5 hover:text-slate-900",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
