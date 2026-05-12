"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { BarChart3, CalendarRange, Plus, Target } from "lucide-react";

import {
  addGoalAmount,
  createGoal,
  deleteGoal,
  markGoalComplete,
  updateGoal,
  updateGoalProgress,
} from "@/app/actions/goals";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FinancialSummaryPanel } from "@/components/dashboard/financial-summary-panel";
import { GoalFilters } from "@/components/dashboard/goal-filters";
import { GoalFormPanel } from "@/components/dashboard/goal-form-panel";
import { GoalHeatmap } from "@/components/dashboard/goal-heatmap";
import { GoalHierarchyTree } from "@/components/dashboard/goal-hierarchy-tree";
import { GoalProgressBar } from "@/components/dashboard/goal-progress-bar";
import { QuarterProgressGrid } from "@/components/dashboard/quarter-progress-grid";
import { SummaryStats } from "@/components/dashboard/summary-stats";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { WeeklyFocusPanel } from "@/components/dashboard/weekly-focus-panel";
import {
  buildFinancialSummary,
  buildGoalTree,
  buildHeatmap,
  buildQuarterSummaries,
  buildVisibleGoalIds,
  computeSummaryStats,
  emptyGoalFormValues,
  getCurrentQuarter,
  getDescendantIds,
  getFocusBuckets,
  getProgressTone,
  getWeeklyMotivation,
  labelMap,
  type DashboardFilters,
  type GoalActivityRecord,
  type GoalFormValues,
  type GoalLevelValue,
  type GoalRecord,
  type GoalStatusValue,
  GOAL_LEVELS,
} from "@/lib/goals";

type GoalDashboardProps = {
  initialGoals: GoalRecord[];
  initialActivities: GoalActivityRecord[];
};

const defaultFilters: DashboardFilters = {
  status: "ALL",
  level: "ALL",
  priority: "ALL",
  timeframe: "ALL",
};

function getChildLevel(level: GoalLevelValue): GoalLevelValue | null {
  const currentIndex = GOAL_LEVELS.indexOf(level);
  const nextLevel = GOAL_LEVELS[currentIndex + 1];
  return nextLevel ?? null;
}

function intensityForStatus(status: GoalStatusValue) {
  if (status === "COMPLETED") return 4;
  if (status === "BLOCKED") return 1;
  if (status === "IN_PROGRESS") return 3;
  return 2;
}

