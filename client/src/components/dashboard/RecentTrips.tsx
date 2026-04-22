import { motion } from "framer-motion";

export function RecentTrips({ trips }: { trips: any[] }) {
  return (
    <div className="glass-card rounded-[2rem] p-6 border border-white/20 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-brand text-xl font-black text-white tracking-tight">Huling Byahe</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Recent Activity</span>
      </div>
      <ul className="space-y-3">
        {trips.slice(0, 5).map((trip, i) => (
          <motion.li 
            key={trip.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10 border border-transparent hover:border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-sm font-black text-white group-hover:text-byahero-yellow transition-colors">
                  {trip.origin} <span className="text-white/30 mx-1">→</span> {trip.destination}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded-lg bg-byahero-blue/40 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-byahero-yellow border border-byahero-yellow/20">
                    {trip.transportType}
                  </span>
                  <span className="text-[10px] font-bold text-white/40">
                    {new Date(trip.tripDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="font-brand text-xl font-black text-byahero-yellow">₱{Number(trip.fare).toFixed(0)}</p>
            </div>
          </motion.li>
        ))}
      </ul>
      {trips.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/20">Wala pang byahe...</p>
        </div>
      )}
    </div>
  );
}

