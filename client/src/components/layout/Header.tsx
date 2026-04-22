import { Bell } from "lucide-react";

export function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:px-8 lg:pt-8 bg-transparent">
      <div className="glass-panel flex items-center justify-between rounded-[1.5rem] px-5 py-4 border border-white/10 shadow-2xl">
        <h2 className="font-brand text-2xl font-black tracking-tight text-white">{title}</h2>
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 active:scale-95"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-byahero-yellow shadow-yellow" />
        </button>
      </div>
    </header>
  );
}

