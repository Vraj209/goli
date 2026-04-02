import {
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  format,
  getISOWeek,
  isSameDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
} from "date-fns";

export const GOAL_LEVELS = ["YEARLY", "QUARTERLY", "MONTHLY", "WEEKLY"] as const;
export const GOAL_KINDS = ["STANDARD", "FINANCIAL"] as const;
export const GOAL_CURRENCIES = ["INR", "CAD"] as const;
export const GOAL_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "BLOCKED",
  "ARCHIVED",
] as const;
export const GOAL_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export type GoalLevelValue = (typeof GOAL_LEVELS)[number];
export type GoalKindValue = (typeof GOAL_KINDS)[number];
export type GoalCurrencyValue = (typeof GOAL_CURRENCIES)[number];
export type GoalStatusValue = (typeof GOAL_STATUSES)[number];
export type GoalPriorityValue = (typeof GOAL_PRIORITIES)[number];

export type GoalRecord = {
  id: string;
  title: string;
  description: string | null;
  kind: GoalKindValue;
  currency: GoalCurrencyValue | null;
  level: GoalLevelValue;
  parentId: string | null;
  status: GoalStatusValue;
  progress: number;
  targetValue: number | null;
  currentValue: number | null;
  dueDate: string | null;
  startDate: string | null;
  priority: GoalPriorityValue;
  tags: string[];
  notes: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type GoalActivityRecord = {
  id: string;
  goalId: string;
  activityDate: string;
  intensity: number;
  completedCount: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GoalNode = GoalRecord & {
  children: GoalNode[];
};

export type GoalFormValues = {
  title: string;
  description: string;
  kind: GoalKindValue;
  currency: GoalCurrencyValue | null;
  level: GoalLevelValue;
  parentId: string | null;
  status: GoalStatusValue;
  progress: number;
  targetValue: number | null;
  currentValue: number | null;
  dueDate: string | null;
  startDate: string | null;
  priority: GoalPriorityValue;
  tags: string[];
  notes: string;
};

export type DashboardFilters = {
  status: GoalStatusValue | "ALL";
  level: GoalLevelValue | "ALL";
  priority: GoalPriorityValue | "ALL";
  timeframe: "ALL" | "ACTIVE" | "OVERDUE" | "THIS_WEEK";
};

export type SummaryStat = {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "danger";
};

export type FinancialSummary = {
  totalFinancialGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  totalRemainingAmount: number;
  completedFinancialGoals: number;
  averageProgress: number;
  byCurrency: FinancialCurrencySummary[];
};

export type FinancialCurrencySummary = {
  currency: GoalCurrencyValue;
  goals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  totalRemainingAmount: number;
  completedGoals: number;
  averageProgress: number;
};

export type QuarterSummary = {
  quarter: number;
  label: string;
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  progress: number;
  monthlyGoals: number;
};

export type HeatmapCell = {
  date: string;
  total: number;
  completedCount: number;
  intensity: 0 | 1 | 2 | 3 | 4;
};

export type FocusBuckets = {
  thisWeek: GoalRecord[];
  overdue: GoalRecord[];
  blocked: GoalRecord[];
  priorities: GoalRecord[];
};

const quarterNames = ["Q1", "Q2", "Q3", "Q4"] as const;
const motivationalQuotes = [
  {
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act but a habit.",
    author: "Will Durant",
  },
  {
    quote: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
  },
  {
    quote: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
  },
  {
    quote: "Great things are not done by impulse, but by a series of small things brought together.",
    author: "Vincent van Gogh",
  },
] as const;

export const labelMap = {
  level: {
    YEARLY: "Yearly",
    QUARTERLY: "Quarterly",
    MONTHLY: "Monthly",
    WEEKLY: "Weekly",
  },
  kind: {
    STANDARD: "Standard",
    FINANCIAL: "Financial",
  },
  currency: {
    INR: "INR",
    CAD: "CAD",
  },
  status: {
    NOT_STARTED: "Not started",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    BLOCKED: "Blocked",
    ARCHIVED: "Archived",
  },
  priority: {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    CRITICAL: "Critical",
  },
} as const;

export function emptyGoalFormValues(
  level: GoalLevelValue = "WEEKLY",
  parentId: string | null = null,
): GoalFormValues {
  return {
    title: "",
    description: "",
    kind: "STANDARD",
    currency: null,
    level,
    parentId,
    status: "NOT_STARTED",
    progress: 0,
    targetValue: null,
    currentValue: null,
    dueDate: null,
    startDate: null,
    priority: "MEDIUM",
    tags: [],
    notes: "",
  };
}

export function toDateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function parseTagInput(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function formatDateLabel(value: string | null) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatLongDateLabel(value: string | null) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatMetric(value: number) {
  return `${Math.round(value)}%`;
}

export function formatAmount(value: number | null) {
  if (value === null) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyAmount(
  value: number | null,
  currency: GoalCurrencyValue | null,
) {
  const amount = value ?? 0;

  if (!currency) {
    return formatAmount(amount);
  }

  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCurrentQuarter(date = new Date()) {
  return Math.floor(date.getMonth() / 3) + 1;
}

export function getQuarterLabel(quarter: number) {
  return quarterNames[quarter - 1] ?? `Q${quarter}`;
}

export function getQuarterForDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Math.floor(date.getMonth() / 3) + 1;
}

export function getQuarterLabelFromDate(value: string | null) {
  const quarter = getQuarterForDate(value);

  if (!quarter || !value) {
    return null;
  }

  const year = new Date(value).getFullYear();
  return `${getQuarterLabel(quarter)} ${year}`;
}

export function getMonthLabelFromDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function getWeekLabelFromDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return `Week ${getISOWeek(date)} • ${formatDateLabel(value)}`;
}

export function getGoalPeriodLabel(
  level: GoalLevelValue,
  startDate: string | null,
  dueDate: string | null,
) {
  const anchor = startDate ?? dueDate;

  if (!anchor) {
    return null;
  }

  switch (level) {
    case "YEARLY":
      return String(new Date(anchor).getFullYear());
    case "QUARTERLY":
      return getQuarterLabelFromDate(anchor);
    case "MONTHLY":
      return getMonthLabelFromDate(anchor);
    case "WEEKLY":
      return getWeekLabelFromDate(anchor);
    default:
      return null;
  }
}

export function getWeeklyMotivation(date = new Date()) {
  const quoteIndex = getISOWeek(date) % motivationalQuotes.length;
  return motivationalQuotes[quoteIndex];
}

function toLocalDateString(value: Date) {
  return format(value, "yyyy-MM-dd");
}

export function applyGoalDateSelection(
  values: GoalFormValues,
  field: "startDate" | "dueDate",
  selectedDate: string | null,
): GoalFormValues {
  if (!selectedDate) {
    if (
      values.level === "QUARTERLY" ||
      values.level === "MONTHLY" ||
      values.level === "WEEKLY"
    ) {
      return {
        ...values,
        startDate: null,
        dueDate: null,
      };
    }

    return {
      ...values,
      [field]: null,
    };
  }

  if (values.level === "QUARTERLY") {
    const anchor = new Date(selectedDate);
    return {
      ...values,
      startDate: toLocalDateString(startOfQuarter(anchor)),
      dueDate: toLocalDateString(endOfQuarter(anchor)),
    };
  }

  if (values.level === "MONTHLY") {
    const anchor = new Date(selectedDate);
    return {
      ...values,
      startDate: toLocalDateString(startOfMonth(anchor)),
      dueDate: toLocalDateString(endOfMonth(anchor)),
    };
  }

  if (values.level === "WEEKLY") {
    const anchor = new Date(selectedDate);
    return {
      ...values,
      startDate: toLocalDateString(startOfWeek(anchor, { weekStartsOn: 1 })),
      dueDate: toLocalDateString(endOfWeek(anchor, { weekStartsOn: 1 })),
    };
  }

  return {
    ...values,
    [field]: selectedDate,
  };
}

export function applyGoalLevelSelection(
  values: GoalFormValues,
  level: GoalLevelValue,
): GoalFormValues {
  const nextValues: GoalFormValues = {
    ...values,
    level,
    parentId: null,
  };

  const anchorDate = values.startDate ?? values.dueDate;

  if (!anchorDate) {
    return nextValues;
  }

  return applyGoalDateSelection(nextValues, "startDate", anchorDate);
}

function sortGoalsForSuggestion(goals: GoalRecord[]) {
  return [...goals].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
  });
}

function goalMatchesAnchorDate(goal: GoalRecord, anchorDate: Date) {
  const start = goal.startDate ? new Date(goal.startDate) : null;
  const due = goal.dueDate ? new Date(goal.dueDate) : null;

  if (start && due) {
    return anchorDate >= start && anchorDate <= due;
  }

  if (goal.level === "YEARLY") {
    const year = (start ?? due)?.getFullYear();
    return year ? year === anchorDate.getFullYear() : false;
  }

  if (goal.level === "QUARTERLY") {
    return (
      getQuarterForDate(goal.startDate ?? goal.dueDate) ===
        getQuarterForDate(anchorDate.toISOString()) &&
      (start ?? due)?.getFullYear() === anchorDate.getFullYear()
    );
  }

  if (goal.level === "MONTHLY") {
    const goalDate = start ?? due;
    return Boolean(
      goalDate &&
        goalDate.getMonth() === anchorDate.getMonth() &&
        goalDate.getFullYear() === anchorDate.getFullYear(),
    );
  }

  return false;
}

export function suggestParentId(goals: GoalRecord[], values: GoalFormValues) {
  if (values.level === "YEARLY") {
    return null;
  }

  const parentLevel = GOAL_LEVELS[GOAL_LEVELS.indexOf(values.level) - 1];
  const candidates = sortGoalsForSuggestion(
    goals.filter((goal) => goal.level === parentLevel),
  );

  if (!candidates.length) {
    return null;
  }

  if (values.parentId && candidates.some((goal) => goal.id === values.parentId)) {
    return values.parentId;
  }

  const anchor = values.startDate ?? values.dueDate;

  if (anchor) {
    const anchorDate = new Date(anchor);
    const matchingParent = candidates.find((goal) =>
      goalMatchesAnchorDate(goal, anchorDate),
    );

    if (matchingParent) {
      return matchingParent.id;
    }
  }

  if (candidates.length === 1) {
    return candidates[0].id;
  }

  return null;
}

export function applyParentSuggestion(goals: GoalRecord[], values: GoalFormValues) {
  return {
    ...values,
    parentId: suggestParentId(goals, values),
  };
}

export function getQuickPickLabel(level: GoalLevelValue) {
  switch (level) {
    case "QUARTERLY":
      return "Current quarter";
    case "MONTHLY":
      return "Current month";
    case "WEEKLY":
      return "This week";
    case "YEARLY":
      return "This year";
    default:
      return "Current period";
  }
}

export function applyCurrentPeriodQuickPick(
  values: GoalFormValues,
  today = new Date(),
): GoalFormValues {
  const anchor = format(today, "yyyy-MM-dd");
  return applyGoalDateSelection(values, "startDate", anchor);
}

export function isUsingCurrentPeriod(
  values: GoalFormValues,
  today = new Date(),
) {
  const quickPicked = applyCurrentPeriodQuickPick(values, today);

  return (
    values.startDate !== null &&
    values.dueDate !== null &&
    quickPicked.startDate !== null &&
    quickPicked.dueDate !== null &&
    isSameDay(new Date(values.startDate), new Date(quickPicked.startDate)) &&
    isSameDay(new Date(values.dueDate), new Date(quickPicked.dueDate))
  );
}

export function buildGoalTree(goals: GoalRecord[]) {
  const nodes = new Map<string, GoalNode>();

  for (const goal of goals) {
    nodes.set(goal.id, {
      ...goal,
      children: [],
    });
  }

  const roots: GoalNode[] = [];

  for (const goal of goals) {
    const node = nodes.get(goal.id);

    if (!node) {
      continue;
    }

    if (goal.parentId) {
      const parent = nodes.get(goal.parentId);
      parent?.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (items: GoalNode[]) => {
    items.sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      if (left.level !== right.level) {
        return GOAL_LEVELS.indexOf(left.level) - GOAL_LEVELS.indexOf(right.level);
      }

      return left.title.localeCompare(right.title);
    });

    items.forEach((item) => sortNodes(item.children));
  };

  sortNodes(roots);
  return roots;
}

export function getAncestorIds(goals: GoalRecord[]) {
  const parentMap = new Map(goals.map((goal) => [goal.id, goal.parentId]));

  return (id: string) => {
    const ancestors = new Set<string>();
    let current = parentMap.get(id) ?? null;

    while (current) {
      ancestors.add(current);
      current = parentMap.get(current) ?? null;
    }

    return ancestors;
  };
}

export function getDescendantIds(goals: GoalRecord[]) {
  const childMap = new Map<string, string[]>();

  for (const goal of goals) {
    if (!goal.parentId) {
      continue;
    }

    const existing = childMap.get(goal.parentId) ?? [];
    existing.push(goal.id);
    childMap.set(goal.parentId, existing);
  }

  return (id: string) => {
    const descendants = new Set<string>();
    const queue = [...(childMap.get(id) ?? [])];

    while (queue.length) {
      const next = queue.shift();

      if (!next || descendants.has(next)) {
        continue;
      }

      descendants.add(next);
      queue.push(...(childMap.get(next) ?? []));
    }

    return descendants;
  };
}

export function buildVisibleGoalIds(
  goals: GoalRecord[],
  search: string,
  filters: DashboardFilters,
) {
  const lowerSearch = search.trim().toLowerCase();
  const getAncestors = getAncestorIds(goals);
  const visible = new Set<string>();
  const now = new Date();
  const weekFromNow = new Date(now);
  weekFromNow.setDate(now.getDate() + 7);

  const matches = goals.filter((goal) => {
    const matchesSearch =
      !lowerSearch ||
      [goal.title, goal.description ?? "", goal.notes ?? "", goal.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(lowerSearch);

    const matchesStatus =
      filters.status === "ALL" ? true : goal.status === filters.status;
    const matchesLevel = filters.level === "ALL" ? true : goal.level === filters.level;
    const matchesPriority =
      filters.priority === "ALL" ? true : goal.priority === filters.priority;

    const dueDate = goal.dueDate ? new Date(goal.dueDate) : null;
    const matchesTimeframe =
      filters.timeframe === "ALL"
        ? true
        : filters.timeframe === "ACTIVE"
          ? goal.status === "IN_PROGRESS" || goal.status === "BLOCKED"
          : filters.timeframe === "OVERDUE"
            ? Boolean(dueDate && dueDate < now && goal.status !== "COMPLETED")
            : Boolean(
                goal.level === "WEEKLY" &&
                  dueDate &&
                  dueDate >= now &&
                  dueDate <= weekFromNow &&
                  goal.status !== "COMPLETED",
              );

    return matchesSearch && matchesStatus && matchesLevel && matchesPriority && matchesTimeframe;
  });

  if (!matches.length && !search.trim() && Object.values(filters).every((value) => value === "ALL")) {
    goals.forEach((goal) => visible.add(goal.id));
    return visible;
  }

  for (const goal of matches) {
    visible.add(goal.id);
    for (const ancestorId of getAncestors(goal.id)) {
      visible.add(ancestorId);
    }
  }

  return visible;
}

export function computeSummaryStats(goals: GoalRecord[]) {
  const completed = goals.filter((goal) => goal.status === "COMPLETED").length;
  const inProgress = goals.filter((goal) => goal.status === "IN_PROGRESS").length;
  const blocked = goals.filter((goal) => goal.status === "BLOCKED").length;
  const completionRate = goals.length ? Math.round((completed / goals.length) * 100) : 0;

  return {
    totalGoals: goals.length,
    completed,
    inProgress,
    blocked,
    completionRate,
    overallProgress: goals.length
      ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
      : 0,
  };
}

export function buildQuarterSummaries(goals: GoalRecord[]) {
  const getDescendants = getDescendantIds(goals);

  return [1, 2, 3, 4].map((quarter) => {
    const quarterGoals = goals.filter(
      (goal) => goal.level === "QUARTERLY" && getQuarterForDate(goal.dueDate ?? goal.startDate) === quarter,
    );

    const descendantMonthlyCount = new Set<string>();
    let completedGoals = 0;
    let inProgressGoals = 0;
    let totalProgress = 0;

    for (const goal of quarterGoals) {
      if (goal.status === "COMPLETED") {
        completedGoals += 1;
      }

      if (goal.status === "IN_PROGRESS") {
        inProgressGoals += 1;
      }

      totalProgress += goal.progress;

      for (const childId of getDescendants(goal.id)) {
        const child = goals.find((entry) => entry.id === childId);

        if (child?.level === "MONTHLY") {
          descendantMonthlyCount.add(child.id);
        }
      }
    }

    return {
      quarter,
      label: getQuarterLabel(quarter),
      totalGoals: quarterGoals.length,
      completedGoals,
      inProgressGoals,
      progress: quarterGoals.length ? Math.round(totalProgress / quarterGoals.length) : 0,
      monthlyGoals: descendantMonthlyCount.size,
    };
  });
}

export function buildHeatmap(
  activities: GoalActivityRecord[],
  days = 140,
  endDate = new Date(),
) {
  const dayMap = new Map<string, { total: number; completedCount: number }>();

  for (const activity of activities) {
    const key = activity.activityDate.slice(0, 10);
    const entry = dayMap.get(key) ?? { total: 0, completedCount: 0 };
    entry.total += activity.intensity;
    entry.completedCount += activity.completedCount;
    dayMap.set(key, entry);
  }

  const cells: HeatmapCell[] = [];
  const cursor = new Date(endDate);
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() - (days - 1));

  let max = 0;
  for (let index = 0; index < days; index += 1) {
    const key = cursor.toISOString().slice(0, 10);
    const entry = dayMap.get(key) ?? { total: 0, completedCount: 0 };
    max = Math.max(max, entry.total);
    cells.push({
      date: key,
      total: entry.total,
      completedCount: entry.completedCount,
      intensity: 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return cells.map((cell) => {
    if (cell.total === 0 || max === 0) {
      return {
        ...cell,
        intensity: 0 as const,
      };
    }

    const scaled = Math.ceil((cell.total / max) * 4) as 1 | 2 | 3 | 4;
    return {
      ...cell,
      intensity: scaled,
    };
  });
}

export function getFocusBuckets(goals: GoalRecord[], today = new Date()): FocusBuckets {
  const weekFromNow = new Date(today);
  weekFromNow.setDate(today.getDate() + 7);

  const activeWeekly = goals
    .filter((goal) => {
      if (goal.level !== "WEEKLY" || goal.status === "COMPLETED" || !goal.dueDate) {
        return false;
      }

      const dueDate = new Date(goal.dueDate);
      return dueDate >= today && dueDate <= weekFromNow;
    })
    .sort((left, right) => (right.progress === left.progress ? 0 : right.progress - left.progress));

  const overdue = goals
    .filter((goal) => {
      if (goal.status === "COMPLETED" || !goal.dueDate) {
        return false;
      }

      return new Date(goal.dueDate) < today;
    })
    .sort((left, right) => {
      const leftDate = left.dueDate ? new Date(left.dueDate).getTime() : 0;
      const rightDate = right.dueDate ? new Date(right.dueDate).getTime() : 0;
      return leftDate - rightDate;
    });

  const blocked = goals
    .filter((goal) => goal.status === "BLOCKED")
    .sort((left, right) => {
      return GOAL_PRIORITIES.indexOf(right.priority) - GOAL_PRIORITIES.indexOf(left.priority);
    });

  const priorities = goals
    .filter(
      (goal) =>
        goal.priority === "CRITICAL" &&
        goal.status !== "COMPLETED" &&
        goal.status !== "ARCHIVED",
    )
    .sort((left, right) => left.progress - right.progress);

  return {
    thisWeek: activeWeekly.slice(0, 5),
    overdue: overdue.slice(0, 5),
    blocked: blocked.slice(0, 5),
    priorities: priorities.slice(0, 5),
  };
}

export function getProgressTone(status: GoalStatusValue) {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "BLOCKED":
      return "danger";
    case "IN_PROGRESS":
      return "warning";
    default:
      return "default";
  }
}

export function isFinancialGoal(goal: Pick<GoalRecord, "kind"> | Pick<GoalFormValues, "kind">) {
  return goal.kind === "FINANCIAL";
}

export function getFinancialGoalCopy(
  goal: Pick<GoalRecord, "kind" | "title" | "description" | "tags"> |
    Pick<GoalFormValues, "kind" | "title" | "description" | "tags">,
) {
  if (goal.kind !== "FINANCIAL") {
    return {
      currentLabel: "Current amount",
      targetLabel: "Target amount",
      actionLabel: "Add amount",
      progressLabel: "Amount progress",
      summaryLabel: "Tracked",
    };
  }

  const context = [goal.title, goal.description ?? "", goal.tags.join(" ")]
    .join(" ")
    .toLowerCase();

  const hasKeyword = (keywords: string[]) =>
    keywords.some((keyword) => context.includes(keyword));

  if (hasKeyword(["loan", "debt", "mortgage", "credit card", "payoff"])) {
    return {
      currentLabel: "Amount paid",
      targetLabel: "Payoff target",
      actionLabel: "Add payment",
      progressLabel: "Payoff progress",
      summaryLabel: "Paid",
    };
  }

  if (hasKeyword(["invest", "investment", "portfolio", "stocks", "equity", "crypto"])) {
    return {
      currentLabel: "Amount invested",
      targetLabel: "Investment target",
      actionLabel: "Add investment",
      progressLabel: "Investment progress",
      summaryLabel: "Invested",
    };
  }

  if (hasKeyword(["revenue", "income", "sales", "earnings", "arr"])) {
    return {
      currentLabel: "Amount earned",
      targetLabel: "Revenue target",
      actionLabel: "Add revenue",
      progressLabel: "Revenue progress",
      summaryLabel: "Earned",
    };
  }

  return {
    currentLabel: "Amount saved",
    targetLabel: "Savings target",
    actionLabel: "Add savings",
    progressLabel: "Savings progress",
    summaryLabel: "Saved",
  };
}

export function computeFinancialProgress(
  currentValue: number | null,
  targetValue: number | null,
) {
  if (targetValue === null || targetValue <= 0) {
    return 0;
  }

  const current = Math.max(0, currentValue ?? 0);
  return Math.max(0, Math.min(100, Math.round((current / targetValue) * 100)));
}

export function normalizeFinancialValues(values: GoalFormValues): GoalFormValues {
  if (values.kind !== "FINANCIAL") {
    return {
      ...values,
      currency: null,
    };
  }

  const targetValue = values.targetValue === null ? null : Math.max(0, values.targetValue);
  const currentValue = values.currentValue === null ? 0 : Math.max(0, values.currentValue);
  const progress = computeFinancialProgress(currentValue, targetValue);
  const status =
    progress >= 100
      ? "COMPLETED"
      : currentValue > 0 && values.status === "NOT_STARTED"
        ? "IN_PROGRESS"
        : values.status;

  return {
    ...values,
    currency: values.currency ?? "INR",
    targetValue,
    currentValue,
    progress,
    status,
  };
}

export function buildFinancialSummary(goals: GoalRecord[]): FinancialSummary {
  const financialGoals = goals.filter((goal) => goal.kind === "FINANCIAL");

  const totalTargetAmount = financialGoals.reduce(
    (sum, goal) => sum + Math.max(0, goal.targetValue ?? 0),
    0,
  );
  const totalCurrentAmount = financialGoals.reduce(
    (sum, goal) => sum + Math.max(0, goal.currentValue ?? 0),
    0,
  );
  const totalRemainingAmount = Math.max(0, totalTargetAmount - totalCurrentAmount);
  const completedFinancialGoals = financialGoals.filter(
    (goal) => goal.status === "COMPLETED",
  ).length;
  const averageProgress = financialGoals.length
    ? Math.round(
        financialGoals.reduce((sum, goal) => sum + goal.progress, 0) /
          financialGoals.length,
      )
    : 0;

  const byCurrency = GOAL_CURRENCIES.map((currency) => {
    const currencyGoals = financialGoals.filter((goal) => goal.currency === currency);
    const totalTargetAmount = currencyGoals.reduce(
      (sum, goal) => sum + Math.max(0, goal.targetValue ?? 0),
      0,
    );
    const totalCurrentAmount = currencyGoals.reduce(
      (sum, goal) => sum + Math.max(0, goal.currentValue ?? 0),
      0,
    );
    const completedGoals = currencyGoals.filter(
      (goal) => goal.status === "COMPLETED",
    ).length;

    return {
      currency,
      goals: currencyGoals.length,
      totalTargetAmount,
      totalCurrentAmount,
      totalRemainingAmount: Math.max(0, totalTargetAmount - totalCurrentAmount),
      completedGoals,
      averageProgress: currencyGoals.length
        ? Math.round(
            currencyGoals.reduce((sum, goal) => sum + goal.progress, 0) /
              currencyGoals.length,
          )
        : 0,
    };
  }).filter((entry) => entry.goals > 0);

  return {
    totalFinancialGoals: financialGoals.length,
    totalTargetAmount,
    totalCurrentAmount,
    totalRemainingAmount,
    completedFinancialGoals,
    averageProgress,
    byCurrency,
  };
}
