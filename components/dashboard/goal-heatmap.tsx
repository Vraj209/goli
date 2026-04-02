import type { HeatmapCell } from "@/lib/goals";

type GoalHeatmapProps = {
  cells: HeatmapCell[];
};

const intensityClassName = {
  0: "bg-white/[0.03]",
  1: "bg-sky-950/70",
  2: "bg-sky-800/80",
  3: "bg-cyan-500/70",
  4: "bg-emerald-400/80",
} as const;

export function GoalHeatmap({ cells }: GoalHeatmapProps) {
  const weeks: HeatmapCell[][] = [];

  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return (
    <section className="border border-white/10 bg-[#0b0b0d] p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Execution Density
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">
            Contribution-style momentum map
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
          <span>Low</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className={`h-3 w-3 border border-white/10 ${intensityClassName[level as keyof typeof intensityClassName]}`}
            />
          ))}
          <span>High</span>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="flex min-w-max gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid gap-1">
              {week.map((cell) => (
                <div
                  key={cell.date}
                  className={`h-4 w-4 border border-white/10 transition-transform duration-200 hover:-translate-y-0.5 ${intensityClassName[cell.intensity]}`}
                  title={`${cell.date} • ${cell.total} activity • ${cell.completedCount} completed`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
