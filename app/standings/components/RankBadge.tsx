export function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-500 font-semibold text-sm">
      {rank}
    </span>
  );
}
