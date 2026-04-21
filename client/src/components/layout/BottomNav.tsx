import { NavLink } from "react-router-dom";
import { Home, Route, ShieldAlert, User, Wallet } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/expenses", label: "Expenses", icon: Wallet },
  { to: "/planner", label: "Plan", icon: Route },
  { to: "/emergency-contacts", label: "SOS", icon: ShieldAlert },
  { to: "/settings", label: "Profile", icon: User },
];

export function BottomNav() {
  return (
    <nav className="safe-pb fixed inset-x-0 bottom-2 z-40 mx-2 rounded-2xl border border-[#dceafd] bg-white/90 px-1 py-2 shadow-card backdrop-blur-xl md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="text-center">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `mx-auto flex min-h-11 w-full max-w-[72px] flex-col items-center justify-center rounded-md text-[11px] ${
                  isActive ? "text-[#30aef7]" : "text-byahero-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} />
                  <span>{label}</span>
                  <span className={`mt-1 h-0.5 w-10 rounded-full ${isActive ? "bg-[#30aef7]" : "bg-transparent"}`} />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
