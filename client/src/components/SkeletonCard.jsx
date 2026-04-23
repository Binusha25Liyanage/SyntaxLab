export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[12px] border border-white/7 bg-bg-surface p-5">
      <div className="mb-4 h-4 w-24 rounded bg-bg-overlay" />
      <div className="mb-3 h-6 w-2/3 rounded bg-bg-overlay" />
      <div className="h-4 w-full rounded bg-bg-overlay" />
    </div>
  );
}
