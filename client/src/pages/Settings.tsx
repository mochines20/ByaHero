import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { api } from "../lib/api";
import { useToastStore } from "../store/uiStore";

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
    pushToast("Profile updated");
  };

  const saveBudget = async () => {
    await api.put("/users/budget", { monthlyBudget: Number(form.monthlyBudget) });
    pushToast("Budget updated");
  };

  return (
    <div className="space-y-4">
      <div className="glass-card grid gap-3 rounded-xl p-4 sm:grid-cols-2">
        <div><label className="text-sm">Name</label><Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} /></div>
        <div><label className="text-sm">Phone</label><Input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} /></div>
        <div><label className="text-sm">Home address</label><Input value={form.homeAddress} onChange={(e) => setForm((s) => ({ ...s, homeAddress: e.target.value }))} /></div>
        <div><label className="text-sm">Work address</label><Input value={form.workAddress} onChange={(e) => setForm((s) => ({ ...s, workAddress: e.target.value }))} /></div>
        <div className="sm:col-span-2"><Button onClick={saveProfile}>Save profile</Button></div>
      </div>

      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-byahero-navy">Budget & Preferences</h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm">Monthly Budget (?)</label>
            <Input type="number" value={form.monthlyBudget} onChange={(e) => setForm((s) => ({ ...s, monthlyBudget: Number(e.target.value) }))} />
          </div>
          <div className="flex items-end">
            <Button onClick={saveBudget}>Update budget</Button>
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-byahero-muted">
          <input
            type="checkbox"
            checked={form.darkMode}
            onChange={(e) => {
              const value = e.target.checked;
              setForm((s) => ({ ...s, darkMode: value }));
              localStorage.setItem("darkMode", String(value));
              document.documentElement.classList.toggle("dark", value);
            }}
          />
          Dark mode
        </label>

        <label className="mt-2 flex items-center justify-between gap-2 rounded-2xl border border-[#dceafd] bg-white/85 px-3 py-2 text-sm text-byahero-navy">
          PWD accessibility mode (large text + contrast)
          <input
            type="checkbox"
            checked={pwdMode}
            onChange={(e) => {
              const value = e.target.checked;
              setPwdMode(value);
              localStorage.setItem("pwdMode", String(value));
              document.documentElement.classList.toggle("pwd", value);
              pushToast(value ? "PWD mode enabled" : "PWD mode disabled");
            }}
          />
        </label>

        <div className="mt-3">
          <p className="text-sm font-semibold text-byahero-navy">Language</p>
          <div className="mt-2 flex flex-wrap gap-2">
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
                  pushToast(`Language set to ${l.label}`);
                }}
                className={`min-h-10 rounded-full px-3 text-xs font-semibold ${
                  language === l.id ? "bg-[#33b6ff] text-white" : "border border-[#dceafd] bg-white/85 text-byahero-navy"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl border-red-200/60 p-4">
        <h3 className="text-sm font-semibold text-red-700">Account</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to="/emergency-contacts"
            className="inline-flex min-h-11 items-center rounded-lg border border-byahero-blue/30 bg-white px-4 py-2 text-sm font-semibold text-byahero-navy"
          >
            Emergency contacts
          </Link>
          <Button className="secondary" onClick={() => pushToast("Password change flow is available in auth endpoints")}>Change password</Button>
          <Button className="secondary" onClick={() => pushToast("Google + Apple linked via OAuth accounts")}>Connected social accounts</Button>
          <Button onClick={async () => { await api.delete("/users/account"); pushToast("Account deletion request submitted"); }}>
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}
