import { Landmark, PiggyBank, TrendingUp } from "lucide-react";

import { GoalProgressBar } from "@/components/dashboard/goal-progress-bar";
import type { FinancialSummary, GoalRecord } from "@/lib/goals";
import { formatAmount, formatCurrencyAmount, getFinancialGoalCopy, labelMap } from "@/lib/goals";

type FinancialSummaryPanelProps = {
  summary: FinancialSummary;
  goals: GoalRecord[];
};

export function FinancialSummaryPanel({ summary, goals }: FinancialSummaryPanelProps) {
  const financialGoals = goals
    .filter((goal) => goal.kind === "FINANCIAL")
    .sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === "COMPLETED" ? 1 : -1;
      }

      return right.progress - left.progress;
    });

  if (!summary.totalFinancialGoals) {
    return null;
  }

  return (
    <section className="border border-white/10 bg-[#0b0b0d] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Financial Goals
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">
            Money tracked separately from the rest of the goal system
          </h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          {summary.totalFinancialGoals} active financial goals
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Landmark className="h-4 w-4" />}
          label="Tracked total"
          value={formatAmount(summary.totalTargetAmount)}
          caption={`${summary.completedFinancialGoals} completed`}
        />
        <MetricCard
          icon={<PiggyBank className="h-4 w-4" />}
          label="Saved / paid"
          value={formatAmount(summary.totalCurrentAmount)}
          caption={`${summary.averageProgress}% average progress`}
          tone="success"
        />
        <MetricCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Remaining"
          value={formatAmount(summary.totalRemainingAmount)}
          caption="Outstanding amount left"
          tone="warning"
        />
        <MetricCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Completion rate"
          value={`${summary.averageProgress}%`}
          caption="Across all financial goals"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {financialGoals.map((goal) => {
          const copy = getFinancialGoalCopy(goal);
          const currentValue = goal.currentValue ?? 0;
          const targetValue = goal.targetValue ?? 0;
          const remainingValue = Math.max(0, targetValue - currentValue);

          return (
            <article key={goal.id} className="border border-white/10 bg-white/2 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                      {goal.currency ?? "Goal"}
                    </p>
                    <span className="border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                      {labelMap.status[goal.status]}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">
                    {goal.title}
                  </h3>
                  {goal.description ? (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                      {goal.description}
                    </p>
                  ) : null}
                </div>

                <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
                  {goal.progress}% complete
                </p>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3 font-mono text-xs text-zinc-400">
                  <span>{copy.progressLabel}</span>
                  <span>
                    {formatCurrencyAmount(currentValue, goal.currency)} /{" "}
                    {formatCurrencyAmount(targetValue, goal.currency)}
                  </span>
                </div>
                <GoalProgressBar value={goal.progress} />
              </div>

              <dl className="mt-5 grid gap-4 border-t border-white/10 pt-4 md:grid-cols-3">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    Target
                  </dt>
                  <dd className="mt-2 text-lg font-semibold tracking-tight text-zinc-50">
                    {formatCurrencyAmount(targetValue, goal.currency)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    {copy.summaryLabel}
                  </dt>
                  <dd className="mt-2 text-lg font-semibold tracking-tight text-emerald-300">
                    {formatCurrencyAmount(currentValue, goal.currency)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    Remaining
                  </dt>
                  <dd className="mt-2 text-lg font-semibold tracking-tight text-amber-300">
                    {formatCurrencyAmount(remainingValue, goal.currency)}
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  caption,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: string;
  tone?: "default" | "success" | "warning";
}) {
  const toneClassName =
    tone === "success"
      ? "text-emerald-300"
      : tone === "warning"
        ? "text-amber-300"
        : "text-zinc-50";

  return (
    <article className="border border-white/10 bg-white/2 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            {label}
          </p>
          <h3 className={`mt-3 text-2xl font-semibold tracking-tight ${toneClassName}`}>
            {value}
          </h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-black text-zinc-300">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm text-zinc-400">{caption}</p>
    </article>
  );
}
