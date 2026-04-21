export function SkeletonBlock({ className = "h-4" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-byahero-light ${className}`} />;
}

export function SkeletonPage() {
  return (
    <div className="space-y-3 p-4">
      <SkeletonBlock className="h-8 w-40" />
      <SkeletonBlock className="h-24 w-full" />
      <SkeletonBlock className="h-24 w-full" />
      <SkeletonBlock className="h-24 w-full" />
    </div>
  );
}
