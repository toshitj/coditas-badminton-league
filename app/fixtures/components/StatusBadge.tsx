import { Clock } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();

  if (s === "live")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        Live
      </span>
    );
  if (s === "rescheduled")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-600 border border-yellow-200">
        <span className="h-2 w-2 rounded-full bg-yellow-500" />
        Rescheduled
      </span>
    );
  if (s === "completed")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Completed
      </span>
    );

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
      <Clock className="w-3 h-3" />
      Scheduled
    </span>
  );
}
