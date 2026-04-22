import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { motion } from "framer-motion";
import { Wallet, Sparkles, Share2, PiggyBank } from "lucide-react";

export function CalculatorPage() {
  const [wfhDays, setWfhDays] = useState(8);
  const [officeDays, setOfficeDays] = useState(14);
  const [dailyCost, setDailyCost] = useState(120);

  const stats = useMemo(() => {
    const monthlySavings = wfhDays * dailyCost;
    return {
      monthlySavings,
      annualSavings: monthlySavings * 12,
      perWfh: dailyCost,
    };
  }, [dailyCost, wfhDays]);

  const chartData = [
    { name: "Gastos sa Office", value: officeDays * dailyCost },
    { name: "Naipon (Saved)", value: stats.monthlySavings },
  ];

  const share = async () => {
    const text = `ByaHero Savings: Nakatipid ako ng ₱${stats.monthlySavings}/month dahil sa ${wfhDays} days na WFH! Sulit ang pagiging Hero.`;
    if (navigator.share) {
      await navigator.share({ title: "ByaHero Savings", text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Savings text copied to clipboard.");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col gap-2">
        <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter">WFH Savings Calculator</h2>
        <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Mag-compute, mag-ipon, maging Hero.</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">WFH Days Kada Buwan</label>
            <Input type="number" value={wfhDays} onChange={(e) => setWfhDays(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Office Days Kada Buwan</label>
            <Input type="number" value={officeDays} onChange={(e) => setOfficeDays(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/50">Daily Commute Cost (₱)</label>
            <Input type="number" value={dailyCost} onChange={(e) => setDailyCost(Number(e.target.value))} />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Monthly Savings", value: stats.monthlySavings, icon: Wallet, color: "from-byahero-yellow to-orange-400" },
          { label: "Annual Savings", value: stats.annualSavings, icon: PiggyBank, color: "from-emerald-400 to-teal-500" },
          { label: "Saved Per WFH Day", value: stats.perWfh, icon: Sparkles, color: "from-byahero-blue to-sky-400" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-[2rem] p-6 border border-white/10 text-center"
          >
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
              <s.icon size={20} className="text-byahero-navy" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{s.label}</p>
            <p className="font-brand text-3xl font-black text-white">₱{s.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-[2.5rem] p-8 border border-white/20 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-brand text-xl font-black text-white">Visual Breakdown</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Cost vs Savings</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 900 }} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.05)", radius: 12 }}
                  contentStyle={{ 
                    backgroundColor: "rgba(10, 36, 99, 0.9)", 
                    borderRadius: "16px", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="value" fill="#FFD60A" radius={[12, 12, 12, 12]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card flex flex-col justify-center rounded-[2.5rem] p-8 border border-white/20 text-center">
          <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-byahero-yellow">
            <Share2 size={24} />
          </div>
          <h3 className="font-brand text-xl font-black text-white mb-2">I-Flex Mo Na!</h3>
          <p className="text-[10px] font-bold text-white/30 mb-8 uppercase tracking-widest leading-relaxed">I-share sa Facebook o Twitter ang iyong naipon bilang ByaHero.</p>
          <Button onClick={share} className="w-full">Share My Savings</Button>
        </div>
      </div>
    </div>
  );
}

