import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { api } from "../lib/api";
import { useToastStore } from "../store/uiStore";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, CreditCard, Languages, Accessibility, Moon, Trash2, LogOut } from "lucide-react";
import clsx from "clsx";

export function SettingsPage() {
  const pushToast = useToastStore((s) => s.pushToast);
  const [form, setForm] = useState({
    name: "",
    homeAddress: "",
    workAddress: "",
    phone: "",
    monthlyBudget: 0,
    darkMode: false,
  });
  const [pwdMode, setPwdMode] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const storedDark = localStorage.getItem("darkMode") === "true";
    const storedPwd = localStorage.getItem("pwdMode") === "true";
    const storedLang = localStorage.getItem("lang") || "en";
    setForm((s) => ({ ...s, darkMode: storedDark }));
    setPwdMode(storedPwd);
    setLanguage(storedLang);
    document.documentElement.classList.toggle("dark", storedDark);
    document.documentElement.classList.toggle("pwd", storedPwd);
  }, []);

  const saveProfile = async () => {
    await api.put("/users/profile", form);
    pushToast("Mabuhay! Na-update na ang iyong profile.");
  };

  const saveBudget = async () => {
    await api.put("/users/budget", { monthlyBudget: Number(form.monthlyBudget) });
    pushToast("Budget saved! Be a wise hero.");
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col gap-2">
        <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter">Settings</h2>
        <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">I-setup ang iyong heroic gear.</p>
      </header>

      {/* Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="text-byahero-yellow" size={20} />
          <h3 className="font-brand text-xl font-black text-white uppercase tracking-tight">Ang Iyong Profile</h3>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Full Name</label>
            <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Phone Number</label>
            <Input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Home Base (Address)</label>
            <Input value={form.homeAddress} onChange={(e) => setForm((s) => ({ ...s, homeAddress: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Work/School (Destination)</label>
            <Input value={form.workAddress} onChange={(e) => setForm((s) => ({ ...s, workAddress: e.target.value }))} />
          </div>
          <div className="sm:col-span-2 pt-4">
            <Button onClick={saveProfile} className="w-full sm:w-auto px-12">I-save ang Profile</Button>
          </div>
        </div>
      </motion.div>

      {/* Budget Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="text-byahero-yellow" size={20} />
          <h3 className="font-brand text-xl font-black text-white uppercase tracking-tight">Budget & Gastos</h3>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Bulanan na Budget (₱)</label>
            <Input type="number" value={form.monthlyBudget} onChange={(e) => setForm((s) => ({ ...s, monthlyBudget: Number(e.target.value) }))} />
          </div>
          <Button onClick={saveBudget} className="h-14">Update Budget</Button>
        </div>
      </motion.div>

      {/* Preferences Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <Accessibility className="text-byahero-yellow" size={20} />
            <h3 className="font-brand text-xl font-black text-white uppercase tracking-tight">Kagustuhan (Preferences)</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <Moon size={18} className="text-white/40" />
                <span className="text-xs font-black uppercase text-white/80">Dark Mode</span>
              </div>
              <input
                type="checkbox"
                className="h-6 w-12 rounded-full cursor-pointer appearance-none bg-white/10 checked:bg-byahero-yellow transition-all"
                checked={form.darkMode}
                onChange={(e) => {
                  const value = e.target.checked;
                  setForm((s) => ({ ...s, darkMode: value }));
                  localStorage.setItem("darkMode", String(value));
                  document.documentElement.classList.toggle("dark", value);
                }}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black uppercase text-white/80">PWD Mode</span>
                <span className="text-[10px] text-white/30 font-bold uppercase">Malaking text + High contrast</span>
              </div>
              <input
                type="checkbox"
                className="h-6 w-12 rounded-full cursor-pointer appearance-none bg-white/10 checked:bg-byahero-yellow transition-all"
                checked={pwdMode}
                onChange={(e) => {
                  const value = e.target.checked;
                  setPwdMode(value);
                  localStorage.setItem("pwdMode", String(value));
                  document.documentElement.classList.toggle("pwd", value);
                  pushToast(value ? "PWD mode enabled" : "PWD mode disabled");
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <Languages className="text-byahero-yellow" size={20} />
            <h3 className="font-brand text-xl font-black text-white uppercase tracking-tight">Wika (Language)</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "en", label: "English" },
              { id: "fil", label: "Filipino" },
              { id: "bis", label: "Bisaya" },
              { id: "ilo", label: "Ilocano" },
            ].map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setLanguage(l.id);
                  localStorage.setItem("lang", l.id);
                  pushToast(`Wika isinalin sa ${l.label}`);
                }}
                className={clsx(
                  "h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  language === l.id ? "bg-byahero-yellow text-byahero-navy shadow-yellow" : "bg-white/5 text-white/50 border border-white/5 hover:bg-white/10"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Account Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-[2.5rem] border border-red-500/20 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-red-400" size={20} />
          <h3 className="font-brand text-xl font-black text-white uppercase tracking-tight">Account Seguridad</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/emergency-contacts"
            className="flex h-14 items-center gap-3 rounded-2xl bg-white/5 px-6 border border-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
          >
            I-manage ang Emergency Contacts
          </Link>
          <Button className="secondary h-14" onClick={() => pushToast("OAuth linked accounts managed via dashboard")}>Social Accounts</Button>
          <button 
            className="flex h-14 items-center gap-2 rounded-2xl bg-red-500/10 px-6 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-all ml-auto"
            onClick={async () => { await api.delete("/users/account"); pushToast("Request submitted"); }}
          >
            <Trash2 size={16} /> Burahin ang Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}

