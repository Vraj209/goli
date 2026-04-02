"use client";

import { useEffect, useMemo } from "react";

import {
  applyCurrentPeriodQuickPick,
  applyParentSuggestion,
  applyGoalDateSelection,
  applyGoalLevelSelection,
  GOAL_CURRENCIES,
  GOAL_KINDS,
  GOAL_LEVELS,
  GOAL_PRIORITIES,
  GOAL_STATUSES,
  computeFinancialProgress,
  formatCurrencyAmount,
  getFinancialGoalCopy,
  getGoalPeriodLabel,
  getQuickPickLabel,
  isUsingCurrentPeriod,
  normalizeFinancialValues,
  labelMap,
  parseTagInput,
  toDateInputValue,
  type GoalFormValues,
  type GoalLevelValue,
  type GoalPriorityValue,
  type GoalRecord,
  type GoalStatusValue,
} from "@/lib/goals";
import {
  ThemedDatePicker,
  ThemedSelect,
} from "@/components/dashboard/themed-controls";

type GoalFormPanelProps = {
  open: boolean;
  mode: "create" | "edit";
  values: GoalFormValues;
  goals: GoalRecord[];
  pending: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onChange: (values: GoalFormValues) => void;
  onSubmit: () => void;
  onDelete?: () => void;
};

