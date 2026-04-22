import { useToastStore } from "../../store/uiStore";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Sparkles } from "lucide-react";

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-32 right-12 z-[150] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="flex min-w-[280px] items-center gap-4 rounded-3xl bg-byahero-navy/90 backdrop-blur-xl px-6 py-4 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto"
            role="status"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-byahero-yellow shadow-yellow">
              <Sparkles size={18} className="text-byahero-navy" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-byahero-yellow/60">ByaHero Alert</span>
              <p className="text-sm font-bold text-white leading-tight">{toast.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

