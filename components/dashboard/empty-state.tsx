type EmptyStateProps = {
  onAddGoal: () => void;
};

export function EmptyState({ onAddGoal }: EmptyStateProps) {
  return (
    <section className="border border-dashed border-white/10 bg-[#0b0b0d] px-6 py-14 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
        Empty workspace
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50">
        Start with the first goal and build the system from there
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
        Add a yearly goal or capture this week’s most important commitment. The dashboard will
        structure the rest around it.
      </p>
      <button
        type="button"
        onClick={onAddGoal}
        className="mt-8 border border-cyan-400/40 bg-cyan-400/[0.06] px-5 py-3 text-xs uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:border-cyan-300/60"
      >
        Add first goal
      </button>
    </section>
  );
}
