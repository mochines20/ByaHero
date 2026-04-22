import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const isSecondary = className?.includes("secondary");
  const isGhost = className?.includes("ghost");

  return (
    <button
      className={clsx(
        "flex min-h-[56px] items-center justify-center rounded-2xl px-8 py-3 text-sm font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.97] hover:scale-[1.02]",
        !isSecondary && !isGhost && "bg-byahero-yellow text-byahero-navy shadow-yellow hover:brightness-110",
        isSecondary && "glass-card border-white/20 text-white hover:bg-white/20",
        isGhost && "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
        className
      )}
      {...props}
    />
  );
}

