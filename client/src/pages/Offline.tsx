import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, WifiOff, Zap, ShieldCheck } from "lucide-react";
import clsx from "clsx";

export function OfflinePage() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <Zap className="text-byahero-yellow" size={28} />
          <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter uppercase">Offline Mode</h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Kahit walang data, hero pa rin sa kalsada.</p>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2.5rem] p-10 border border-white/20 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={online ? "online" : "offline"}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              className={clsx(
                "w-24 h-24 mx-auto mb-8 rounded-[2rem] flex items-center justify-center border-2 transition-all duration-500 shadow-2xl",
                online ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-emerald-500/20" : "bg-rose-500/20 border-rose-400 text-rose-400 shadow-rose-500/20"
              )}
            >
              {online ? <Globe size={40} /> : <WifiOff size={40} />}
            </motion.div>
          </AnimatePresence>

          <h3 className="font-brand text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
            System is {online ? "Online" : "Offline"}
          </h3>
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest max-w-[300px] mx-auto leading-relaxed">
            {online 
              ? "Lahat ng iyong data ay naka-sync sa aming servers sa real-time." 
              : "Huwag mag-alala, Hero! Maaari mo pa ring gamitin ang app at mag-log ng trips. Mag-uupdate ito kapag may signal na uli."}
          </p>
        </div>

        {/* Decorative Background Glow */}
        <div className={clsx(
          "absolute inset-0 opacity-10 blur-[100px] transition-all duration-1000",
          online ? "bg-emerald-500" : "bg-rose-500"
        )} />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 rounded-[2rem] border border-white/10 flex items-start gap-4"
        >
          <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-byahero-yellow font-black">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-brand text-xl font-black text-white uppercase italic mb-1 tracking-tight">Smart Caching</h4>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">
              Ang iyong profile at mga trips ay naka-store nang ligtas sa iyong device para mabilis ang loading kahit walang net.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 rounded-[2rem] border border-white/10 flex items-start gap-4"
        >
          <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-byahero-yellow font-black">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="font-brand text-xl font-black text-white uppercase italic mb-1 tracking-tight">Auto-Sync</h4>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">
              Automatic na mag-uuplaod ang iyong mga bagong trips at resibo oras na bumalik ang iyong koneksyon.
            </p>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
        "Ang Hero, laging handa, may signal man o wala."
      </p>
    </div>
  );
}

