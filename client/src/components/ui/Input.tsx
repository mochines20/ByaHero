import clsx from "clsx";
import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { error?: string };

export function Input({ error, className, ...props }: Props) {
  return (
    <div className="space-y-2 group">
      <input
        className={clsx(
          "h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 font-sans text-base text-white outline-none backdrop-blur-md transition-all duration-300 placeholder:text-white/30",
          error 
            ? "border-red-400 focus:bg-red-500/10" 
            : "focus:border-byahero-yellow focus:bg-white/10 focus:ring-4 focus:ring-byahero-yellow/10",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="px-2 text-[10px] font-black uppercase tracking-widest text-red-400 animate-slide-up flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