export function GoalDashboard({
  initialGoals,
  initialActivities,
}: GoalDashboardProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [activities, setActivities] = useState(initialActivities);
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [search, setSearch] = useState("");
  const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
  const [panelOpen, setPanelOpen] = useState(false);
  const [formValues, setFormValues] = useState<GoalFormValues>(emptyGoalFormValues("YEARLY"));
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () =>
      new Set(
        initialGoals
          .filter((goal) => goal.level === "YEARLY" || goal.level === "QUARTERLY")
          .map((goal) => goal.id),
      ),
  );

  useEffect(() => {
    setGoals(initialGoals);
    setActivities(initialActivities);
  }, [initialActivities, initialGoals]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isTyping =
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName);

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (!isTyping && event.key.toLowerCase() === "n") {
        event.preventDefault();
        openCreatePanel("YEARLY", null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentYear = new Date().getFullYear();
  const activeQuarter = getCurrentQuarter();
  const weeklyQuote = useMemo(() => getWeeklyMotivation(), []);
  const summary = useMemo(() => computeSummaryStats(goals), [goals]);
  const financialSummary = useMemo(() => buildFinancialSummary(goals), [goals]);
  const tree = useMemo(() => buildGoalTree(goals), [goals]);
  const visibleIds = useMemo(
    () => buildVisibleGoalIds(goals, search, filters),
    [filters, goals, search],
  );
  const heatmap = useMemo(() => buildHeatmap(activities), [activities]);
  const quarterSummaries = useMemo(() => buildQuarterSummaries(goals), [goals]);
  const focusBuckets = useMemo(() => getFocusBuckets(goals), [goals]);

  const progressOverview = useMemo(() => {
    return GOAL_LEVELS.map((level) => {
      const matching = goals.filter((goal) => goal.level === level);
      const progress = matching.length
        ? Math.round(matching.reduce((sum, goal) => sum + goal.progress, 0) / matching.length)
        : 0;
      const done = matching.filter((goal) => goal.status === "COMPLETED").length;

      return {
        level,
        progress,
        done,
        total: matching.length,
      };
    });
  }, [goals]);

  const summaryStats = useMemo(
    () => [
      { label: "Current year", value: String(currentYear) },
      { label: "Active quarter", value: `Q${activeQuarter}` },
      { label: "Total goals", value: String(summary.totalGoals) },
      { label: "Completed", value: String(summary.completed), tone: "success" as const },
      { label: "In progress", value: String(summary.inProgress), tone: "warning" as const },
      { label: "Blocked", value: String(summary.blocked), tone: "danger" as const },
      { label: "Completion rate", value: `${summary.completionRate}%` },
    ],
    [activeQuarter, currentYear, summary],
  );

  function upsertActivity(goalId: string, status: GoalStatusValue, note: string, completedCount = 0) {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const isoDate = today.toISOString();

    setActivities((current) => {
      const next = [...current];
      const existingIndex = next.findIndex(
        (activity) =>
          activity.goalId === goalId && activity.activityDate.slice(0, 10) === isoDate.slice(0, 10),
      );

      const activity = {
        id: `${goalId}-${isoDate.slice(0, 10)}`,
        goalId,
        activityDate: isoDate,
        intensity: intensityForStatus(status),
        completedCount,
        note,
        createdAt: isoDate,
        updatedAt: isoDate,
      } satisfies GoalActivityRecord;

      if (existingIndex >= 0) {
        next[existingIndex] = activity;
        return next;
      }

      return [...next, activity];
    });
  }

  function openCreatePanel(level: GoalLevelValue, parentId: string | null) {
    setPanelMode("create");
    setEditingGoalId(null);
    setFormError(null);
    setDeleteArmed(false);
    setFormValues(emptyGoalFormValues(level, parentId));
    setPanelOpen(true);
  }

  function openEditPanel(goal: GoalRecord) {
    setPanelMode("edit");
    setEditingGoalId(goal.id);
    setFormError(null);
    setDeleteArmed(false);
    setFormValues({
      title: goal.title,
      description: goal.description ?? "",
      kind: goal.kind,
      currency: goal.currency,
      level: goal.level,
      parentId: goal.parentId,
      status: goal.status,
      progress: goal.progress,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      dueDate: goal.dueDate,
      startDate: goal.startDate,
      priority: goal.priority,
      tags: goal.tags,
      notes: goal.notes ?? "",
    });
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setFormError(null);
    setDeleteArmed(false);
    setEditingGoalId(null);
  }

  function applyGoalUpdate(updatedGoal: GoalRecord) {
    setGoals((current) => {
      const exists = current.some((goal) => goal.id === updatedGoal.id);
      if (!exists) {
        return [...current, updatedGoal];
      }

      return current.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal));
    });
  }

  function handleSubmit() {
    setFormError(null);

    if (!formValues.title.trim()) {
      setFormError("A clear goal title is required.");
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          if (panelMode === "create") {
            const created = await createGoal({
              ...formValues,
              title: formValues.title.trim(),
              description: formValues.description.trim() || null,
              notes: formValues.notes.trim() || null,
              tags: formValues.tags,
            });

            applyGoalUpdate(created);
            upsertActivity(created.id, created.status, "Created goal");

            if (created.parentId) {
              setExpandedIds((current) => new Set(current).add(created.parentId!));
            }
          } else if (editingGoalId) {
            const updated = await updateGoal(editingGoalId, {
              ...formValues,
              title: formValues.title.trim(),
              description: formValues.description.trim() || null,
              notes: formValues.notes.trim() || null,
              tags: formValues.tags,
            });

            applyGoalUpdate(updated);
            upsertActivity(updated.id, updated.status, "Updated goal");
          }

          closePanel();
        } catch (error) {
          setFormError(error instanceof Error ? error.message : "Unable to save goal.");
        }
      })();
    });
  }

  function handleDelete() {
    if (!editingGoalId) {
      return;
    }

    if (!deleteArmed) {
      setDeleteArmed(true);
      setFormError("Press delete again to remove this goal and all nested goals.");
      return;
    }

    setPendingId(editingGoalId);
    startTransition(() => {
      void (async () => {
        try {
          await deleteGoal(editingGoalId);
          setGoals((current) => {
            const descendants = getDescendantIds(current)(editingGoalId);
            return current.filter(
              (goal) => goal.id !== editingGoalId && !descendants.has(goal.id),
            );
          });
          closePanel();
        } catch (error) {
          setFormError(error instanceof Error ? error.message : "Unable to delete goal.");
        } finally {
          setPendingId(null);
        }
      })();
    });
  }

  function handleQuickAdd(goal: GoalRecord) {
    const childLevel = getChildLevel(goal.level);
    if (!childLevel) {
      return;
    }

    openCreatePanel(childLevel, goal.id);
  }

  function handleComplete(goal: GoalRecord) {
    setPendingId(goal.id);
    startTransition(() => {
      void (async () => {
        try {
          const updated = await markGoalComplete(goal.id);
          applyGoalUpdate(updated);
          upsertActivity(updated.id, updated.status, "Marked complete", 1);
        } finally {
          setPendingId(null);
        }
      })();
    });
  }

  function handleProgressChange(goal: GoalRecord, progress: number) {
    setPendingId(goal.id);
    startTransition(() => {
      void (async () => {
        try {
          const updated = await updateGoalProgress(goal.id, progress);
          applyGoalUpdate(updated);
          upsertActivity(
            updated.id,
            updated.status,
            `Progress updated to ${updated.progress}%`,
            updated.progress === 100 ? 1 : 0,
          );
        } finally {
          setPendingId(null);
        }
      })();
    });
  }

  function handleAddAmount(goal: GoalRecord, amount: number) {
    setPendingId(goal.id);
    startTransition(() => {
      void (async () => {
        try {
          const updated = await addGoalAmount(goal.id, amount);
          applyGoalUpdate(updated);
          upsertActivity(
            updated.id,
            updated.status,
            `Added amount ${amount}`,
            updated.progress === 100 ? 1 : 0,
          );
        } finally {
          setPendingId(null);
        }
      })();
    });
  }

  if (!goals.length) {
    return (
      <>
        <EmptyState onAddGoal={() => openCreatePanel("YEARLY", null)} />
        <GoalFormPanel
          open={panelOpen}
          mode={panelMode}
          values={formValues}
          goals={goals}
          pending={isPending}
          errorMessage={deleteArmed ? "Press delete again to confirm." : formError}
          onClose={closePanel}
          onChange={setFormValues}
          onSubmit={handleSubmit}
          onDelete={panelMode === "edit" ? handleDelete : undefined}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="border border-white/10 bg-[#0b0b0d] p-5">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Goal Tracking OS
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-zinc-50 md:text-6xl">
                {weeklyQuote.quote}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
                Weekly directive by {weeklyQuote.author}. See the year, the active quarter, what is
                moving, what is blocked, and where this week needs attention without leaving the
                page.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => openCreatePanel("YEARLY", null)}
                className="inline-flex h-11 items-center gap-2 border border-cyan-400/40 bg-cyan-400/6 px-4 text-xs uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:border-cyan-300/60"
              >
                <Plus className="h-4 w-4" />
                New goal
              </button>
              <div className="flex h-11 items-center border border-white/10 bg-black px-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                <span className="mr-3">Shortcut</span>
                <span className="font-mono text-zinc-300">N</span>
              </div>
              <label className="flex h-11 items-center border border-white/10 bg-black px-3 text-xs text-zinc-400">
                <span className="mr-3 uppercase tracking-[0.18em] text-zinc-500">Search</span>
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ctrl/Cmd + K"
                  className="min-w-[140px] bg-transparent text-right text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                />
              </label>
            </div>
          </div>

          <div className="mt-6">
            <SummaryStats stats={summaryStats} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <div className="border border-white/10 bg-[#0b0b0d] p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Progress overview
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">
                  Year, quarter, month, and week at a glance
                </h2>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
                Overall progress {summary.overallProgress}%
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {progressOverview.map((item) => (
                <article key={item.level} className="border border-white/10 bg-white/2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                        {labelMap.level[item.level]}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-zinc-50">
                        {item.progress}%
                      </h3>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-black text-zinc-300">
                      {item.level === "YEARLY" ? (
                        <Target className="h-4 w-4" />
                      ) : item.level === "QUARTERLY" ? (
                        <CalendarRange className="h-4 w-4" />
                      ) : (
                        <BarChart3 className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-zinc-400">
                    {item.done} of {item.total} completed
                  </p>
                  <div className="mt-4">
                    <GoalProgressBar
                      value={item.progress}
                      tone={getProgressTone(item.progress === 100 ? "COMPLETED" : "IN_PROGRESS")}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <GoalHeatmap cells={heatmap} />
        </section>

        <FinancialSummaryPanel summary={financialSummary} />

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <QuarterProgressGrid quarters={quarterSummaries} activeQuarter={activeQuarter} />
          <WeeklyFocusPanel buckets={focusBuckets} />
        </section>

        <GoalFilters
          filters={filters}
          search={search}
          onSearchChange={setSearch}
          onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        />

        <GoalHierarchyTree
          tree={tree}
          visibleIds={visibleIds}
          expandedIds={expandedIds}
          pendingId={pendingId}
          onToggleExpand={(id) =>
            setExpandedIds((current) => {
              const next = new Set(current);
              if (next.has(id)) {
                next.delete(id);
              } else {
                next.add(id);
              }
              return next;
            })
          }
          onEdit={openEditPanel}
          onQuickAdd={handleQuickAdd}
          onComplete={handleComplete}
          onProgressChange={handleProgressChange}
          onAddAmount={handleAddAmount}
        />
      </div>

      {panelOpen ? (
        <button
          type="button"
          aria-label="Close panel overlay"
          onClick={closePanel}
          className="fixed inset-0 z-30 bg-black/70"
        />
      ) : null}

      <GoalFormPanel
        open={panelOpen}
        mode={panelMode}
        values={formValues}
        goals={goals}
        pending={isPending}
        errorMessage={deleteArmed ? "Press delete again to confirm." : formError}
        onClose={closePanel}
        onChange={(values) => {
          setDeleteArmed(false);
          setFormError(null);
          setFormValues(values);
        }}
        onSubmit={handleSubmit}
        onDelete={panelMode === "edit" ? handleDelete : undefined}
      />
    </>
  );
}
