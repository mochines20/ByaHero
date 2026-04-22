import { useState } from "react";
import { Lightbox } from "../components/receipts/Lightbox";
import { PhotoGrid } from "../components/receipts/PhotoGrid";
import { UploadZone } from "../components/receipts/UploadZone";
import { api } from "../lib/api";
import { useReceipts } from "../hooks/useReceipts";
import { useToastStore } from "../store/uiStore";
import { motion } from "framer-motion";

export function ReceiptsPage() {
  const { receipts } = useReceipts();
  const pushToast = useToastStore((s) => s.pushToast);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const upload = async (files: FileList) => {
    const list = Array.from(files);
    for (const file of list) {
      if (file.size > 10 * 1024 * 1024) {
        pushToast(`${file.name} masyadong malaki! Limit is 10MB.`);
        return;
      }
    }

    pushToast("Nagsasampay na ng mga resibo...");
    
    try {
      for (const file of list) {
        const form = new FormData();
        form.append("file", file);
        form.append("tripId", receipts[0]?.id ?? "");
        await api.post("/receipts/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      }

      pushToast("Tagumpay! Nakatago na ang iyong mga resibo.");
      location.reload();
    } catch (err: any) {
      pushToast("Naku! Nagka-error sa pag-upload.");
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col gap-2">
        <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter">Baul ng Resibo</h2>
        <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Safe and sound ang iyong ebidensya.</p>
      </header>

      <UploadZone onFiles={upload} />

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-brand text-2xl font-black text-white">Iyong Koleksyon</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{receipts.length} item(s)</span>
        </div>
        
        <PhotoGrid receipts={receipts} onOpen={setLightbox} />
      </div>

      <Lightbox url={lightbox} onClose={() => setLightbox(null)} />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-8 rounded-[2.5rem] border border-white/5 text-center mt-12"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
          "Ang maingat na hero, may resibo sa bawat byahe."
        </p>
      </motion.div>
    </div>
  );
}

