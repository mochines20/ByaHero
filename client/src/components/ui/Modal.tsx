import { PropsWithChildren } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = PropsWithChildren<{ open: boolean; title: string; onClose: () => void }>;

export function Modal({ open, title, onClose, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-byahero-navy/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full glass-card rounded-t-[3rem] p-8 border-t border-white/20 shadow-2xl md:max-w-lg md:rounded-[3rem] md:border"
          >
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-brand text-2xl font-black text-white italic tracking-tight">{title}</h3>
              <button 
                onClick={onClose} 
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative z-10">
              {children}
            </div>
            
            {/* Grab handle for mobile */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-white/10 md:hidden" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

