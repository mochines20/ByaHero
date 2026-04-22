import { motion } from "framer-motion";

export function PhotoGrid({ receipts, onOpen }: { receipts: any[]; onOpen: (url: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {receipts.map((r, i) => (
        <motion.button
          key={r.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -5 }}
          className="group relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 shadow-xl transition-all hover:border-byahero-yellow/30"
          onClick={() => onOpen(r.receipt.imageUrl)}
        >
          <img
            src={r.receipt.imageUrl}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/300x300?text=Receipt";
            }}
            alt={`${r.origin} to ${r.destination}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-byahero-navy via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-byahero-yellow mb-0.5">₱{Number(r.fare).toFixed(0)}</p>
            <p className="font-brand text-sm font-black text-white truncate leading-tight">
              {r.origin} <span className="text-white/30">→</span> {r.destination}
            </p>
          </div>
          
          {/* Active Hover Border */}
          <div className="absolute inset-0 border-2 border-byahero-yellow opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none" />
        </motion.button>
      ))}
      
      {receipts.length === 0 && (
        <div className="col-span-full py-20 text-center opacity-20">
          <p className="text-xs font-black uppercase tracking-[0.5em]">Walang record ng resibo...</p>
        </div>
      )}
    </div>
  );
}

