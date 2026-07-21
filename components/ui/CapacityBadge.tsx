export function CapacityBadge({
  remaining,
  capacity,
  activeWaitlistCount = 0,
}: {
  remaining: number;
  capacity: number;
  activeWaitlistCount?: number;
}) {
  const isQueued = remaining > 0 && activeWaitlistCount > 0;
  const percent = isQueued
    ? 100
    : Math.round(((capacity - remaining) / capacity) * 100);

  const status =
    isQueued
      ? "Queued"
      : remaining === 0
      ? "Waitlist"
      : remaining <= 4
      ? "Almost full"
      : "Open";

  const color =
    isQueued
      ? "bg-amber-500"
      : remaining === 0
      ? "bg-red-500"
      : remaining <= 4
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-heading font-medium text-slate-800">{status}</span>
        <span className="text-slate-500">
          {isQueued
            ? `${activeWaitlistCount} ahead in queue`
            : `${remaining} left`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

