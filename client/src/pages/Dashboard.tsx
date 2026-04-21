import { Plus } from "lucide-react";
import { useMemo } from "react";
import { RecentTrips } from "../components/dashboard/RecentTrips";
import { SpendingChart } from "../components/dashboard/SpendingChart";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { useTrips } from "../hooks/useTrips";

export function DashboardPage() {
  const { trips } = useTrips();

  const summary = useMemo(() => {
    const today = new Date().toDateString();
    const todayTrips = trips.filter((t) => new Date(t.tripDate).toDateString() === today);
    return {
      spent: todayTrips.reduce((a, t) => a + Number(t.fare), 0),
      trips: todayTrips.length,
      minutes: todayTrips.reduce((a, t) => a + Number(t.travelTime || 0), 0),
    };
  }, [trips]);

  const weeklyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => ({
    day,
    amount: trips.filter((_, i) => i % 7 === idx).reduce((a, t) => a + Number(t.fare), 0),
  }));

  return (
    <div className="space-y-4">
      <SummaryCards spent={summary.spent} trips={summary.trips} minutes={summary.minutes} />
      <div className="grid gap-4 lg:grid-cols-2">
        <SpendingChart data={weeklyData} />
        <RecentTrips trips={trips} />
      </div>

      <button
        className="fixed bottom-24 right-4 z-40 min-h-14 min-w-14 rounded-full border border-white/50 bg-white/70 text-byahero-navy shadow-card backdrop-blur-xl transition hover:bg-white/85 lg:hidden"
        aria-label="Log trip"
      >
        <Plus className="mx-auto" />
      </button>
    </div>
  );
}
