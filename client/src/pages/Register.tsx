import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PasswordField } from "../components/auth/PasswordField";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { api } from "../lib/api";
import { useToastStore } from "../store/uiStore";
import { motion } from "framer-motion";
import clsx from "clsx";

const schema = z
  .object({
    name: z.string().min(2, "Masyadong maikli ang pangalan"),
    email: z.string().email("Ilagay ang tamang email"),
    password: z.string().min(8, "Kailangan ng hindi bababa sa 8 characters").regex(/[A-Z]/, "Kailangan ng uppercase").regex(/[0-9]/, "Kailangan ng numero"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Hindi magkatugma ang password",
  });

export function RegisterPage() {
  const navigate = useNavigate();
  const pushToast = useToastStore((s) => s.pushToast);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = useMemo(() => {
    let score = 0;
    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;
    return score;
  }, [form.password]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[i.path[0] as string] = i.message));
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      pushToast("Tagumpay! Pakisuri ang iyong email para sa verification.");
      navigate("/login");
    } catch (err: any) {
      pushToast(err.message || "Nagka-error sa pag-register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Maging Hero" subtitle="Sumali sa komunidad ng mga wais na commuter.">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10"
      >
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Buong Pangalan</label>
            <Input placeholder="Juan Dela Cruz" value={form.name} error={errors.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Email Address</label>
            <Input type="email" placeholder="juan@byahero.ph" value={form.email} error={errors.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Password</label>
            <PasswordField id="password" placeholder="••••••••" value={form.password} error={errors.password} onChange={(value) => setForm((s) => ({ ...s, password: value }))} />
            <div className="flex gap-1 h-1 px-1 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={clsx(
                    "flex-1 rounded-full transition-all duration-500",
                    strength >= i ? (strength <= 2 ? "bg-orange-400" : "bg-byahero-yellow shadow-yellow") : "bg-white/10"
                  )} 
                />
              ))}
            </div>
            <p className="text-[9px] uppercase tracking-tighter font-black text-white/50 mt-1 ml-1 text-right italic">
              Security: {strength === 0 ? "None" : strength === 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Strong" : "Heroic"}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Kumpirmahin ang Password</label>
            <PasswordField
              id="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              onChange={(value) => setForm((s) => ({ ...s, confirmPassword: value }))}
            />
          </div>

          <Button disabled={loading} className="w-full mt-4">
            {loading ? "Nag-rerehistro..." : "Maging Hero Ngayon"}
          </Button>

          <p className="text-center text-sm font-bold text-white/70">
            May account na?{" "}
            <Link className="font-black text-byahero-yellow hover:scale-105 inline-block transition-transform" to="/login">
              Sumakay Na
            </Link>
          </p>
        </form>
      </motion.div>
    </AuthLayout>
  );
}

