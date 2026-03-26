"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { fetch_fixtures } from "./api";
import { build_tabs_from_fixtures } from "./utils/date";
import { enrich_with_knockout_placeholders } from "./utils/knockout";
import { DateTabs } from "./components/DateTabs";
import { FixtureCard } from "./components/FixtureCard";
import type { Fixture } from "./types";

const ACTIVE_TAB_STORAGE_KEY = "cbl:fixtures:active_tab";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let is_active = true;
    (async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const raw = await fetch_fixtures();
        if (!is_active) return;
        setFixtures(enrich_with_knockout_placeholders(raw));
      } catch (err) {
        if (!is_active) return;
        setErrorMessage(err instanceof Error ? err.message : "Failed to fetch fixtures");
        setFixtures([]);
      } finally {
        if (!is_active) return;
        setIsLoading(false);
      }
    })();
    return () => { is_active = false; };
  }, []);

  const tabs = useMemo(() => build_tabs_from_fixtures(fixtures), [fixtures]);

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      return typeof window === "undefined" ? "" : window.localStorage.getItem(ACTIVE_TAB_STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    if (!activeTab) return;
    try { window.localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab); } catch { /* ignore */ }
  }, [activeTab]);

  useEffect(() => {
    if (tabs.length === 0 || isLoading) return;
    if (activeTab && tabs.some((t) => t.key === activeTab)) return;
    setActiveTab(tabs[0].key);
  }, [activeTab, isLoading, tabs]);

  const active = useMemo(() => {
    if (tabs.length === 0) return null;
    return tabs.find((t) => t.key === activeTab) ?? tabs[0];
  }, [activeTab, tabs]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-semibold neon-text tracking-tight">Match Fixtures</h1>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Marked on the Calendar, Ready for the Court!
            </p>
          </div>

          <DateTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={active?.key ?? "empty"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-neon-blue mb-4" />
                  <p className="text-gray-400">Loading Fixtures...</p>
                </div>
              ) : errorMessage ? (
                <div className="text-center text-red-600 py-12">{errorMessage}</div>
              ) : !active || active.fixtures.length === 0 ? (
                <div className="text-center text-slate-600 py-12">No fixtures available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {active.fixtures.map((fixture, i) => (
                    <FixtureCard key={fixture.matchId} fixture={fixture} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}
