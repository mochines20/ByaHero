import { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";
import { useToastStore } from "../store/uiStore";

type Crowd = "Low" | "Moderate" | "High" | "Very High";

const tone: Record<Crowd, string> = {
  Low: "bg-emerald-100 text-emerald-700",
  Moderate: "bg-amber-100 text-amber-800",
  High: "bg-orange-100 text-orange-800",
  "Very High": "bg-rose-100 text-rose-700",
};

export function CrowdPage() {
  const pushToast = useToastStore((s) => s.pushToast);
  const [origin, setOrigin] = useState("Alabang");
  const [destination, setDestination] = useState("Makati");
  const [loading, setLoading] = useState(false);
  const [crowd, setCrowd] = useState<Crowd | null>(null);
  const [peak, setPeak] = useState<string>("");

  const heat = useMemo(() => {
    return [
      { slot: "6-7 AM", level: "Moderate" as Crowd },
      { slot: "7-9 AM", level: "Very High" as Crowd },
      { slot: "10-12 PM", level: "Low" as Crowd },
      { slot: "12-3 PM", level: "Moderate" as Crowd },
      { slot: "5-8 PM", level: "Very High" as Crowd },
      { slot: "8-10 PM", level: "High" as Crowd },
    ];
  }, []);

  const check = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/planner/options", { origin, destination, departureTime: new Date().toISOString() });
      const first = data?.options?.[0];
      if (!first) {
        pushToast("No routes found.");
        return;
      }
      setCrowd(first.crowdLevel as Crowd);
      setPeak(first.peakWindow || "");
    } catch (e: any) {
      pushToast(e.message || "Failed to check crowd");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <h1 className="text-xl font-bold text-byahero-navy sm:text-2xl">Crowd Level Predictor</h1>
        <p className="mt-1 text-sm text-byahero-muted">Uses routing + traffic context to estimate crowd levels and peak windows.</p>
      </Card>

      <Card className="rounded-3xl space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" />
          <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
        </div>
        <Button onClick={check} disabled={loading}>{loading ? "Checking..." : "Check crowd now"}</Button>
        {crowd ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-2 text-xs font-semibold ${tone[crowd]}`}>Volume: {crowd}</span>
            {peak ? <span className="rounded-full bg-[#edf6ff] px-3 py-2 text-xs font-semibold text-byahero-navy">{peak}</span> : null}
          </div>
        ) : null}
      </Card>

      <Card className="rounded-3xl">
        <h3 className="text-sm font-semibold text-byahero-navy">Peak hour heatmap (prototype)</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {heat.map((h) => (
            <div key={h.slot} className="rounded-2xl border border-[#dceafd] bg-white/85 p-3">
              <p className="text-xs text-byahero-muted">{h.slot}</p>
              <p className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${tone[h.level]}`}>{h.level}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

