import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { motion } from "framer-motion";

export function TripForm({ onSubmit }: { onSubmit: (payload: any) => Promise<void> }) {
  const [data, setData] = useState({
    origin: "",
    destination: "",
    transportType: "jeepney",
    fare: "",
    travelTime: "",
    tripDate: new Date().toISOString().slice(0, 16),
    notes: "",
  });

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card grid gap-6 rounded-[2.5rem] p-8 border border-white/20 shadow-2xl md:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({ ...data, fare: Number(data.fare), travelTime: Number(data.travelTime) });
      }}
    >
      <div className="md:col-span-2 mb-2">
        <h3 className="font-brand text-2xl font-black text-white italic tracking-tighter">Itala ang Byahe</h3>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Log your heroic commute move</p>
      </div>

      <div className="space-y-1.5">
        <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Mula sa (Origin)</label>
        <Input placeholder="Hal. Cubao" value={data.origin} onChange={(e) => setData((s) => ({ ...s, origin: e.target.value }))} required />
      </div>
      <div className="space-y-1.5">
        <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Papunta sa (Destination)</label>
        <Input placeholder="Hal. Makati" value={data.destination} onChange={(e) => setData((s) => ({ ...s, destination: e.target.value }))} required />
      </div>
      <div className="space-y-1.5">
        <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Uri ng Sasakyan</label>
        <select
          className="h-14 w-full rounded-2xl bg-white/5 border border-white/10 px-5 font-sans text-base text-white outline-none backdrop-blur-md transition-all duration-300 focus:border-byahero-yellow focus:ring-4 focus:ring-byahero-yellow/10"
          value={data.transportType}
          onChange={(e) => setData((s) => ({ ...s, transportType: e.target.value }))}
        >
          {["jeepney", "mrt", "lrt", "bus", "etrike", "walk", "grab"].map(opt => (
            <option key={opt} value={opt} className="bg-byahero-navy text-white capitalize">{opt}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Pamasahe (₱)</label>
        <Input type="number" placeholder="0.00" value={data.fare} onChange={(e) => setData((s) => ({ ...s, fare: e.target.value }))} required />
      </div>
      <div className="space-y-1.5">
        <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Tagal sa Daan (min)</label>
        <Input type="number" placeholder="30" value={data.travelTime} onChange={(e) => setData((s) => ({ ...s, travelTime: e.target.value }))} required />
      </div>
      <div className="space-y-1.5">
        <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Petsa at Oras</label>
        <Input type="datetime-local" value={data.tripDate} onChange={(e) => setData((s) => ({ ...s, tripDate: e.target.value }))} required />
      </div>
      <div className="md:col-span-2 space-y-1.5">
        <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Mga Tala (Notes)</label>
        <textarea
          className="h-28 w-full rounded-[1.5rem] bg-white/5 border border-white/10 p-5 font-sans text-base text-white outline-none backdrop-blur-md transition-all duration-300 focus:border-byahero-yellow focus:ring-4 focus:ring-byahero-yellow/10 placeholder:text-white/20"
          placeholder="Anong kwento sa byaheng ito?"
          value={data.notes}
          onChange={(e) => setData((s) => ({ ...s, notes: e.target.value }))}
        />
      </div>
      <div className="md:col-span-2">
        <Button className="w-full h-14">Itala ang Byahe</Button>
      </div>
    </motion.form>
  );
}

