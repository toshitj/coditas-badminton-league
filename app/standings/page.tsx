"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { fetch_standings } from "./api";
import { GroupTable } from "./components/GroupTable";
import { StandingsSidebar } from "./components/StandingsSidebar";
import { StandingsAccordion } from "./components/StandingsAccordion";
import type { Standing } from "./types";

export default function StandingsPage() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let is_active = true;
    (async () => {
      try {
        setState("loading");
        setErrorMessage(null);
        const rows = await fetch_standings();
        if (!is_active) return;
        setStandings(rows);
        setState("loaded");
      } catch (err) {
        if (!is_active) return;
        setErrorMessage(err instanceof Error ? err.message : "Failed to fetch standings");
        setStandings([]);
        setState("error");
      }
    })();
    return () => { is_active = false; };
  }, []);

  const standingsByGroup = useMemo(() => {
    const by_group: Record<string, Standing[]> = {};
    for (const row of standings) {
      const group = row.group || "—";
      if (!by_group[group]) by_group[group] = [];
      by_group[group].push(row);
    }
    Object.keys(by_group).forEach((group) => {
      by_group[group].sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
    });
    return Object.entries(by_group).sort(([a], [b]) => a.localeCompare(b));
  }, [standings]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <div className="text-center mb-10">
            <h1 className="text-4xl pb-2 md:text-5xl font-semibold neon-text tracking-tight">Standings</h1>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Points table grouped by group and sorted by rank.
            </p>
          </div>

          {state === "loading" && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-neon-blue mb-4" />
              <p className="text-gray-400">Loading Standings...</p>
            </div>
          )}

          {state === "error" && (
            <div className="text-center text-red-600 py-12">{errorMessage}</div>
          )}

          {state === "loaded" && standings.length === 0 && (
            <div className="text-center text-slate-600 py-12">No standings available.</div>
          )}

          {state === "loaded" && standings.length > 0 && (
            <>
              {/* Mobile accordion - shows above tables on mobile only */}
              <div className="lg:hidden">
                <StandingsAccordion />
              </div>

              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Tables — 70% on desktop, full width on mobile */}
                <div className="w-full lg:w-[70%] space-y-8">
                  {standingsByGroup.map(([group, rows]) => (
                    <GroupTable key={group} group={group} rows={rows} />
                  ))}
                </div>

                {/* Desktop sidebar — 30% sticky, hidden on mobile */}
                <div className="hidden lg:block lg:w-[30%] lg:sticky lg:top-20">
                  <StandingsSidebar />
                </div>
              </div>
            </>
          )}

        </motion.div>
      </div>
    </div>
  );
}
