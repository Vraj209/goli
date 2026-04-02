import { subDays } from "date-fns";

import { prisma } from "@/lib/prisma";

/** Inferred from the client so we do not rely on `@prisma/client` exporting model aliases (varies by tooling). */
type GoalRow = Awaited<ReturnType<typeof prisma.goal.findMany>>[number];
type GoalActivityRow = Awaited<ReturnType<typeof prisma.goalActivity.findMany>>[number];

export async function getDashboardData() {
  const [goals, activities] = await Promise.all([
    prisma.goal.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.goalActivity.findMany({
      where: {
        activityDate: {
          gte: subDays(new Date(), 140),
        },
      },
      orderBy: {
        activityDate: "asc",
      },
    }),
  ]);

  return {
    goals: goals.map((goal: GoalRow) => ({
      ...goal,
      dueDate: goal.dueDate?.toISOString() ?? null,
      startDate: goal.startDate?.toISOString() ?? null,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
    })),
    activities: activities.map((activity: GoalActivityRow) => ({
      ...activity,
      activityDate: activity.activityDate.toISOString(),
      createdAt: activity.createdAt.toISOString(),
      updatedAt: activity.updatedAt.toISOString(),
    })),
  };
}
