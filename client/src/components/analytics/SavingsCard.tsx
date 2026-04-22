import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Sparkles } from "lucide-react";

export function SavingsCard({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  const positive = diff < 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card relative overflow-hidden rounded-[2.5rem] p-8 border border-white/20 shadow-2xl flex flex-col justify-center text-center"
    >
      <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br transition-all duration-500 ${positive ? "from-emerald-400 to-teal-500" : "from-red-400 to-orange-500"}`}>
        {positive ? <TrendingDown size={28} className="text-white" /> : <TrendingUp size={28} className="text-white" />}
      </div>
      
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Savings vs Last Month</p>
      <p className="font-brand text-4xl font-black text-white mb-4">₱{Math.abs(diff).toLocaleString()}</p>
      
      <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
        <span className={`text-xs font-bold uppercase tracking-tighter ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? "Wais! Mas maliit ang gastos mo ngayon." : "Naku! Medyo napagastos ka ngayong buwan."}
        </span>
      </div>

      {positive && (
        <div className="absolute top-4 right-4 text-byahero-yellow animate-pulse">
          <Sparkles size={20} />
        </div>
      )}
    </motion.div>
  );
}

