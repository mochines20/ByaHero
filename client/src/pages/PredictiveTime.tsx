import { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CloudRain, ShieldCheck, Zap } from "lucide-react";

function minsToClock(totalMins: number) {
  const h24 = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function PredictiveTimePage() {
  const [arrival, setArrival] = useState("09:00");
  const [traffic, setTraffic] = useState("high");
  const [weather, setWeather] = useState("clear");
  const [extra, setExtra] = useState(15);
  const [result, setResult] = useState<string | null>(null);

  const computed = useMemo(() => {
    const [h, m] = arrival.split(":").map(Number);
    const arrivalMins = h * 60 + m;
    const trafficPenalty = traffic === "high" ? 50 : traffic === "medium" ? 32 : 15;
    const weatherPenalty = weather === "rainy" ? 15 : weather === "storm" ? 30 : 0;
    const leaveMins = Math.max(0, arrivalMins - (trafficPenalty + weatherPenalty + Number(extra || 0)));
    return { leaveMins, trafficPenalty, weatherPenalty };
  }, [arrival, traffic, weather, extra]);

  return (
    <div className="space-y-8 pb-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <Clock className="text-byahero-yellow" size={28} />
          <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter uppercase">Predictive Time</h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Alamin ang tamang oras ng pag-alis para di mahuli.</p>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-6">
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                <Clock size={10} /> Target Arrival
              </label>
              <Input type="time" value={arrival} onChange={(e) => setArrival(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                <ShieldCheck size={10} /> Extra Buffer (Minutes)
              </label>
              <Input type="number" value={extra} onChange={(e) => setExtra(Number(e.target.value))} />
            </div>
          </div>

          <div className="grid gap-6">
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                <Zap size={10} /> Traffic Level
              </label>
              <select 
                value={traffic} 
                onChange={(e) => setTraffic(e.target.value)} 
                className="flex h-14 w-full items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-xs font-black uppercase text-white outline-none focus:border-byahero-yellow transition-all"
              >
                <option value="low" className="bg-byahero-navy">Low (Magaan)</option>
                <option value="medium" className="bg-byahero-navy">Medium (Katamtaman)</option>
                <option value="high" className="bg-byahero-navy">High (Siksikan)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                <CloudRain size={10} /> Weather Condition
              </label>
              <select 
                value={weather} 
                onChange={(e) => setWeather(e.target.value)} 
                className="flex h-14 w-full items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-xs font-black uppercase text-white outline-none focus:border-byahero-yellow transition-all"
              >
                <option value="clear" className="bg-byahero-navy">Clear (Maaliwalas)</option>
                <option value="rainy" className="bg-byahero-navy">Rainy (Umuulan)</option>
                <option value="storm" className="bg-byahero-navy">Storm (May Bagyo)</option>
              </select>
            </div>
          </div>
        </div>

        <Button onClick={() => setResult(minsToClock(computed.leaveMins))} className="w-full mt-8 h-14 shadow-yellow">
          Compute Leave Time
        </Button>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex flex-col items-center justify-center rounded-[2.5rem] p-10 border border-byahero-yellow/30 bg-byahero-yellow/5 text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-byahero-yellow mb-2 italic">Hero Leave Time</p>
              <h3 className="font-brand text-6xl font-black text-white italic tracking-tighter mb-6">{result}</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                  Traffic: +{computed.trafficPenalty}m
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                  Weather: +{computed.weatherPenalty}m
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                  Buffer: +{extra}m
                </div>
              </div>
            </div>
            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-byahero-yellow/10 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
        "Hero, ang bawat minuto ay mahalaga sa bawat byahe."
      </p>
    </div>
  );
}

