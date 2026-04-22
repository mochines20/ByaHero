import { useMemo, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { ExportButtons } from "../components/expenses/ExportButtons";
import { TripForm } from "../components/expenses/TripForm";
import { TripList } from "../components/expenses/TripList";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";
import { useTrips } from "../hooks/useTrips";
import { useToastStore } from "../store/uiStore";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Wallet, TrendingDown } from "lucide-react";

const colors = ["#FFD60A", "#60A5FA", "#34D399", "#818CF8", "#F87171"];

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
    return Array.from(map.entries()).map(([name, value]) => ({ 
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      value 
    }));
  }, [filtered]);

  return (
    <div className="space-y-8 pb-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <Wallet className="text-byahero-yellow" size={28} />
          <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter uppercase">Gasto Tracker</h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Bantayan ang bawat sentimong pinaghirapan.</p>
      </motion.header>

      <TripForm
        onSubmit={async (payload) => {
          await api.post("/trips", payload);
          pushToast("Binalasubas! Naitala na ang iyong byahe.");
          location.reload();
        }}
      />

      <div className="glass-card flex flex-wrap items-center gap-4 rounded-[2rem] p-4 border border-white/20">
        <div className="flex flex-1 gap-2 min-w-[300px]">
          <select 
            className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-xs font-black uppercase text-white outline-none focus:border-byahero-yellow" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Lahat ng Sasakyan</option>
            <option value="jeepney">Jeepney</option>
            <option value="mrt">MRT</option>
            <option value="lrt">LRT</option>
            <option value="bus">Bus</option>
            <option value="etrike">E-trike</option>
            <option value="walk">Paglalakad</option>
            <option value="grab">Grab/Joyride</option>
          </select>
          <select 
            className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-xs font-black uppercase text-white outline-none focus:border-byahero-yellow" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Petsa</option>
            <option value="amount">Halaga</option>
            <option value="transport">Uri</option>
          </select>
        </div>
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as const).map((v) => (
            <button 
              key={v} 
              className={clsx(
                "h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                view === v ? "bg-byahero-yellow text-byahero-navy shadow-yellow" : "bg-white/5 text-white/50 hover:bg-white/10"
              )} 
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-[2rem] p-6 border border-white/20 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-brand text-xl font-black text-white">Breakdown ({view})</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">By Transport Mode</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={breakdown} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={8}
                >
                  {breakdown.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(10, 36, 99, 0.9)", 
                    borderRadius: "16px", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    color: "#fff",
                    fontWeight: "bold"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card flex flex-col justify-center rounded-[2rem] p-8 border border-white/20 text-center">
          <h3 className="font-brand text-xl font-black text-white mb-2">Ibaon ang Report</h3>
          <p className="text-xs font-bold text-white/40 mb-6 uppercase tracking-widest">I-download para sa iyong budget tracker.</p>
          <ExportButtons trips={filtered} />
        </div>
      </div>

      <TripList
        trips={filtered}
        onDelete={async (id) => {
          await api.delete(`/trips/${id}`);
          pushToast("Bura na! Malinis na ang record.");
          location.reload();
        }}
      />
    </div>
  );
}

