import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#FFD60A", "#60A5FA", "#34D399", "#818CF8", "#F87171"];

export function TransportPie({ data }: { data: any[] }) {
  const formattedData = data.map(item => ({
    ...item,
    name: item.transportType.charAt(0).toUpperCase() + item.transportType.slice(1)
  }));

  return (
    <div className="glass-card rounded-[2.5rem] p-8 border border-white/20 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-brand text-xl font-black text-white">Paboritong Sasakyan</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Usage Statistics</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={formattedData} 
              dataKey="count" 
              nameKey="name" 
              innerRadius={70}
              outerRadius={90} 
              paddingAngle={8}
            >
              {formattedData.map((_: any, i: number) => (
                <Cell key={i} fill={colors[i % colors.length]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(10, 36, 99, 0.9)", 
                borderRadius: "16px", 
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                padding: "8px 12px",
                color: "#fff",
                fontWeight: "bold"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

