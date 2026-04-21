import clsx from "clsx";
import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { error?: string };

export function Input({ error, className, ...props }: Props) {
  return (
    <div className="space-y-1">
      <input
        className={clsx(
          "h-12 w-full rounded-2xl border bg-white/92 px-3 text-sm md:h-10",
          error ? "border-red-500" : "border-[#d7e9ff]",
          className
        )}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
