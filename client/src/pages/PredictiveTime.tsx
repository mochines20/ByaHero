import { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

function minsToClock(totalMins: number) {
  const h24 = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function PredictiveTimePage() {
  const [arrival, setArrival] = useState("09:00");
  const [traffic, setTraffic] = useState("high");
  const [weather, setWeather] = useState("clear");
  const [extra, setExtra] = useState(8);
  const [result, setResult] = useState<string | null>(null);

  const computed = useMemo(() => {
    const [h, m] = arrival.split(":").map(Number);
    const arrivalMins = h * 60 + m;
    const trafficPenalty = traffic === "high" ? 50 : traffic === "medium" ? 32 : 20;
    const weatherPenalty = weather === "rainy" ? 15 : weather === "storm" ? 28 : 0;
    const leaveMins = Math.max(0, arrivalMins - (trafficPenalty + weatherPenalty + Number(extra || 0)));
    return { leaveMins, trafficPenalty, weatherPenalty };
  }, [arrival, traffic, weather, extra]);

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <h1 className="text-xl font-bold text-byahero-navy sm:text-2xl">Predictive Commute Time</h1>
        <p className="mt-1 text-sm text-byahero-muted">Tells you when to leave based on traffic + weather and a safety buffer.</p>
      </Card>

      <Card className="rounded-3xl space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-byahero-muted">Arrive by</label>
            <Input type="time" value={arrival} onChange={(e) => setArrival(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-byahero-muted">Extra buffer (minutes)</label>
            <Input type="number" value={extra} onChange={(e) => setExtra(Number(e.target.value))} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-byahero-muted">Traffic</label>
            <select value={traffic} onChange={(e) => setTraffic(e.target.value)} className="mt-1 min-h-11 w-full rounded-2xl border border-[#d7e9ff] bg-white/92 px-3 text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-byahero-muted">Weather</label>
            <select value={weather} onChange={(e) => setWeather(e.target.value)} className="mt-1 min-h-11 w-full rounded-2xl border border-[#d7e9ff] bg-white/92 px-3 text-sm">
              <option value="clear">Clear</option>
              <option value="rainy">Rainy</option>
              <option value="storm">Storm</option>
            </select>
          </div>
        </div>

        <Button onClick={() => setResult(minsToClock(computed.leaveMins))}>Compute leave time</Button>

        {result ? (
          <div className="rounded-2xl bg-[#edf6ff] p-3 text-sm text-byahero-navy">
            Leave by <span className="font-bold">{result}</span> (traffic +{computed.trafficPenalty}m, weather +{computed.weatherPenalty}m, buffer +{extra}m)
          </div>
        ) : null}
      </Card>
    </div>
  );
}

