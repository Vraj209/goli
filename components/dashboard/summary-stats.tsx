import type { SummaryStat } from "@/lib/goals";
import { cn } from "@/lib/utils";

type SummaryStatsProps = {
  stats: SummaryStat[];
};

const toneClassName: Record<NonNullable<SummaryStat["tone"]>, string> = {
  default: "text-zinc-100",
  success: "text-emerald-300",
  warning: "text-amber-300",
  danger: "text-rose-300",
};

export function SummaryStats({ stats }: SummaryStatsProps) {
  return (
    <div className="grid gap-px overflow-hidden border border-white/10 bg-white/5 lg:grid-cols-7">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="border-b border-white/10 bg-[#0b0b0d] px-4 py-4 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            {stat.label}
          </p>
          <p className={cn("mt-3 text-2xl font-semibold tracking-tight", toneClassName[stat.tone ?? "default"])}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
