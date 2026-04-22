import clsx from "clsx";
import { motion } from "framer-motion";
import { Zap, Users, Info, TrendingUp, Navigation } from "lucide-react";
import { Button } from "../ui/Button";

type RouteOption = {
  id: string;
  name: string;
  cost: number;
  minutes: number;
  tag?: "fastest" | "tipid" | "balance";
  label?: string;
  crowdLevel?: "Low" | "Moderate" | "High" | "Very High";
  peakWindow?: string;
  avgSpeedKph?: number;
  fareBreakdown?: { mode: string; distanceKm: number; estimatedFare: number; note?: string }[];
  legs: { mode: string; label: string }[];
};

export function RouteCard({ option, onSave, onStart }: { option: RouteOption; onSave: () => void; onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card relative overflow-hidden rounded-[2.5rem] p-7 border border-white/20 shadow-2xl flex flex-col h-full"
    >
      {option.tag && (
        <div className={clsx(
          "absolute top-0 right-0 px-6 py-2 rounded-bl-[1.5rem] shadow-2xl",
          option.tag === "fastest" ? "bg-byahero-yellow text-byahero-navy shadow-yellow" :
          option.tag === "tipid" ? "bg-emerald-500 text-white shadow-emerald-500/20" :
          "bg-byahero-blue text-white shadow-blue-500/20"
        )}>
          <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            {option.tag === "fastest" ? <Zap size={12} fill="currentColor" /> : 
             option.tag === "tipid" ? <TrendingUp size={12} className="rotate-180" /> : 
             <Zap size={12} />} 
            {option.label}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h4 className="font-brand text-2xl font-black text-white pr-20">{option.name}</h4>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-2xl font-brand font-black text-byahero-yellow">P{option.cost.toFixed(0)}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-white/20"></span>
          <span className="text-sm font-bold text-white/50 uppercase tracking-widest">{option.minutes} mins</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
          <p className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1 mb-1">
            <Users size={10} /> Crowd
          </p>
          <p className="text-xs font-bold text-white uppercase">{option.crowdLevel ?? "Moderate"}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
          <p className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1 mb-1">
            <TrendingUp size={10} /> Avg Speed
          </p>
          <p className="text-xs font-bold text-white uppercase">{option.avgSpeedKph ?? 22} KPH</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 mb-8">
        <div className="flex items-center gap-2 text-white/40 mb-2">
          <Navigation size={12} />
          <span className="text-[10px] font-black uppercase tracking-widest">Route Steps</span>
        </div>
        {option.legs.map((leg, idx) => (
          <div key={`${leg.mode}-${idx}`} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-byahero-yellow/40">
            <p className="text-[11px] font-bold text-white leading-tight">
              <span className="text-byahero-yellow uppercase text-[9px] tracking-tighter mr-1">{leg.mode}</span> 
              {leg.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <button 
          className="flex h-12 items-center justify-center rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/50 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
          onClick={onSave}
        >
          Favorite
        </button>
        <button 
          className="flex h-12 items-center justify-center rounded-2xl bg-byahero-yellow text-[10px] font-black uppercase tracking-widest text-byahero-navy shadow-yellow transition-all hover:brightness-110 active:scale-95"
          onClick={onStart}
        >
          Simulan
        </button>
      </div>
    </motion.div>
  );
}
