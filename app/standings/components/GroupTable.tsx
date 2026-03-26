"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Standing } from "../types";
import { RankBadge } from "./RankBadge";
import { DiffIndicator } from "./DiffIndicator";
import { WinPct } from "./WinPct";

const COLUMNS = ["#", "Team", "MP", "W", "L", "RW", "RL", "RD", "Pts", "Win%"];

const MOBILE_STATS = (r: Standing) => [
  { label: "MP", value: r.matchesPlayed, color: "text-slate-600" },
  { label: "W", value: r.wins, color: "text-emerald-600 font-semibold" },
  { label: "L", value: r.losses, color: "text-red-500 font-semibold" },
  { label: "RW/RL", value: `${r.rubbersWon}/${r.rubbersLost}`, color: "text-slate-600" },
];

export function GroupTable({ group, rows }: { group: string; rows: Standing[] }) {
  return (
    <motion.div
      className="glass rounded-2xl overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Group header */}
      <div className="px-6 py-4 bg-gradient-to-r from-brand-violet/8 to-brand-turquoise/8 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-violet to-brand-turquoise flex items-center justify-center shadow-sm">
          <Trophy className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Group {group}</h2>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-border">
              {COLUMNS.map((h, i) => (
                <th
                  key={h}
                  className={`py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${i === 1 ? "text-left" : "text-center"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={`${r.group}-${r.teamName}`}
                className="border-b border-border/50 last:border-b-0 transition-colors hover:bg-slate-50/60"
              >
                <td className="py-3 px-3 text-center"><RankBadge rank={r.rank} /></td>
                <td className="py-3 px-3 text-left">
                  <span className="font-semibold text-slate-700">{r.teamName}</span>
                </td>
                <td className="py-3 px-3 text-center text-slate-600 font-medium">{r.matchesPlayed}</td>
                <td className="py-3 px-3 text-center">
                  <span className="font-semibold text-emerald-600">{r.wins}</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="font-semibold text-red-500">{r.losses}</span>
                </td>
                <td className="py-3 px-3 text-center text-slate-600">{r.rubbersWon}</td>
                <td className="py-3 px-3 text-center text-slate-600">{r.rubbersLost}</td>
                <td className="py-3 px-3 text-center"><DiffIndicator value={r.rubberDiff} /></td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-violet/10 to-brand-turquoise/10 border border-brand-violet/20 font-bold text-brand-violet text-sm">
                    {r.points}
                  </span>
                </td>
                <td className="py-3 px-3 text-center"><WinPct pct={r.matchWinPercentage} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border/50">
        {rows.map((r) => (
          <div key={`${r.group}-${r.teamName}-mob`} className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <RankBadge rank={r.rank} />
                <span className="font-bold text-sm text-slate-700">{r.teamName}</span>
              </div>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-violet/10 to-brand-turquoise/10 border border-brand-violet/20 font-bold text-brand-violet text-sm">
                {r.points}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs text-center">
              {MOBILE_STATS(r).map(({ label, value, color }) => (
                <div key={label} className="bg-slate-50 rounded-lg p-2">
                  <div className="text-slate-400 mb-0.5">{label}</div>
                  <div className={color}>{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500">Win %</span>
              <WinPct pct={r.matchWinPercentage} />
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  );
}
