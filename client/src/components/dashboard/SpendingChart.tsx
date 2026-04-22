import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export function SpendingChart({ data }: { data: { day: string; amount: number }[] }) {
  return (
    <div className="glass-card rounded-[2rem] p-6 border border-white/20 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-brand text-xl font-black text-white tracking-tight">Gastos sa Linggong Ito</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">PHP Analytics</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 900 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 900 }} 
            />
            <Tooltip 
              cursor={{ fill: "rgba(255,255,255,0.05)", radius: 12 }}
              contentStyle={{ 
                backgroundColor: "rgba(10, 36, 99, 0.9)", 
                borderRadius: "16px", 
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                padding: "12px 16px",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              itemStyle={{ color: "#FFD60A" }}
              labelStyle={{ marginBottom: "4px", opacity: 0.6 }}
            />
            <Bar 
              dataKey="amount" 
              fill="#FFD60A" 
              radius={[10, 10, 10, 10]} 
              barSize={24}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

