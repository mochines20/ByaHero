import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PasswordField } from "../components/auth/PasswordField";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { api } from "../lib/api";
import { useToastStore } from "../store/uiStore";

const schema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 chars").regex(/[A-Z]/, "Need uppercase").regex(/[0-9]/, "Need number"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
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
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      pushToast("Registration successful. Check your email for verification.");
      navigate("/login");
    } catch (err: any) {
      pushToast(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Join ByaHero in under one minute.">
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-byahero-navy">Name</label>
          <Input value={form.name} error={errors.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm font-medium text-byahero-navy">Email</label>
          <Input type="email" value={form.email} error={errors.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        </div>

        <PasswordField id="password" label="Password" value={form.password} error={errors.password} onChange={(value) => setForm((s) => ({ ...s, password: value }))} />
        <div className="h-2 rounded-full bg-byahero-light">
          <div className="h-2 rounded-full bg-byahero-green" style={{ width: `${(strength / 4) * 100}%` }} />
        </div>
        <p className="text-xs text-byahero-muted">Password strength: {strength}/4</p>

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={(value) => setForm((s) => ({ ...s, confirmPassword: value }))}
        />

        <Button disabled={loading} className="w-full">
          {loading ? "Creating..." : "Register"}
        </Button>

        <p className="text-center text-sm text-byahero-muted">
          Already have an account? <Link className="text-byahero-blue" to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
