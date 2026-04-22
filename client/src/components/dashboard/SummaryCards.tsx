import { motion } from "framer-motion";
import { Wallet, MapPin, Clock } from "lucide-react";

type Props = { spent: number; trips: number; minutes: number };

export function SummaryCards({ spent, trips, minutes }: Props) {
  const cards = [
    { 
      label: "Gastos Ngayon", 
      value: `₱${spent.toFixed(2)}`, 
      icon: Wallet, 
      color: "from-byahero-yellow to-orange-400" 
    },
    { 
      label: "Bilang ng Byahe", 
      value: String(trips), 
      icon: MapPin, 
      color: "from-byahero-blue to-sky-400" 
    },
    { 
      label: "Tagal sa Daan", 
      value: `${minutes}m`, 
      icon: Clock, 
      color: "from-emerald-400 to-teal-500" 
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card group relative overflow-hidden rounded-[2rem] p-6 border border-white/20 shadow-2xl"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{c.label}</p>
              <p className="mt-1 font-brand text-3xl font-black text-white">{c.value}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} shadow-lg`}>
              <c.icon size={20} className="text-byahero-navy" />
            </div>
          </div>
          
          <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${c.color} opacity-0 transition-opacity duration-500 group-hover:opacity-10 blur-2xl`} />
        </motion.div>
      ))}
    </div>
  );
}

