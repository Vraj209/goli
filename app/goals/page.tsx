import { GoalDashboard } from "@/components/dashboard/goal-dashboard";
import { getDashboardData } from "@/lib/goal-store";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const data = await getDashboardData();

  return (
    <main className="grain dashboard-shell min-h-screen">
      <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8">
        <GoalDashboard
          initialGoals={data.goals}
          initialActivities={data.activities}
          view="goals"
        />
      </div>
    </main>
  );
}
