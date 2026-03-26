import { Clock } from "lucide-react";
import { FixtureCard } from "./FixtureCard";
import type { Fixture } from "../types";

type TimeSlotSectionProps = {
  slotLabel: string;
  fixtures: Fixture[];
  cardIndexOffset: number;
};

export function TimeSlotSection({ slotLabel, fixtures, cardIndexOffset }: TimeSlotSectionProps) {
  return (
    <div>
      {/* Slot header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-violet/10 to-brand-turquoise/10 border border-brand-violet/20 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-brand-violet" />
          </div>
          <span className="text-sm font-semibold text-slate-800">{slotLabel}</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-slate-400 shrink-0">
          {fixtures.length} {fixtures.length === 1 ? "match" : "matches"}
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {fixtures.map((fixture, i) => (
          <FixtureCard
            key={fixture.matchId}
            fixture={fixture}
            index={cardIndexOffset + i}
          />
        ))}
      </div>
    </div>
  );
}
