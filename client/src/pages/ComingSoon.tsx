import { Card } from "../components/ui/Card";
import { motion } from "framer-motion";
import { Construction, Sparkles } from "lucide-react";

export function ComingSoonPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-8 pb-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <Construction className="text-byahero-yellow" size={28} />
          <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter uppercase">{title}</h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">{description}</p>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2.5rem] p-12 border border-white/20 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="h-20 w-20 mx-auto mb-8 flex items-center justify-center rounded-[2rem] bg-white/5 border border-white/10 text-byahero-yellow animate-bounce">
            <Sparkles size={32} />
          </div>
          <h3 className="font-brand text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
            Malapit Na, Hero!
          </h3>
          <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] max-w-[400px] mx-auto leading-relaxed">
            Ang feature na ito ay kasalukuyang binubuo para sa V2 ng ByaHero. Manatiling nakatutok para sa aming susunod na update!
          </p>
        </div>

        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-byahero-yellow/5 blur-[100px] rounded-full pointer-events-none" />
      </motion.div>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
        "Patuloy ang pag-asenso, patuloy ang byahe nating mga Hero."
      </p>
    </div>
  );
}

