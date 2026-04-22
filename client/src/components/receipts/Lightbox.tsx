import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function Lightbox({ url, onClose }: { url: string | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {url && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-byahero-navy/90 backdrop-blur-xl p-4" 
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-h-[90vh] max-w-full overflow-hidden rounded-[3rem] border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={url} alt="Receipt preview" className="max-h-[90vh] max-w-full object-contain" />
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

