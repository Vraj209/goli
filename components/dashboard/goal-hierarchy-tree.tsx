import { Check, ChevronRight, Pencil, Plus } from "lucide-react";
import { useState } from "react";

import {
  formatDateLabel,
  formatCurrencyAmount,
  getFinancialGoalCopy,
  getGoalPeriodLabel,
  getProgressTone,
  isFinancialGoal,
  labelMap,
  type GoalNode,
  type GoalRecord,
} from "@/lib/goals";

import { GoalProgressBar } from "@/components/dashboard/goal-progress-bar";

type GoalHierarchyTreeProps = {
  tree: GoalNode[];
  visibleIds: Set<string>;
  expandedIds: Set<string>;
  pendingId: string | null;
  onToggleExpand: (id: string) => void;
  onEdit: (goal: GoalRecord) => void;
  onQuickAdd: (goal: GoalRecord) => void;
  onComplete: (goal: GoalRecord) => void;
  onProgressChange: (goal: GoalRecord, progress: number) => void;
  onAddAmount: (goal: GoalRecord, amount: number) => void;
};

const statusClassName = {
  NOT_STARTED: "border-white/10 text-zinc-500",
  IN_PROGRESS: "border-amber-300/25 text-amber-200",
  COMPLETED: "border-emerald-300/25 text-emerald-200",
  BLOCKED: "border-rose-300/25 text-rose-200",
  ARCHIVED: "border-white/10 text-zinc-600",
} as const;

export function GoalHierarchyTree({
  tree,
  visibleIds,
  expandedIds,
  pendingId,
  onToggleExpand,
  onEdit,
  onQuickAdd,
  onComplete,
  onProgressChange,
  onAddAmount,
}: GoalHierarchyTreeProps) {
  const filteredTree = tree.filter((goal) => visibleIds.has(goal.id));

  return (
    <section className="border border-white/10 bg-[#0b0b0d] p-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
          Hierarchy
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">
          One-page goal tree from yearly direction to weekly execution
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        {filteredTree.length ? (
          filteredTree.map((goal) => (
            <GoalTreeNode
              key={goal.id}
              goal={goal}
              depth={0}
              visibleIds={visibleIds}
              expandedIds={expandedIds}
              pendingId={pendingId}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onQuickAdd={onQuickAdd}
              onComplete={onComplete}
              onProgressChange={onProgressChange}
              onAddAmount={onAddAmount}
            />
          ))
        ) : (
          <div className="border border-dashed border-white/10 px-4 py-10 text-sm text-zinc-500">
            No goals match the current filters.
          </div>
        )}
      </div>
    </section>
  );
}

