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

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 chars"),
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
      pushToast(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to track your daily commute hero moves.">
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-byahero-navy">Email</label>
          <Input
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => {
              const value = e.target.value;
              setForm((s) => ({ ...s, email: value }));
              setErrors((s) => ({ ...s, email: "" }));
            }}
            onBlur={() =>
              schema.shape.email.safeParse(form.email.trim()).success
                ? setErrors((s) => ({ ...s, email: "" }))
                : setErrors((s) => ({ ...s, email: "Enter a valid email" }))
            }
          />
        </div>

        <PasswordField
          id="password"
          label="Password"
          value={form.password}
          error={errors.password}
          onChange={(value) => {
            setForm((s) => ({ ...s, password: value }));
            setErrors((s) => ({ ...s, password: "" }));
          }}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-byahero-muted">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Remember me (30 days)
          </label>
          <Link to="/forgot-password" className="text-sm text-byahero-blue">
            Forgot Password?
          </Link>
        </div>

        <Button disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Login"}
        </Button>

        <div className="my-1 text-center text-xs text-byahero-muted">- or continue with -</div>

        <SocialButtons
          disabled={loading}
          onGoogle={() => (window.location.href = `${apiBaseUrl}/auth/google`)}
          onApple={() => (window.location.href = `${apiBaseUrl}/auth/apple`)}
        />

        <p className="text-center text-sm text-byahero-muted">
          No account yet? <Link className="text-byahero-blue" to="/register">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
