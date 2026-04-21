import { Bell } from "lucide-react";

export function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4">
      <div className="glass-panel flex items-center justify-between rounded-2xl px-3 py-3 sm:px-4">
        <h2 className="text-base font-bold text-byahero-navy sm:text-lg">{title}</h2>
        <button
          aria-label="Notifications"
          className="min-h-11 min-w-11 rounded-full border border-[#dceafd] bg-[#f6fbff] p-2 text-byahero-navy transition hover:bg-white md:min-h-10 md:min-w-10"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
