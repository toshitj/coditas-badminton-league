"use client";

import { motion } from "framer-motion";
import { MapPin, Trophy } from "lucide-react";
import type { Fixture } from "../types";
import { StatusBadge } from "./StatusBadge";
import { RubberRow } from "./RubberRow";

export function FixtureCard({ fixture, index }: { fixture: Fixture; index: number }) {
  const status = (fixture.status || "").toLowerCase();
  const isCompleted = status === "completed";
  const isLive = status === "live";

  const cardBorder = isLive
    ? "border-red-300 shadow-red-50"
    : isCompleted
    ? "border-emerald-200 shadow-emerald-50"
    : "border-blue-200";

  const hasRubberData =
    fixture.mdScore || fixture.msScore || fixture.wsScore ||
    fixture.mdWinner || fixture.msWinner || fixture.wsWinner;

  return (
    <motion.div
      className={`glass rounded-2xl overflow-hidden border ${cardBorder} shadow-sm glass-hover flex flex-col`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.015 }}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3 bg-gradient-to-r from-white to-slate-50/80 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2 mb-2">
          <StatusBadge status={fixture.status} />
          <span className="text-xs px-2.5 py-1 rounded-full bg-brand-violet/8 text-brand-violet border border-brand-violet/20 font-medium shrink-0">
            {fixture.stage}{fixture.group ? ` · Grp ${fixture.group}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="font-medium text-slate-700">{fixture.venue || "TBD"}</span>
          {fixture.matchTime && (
            <>
              <span className="text-slate-300">·</span>
              <span>{fixture.matchTime}</span>
            </>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-3">
          <TeamBox teamName={fixture.team1Name} isWinner={fixture.matchWinners === fixture.team1Name} />
          <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-brand-violet/10 to-brand-turquoise/10 border border-brand-violet/20 flex items-center justify-center">
            <span className="text-xs font-bold text-brand-violet">VS</span>
          </div>
          <TeamBox teamName={fixture.team2Name} isWinner={fixture.matchWinners === fixture.team2Name} />
        </div>
      </div>

      {/* Rubbers */}
      {hasRubberData && (
        <div className="px-5 pb-4 flex-1">
          <div className="bg-slate-50/80 rounded-xl border border-slate-100 px-3 py-1">
            <RubberRow
              label="Mixed Doubles"
              shortLabel="MD"
              player1={fixture.mdTeam1Players}
              player2={fixture.mdTeam2Players}
              score={fixture.mdScore}
              winner={fixture.mdWinner}
              team1Name={fixture.team1Name}
              team2Name={fixture.team2Name}
            />
            <RubberRow
              label="Men's Singles"
              shortLabel="MS"
              player1={fixture.msTeam1Player}
              player2={fixture.msTeam2Player}
              score={fixture.msScore}
              winner={fixture.msWinner}
              team1Name={fixture.team1Name}
              team2Name={fixture.team2Name}
            />
            <RubberRow
              label="Women's Singles"
              shortLabel="WS"
              player1={fixture.wsTeam1Player}
              player2={fixture.wsTeam2Player}
              score={fixture.wsScore}
              winner={fixture.wsWinner}
              team1Name={fixture.team1Name}
              team2Name={fixture.team2Name}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TeamBox({ teamName, isWinner }: { teamName: string; isWinner: boolean }) {
  return (
    <div className={`flex-1 text-center p-3 rounded-xl ${isWinner ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-200"}`}>
      <div className={`text-sm font-bold leading-tight ${isWinner ? "text-emerald-700" : "text-slate-800"}`}>
        {teamName}
      </div>
      {isWinner && (
        <div className="flex items-center justify-center gap-1 mt-1">
          <Trophy className="w-3 h-3 text-amber-500" />
          <span className="text-xs font-semibold text-amber-600">Winner</span>
        </div>
      )}
    </div>
  );
}