function GoalTreeNode({
  goal,
  depth,
  visibleIds,
  expandedIds,
  pendingId,
  onToggleExpand,
  onEdit,
  onQuickAdd,
  onComplete,
  onProgressChange,
  onAddAmount,
}: {
  goal: GoalNode;
  depth: number;
  visibleIds: Set<string>;
  expandedIds: Set<string>;
  pendingId: string | null;
  onToggleExpand: (id: string) => void;
  onEdit: (goal: GoalRecord) => void;
  onQuickAdd: (goal: GoalRecord) => void;
  onComplete: (goal: GoalRecord) => void;
  onProgressChange: (goal: GoalRecord, progress: number) => void;
  onAddAmount: (goal: GoalRecord, amount: number) => void;
}) {
  const visibleChildren = goal.children.filter((child) => visibleIds.has(child.id));
  const isExpanded = expandedIds.has(goal.id);
  const isPending = pendingId === goal.id;
  const canCreateChild = goal.level !== "WEEKLY";
  const periodLabel = getGoalPeriodLabel(goal.level, goal.startDate, goal.dueDate);
  const [amountDraft, setAmountDraft] = useState("");
  const financial = isFinancialGoal(goal);
  const financialCopy = getFinancialGoalCopy(goal);

  const handleAddAmount = () => {
    const parsed = Number(amountDraft);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }

    onAddAmount(goal, parsed);
    setAmountDraft("");
  };

  return (
    <div>
      <article
        className="border border-white/10 bg-black/50 p-4"
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleExpand(goal.id)}
                className="flex h-7 w-7 items-center justify-center border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100"
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                {labelMap.level[goal.level]}
              </span>
              <span
                className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] ${statusClassName[goal.status]}`}
              >
                {labelMap.status[goal.status]}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                {labelMap.priority[goal.priority]}
              </span>
              {periodLabel ? (
                <span className="border border-cyan-400/20 bg-cyan-400/6 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100">
                  {periodLabel}
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <h3 className="text-lg font-medium text-zinc-50">{goal.title}</h3>
              {goal.description ? (
                <p className="max-w-3xl text-sm leading-6 text-zinc-400">{goal.description}</p>
              ) : null}
              <p className="text-xs text-zinc-500">
                {goal.dueDate ? `Due ${formatDateLabel(goal.dueDate)}` : "No due date"}
                {goal.tags.length ? ` • ${goal.tags.join(" / ")}` : ""}
              </p>
            </div>
          </div>

          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center justify-between gap-3 font-mono text-xs text-zinc-400">
              <span>{financial ? financialCopy.progressLabel : "Progress"}</span>
              <span>
                {financial
                  ? `${formatCurrencyAmount(goal.currentValue, goal.currency)} / ${formatCurrencyAmount(goal.targetValue, goal.currency)}`
                  : `${goal.progress}%`}
              </span>
            </div>
            <GoalProgressBar value={goal.progress} tone={getProgressTone(goal.status)} />
            {financial ? (
              <div className="flex items-center justify-end gap-2">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={amountDraft}
                  onChange={(event) => setAmountDraft(event.target.value)}
                  placeholder={financialCopy.actionLabel}
                  className="h-9 w-32 border border-white/10 bg-black px-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-400/50"
                />
                <button
                  type="button"
                  onClick={handleAddAmount}
                  disabled={isPending || goal.status === "ARCHIVED"}
                  className="border border-cyan-400/30 bg-cyan-400/6 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:border-cyan-300/50 disabled:opacity-50"
                >
                  {financialCopy.actionLabel}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onProgressChange(goal, Math.max(0, goal.progress - 10))}
                  disabled={isPending || goal.status === "ARCHIVED"}
                  className="border border-white/10 px-2 py-1 font-mono text-[11px] text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100 disabled:opacity-50"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => onProgressChange(goal, Math.min(100, goal.progress + 10))}
                  disabled={isPending || goal.status === "ARCHIVED"}
                  className="border border-white/10 px-2 py-1 font-mono text-[11px] text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100 disabled:opacity-50"
                >
                  +10
                </button>
              </div>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              {canCreateChild ? (
                <button
                  type="button"
                  onClick={() => onQuickAdd(goal)}
                  className="inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:border-white/20"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add child
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onEdit(goal)}
                className="inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:border-white/20"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onComplete(goal)}
                disabled={isPending || goal.status === "COMPLETED"}
                className="inline-flex items-center gap-2 border border-emerald-300/25 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-emerald-100 transition-colors hover:border-emerald-300/45 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                Complete
              </button>
            </div>
          </div>
        </div>
      </article>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${
          isExpanded && visibleChildren.length ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70"
        }`}
      >
        <div className="min-h-0 space-y-3 pt-3">
          {visibleChildren.map((child) => (
            <GoalTreeNode
              key={child.id}
              goal={child}
              depth={depth + 1}
              visibleIds={visibleIds}
              expandedIds={expandedIds}
              pendingId={pendingId}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onQuickAdd={onQuickAdd}
              onComplete={onComplete}
              onProgressChange={onProgressChange}
              onAddAmount={onAddAmount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
