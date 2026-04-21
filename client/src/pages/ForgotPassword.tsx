import { FormEvent, useState } from "react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { api } from "../lib/api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post("/auth/forgot-password", { email });
    setSent(true);
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="We will send a reset link valid for 1 hour.">
      {sent ? (
        <div className="rounded-lg bg-byahero-light p-3 text-sm text-byahero-navy">Reset email sent. Check your inbox.</div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <label className="text-sm font-medium text-byahero-navy">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button className="w-full">Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  );
}
