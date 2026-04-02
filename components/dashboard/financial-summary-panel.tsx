import { Landmark, PiggyBank, TrendingUp } from "lucide-react";

import type { FinancialSummary } from "@/lib/goals";
import { formatAmount, formatCurrencyAmount } from "@/lib/goals";

type FinancialSummaryPanelProps = {
  summary: FinancialSummary;
};

export function FinancialSummaryPanel({
  summary,
}: FinancialSummaryPanelProps) {
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
        {summary.byCurrency.map((currencySummary) => (
          <article
            key={currencySummary.currency}
            className="border border-white/10 bg-white/2 p-4"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  {currencySummary.currency} dashboard
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">
                  {currencySummary.goals} financial goals
                </h3>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
                {currencySummary.averageProgress}% avg progress
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <MiniMetric
                label="Tracked"
                value={formatCurrencyAmount(
                  currencySummary.totalTargetAmount,
                  currencySummary.currency,
                )}
              />
              <MiniMetric
                label="Saved / paid"
                value={formatCurrencyAmount(
                  currencySummary.totalCurrentAmount,
                  currencySummary.currency,
                )}
                tone="success"
              />
              <MiniMetric
                label="Remaining"
                value={formatCurrencyAmount(
                  currencySummary.totalRemainingAmount,
                  currencySummary.currency,
                )}
                tone="warning"
              />
            </div>
          </article>
        ))}
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

function MiniMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
}) {
  const toneClassName =
    tone === "success"
      ? "text-emerald-300"
      : tone === "warning"
        ? "text-amber-300"
        : "text-zinc-50";

  return (
    <div className="border border-white/10 bg-black/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </p>
      <p className={`mt-3 text-lg font-semibold tracking-tight ${toneClassName}`}>{value}</p>
    </div>
  );
}
