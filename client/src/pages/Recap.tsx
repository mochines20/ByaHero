import { useMemo } from "react";
import { Card } from "../components/ui/Card";
import { useTrips } from "../hooks/useTrips";
import { motion } from "framer-motion";
import { History, TrendingUp, Clock, Wallet, MapPin } from "lucide-react";

export function RecapPage() {
  const { trips } = useTrips();

  const recap = useMemo(() => {
    const totalFare = trips.reduce((sum, t) => sum + Number(t.fare || 0), 0);
    const totalMinutes = trips.reduce((sum, t) => sum + Number(t.travelTime || 0), 0);
    const longest = trips.reduce((best, t) => (Number(t.travelTime || 0) > Number(best.travelTime || 0) ? t : best), trips[0] ?? null);
    return { totalFare, totalMinutes, tripCount: trips.length, longest };
  }, [trips]);

  const stats = [
    { label: "Trips Logged", value: recap.tripCount, icon: History, color: "text-byahero-yellow" },
    { label: "Total Fare", value: `₱${recap.totalFare.toLocaleString()}`, icon: Wallet, color: "text-emerald-400" },
    { label: "Total Time", value: `${recap.totalMinutes}m`, icon: Clock, color: "text-byahero-blue" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="text-byahero-yellow" size={28} />
          <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter uppercase">Commute Recap</h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Ang iyong buwanang byahe, naka-summary na Hero.</p>
      </motion.header>

      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card flex flex-col items-center justify-center rounded-[2rem] p-8 border border-white/10 text-center">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 ${s.color}`}>
                <s.icon size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{s.label}</p>
              <p className="font-brand text-3xl font-black text-white">{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="text-byahero-yellow" size={20} />
            <h3 className="font-brand text-xl font-black text-white uppercase tracking-tight italic">Longest Heroic Journey</h3>
          </div>
          
          {recap.longest ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <p className="font-brand text-3xl font-black text-white leading-tight mb-2 uppercase italic tracking-tighter">
                  {recap.longest.origin} <span className="text-byahero-yellow">→</span> {recap.longest.destination}
                </p>
                <div className="flex gap-4">
                  <span className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Clock size={12} /> {recap.longest.travelTime} Minutes
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-byahero-yellow flex items-center gap-2">
                    <Wallet size={12} /> ₱{Number(recap.longest.fare || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-byahero-yellow animate-pulse">
                <TrendingUp size={32} />
              </div>
            </div>
          ) : (
            <p className="text-sm font-black uppercase tracking-widest text-white/20">Wala pang nakatalang byahe.</p>
          )}
        </div>
      </motion.div>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
        "Hero, balikan ang iyong bawat byahe para sa mas maaliwalas na bukas."
      </p>
    </div>
  );
}

