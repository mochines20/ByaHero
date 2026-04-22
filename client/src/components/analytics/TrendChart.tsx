import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export function TrendChart({ data }: { data: any[] }) {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-brand text-xl font-black text-white">Trend ng Gastos</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Monthly Activity</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="month" 
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
              contentStyle={{ 
                backgroundColor: "rgba(10, 36, 99, 0.9)", 
                borderRadius: "16px", 
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                padding: "12px 16px",
                color: "#fff"
              }}
              itemStyle={{ color: "#FFD60A" }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#FFD60A" 
              strokeWidth={4} 
              dot={{ r: 4, fill: "#FFD60A", strokeWidth: 2, stroke: "#0A2463" }}
              activeDot={{ r: 6, fill: "#FFD60A", strokeWidth: 0 }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

