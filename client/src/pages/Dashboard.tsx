import { Plus, Trophy, Flame, Target } from "lucide-react";
import { useMemo } from "react";
import { RecentTrips } from "../components/dashboard/RecentTrips";
import { SpendingChart } from "../components/dashboard/SpendingChart";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { useTrips } from "../hooks/useTrips";
import { motion } from "framer-motion";

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
    <div className="space-y-6">
      {/* Hero Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card flex flex-col justify-between overflow-hidden rounded-[2.5rem] p-8 border border-white/20 shadow-2xl lg:flex-row lg:items-center"
      >
        <div className="relative z-10">
          <h2 className="font-brand text-4xl font-black text-white">Handa na sa Byahe?</h2>
          <p className="mt-2 text-sm font-bold text-byahero-yellow uppercase tracking-widest flex items-center gap-2">
            <Trophy size={16} /> Certified Commuter Hero
          </p>
        </div>
        
        <div className="mt-6 flex gap-4 lg:mt-0">
          <div className="flex flex-col items-center rounded-2xl bg-white/5 border border-white/10 px-6 py-3">
            <Flame className="text-orange-400 mb-1" size={20} />
            <span className="text-[10px] font-black uppercase text-white/40 tracking-tighter">Streak</span>
            <span className="font-brand text-2xl font-black text-white">12</span>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white/5 border border-white/10 px-6 py-3">
            <Target className="text-byahero-yellow mb-1" size={20} />
            <span className="text-[10px] font-black uppercase text-white/40 tracking-tighter">Goal</span>
            <span className="font-brand text-2xl font-black text-white">85%</span>
          </div>
        </div>

        {/* Decorative Baybayin Accent */}
        <div className="absolute -right-10 top-0 select-none opacity-5 scroll-m-0">
          <span className="font-serif text-[120px] pointer-events-none">ᜊᜌᜑᜒᜇᜓ</span>
        </div>
      </motion.div>

      <SummaryCards spent={summary.spent} trips={summary.trips} minutes={summary.minutes} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart data={weeklyData} />
        <RecentTrips trips={trips} />
      </div>

      {/* Floating Action Hint (Mobile) */}
      <div className="fixed bottom-32 right-12 lg:hidden">
        <div className="glass-card rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest text-byahero-yellow border border-byahero-yellow/20 animate-bounce">
          Tara Byahe!
        </div>
      </div>
    </div>
  );
}

