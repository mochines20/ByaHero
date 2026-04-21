import { useMemo } from "react";
import { Card } from "../components/ui/Card";
import { useTrips } from "../hooks/useTrips";

export function RecapPage() {
  const { trips } = useTrips();

  const recap = useMemo(() => {
    const totalFare = trips.reduce((sum, t) => sum + Number(t.fare || 0), 0);
    const totalMinutes = trips.reduce((sum, t) => sum + Number(t.travelTime || 0), 0);
    const longest = trips.reduce((best, t) => (Number(t.travelTime || 0) > Number(best.travelTime || 0) ? t : best), trips[0] ?? null);
    return { totalFare, totalMinutes, tripCount: trips.length, longest };
  }, [trips]);

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <h1 className="text-xl font-bold text-byahero-navy sm:text-2xl">Monthly Commute Recap</h1>
        <p className="mt-1 text-sm text-byahero-muted">A shareable summary based on your logged trips.</p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="rounded-3xl">
          <p className="text-xs text-byahero-muted">Trips logged</p>
          <p className="mt-1 text-2xl font-bold text-byahero-navy">{recap.tripCount}</p>
        </Card>
        <Card className="rounded-3xl">
          <p className="text-xs text-byahero-muted">Total fare</p>
          <p className="mt-1 text-2xl font-bold text-byahero-navy">PHP {recap.totalFare.toFixed(2)}</p>
        </Card>
        <Card className="rounded-3xl">
          <p className="text-xs text-byahero-muted">Total time</p>
          <p className="mt-1 text-2xl font-bold text-byahero-navy">{recap.totalMinutes} mins</p>
        </Card>
        <Card className="rounded-3xl">
          <p className="text-xs text-byahero-muted">Longest trip</p>
          <p className="mt-1 text-sm font-semibold text-byahero-navy">
            {recap.longest ? `${recap.longest.origin} → ${recap.longest.destination}` : "N/A"}
          </p>
          <p className="mt-1 text-sm text-byahero-muted">
            {recap.longest ? `${recap.longest.travelTime} mins • PHP ${Number(recap.longest.fare || 0).toFixed(2)}` : ""}
          </p>
        </Card>
      </div>
    </div>
  );
}

