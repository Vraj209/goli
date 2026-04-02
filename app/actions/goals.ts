"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  GOAL_CURRENCIES,
  GOAL_KINDS,
  GOAL_LEVELS,
  GOAL_PRIORITIES,
  GOAL_STATUSES,
  computeFinancialProgress,
  type GoalCurrencyValue,
  type GoalKindValue,
  type GoalLevelValue,
  type GoalStatusValue,
} from "@/lib/goals";
import { prisma } from "@/lib/prisma";

const goalInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(3000).nullable(),
  kind: z.enum(GOAL_KINDS),
  currency: z.enum(GOAL_CURRENCIES).nullable(),
  level: z.enum(GOAL_LEVELS),
  parentId: z.string().cuid().nullable(),
  status: z.enum(GOAL_STATUSES),
  progress: z.number().int().min(0).max(100),
  targetValue: z.number().nullable(),
  currentValue: z.number().nullable(),
  dueDate: z.string().nullable(),
  startDate: z.string().nullable(),
  priority: z.enum(GOAL_PRIORITIES),
  tags: z.array(z.string().trim().min(1).max(24)).max(8),
  notes: z.string().trim().max(4000).nullable(),
});

function toDate(value: string | null) {
  return value ? new Date(value) : null;
}

function serializeGoal(goal: {
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
  dueDate: Date | null;
  startDate: Date | null;
  priority: (typeof GOAL_PRIORITIES)[number];
  tags: string[];
  notes: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...goal,
    dueDate: goal.dueDate?.toISOString() ?? null,
    startDate: goal.startDate?.toISOString() ?? null,
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString(),
  };
}

function normalizeGoalPayload(payload: z.infer<typeof goalInputSchema>) {
  if (payload.kind !== "FINANCIAL") {
    return {
      ...payload,
      currency: null,
    };
  }

  if (!payload.currency) {
    throw new Error("Financial goals require a currency.");
  }

  const targetValue = payload.targetValue === null ? null : Math.max(0, payload.targetValue);
  const currentValue = payload.currentValue === null ? 0 : Math.max(0, payload.currentValue);
  const progress = computeFinancialProgress(currentValue, targetValue);
  const status =
    progress >= 100
      ? "COMPLETED"
      : currentValue > 0 && payload.status === "NOT_STARTED"
        ? "IN_PROGRESS"
        : payload.status;

  return {
    ...payload,
    targetValue,
    currentValue,
    progress,
    status,
  };
}

async function validateHierarchy(
  level: GoalLevelValue,
  parentId: string | null,
  currentGoalId?: string,
) {
  if (level !== "YEARLY" && !parentId) {
    throw new Error("Non-yearly goals must belong to a parent goal.");
  }

  if (level === "YEARLY" && parentId) {
    throw new Error("Yearly goals cannot have a parent.");
  }

  if (!parentId) {
    return;
  }

  if (currentGoalId && parentId === currentGoalId) {
    throw new Error("A goal cannot be its own parent.");
  }

  const parent = await prisma.goal.findUnique({
    where: { id: parentId },
    select: { level: true },
  });

  if (!parent) {
    throw new Error("Parent goal not found.");
  }

  const expectedParentLevel = GOAL_LEVELS[GOAL_LEVELS.indexOf(level) - 1];

  if (parent.level !== expectedParentLevel) {
    throw new Error("Parent goal level does not match the hierarchy.");
  }

  if (currentGoalId) {
    const descendants = await prisma.goal.findMany({
      where: {
        parentId: currentGoalId,
      },
      select: { id: true },
    });

    const queue = descendants.map((goal) => goal.id);
    const visited = new Set(queue);

    while (queue.length) {
      const nextId = queue.shift();
      if (!nextId) {
        continue;
      }

      if (nextId === parentId) {
        throw new Error("A goal cannot be moved underneath one of its descendants.");
      }

      const children = await prisma.goal.findMany({
        where: { parentId: nextId },
        select: { id: true },
      });

      for (const child of children) {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          queue.push(child.id);
        }
      }
    }
  }
}

async function touchGoalActivity(
  goalId: string,
  status: GoalStatusValue,
  note: string,
  completedCount = 0,
) {
  const activityDate = new Date();
  activityDate.setHours(12, 0, 0, 0);

  const intensity =
    status === "COMPLETED" ? 4 : status === "BLOCKED" ? 1 : status === "IN_PROGRESS" ? 3 : 2;

  await prisma.goalActivity.upsert({
    where: {
      goalId_activityDate: {
        goalId,
        activityDate,
      },
    },
    update: {
      intensity,
      completedCount,
      note,
    },
    create: {
      goalId,
      activityDate,
      intensity,
      completedCount,
      note,
    },
  });
}

