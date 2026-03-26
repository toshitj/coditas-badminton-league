import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function DiffIndicator({ value }: { value: number }) {
  if (value > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
        <TrendingUp className="w-3 h-3" />+{value}
      </span>
    );
  if (value < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-red-500 font-semibold">
        <TrendingDown className="w-3 h-3" />{value}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-slate-400 font-semibold">
      <Minus className="w-3 h-3" />0
    </span>
  );
}
