export function WinPct({ pct }: { pct: number }) {
  const safe = Math.min(100, Math.max(0, pct || 0));
  const color = safe >= 60 ? "text-emerald-600" : safe >= 40 ? "text-amber-500" : "text-red-500";
  return (
    <span className={`text-xs font-semibold tabular-nums ${color}`}>
      {safe.toFixed(0)}%
    </span>
  );
}
