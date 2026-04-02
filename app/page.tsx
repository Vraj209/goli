import { GoalDashboard } from "@/components/dashboard/goal-dashboard";
import { getDashboardData } from "@/lib/goal-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getDashboardData();

  return (
    <main className="grain min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_30%),linear-gradient(180deg,#060607_0%,#09090b_100%)]">
      <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8">
        <GoalDashboard
          initialGoals={data.goals}
          initialActivities={data.activities}
        />
      </div>
    </main>
  );
}
