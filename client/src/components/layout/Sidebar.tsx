import { NavLink } from "react-router-dom";
import { BarChart3, Calculator, Home, Image, LayoutGrid, Route, Settings2, ShieldAlert, Wallet } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { motion } from "framer-motion";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/features", label: "Features", icon: LayoutGrid },
  { to: "/expenses", label: "Expenses", icon: Wallet },
  { to: "/planner", label: "Route Planner", icon: Route },
  { to: "/emergency-contacts", label: "Emergency", icon: ShieldAlert },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/receipts", label: "Receipts", icon: Image },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings2 },
];

export function Sidebar() {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col glass-panel px-6 py-8 lg:flex border-r border-white/10">
      <div className="mb-10">
        <h1 className="font-brand text-4xl font-extrabold tracking-tight text-white">
          Bya<span className="text-byahero-yellow">Hero</span>
        </h1>
        <p className="mt-2 text-xs font-medium text-white/60 uppercase tracking-widest leading-relaxed">
          Bawat commuter, bayani ng sariling byahe.
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex h-12 items-center gap-4 rounded-2xl px-4 text-sm font-bold transition-all duration-300 ${
                isActive 
                  ? "bg-byahero-yellow text-byahero-navy shadow-yellow" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={20} className="transition-transform group-hover:scale-110" />
            <span className="font-sans">{label}</span>
          </NavLink>
        ))}
      </nav>

      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="mt-8 flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-byahero-yellow to-byahero-blue flex items-center justify-center text-byahero-navy font-black text-xs shadow-inner">
          {user?.name?.[0] ?? "B"}
        </div>
        <div className="overflow-hidden">
          <p className="truncate text-sm font-black text-white">{user?.name ?? "ByaHero User"}</p>
          <p className="truncate text-[10px] font-bold text-white/50 uppercase tracking-tighter">Verified Hero</p>
        </div>
      </motion.div>

      {/* Decorative Baybayin Accent */}
      <div className="mt-6 text-center select-none">
        <span className="font-serif text-2xl text-white/5 tracking-[0.5em] pointer-events-none">ᜊᜌᜑᜒᜇᜓ</span>
      </div>
    </aside>
  );
}

