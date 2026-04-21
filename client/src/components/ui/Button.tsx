import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const isPrimary = !className?.includes("secondary");
  return (
    <button
      className={clsx(
        "min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition md:min-h-10",
        isPrimary
          ? "bg-[#33b6ff] text-white shadow-[0_10px_24px_rgba(51,182,255,0.35)] hover:brightness-95"
          : "rounded-full border border-[#cfe6ff] bg-white text-byahero-navy",
        className
      )}
      {...props}
    />
  );
}
