import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

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
    { name: "Office cost", value: officeDays * dailyCost },
    { name: "Saved", value: stats.monthlySavings },
  ];

  const share = async () => {
    const text = `ByaHero Savings: I save PHP ${stats.monthlySavings}/month by WFH ${wfhDays} days.`;
    if (navigator.share) {
      await navigator.share({ title: "ByaHero Savings", text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Savings text copied to clipboard.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-xl border border-byahero-light bg-white p-4 shadow-card sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="text-sm">WFH days / month</label>
          <Input type="number" value={wfhDays} onChange={(e) => setWfhDays(Number(e.target.value))} />
        </div>
        <div>
          <label className="text-sm">Office days / month</label>
          <Input type="number" value={officeDays} onChange={(e) => setOfficeDays(Number(e.target.value))} />
        </div>
        <div>
          <label className="text-sm">Average daily commute cost</label>
          <Input type="number" value={dailyCost} onChange={(e) => setDailyCost(Number(e.target.value))} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-byahero-light bg-white p-4 shadow-card"><p className="text-xs">Monthly savings</p><p className="text-2xl font-bold">?{stats.monthlySavings.toFixed(2)}</p></div>
        <div className="rounded-xl border border-byahero-light bg-white p-4 shadow-card"><p className="text-xs">Annual savings</p><p className="text-2xl font-bold">?{stats.annualSavings.toFixed(2)}</p></div>
        <div className="rounded-xl border border-byahero-light bg-white p-4 shadow-card"><p className="text-xs">Per WFH day</p><p className="text-2xl font-bold">?{stats.perWfh.toFixed(2)}</p></div>
      </div>

      <div className="rounded-xl border border-byahero-light bg-white p-4 shadow-card">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1D9E75" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Button onClick={share}>Share my savings</Button>
    </div>
  );
}
