import { NavLink } from "react-router-dom";
import { BarChart3, Calculator, Home, Image, Layers, Route, Settings2, ShieldAlert, Wallet } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/features", label: "Features", icon: Layers },
  { to: "/expenses", label: "Expenses", icon: Wallet },
  { to: "/planner", label: "Route Planner", icon: Route },
  { to: "/emergency-contacts", label: "Emergency Contacts", icon: ShieldAlert },
  { to: "/calculator", label: "WFH Calculator", icon: Calculator },
  { to: "/receipts", label: "Receipts", icon: Image },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings2 },
];

export function Sidebar() {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="hidden w-64 flex-col rounded-3xl border border-[#dceafd] bg-white/85 px-4 py-5 text-byahero-navy shadow-card backdrop-blur-xl lg:flex">
      <div>
        <h1 className="text-2xl font-extrabold">Bya<span className="text-byahero-gold">Hero</span></h1>
        <p className="mt-1 text-xs text-byahero-muted">Bawat commuter, bayani ng sariling byahe.</p>
      </div>
      <nav className="mt-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm transition ${
                isActive ? "bg-[#4dbdff] text-white" : "text-byahero-navy hover:bg-[#edf6ff]"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-2 rounded-xl border border-[#dceafd] bg-[#f6fbff] p-3 text-sm">
        <div className="h-9 w-9 rounded-full bg-[#8cd2ff]" />
        <div>
          <p className="font-semibold">{user?.name ?? "ByaHero User"}</p>
          <p className="text-xs text-byahero-muted">{user?.email ?? "user@email.com"}</p>
        </div>
      </div>
    </aside>
  );
}
