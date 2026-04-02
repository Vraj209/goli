import type { QuarterSummary } from "@/lib/goals";

import { GoalProgressBar } from "@/components/dashboard/goal-progress-bar";

type QuarterProgressGridProps = {
  quarters: QuarterSummary[];
  activeQuarter: number;
};

export function QuarterProgressGrid({
  quarters,
  activeQuarter,
}: QuarterProgressGridProps) {
  return (
    <section className="border border-white/10 bg-[#0b0b0d] p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Quarterly Tracker
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">
            Strategic cadence across all four quarters
          </h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          Active quarter: Q{activeQuarter}
        </p>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        {quarters.map((quarter) => {
          const isActive = quarter.quarter === activeQuarter;
          return (
            <article
              key={quarter.quarter}
              className={`border p-4 transition-colors ${
                isActive
                  ? "border-cyan-400/40 bg-cyan-400/[0.05]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                    {quarter.label}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-50">
                    {quarter.completedGoals} of {quarter.totalGoals} goals completed
                  </h3>
                </div>
                <span className="font-mono text-sm text-zinc-300">{quarter.progress}%</span>
              </div>

              <div className="mt-4">
                <GoalProgressBar value={quarter.progress} tone={isActive ? "warning" : "default"} />
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    In progress
                  </dt>
                  <dd className="mt-1 text-zinc-100">{quarter.inProgressGoals}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    Monthly goals
                  </dt>
                  <dd className="mt-1 text-zinc-100">{quarter.monthlyGoals}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}
