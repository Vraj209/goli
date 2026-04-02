import { cn } from "@/lib/utils";

type GoalProgressBarProps = {
  value: number;
  tone?: "default" | "success" | "warning" | "danger";
  compact?: boolean;
};

const toneClassName: Record<NonNullable<GoalProgressBarProps["tone"]>, string> = {
  default: "bg-zinc-100",
  success: "bg-emerald-300",
  warning: "bg-amber-300",
  danger: "bg-rose-300",
};

export function GoalProgressBar({
  value,
  tone = "default",
  compact = false,
}: GoalProgressBarProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-white/10 bg-white/[0.03]",
        compact ? "h-1.5" : "h-2.5",
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 transition-[width] duration-300 ease-out",
          toneClassName[tone],
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
