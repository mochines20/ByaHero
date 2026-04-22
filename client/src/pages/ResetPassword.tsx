import { FormEvent, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PasswordField } from "../components/auth/PasswordField";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";
import { motion } from "framer-motion";

export function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
    } catch {
      // toast error handled by api interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Gumamit ng bago at mas matibay na password.">
      {done ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[2rem] p-8 border border-emerald-500/30 text-center"
        >
          <p className="text-sm font-bold text-white mb-6">Matagumpay mong napalitan ang iyong password!</p>
          <Link to="/login">
            <Button className="w-full">Bumalik sa Login</Button>
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Bagong Password</label>
            <PasswordField 
              id="newPassword" 
              placeholder="••••••••" 
              value={password} 
              onChange={setPassword} 
            />
          </div>
          <Button disabled={loading || !password} className="w-full">
            {loading ? "Nag-uupdate..." : "Palitan ang Password"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
