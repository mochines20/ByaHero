import { useRef, useState } from "react";
import { Upload, FileImage, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

type Props = { onFiles: (files: FileList) => void };

export function UploadZone({ onFiles }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        "relative overflow-hidden rounded-[2.5rem] border-2 border-dashed p-10 text-center transition-all duration-300",
        isDragging 
          ? "border-byahero-yellow bg-byahero-yellow/5 shadow-yellow" 
          : "border-white/10 bg-white/5 hover:bg-white/10 active:scale-[0.98]"
      )}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) onFiles(e.dataTransfer.files);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => ref.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") ref.current?.click();
      }}
      aria-label="Upload receipts"
    >
      <div className="relative z-10 flex flex-col items-center">
        <div className={clsx(
          "mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br transition-all duration-500",
          isDragging ? "from-byahero-yellow to-orange-400 scale-110 shadow-yellow" : "from-white/5 to-white/10 shadow-lg"
        )}>
          <Upload className={isDragging ? "text-byahero-navy" : "text-byahero-yellow"} size={32} />
        </div>
        
        <h3 className="font-brand text-2xl font-black text-white italic tracking-tight mb-2">Ibaon ang Resibo</h3>
        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] max-w-[200px] mb-6">Tap or drop files to keep your records crystal clear.</p>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/30 tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
            <FileImage size={12} /> JPG, PNG, WEBP
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/30 tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
            <Sparkles size={12} /> Max 10MB
          </div>
        </div>
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) onFiles(e.target.files);
        }}
      />

      {/* Decorative Glow */}
      <div className={clsx(
        "absolute -right-20 -top-20 h-64 w-64 rounded-full transition-all duration-700 blur-[80px]",
        isDragging ? "bg-byahero-yellow/20" : "bg-byahero-blue/5"
      )} />
    </motion.div>
  );
}

