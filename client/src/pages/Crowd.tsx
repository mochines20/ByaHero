import { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";
import { useToastStore } from "../store/uiStore";
import { motion, AnimatePresence } from "framer-motion";
import { Users, AlertTriangle, Clock, MapPin } from "lucide-react";
import clsx from "clsx";

type Crowd = "Low" | "Moderate" | "High" | "Very High";

const tone: Record<Crowd, string> = {
  Low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  Moderate: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  High: "bg-orange-500/20 text-orange-400 border-orange-500/20",
  "Very High": "bg-rose-500/20 text-rose-400 border-rose-500/20",
};

export function CrowdPage() {
  const pushToast = useToastStore((s) => s.pushToast);
  const [origin, setOrigin] = useState("Alabang");
  const [destination, setDestination] = useState("Makati");
  const [loading, setLoading] = useState(false);
  const [crowd, setCrowd] = useState<Crowd | null>(null);
  const [peak, setPeak] = useState<string>("");

  const heat = useMemo(() => {
    return [
      { slot: "6-7 AM", level: "Moderate" as Crowd },
      { slot: "7-9 AM", level: "Very High" as Crowd },
      { slot: "10-12 PM", level: "Low" as Crowd },
      { slot: "12-3 PM", level: "Moderate" as Crowd },
      { slot: "5-8 PM", level: "Very High" as Crowd },
      { slot: "8-10 PM", level: "High" as Crowd },
    ];
  }, []);

  const check = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/planner/options", { origin, destination, departureTime: new Date().toISOString() });
      const first = data?.options?.[0];
      if (!first) {
        pushToast("Paumanhin, walang nahanap na ruta.");
        return;
      }
      setCrowd(first.crowdLevel as Crowd);
      setPeak(first.peakWindow || "");
      pushToast("Crowd prediction updated!");
    } catch (e: any) {
      pushToast(e.message || "Bigo sa pag-check ng volume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <Users className="text-byahero-yellow" size={28} />
          <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter uppercase">Crowd Predictor</h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Silipin ang dami ng tao bago sumabak sa byahe.</p>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                  <MapPin size={10} /> Origin
                </label>
                <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Saan galing?" />
              </div>
              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                  <MapPin size={10} /> Destination
                </label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Saan pupunta?" />
              </div>
            </div>
          </div>
          <Button onClick={check} disabled={loading} className="h-14 px-10 shadow-yellow min-w-[200px]">
            {loading ? "Sinusuri..." : "Suriin ang Volume"}
          </Button>
        </div>

        <AnimatePresence>
          {crowd && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-8 pt-8 border-t border-white/10"
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className={clsx(
                  "flex items-center gap-3 px-6 py-3 rounded-2xl border font-black text-sm uppercase tracking-tighter transition-all",
                  tone[crowd]
                )}>
                  <AlertTriangle size={18} />
                  Volume: {crowd}
                </div>
                {peak && (
                  <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-tighter">
                    <Clock size={18} className="text-byahero-yellow" />
                    Peak: {peak}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-brand text-xl font-black text-white uppercase tracking-tight italic">Peak Hour Heatmap</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Live Station Data</span>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {heat.map((h, i) => (
            <div key={h.slot} className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 p-4 hover:bg-white/10 transition-all cursor-default">
              <div className="flex justify-between items-center relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{h.slot}</p>
                <div className={clsx(
                  "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                  tone[h.level]
                )}>
                  {h.level}
                </div>
              </div>
              
              {/* Visual Heat Bar */}
              <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: h.level === "Low" ? "25%" : h.level === "Moderate" ? "50%" : h.level === "High" ? "75%" : "100%" }}
                  className={clsx(
                    "h-full rounded-full",
                    h.level === "Low" ? "bg-emerald-400" : h.level === "Moderate" ? "bg-amber-400" : h.level === "High" ? "bg-orange-400" : "bg-rose-400"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
        "Iwasan ang siksikan, planuhin ang byahe nating mga Hero."
      </p>
    </div>
  );
}

