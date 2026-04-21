import { useMemo, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { ExportButtons } from "../components/expenses/ExportButtons";
import { TripForm } from "../components/expenses/TripForm";
import { TripList } from "../components/expenses/TripList";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";
import { useTrips } from "../hooks/useTrips";
import { useToastStore } from "../store/uiStore";

const colors = ["#F59E0B", "#185FA5", "#0D9488", "#7E22CE", "#6B7280"];

export function ExpensesPage() {
  const { trips } = useTrips();
  const pushToast = useToastStore((s) => s.pushToast);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [view, setView] = useState("monthly");

  const filtered = useMemo(() => {
    const base = trips.filter((t) => (filterType === "all" ? true : t.transportType === filterType));
    return [...base].sort((a, b) => {
      if (sortBy === "amount") return Number(b.fare) - Number(a.fare);
      if (sortBy === "transport") return String(a.transportType).localeCompare(String(b.transportType));
      return new Date(b.tripDate).getTime() - new Date(a.tripDate).getTime();
    });
  }, [filterType, sortBy, trips]);

  const breakdown = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((t) => map.set(t.transportType, (map.get(t.transportType) ?? 0) + Number(t.fare)));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  return (
    <div className="space-y-4">
      <TripForm
        onSubmit={async (payload) => {
          await api.post("/trips", payload);
          pushToast("Trip logged");
          location.reload();
        }}
      />

      <div className="flex flex-wrap gap-2 rounded-xl border border-byahero-light bg-white p-3 shadow-card">
        <select className="h-11 rounded-lg border border-byahero-light px-3" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All transport</option>
          <option value="jeepney">Jeepney</option>
          <option value="mrt">MRT</option>
          <option value="lrt">LRT</option>
          <option value="bus">Bus</option>
          <option value="etrike">E-trike</option>
          <option value="walk">Walking</option>
          <option value="grab">Grab</option>
        </select>
        <select className="h-11 rounded-lg border border-byahero-light px-3" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort: Date</option>
          <option value="amount">Sort: Amount</option>
          <option value="transport">Sort: Transport</option>
        </select>
        <div className="ml-auto flex gap-2">
          {(["daily", "weekly", "monthly"] as const).map((v) => (
            <Button key={v} className={view === v ? "" : "secondary"} onClick={() => setView(v)} type="button">
              {v}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-byahero-light bg-white p-3 shadow-card">
          <h3 className="mb-2 text-sm font-semibold text-byahero-navy">Breakdown ({view})</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" outerRadius={85}>
                  {breakdown.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-byahero-light bg-white p-3 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-byahero-navy">Exports</h3>
          <ExportButtons trips={filtered} />
        </div>
      </div>

      <TripList
        trips={filtered}
        onDelete={async (id) => {
          await api.delete(`/trips/${id}`);
          pushToast("Trip deleted");
          location.reload();
        }}
      />
    </div>
  );
}
