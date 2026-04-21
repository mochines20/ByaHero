import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#185FA5", "#F59E0B", "#0D9488", "#7E22CE", "#6B7280"];

export function TransportPie({ data }: { data: any[] }) {
  return (
    <div className="rounded-xl border border-byahero-light bg-white p-4 shadow-card">
      <h3 className="mb-2 text-sm font-semibold text-byahero-navy">Most Used Transport</h3>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="transportType" outerRadius={90}>
              {data.map((_: any, i: number) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
