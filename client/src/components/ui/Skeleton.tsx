import { JeepneyLoader } from "./JeepneyLoader";

export function SkeletonBlock({ className = "h-4" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-byahero-light ${className}`} />;
}

export function SkeletonPage() {
  return <JeepneyLoader />;
}

