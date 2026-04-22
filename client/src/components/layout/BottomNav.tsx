import { NavLink } from "react-router-dom";
import { Home, Route, ShieldAlert, User, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/expenses", label: "Wallet", icon: Wallet },
  { to: "/planner", label: "Route", icon: Route },
  { to: "/emergency-contacts", label: "SOS", icon: ShieldAlert },
  { to: "/settings", label: "Ako", icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-4 bottom-6 z-40 lg:hidden">
      <div className="glass-panel rounded-[2rem] px-2 py-3 border border-white/20 shadow-2xl">
        <ul className="flex items-center justify-around">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to} className="relative">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                    isActive ? "text-byahero-yellow" : "text-white/60"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      size={20} 
                      className={`mb-1 transition-transform ${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(255,214,10,0.5)]" : ""}`} 
                    />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 h-1 w-1 rounded-full bg-byahero-yellow shadow-yellow"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

