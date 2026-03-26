export type RubberRowProps = {
  label: string;
  shortLabel: string;
  player1: string;
  player2: string;
  score: string;
  winner: string;
  team1Name: string;
  team2Name: string;
};

export function RubberRow({ label, shortLabel, player1, player2, score, winner, team1Name, team2Name }: RubberRowProps) {
  const hasData = score || winner || player1 || player2;
  if (!hasData) return null;

  const team1Won = winner === team1Name;
  const team2Won = winner === team2Name;

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-b-0">
      <span className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-brand-violet/10 to-brand-turquoise/10 border border-brand-violet/20 flex items-center justify-center text-xs font-bold text-brand-violet">
        {shortLabel}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-medium text-slate-500">{label}</span>
          {winner && (
            <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-brand-violet/30 text-brand-violet text-xs font-semibold bg-gradient-to-r from-brand-violet/5 to-brand-turquoise/5">
              {winner}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className={`text-xs truncate ${team1Won ? "font-semibold text-slate-900" : "text-slate-500"}`}>
              {player1 || "—"}
              {team1Won && <span className="ml-1 text-brand-violet">✓</span>}
            </div>
            <div className={`text-xs truncate mt-0.5 ${team2Won ? "font-semibold text-slate-900" : "text-slate-500"}`}>
              {player2 || "—"}
              {team2Won && <span className="ml-1 text-brand-violet">✓</span>}
            </div>
          </div>
          {score && (
            <span className="shrink-0 text-sm font-bold text-slate-800 tabular-nums">{score}</span>
          )}
        </div>
      </div>
    </div>
  );
}
