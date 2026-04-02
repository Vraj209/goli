import type { FocusBuckets, GoalRecord } from "@/lib/goals";
import { formatDateLabel, labelMap } from "@/lib/goals";

type WeeklyFocusPanelProps = {
  buckets: FocusBuckets;
};

function FocusList({
  title,
  goals,
}: {
  title: string;
  goals: GoalRecord[];
}) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-300">
          {title}
        </h3>
        <span className="font-mono text-xs text-zinc-500">{goals.length}</span>
      </div>

      <div className="mt-4 space-y-3">
        {goals.length ? (
          goals.map((goal) => (
            <article key={goal.id} className="border border-white/10 bg-[#09090b] p-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-100">{goal.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {labelMap.priority[goal.priority]} priority
                    {goal.dueDate ? ` • Due ${formatDateLabel(goal.dueDate)}` : ""}
                  </p>
                </div>
                <span className="font-mono text-xs text-zinc-400">{goal.progress}%</span>
              </div>
            </article>
          ))
        ) : (
          <div className="border border-dashed border-white/10 px-4 py-6 text-sm text-zinc-500">
            Nothing urgent here.
          </div>
        )}
      </div>
    </div>
  );
}

export function WeeklyFocusPanel({ buckets }: WeeklyFocusPanelProps) {
  return (
    <section className="border border-white/10 bg-[#0b0b0d] p-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
          Active Focus
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">
          This week, overdue, blocked, and critical priorities
        </h2>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <FocusList title="This week" goals={buckets.thisWeek} />
        <FocusList title="Overdue" goals={buckets.overdue} />
        <FocusList title="Blocked" goals={buckets.blocked} />
        <FocusList title="Critical" goals={buckets.priorities} />
      </div>
    </section>
  );
}
