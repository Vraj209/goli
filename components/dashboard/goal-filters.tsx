import {
  GOAL_LEVELS,
  GOAL_PRIORITIES,
  GOAL_STATUSES,
  type DashboardFilters,
  type GoalLevelValue,
  type GoalPriorityValue,
  type GoalStatusValue,
  labelMap,
} from "@/lib/goals";
import { ThemedSelect } from "@/components/dashboard/themed-controls";

type GoalFiltersProps = {
  filters: DashboardFilters;
  search: string;
  onSearchChange: (value: string) => void;
  onFilterChange: <Key extends keyof DashboardFilters>(
    key: Key,
    value: DashboardFilters[Key],
  ) => void;
};

export function GoalFilters({
  filters,
  search,
  onSearchChange,
  onFilterChange,
}: GoalFiltersProps) {
  return (
    <section className="border border-white/10 bg-[#0b0b0d] p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Filters
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">
            Search and slice the full goal system
          </h2>
        </div>

        <label className="flex min-w-0 flex-1 flex-col gap-2 xl:max-w-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Search goals
          </span>
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search title, notes, or tags"
            className="h-11 border border-white/10 bg-black px-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-400/50"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ThemedSelect
          label="Status"
          value={filters.status}
          options={["ALL", ...GOAL_STATUSES]}
          getLabel={(value) =>
            value === "ALL" ? "All statuses" : labelMap.status[value as GoalStatusValue]
          }
          onChange={(value) => onFilterChange("status", value as DashboardFilters["status"])}
        />
        <ThemedSelect
          label="Level"
          value={filters.level}
          options={["ALL", ...GOAL_LEVELS]}
          getLabel={(value) =>
            value === "ALL" ? "All levels" : labelMap.level[value as GoalLevelValue]
          }
          onChange={(value) => onFilterChange("level", value as DashboardFilters["level"])}
        />
        <ThemedSelect
          label="Priority"
          value={filters.priority}
          options={["ALL", ...GOAL_PRIORITIES]}
          getLabel={(value) =>
            value === "ALL" ? "All priorities" : labelMap.priority[value as GoalPriorityValue]
          }
          onChange={(value) => onFilterChange("priority", value as DashboardFilters["priority"])}
        />
        <ThemedSelect
          label="Timeframe"
          value={filters.timeframe}
          options={["ALL", "ACTIVE", "OVERDUE", "THIS_WEEK"]}
          getLabel={(value) => {
            if (value === "ALL") return "All timeframes";
            if (value === "ACTIVE") return "Active";
            if (value === "OVERDUE") return "Overdue";
            return "This week";
          }}
          onChange={(value) => onFilterChange("timeframe", value as DashboardFilters["timeframe"])}
        />
      </div>
    </section>
  );
}