export function GoalFormPanel({
  open,
  mode,
  values,
  goals,
  pending,
  errorMessage,
  onClose,
  onChange,
  onSubmit,
  onDelete,
}: GoalFormPanelProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  const validParents = useMemo(() => {
    const parentIndex = GOAL_LEVELS.indexOf(values.level) - 1;
    if (parentIndex < 0) {
      return [];
    }

    const parentLevel = GOAL_LEVELS[parentIndex];
    return goals.filter((goal) => goal.level === parentLevel);
  }, [goals, values.level]);

  const selectedParent = useMemo(
    () => validParents.find((goal) => goal.id === values.parentId) ?? null,
    [validParents, values.parentId],
  );

  const periodPreview = useMemo(
    () => getGoalPeriodLabel(values.level, values.startDate, values.dueDate),
    [values.dueDate, values.level, values.startDate],
  );
  const isFinancial = values.kind === "FINANCIAL";
  const financialCopy = useMemo(() => getFinancialGoalCopy(values), [values]);
  const hasQuickPick = values.level !== "YEARLY" || values.startDate !== null || values.dueDate !== null;
  const currentPeriodActive = useMemo(() => isUsingCurrentPeriod(values), [values]);
  const financialProgressPreview = useMemo(
    () => computeFinancialProgress(values.currentValue, values.targetValue),
    [values.currentValue, values.targetValue],
  );

  const periodTitle =
    values.level === "QUARTERLY"
      ? "Quarter"
      : values.level === "MONTHLY"
        ? "Month"
        : values.level === "WEEKLY"
          ? "Week"
          : "Year";

  const parentHint =
    values.level === "YEARLY"
      ? "Top-level yearly goal"
      : selectedParent
        ? `Suggested ${labelMap.level[selectedParent.level].toLowerCase()} parent: ${selectedParent.title}`
        : `Select a ${labelMap.level[validParents[0]?.level ?? GOAL_LEVELS[Math.max(0, GOAL_LEVELS.indexOf(values.level) - 1)]]} parent.`;

  const dateHint =
    values.level === "QUARTERLY"
      ? "Pick any day in the quarter and both dates will snap to the full quarter."
      : values.level === "MONTHLY"
        ? "Pick any day in the month and both dates will snap to the full month."
        : values.level === "WEEKLY"
          ? "Pick any day in the week and both dates will snap to Monday-Sunday."
          : "Pick dates to anchor the yearly goal in time.";

  return (
    <div
      className={`fixed inset-y-0 right-0 z-40 w-full max-w-2xl border-l border-white/10 bg-[#08080a] shadow-2xl transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                {mode === "create" ? "Quick add" : "Edit goal"}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
                {mode === "create"
                  ? "Capture the next meaningful goal"
                  : "Update scope, status, or pacing"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <TextField
            label="Title"
            value={values.title}
            onChange={(title) => onChange({ ...values, title })}
            placeholder="Ship the execution cockpit"
          />

          <TextAreaField
            label="Description"
            value={values.description}
            onChange={(description) => onChange({ ...values, description })}
            placeholder="Outcome, scope, and why it matters."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <InfoPanel
              label="Hierarchy context"
              value={parentHint}
              tone={selectedParent ? "default" : "muted"}
            />
            <InfoPanel
              label={`${periodTitle} preview`}
              value={periodPreview ?? "Set a start or due date to lock the time period."}
              tone={periodPreview ? "accent" : "muted"}
            />
          </div>

          {hasQuickPick ? (
            <div className="border border-white/10 bg-white/2 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    Quick period
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Snap this goal to the current execution window in one click.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      applyParentSuggestion(goals, applyCurrentPeriodQuickPick(values)),
                    )
                  }
                  className={`border px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${
                    currentPeriodActive
                      ? "border-cyan-400/40 bg-cyan-400/8 text-cyan-100"
                      : "border-white/10 text-zinc-300 hover:border-white/20 hover:text-zinc-100"
                  }`}
                >
                  {getQuickPickLabel(values.level)}
                </button>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <ThemedSelect
              label="Goal type"
              value={values.kind}
              options={GOAL_KINDS}
              getLabel={(value) => labelMap.kind[value as keyof typeof labelMap.kind]}
              onChange={(kind) =>
                onChange(
                  normalizeFinancialValues({
                    ...values,
                    kind: kind as GoalFormValues["kind"],
                  }),
                )
              }
              description="Use Financial for money-based goals like loans, savings, or revenue targets."
            />
            <ThemedSelect
              label="Level"
              value={values.level}
              options={GOAL_LEVELS}
              getLabel={(value) => labelMap.level[value as GoalLevelValue]}
              onChange={(level) =>
                onChange(
                  applyParentSuggestion(
                    goals,
                    applyGoalLevelSelection(values, level as GoalFormValues["level"]),
                  ),
                )
              }
            />

            <ThemedSelect
              label="Parent"
              value={values.parentId ?? ""}
              options={["", ...validParents.map((goal) => goal.id)]}
              getLabel={(value) =>
                value ? validParents.find((goal) => goal.id === value)?.title ?? "Unknown" : "No parent"
              }
              onChange={(parentId) => onChange({ ...values, parentId: parentId || null })}
            />

            <ThemedSelect
              label="Status"
              value={values.status}
              options={GOAL_STATUSES as unknown as string[]}
              getLabel={(value) => labelMap.status[value as GoalStatusValue]}
              onChange={(status) => onChange({ ...values, status: status as GoalFormValues["status"] })}
            />

            <ThemedSelect
              label="Priority"
              value={values.priority}
              options={GOAL_PRIORITIES as unknown as string[]}
              getLabel={(value) => labelMap.priority[value as GoalPriorityValue]}
              onChange={(priority) =>
                onChange({ ...values, priority: priority as GoalFormValues["priority"] })
              }
            />
          </div>

          {isFinancial ? (
            <div className="grid gap-4 md:grid-cols-2">
              <ThemedSelect
                label="Currency"
                value={values.currency ?? "INR"}
                options={GOAL_CURRENCIES}
                getLabel={(value) => labelMap.currency[value as keyof typeof labelMap.currency]}
                onChange={(currency) =>
                  onChange(
                    normalizeFinancialValues({
                      ...values,
                      currency: currency as GoalFormValues["currency"],
                    }),
                  )
                }
                description="Financial goals are currently limited to INR and CAD."
              />
            </div>
          ) : null}

          {isFinancial ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <NumberField
                  label={financialCopy.currentLabel}
                  value={values.currentValue?.toString() ?? ""}
                  onChange={(currentValue) =>
                    onChange(
                      normalizeFinancialValues({
                        ...values,
                        currentValue: currentValue === "" ? null : Number(currentValue),
                      }),
                    )
                  }
                  placeholder="0"
                />
                <NumberField
                  label={financialCopy.targetLabel}
                  value={values.targetValue?.toString() ?? ""}
                  onChange={(targetValue) =>
                    onChange(
                      normalizeFinancialValues({
                        ...values,
                        targetValue: targetValue === "" ? null : Number(targetValue),
                      }),
                    )
                  }
                  placeholder="16500"
                />
              </div>

              <InfoPanel
                label="Financial tracking"
                value={`${financialCopy.summaryLabel} ${formatCurrencyAmount(values.currentValue, values.currency)} of ${formatCurrencyAmount(values.targetValue, values.currency)} • ${financialProgressPreview}% complete`}
                tone="accent"
              />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <NumberField
                label="Progress"
                value={String(values.progress)}
                min={0}
                max={100}
                onChange={(progress) => onChange({ ...values, progress: Number(progress) || 0 })}
              />
              <NumberField
                label="Current value"
                value={values.currentValue?.toString() ?? ""}
                onChange={(currentValue) =>
                  onChange({
                    ...values,
                    currentValue: currentValue === "" ? null : Number(currentValue),
                  })
                }
              />
              <NumberField
                label="Target value"
                value={values.targetValue?.toString() ?? ""}
                onChange={(targetValue) =>
                  onChange({
                    ...values,
                    targetValue: targetValue === "" ? null : Number(targetValue),
                  })
                }
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <ThemedDatePicker
              label="Start date"
              value={toDateInputValue(values.startDate)}
              description={dateHint}
              onChange={(startDate) =>
                onChange(
                  applyParentSuggestion(
                    goals,
                    applyGoalDateSelection(values, "startDate", startDate || null),
                  ),
                )
              }
            />
            <ThemedDatePicker
              label="Due date"
              value={toDateInputValue(values.dueDate)}
              description={dateHint}
              onChange={(dueDate) =>
                onChange(
                  applyParentSuggestion(
                    goals,
                    applyGoalDateSelection(values, "dueDate", dueDate || null),
                  ),
                )
              }
            />
          </div>

          <TextField
            label="Tags"
            value={values.tags.join(", ")}
            onChange={(tagInput) => onChange({ ...values, tags: parseTagInput(tagInput) })}
            placeholder="strategy, focus, q1"
          />

          <TextAreaField
            label="Notes"
            value={values.notes}
            onChange={(notes) => onChange({ ...values, notes })}
            placeholder="Dependencies, risks, or review notes."
          />
        </div>

        <div className="border-t border-white/10 px-5 py-5">
          {errorMessage ? (
            <p className="mb-4 border border-rose-400/25 bg-rose-400/6 px-3 py-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {mode === "edit" && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="border border-rose-400/30 px-4 py-3 text-xs uppercase tracking-[0.2em] text-rose-200 transition-colors hover:border-rose-300/50"
              >
                Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={pending}
                className="border border-cyan-400/40 bg-cyan-400/6 px-4 py-3 text-xs uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:border-cyan-300/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "Saving..." : mode === "create" ? "Create goal" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoPanel({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "muted";
}) {
  const toneClassName =
    tone === "accent"
      ? "border-cyan-400/30 bg-cyan-400/6 text-cyan-100"
      : tone === "muted"
        ? "border-white/10 bg-white/[0.02] text-zinc-400"
        : "border-white/10 bg-white/[0.02] text-zinc-100";

  return (
    <div className={`border p-4 ${toneClassName}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      <p className="mt-3 text-sm leading-6">{value}</p>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 border border-white/10 bg-black px-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-400/50"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 border border-white/10 bg-black px-3 text-sm text-zinc-100 outline-none transition-colors focus:border-cyan-400/50"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </span>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="border border-white/10 bg-black px-3 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-400/50"
      />
    </label>
  );
}
