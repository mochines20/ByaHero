import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { api } from "../lib/api";
import { motion } from "framer-motion";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      // toast error handled by api interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Password Recovery" subtitle="Padadalhan ka namin ng reset link na valid sa loob ng isang oras.">
      {sent ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[2rem] p-8 border border-byahero-yellow/20 text-center"
        >
          <p className="text-sm font-bold text-white mb-6">Napadala na ang email! Pakisuri ang iyong inbox at spam folder.</p>
          <Link to="/login">
            <Button className="w-full">Bumalik sa Login</Button>
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Email Address</label>
            <Input 
              type="email" 
              placeholder="juan@byahero.ph" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <Button disabled={loading || !email} className="w-full">
            {loading ? "Nagpapadala..." : "Ipadala ang Reset Link"}
          </Button>
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/40">
            Naalala mo na? <Link to="/login" className="text-byahero-yellow hover:underline">Mag-login na</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
