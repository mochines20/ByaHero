import { PropsWithChildren } from "react";
import { Button } from "./Button";

type Props = PropsWithChildren<{ open: boolean; title: string; onClose: () => void }>;

export function Modal({ open, title, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div className="absolute inset-x-0 bottom-0 animate-slide-up rounded-t-2xl bg-white p-4 md:left-1/2 md:top-1/2 md:h-auto md:w-[480px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-byahero-navy">{title}</h3>
          <Button className="secondary" onClick={onClose} aria-label="Close dialog">
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
