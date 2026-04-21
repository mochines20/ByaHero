import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SavingsCard } from "../components/analytics/SavingsCard";
import { TrendChart } from "../components/analytics/TrendChart";
import { TransportPie } from "../components/analytics/TransportPie";
import { useAnalytics } from "../hooks/useAnalytics";

export function AnalyticsPage() {
  const { monthlyTrend, transport } = useAnalytics();
  const weekday = [
    { day: "Mon", total: 220 },
    { day: "Tue", total: 245 },
    { day: "Wed", total: 300 },
    { day: "Thu", total: 210 },
    { day: "Fri", total: 280 },
    { day: "Sat", total: 150 },
    { day: "Sun", total: 80 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <TrendChart data={monthlyTrend} />
        <TransportPie data={transport} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-4">
          <h3 className="mb-2 text-sm font-semibold text-byahero-navy">Highest Spend Day of Week</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekday}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#185FA5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <SavingsCard current={5400} previous={6200} />
      </div>
    </div>
  );
}
