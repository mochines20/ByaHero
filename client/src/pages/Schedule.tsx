import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles, Wand2 } from "lucide-react";
import { useToastStore } from "../store/uiStore";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type ScheduleItem = { day: DayKey; route: string; leave: string };

const days: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const storageKey = "byahero.schedule.v1";

export function SchedulePage() {
  const pushToast = useToastStore((s) => s.pushToast);
  const [route, setRoute] = useState("Pasig → Makati");
  const [leave, setLeave] = useState("07:20");
  const [items, setItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const filled = useMemo(() => {
    const map = new Map(items.map((i) => [i.day, i]));
    return days.map((d) => map.get(d) ?? { day: d, route: "", leave: "" });
  }, [items]);

  const applyWeek = () => {
    setItems(days.map((d) => ({ day: d, route, leave })));
    pushToast("Tagumpay! Naikarga na ang schedule sa buong linggo.");
  };

  const updateDay = (day: DayKey, next: Partial<ScheduleItem>) => {
    setItems((prev) => {
      const map = new Map(prev.map((i) => [i.day, i]));
      const cur = map.get(day) ?? { day, route: "", leave: "" };
      map.set(day, { ...cur, ...next });
      return Array.from(map.values()).sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));
    });
  };

  return (
    <div className="space-y-8 pb-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <Calendar className="text-byahero-yellow" size={28} />
          <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter uppercase">Smart Schedule</h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Planuhin ang iyong rutin, iwas-hassle heroes.</p>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-byahero-yellow" size={20} />
            <h3 className="font-brand text-xl font-black text-white uppercase tracking-tight">Quick Setup</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 w-full grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                  <MapPin size={10} /> Default Route
                </label>
                <Input value={route} onChange={(e) => setRoute(e.target.value)} placeholder="Hal. Pasig → Makati" />
              </div>
              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                  <Clock size={10} /> Leave Time
                </label>
                <Input type="time" value={leave} onChange={(e) => setLeave(e.target.value)} />
              </div>
            </div>
            <Button onClick={applyWeek} className="h-14 px-8 shadow-yellow min-w-[220px] flex items-center gap-2">
              <Wand2 size={18} /> Apply Whole Week
            </Button>
          </div>
        </div>
        
        {/* Decorative Baybayin Accent */}
        <div className="absolute -right-10 -bottom-10 select-none opacity-5 scroll-m-0 rotate-12">
          <span className="font-serif text-[180px] pointer-events-none italic">ᜐᜒᜇᜓ</span>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filled.map((i, idx) => (
          <motion.div
            key={i.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="rounded-[2rem] border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all group overflow-hidden relative">
              <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-byahero-yellow group-hover:scale-110 transition-transform">
                    <span className="text-[10px] font-black uppercase">{i.day[0]}</span>
                  </div>
                  <p className="font-brand text-2xl font-black text-white">{i.day === "Mon" ? "Lunes" : i.day === "Tue" ? "Martes" : i.day === "Wed" ? "Miyerkules" : i.day === "Thu" ? "Huwebes" : i.day === "Fri" ? "Biyernes" : i.day === "Sat" ? "Sabado" : "Linggo"}</p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Local Sync</span>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Route</label>
                  <Input 
                    value={i.route} 
                    onChange={(e) => updateDay(i.day, { route: e.target.value })} 
                    placeholder="Route" 
                    className="!h-11 !text-xs !rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Time</label>
                  <Input 
                    type="time" 
                    value={i.leave} 
                    onChange={(e) => updateDay(i.day, { leave: e.target.value })} 
                    className="!h-11 !text-xs !rounded-xl"
                  />
                </div>
              </div>

              {/* Decorative Subtle Line */}
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-byahero-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
        "Ang disiplinado na Hero, laging nasa oras sa bawat kanto."
      </p>
    </div>
  );
}

