import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

type Props = {
  id: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
};

export function PasswordField({ id, value, placeholder, error, onChange }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative group">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          "h-14 w-full rounded-2xl bg-white/5 border px-5 pr-12 font-sans text-base text-white outline-none backdrop-blur-md transition-all duration-300",
          error ? "border-red-500 ring-4 ring-red-500/10" : "border-white/10 group-hover:border-white/20 focus:border-byahero-yellow focus:ring-4 focus:ring-byahero-yellow/10",
          "placeholder:text-white/20"
        )}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-white/40 hover:text-white hover:bg-white/5 transition-all"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      {error ? (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 ml-1 text-[10px] font-black uppercase tracking-widest text-red-400"
        >
          {error}
        </motion.p>
      ) : null}
    </div>
  );
}
