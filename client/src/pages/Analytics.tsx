import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { SavingsCard } from "../components/analytics/SavingsCard";
import { TrendChart } from "../components/analytics/TrendChart";
import { TransportPie } from "../components/analytics/TransportPie";
import { useAnalytics } from "../hooks/useAnalytics";
import { motion } from "framer-motion";

export function AnalyticsPage() {
  const { monthlyTrend, transport, weekday } = useAnalytics();

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col gap-2">
        <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter">Commuter Analytics</h2>
        <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Suriin ang iyong bawat galaw.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <TrendChart data={monthlyTrend} />
        <TransportPie data={transport} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-brand text-xl font-black text-white">Araw na Pinaka-Gastos</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Weekly Peak</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekday} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: 900 }} 
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
                <Bar dataKey="total" fill="#FFD60A" radius={[10, 10, 10, 10]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        <SavingsCard current={5400} previous={6200} />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-8 rounded-[2.5rem] border border-white/5 text-center mt-6"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
          "Ang wais na hero, nakikita ang pattern sa kanyang byahe."
        </p>
      </motion.div>
    </div>
  );
}

