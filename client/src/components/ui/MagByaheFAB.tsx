import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export function MagByaheFAB() {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-byahero-yellow text-byahero-navy shadow-yellow lg:bottom-12 lg:right-12"
      aria-label="Mag-byahe"
    >
      <div className="flex flex-col items-center">
        <Plus className="h-6 w-6 stroke-[3]" />
        <span className="text-[10px] font-black uppercase tracking-tighter">Byahe</span>
      </div>
    </motion.button>
  );
}