export async function createGoal(input: z.infer<typeof goalInputSchema>) {
  const payload = normalizeGoalPayload(goalInputSchema.parse(input));
  await validateHierarchy(payload.level, payload.parentId);

  const siblingCount = await prisma.goal.count({
    where: { parentId: payload.parentId },
  });

  const created = await prisma.goal.create({
    data: {
      title: payload.title,
      description: payload.description,
      kind: payload.kind,
      currency: payload.currency,
      level: payload.level,
      parentId: payload.parentId,
      status: payload.status,
      progress: payload.progress,
      targetValue: payload.targetValue,
      currentValue: payload.currentValue,
      dueDate: toDate(payload.dueDate),
      startDate: toDate(payload.startDate),
      priority: payload.priority,
      tags: payload.tags,
      notes: payload.notes,
      sortOrder: siblingCount,
    },
  });

  await touchGoalActivity(created.id, created.status, "Created goal");
  revalidatePath("/");

  return serializeGoal(created);
}

export async function updateGoal(id: string, input: z.infer<typeof goalInputSchema>) {
  const payload = normalizeGoalPayload(goalInputSchema.parse(input));
  await validateHierarchy(payload.level, payload.parentId, id);

  const updated = await prisma.goal.update({
    where: { id },
    data: {
      title: payload.title,
      description: payload.description,
      kind: payload.kind,
      currency: payload.currency,
      level: payload.level,
      parentId: payload.parentId,
      status: payload.status,
      progress: payload.progress,
      targetValue: payload.targetValue,
      currentValue: payload.currentValue,
      dueDate: toDate(payload.dueDate),
      startDate: toDate(payload.startDate),
      priority: payload.priority,
      tags: payload.tags,
      notes: payload.notes,
    },
  });

  await touchGoalActivity(updated.id, updated.status, "Updated goal");
  revalidatePath("/");

  return serializeGoal(updated);
}

export async function deleteGoal(id: string) {
  await prisma.goal.delete({
    where: { id },
  });

  revalidatePath("/");
  return { id };
}

export async function markGoalComplete(id: string) {
  const current = await prisma.goal.findUnique({
    where: { id },
  });

  if (!current) {
    throw new Error("Goal not found.");
  }

  const updated = await prisma.goal.update({
    where: { id },
    data: {
      status: "COMPLETED",
      progress: 100,
      currentValue: current.kind === "FINANCIAL" ? current.targetValue ?? current.currentValue : current.targetValue ?? current.currentValue,
    },
  });

  await touchGoalActivity(updated.id, updated.status, "Marked complete", 1);
  revalidatePath("/");

  return serializeGoal(updated);
}

export async function updateGoalProgress(id: string, progress: number) {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));
  const current = await prisma.goal.findUnique({
    where: { id },
  });

  if (!current) {
    throw new Error("Goal not found.");
  }

  if (current.kind === "FINANCIAL") {
    throw new Error("Financial goals use amount updates instead of manual progress.");
  }

  const nextStatus: GoalStatusValue =
    safeProgress >= 100
      ? "COMPLETED"
      : safeProgress > 0 && current.status === "NOT_STARTED"
        ? "IN_PROGRESS"
        : current.status;

  const updated = await prisma.goal.update({
    where: { id },
    data: {
      progress: safeProgress,
      status: nextStatus,
    },
  });

  await touchGoalActivity(
    updated.id,
    updated.status,
    `Progress updated to ${safeProgress}%`,
    safeProgress >= 100 ? 1 : 0,
  );
  revalidatePath("/");

  return serializeGoal(updated);
}

export async function addGoalAmount(id: string, amount: number) {
  const safeAmount = Math.max(0, Math.round(amount * 100) / 100);

  if (safeAmount <= 0) {
    throw new Error("Add amount must be greater than zero.");
  }

  const current = await prisma.goal.findUnique({
    where: { id },
  });

  if (!current) {
    throw new Error("Goal not found.");
  }

  if (current.kind !== "FINANCIAL") {
    throw new Error("Only financial goals accept amount updates.");
  }

  const nextCurrentValue = Math.max(0, (current.currentValue ?? 0) + safeAmount);
  const nextProgress = computeFinancialProgress(nextCurrentValue, current.targetValue);
  const nextStatus: GoalStatusValue =
    nextProgress >= 100 ? "COMPLETED" : nextCurrentValue > 0 ? "IN_PROGRESS" : current.status;

  const updated = await prisma.goal.update({
    where: { id },
    data: {
      currentValue: nextCurrentValue,
      progress: nextProgress,
      status: nextStatus,
    },
  });

  await touchGoalActivity(
    updated.id,
    updated.status,
    `Added amount ${safeAmount}`,
    nextProgress >= 100 ? 1 : 0,
  );
  revalidatePath("/");

  return serializeGoal(updated);
}
