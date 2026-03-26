"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const LEGEND = [
  ["MP", "Matches Played"],
  ["W", "Wins"],
  ["L", "Losses"],
  ["RW", "Rubbers Won"],
  ["RL", "Rubbers Lost"],
  ["RD", "Rubber Diff"],
  ["Pts", "Points"],
  ["Win%", "Match Win %"],
];

export function StandingsAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-sm mb-6">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 bg-gradient-to-r from-brand-violet/8 to-brand-turquoise/8 border-b border-border flex items-center justify-between hover:from-brand-violet/12 hover:to-brand-turquoise/12 transition-colors"
      >
        <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase">Guide</h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-5 py-4 space-y-5">
          {/* Abbreviations */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Abbreviations</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {LEGEND.map(([abbr, full]) => (
                <div key={abbr} className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-brand-violet shrink-0">{abbr}</span>
                  <span className="text-xs text-slate-500 truncate">{full}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/60" />

          {/* Rubbers explanation */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">What are Rubbers?</p>

            <div className="rounded-xl bg-gradient-to-br from-brand-violet/5 to-brand-turquoise/5 border border-brand-violet/15 p-3 space-y-1">
              <p className="text-xs font-semibold text-brand-violet">Rubbers Won (RW)</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Total individual rubbers (MD, MS, WS) won across all team matches. A team wins a rubber by winning that specific discipline.
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-red-500/5 to-red-400/5 border border-red-300/30 p-3 space-y-1">
              <p className="text-xs font-semibold text-red-500">Rubbers Lost (RL)</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Total individual rubbers (MD, MS, WS) lost across all team matches. Used alongside RW to determine rubber difference (RD).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}