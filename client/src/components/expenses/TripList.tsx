import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export function TripList({ trips, onDelete }: { trips: any[]; onDelete: (id: string) => Promise<void> }) {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {trips.map((trip, i) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card group flex flex-col rounded-[2rem] p-5 border border-white/10 hover:border-white/20 transition-all shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-brand text-xl font-black text-white group-hover:text-byahero-yellow transition-colors leading-tight">
                  {trip.origin} → {trip.destination}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="rounded-xl bg-byahero-blue/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-byahero-yellow border border-byahero-yellow/20 shadow-inner">
                    {trip.transportType}
                  </span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">
                    {new Date(trip.tripDate).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-brand text-2xl font-black text-byahero-yellow">P{Number(trip.fare).toFixed(2)}</p>
                <p className="text-[9px] font-black uppercase tracking-tighter text-white/50">{trip.travelTime} mins</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <p className="italic text-[11px] text-white/50 truncate max-w-[200px]">
                {trip.notes || "Walang nakasulat na tala..."}
              </p>
              <div className="flex gap-2">
                <button 
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                  aria-label="Edit trip"
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                  aria-label="Delete trip"
                  onClick={() => setPendingDelete(trip.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Modal open={Boolean(pendingDelete)} title="Burahin ang Byahe?" onClose={() => setPendingDelete(null)}>
        <div className="p-2">
          <p className="mb-8 text-sm font-bold text-white/80">
            Sigurado ka bang gusto mong burahin ang record na ito? Hindi na ito maibabalik.
          </p>
          <div className="flex gap-3">
            <Button className="secondary flex-1" onClick={() => setPendingDelete(null)}>Huwag muna</Button>
            <Button
              className="flex-1 !bg-red-500 !text-white"
              onClick={async () => {
                if (pendingDelete) {
                  await onDelete(pendingDelete);
                  setPendingDelete(null);
                }
              }}
            >
              Burahin na
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

