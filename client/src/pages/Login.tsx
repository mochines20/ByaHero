import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PasswordField } from "../components/auth/PasswordField";
import { SocialButtons } from "../components/auth/SocialButtons";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/uiStore";
import { motion } from "framer-motion";

const schema = z.object({
  email: z.string().email("Ilagay ang tamang email"),
  password: z.string().min(8, "Kailangan ng hindi bababa sa 8 characters"),
});

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const pushToast = useToastStore((s) => s.pushToast);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...form, email: form.email.trim() };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[i.path[0] as string] = i.message));
      setErrors(next);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { ...payload, rememberMe });
      setUser(data.user);
      navigate("/dashboard");
    } catch (err: any) {
      pushToast(err.message || "Maling email o password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Mabuhay, Hero!" 
      subtitle="Handa ka na bang mag-byahe? Tara na!"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Email Address</label>
            <Input
              type="email"
              placeholder="juan@byahero.ph"
              value={form.email}
              error={errors.email}
              onChange={(e) => {
                const value = e.target.value;
                setForm((s) => ({ ...s, email: value }));
                setErrors((s) => ({ ...s, email: "" }));
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Password</label>
            <PasswordField
              id="password"
              placeholder="••••••••"
              value={form.password}
              error={errors.password}
              onChange={(value) => {
                setForm((s) => ({ ...s, password: value }));
                setErrors((s) => ({ ...s, password: "" }));
              }}
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-white select-none">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-white/20 bg-white/10 text-byahero-yellow focus:ring-byahero-yellow/20"
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              Tandaan ako
            </label>
            <Link to="/forgot-password" title="Nakalimutan?" className="text-xs font-black text-byahero-yellow hover:underline transition-all">
              Nakalimutan?
            </Link>
          </div>

          <Button disabled={loading} className="w-full">
            {loading ? "Sumasakay na..." : "Sumakay Na!"}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center opacity-20"><div className="w-full border-t border-white"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-white/40">
              <span className="bg-transparent px-2">O kaya naman sa</span>
            </div>
          </div>

          <SocialButtons
            disabled={loading}
            onGoogle={() => (window.location.href = `${apiBaseUrl}/auth/google`)}
            onApple={() => (window.location.href = `${apiBaseUrl}/auth/apple`)}
          />

          <p className="text-center text-sm font-bold text-white/70">
            Wala pang account?{" "}
            <Link className="font-black text-byahero-yellow hover:scale-105 inline-block transition-transform" to="/register">
              Maging Hero
            </Link>
          </p>
        </form>
      </motion.div>
    </AuthLayout>
  );
}

