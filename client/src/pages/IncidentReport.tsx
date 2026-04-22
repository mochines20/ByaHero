import { FormEvent, useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, MapPin, ClipboardList, Info, Trash2 } from "lucide-react";
import { useToastStore } from "../store/uiStore";

type Report = { id: string; createdAt: string; type: string; details: string; location?: string };
const storageKey = "byahero.incidents.v1";

export function IncidentReportPage() {
  const pushToast = useToastStore((s) => s.pushToast);
  const [type, setType] = useState("harassment");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setReports(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(reports));
  }, [reports]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      pushToast("Pakisulat ang detalye ng incident.");
      return;
    }
    const report: Report = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      type,
      details: details.trim(),
      location: location.trim() || undefined,
    };
    setReports((s) => [report, ...s]);
    setDetails("");
    setLocation("");
    pushToast("Naitala na ang report. Maraming salamat sa pagiging matapang, Hero.");
  };

  const removeReport = (id: string) => {
    setReports((s) => s.filter((r) => r.id !== id));
    pushToast("Report removed from local storage.");
  };

  return (
    <div className="space-y-8 pb-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-400" size={28} />
          <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter uppercase">Incident report</h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Isumbong ang mga aberya para sa kaligtasan ng lahat.</p>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="text-byahero-yellow" size={20} />
          <h3 className="font-brand text-xl font-black text-white uppercase tracking-tight">Report Details</h3>
        </div>
        
        <form onSubmit={submit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Uri ng Incident</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="flex h-14 w-full items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-xs font-black uppercase text-white outline-none focus:border-byahero-yellow transition-all"
              >
                <option value="harassment" className="bg-byahero-navy">Harassment</option>
                <option value="pickpocket" className="bg-byahero-navy">Pickpocketing</option>
                <option value="dangerous-driver" className="bg-byahero-navy">Dangerous Driver</option>
                <option value="other" className="bg-byahero-navy">Iba pang problema</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Saan Ito Nangyari?</label>
              <Input 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Hal. MRT Shaw, EDSA Busway" 
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Mga Detalye</label>
            <Input 
              value={details} 
              onChange={(e) => setDetails(e.target.value)} 
              placeholder="Ilarawan ang nangyari nang malinaw..." 
            />
          </div>
          
          <Button className="w-full h-14 shadow-yellow">Isumbong Ang Incident</Button>
        </form>
      </motion.div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-brand text-2xl font-black text-white italic">History</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{reports.length} report(s) logged</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {reports.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:col-span-2 py-12 glass-card rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center opacity-30"
              >
                <Info size={32} className="mb-3" />
                <p className="text-xs font-black uppercase tracking-[0.3em]">Walang nakatalang reports.</p>
              </motion.div>
            ) : (
              reports.map((r) => (
                <motion.div 
                  key={r.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card flex flex-col group p-6 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-400 border border-red-500/20">
                      {r.type}
                    </span>
                    <button 
                      onClick={() => removeReport(r.id)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <p className="font-brand text-xl font-black text-white leading-tight mb-4">{r.details}</p>
                  
                  <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      <MapPin size={10} className="text-byahero-yellow" />
                      {r.location || "Unknown Location"}
                    </div>
                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

