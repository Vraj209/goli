export default function Loading() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-[1680px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <section
            key={index}
            className="h-40 animate-pulse border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
    </main>
  );
}
