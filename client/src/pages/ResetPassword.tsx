import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PasswordField } from "../components/auth/PasswordField";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";

export function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post("/auth/reset-password", { token, password });
    setDone(true);
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Choose a new secure password.">
      {done ? (
        <p className="rounded-lg bg-byahero-light p-3 text-sm text-byahero-navy">Password updated. You can now login.</p>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <PasswordField id="newPassword" label="New Password" value={password} onChange={setPassword} />
          <Button className="w-full">Reset password</Button>
        </form>
      )}
    </AuthLayout>
  );
}
