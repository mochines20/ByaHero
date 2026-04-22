import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export function RouteInput({
  origin,
  destination,
  onOrigin,
  onDestination,
  onPlan,
}: {
  origin: string;
  destination: string;
  onOrigin: (v: string) => void;
  onDestination: (v: string) => void;
  onPlan: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-brand text-2xl font-black text-white">Saan tayo?</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
          <MapPin size={12} className="text-byahero-yellow" /> Trip Planner
        </span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Mula sa (From)</label>
          <Input placeholder="Hal. SM North" value={origin} onChange={(e) => onOrigin(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Hanggang sa (To)</label>
          <Input placeholder="Hal. BGC" value={destination} onChange={(e) => onDestination(e.target.value)} />
        </div>
      </div>
      
      <Button className="mt-8 w-full" onClick={onPlan}>Mag-hanap ng Byahe</Button>
    </motion.div>
  );
}

