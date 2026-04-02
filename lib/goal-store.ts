import { subDays } from "date-fns";
import type { Goal, GoalActivity } from "@prisma/client";

import { prisma } from "@/lib/prisma";

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
    goals: goals.map((goal: Goal) => ({
      ...goal,
      dueDate: goal.dueDate?.toISOString() ?? null,
      startDate: goal.startDate?.toISOString() ?? null,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
    })),
    activities: activities.map((activity: GoalActivity) => ({
      ...activity,
      activityDate: activity.activityDate.toISOString(),
      createdAt: activity.createdAt.toISOString(),
      updatedAt: activity.updatedAt.toISOString(),
    })),
  };
}
