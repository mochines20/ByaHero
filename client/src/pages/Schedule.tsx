import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type ScheduleItem = { day: DayKey; route: string; leave: string };

const days: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const storageKey = "byahero.schedule.v1";

export function SchedulePage() {
  const [route, setRoute] = useState("Pasig → Makati");
  const [leave, setLeave] = useState("07:20");
  const [items, setItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const filled = useMemo(() => {
    const map = new Map(items.map((i) => [i.day, i]));
    return days.map((d) => map.get(d) ?? { day: d, route: "", leave: "" });
  }, [items]);

  const applyWeek = () => {
    setItems(days.map((d) => ({ day: d, route, leave })));
  };

  const updateDay = (day: DayKey, next: Partial<ScheduleItem>) => {
    setItems((prev) => {
      const map = new Map(prev.map((i) => [i.day, i]));
      const cur = map.get(day) ?? { day, route: "", leave: "" };
      map.set(day, { ...cur, ...next });
      return Array.from(map.values()).sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));
    });
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <h1 className="text-xl font-bold text-byahero-navy sm:text-2xl">Smart Commute Schedule</h1>
        <p className="mt-1 text-sm text-byahero-muted">A functional weekly schedule (saved locally). Later we can learn patterns automatically.</p>
      </Card>

      <Card className="rounded-3xl space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-byahero-muted">Default route</label>
            <Input value={route} onChange={(e) => setRoute(e.target.value)} placeholder="e.g., Pasig → Makati" />
          </div>
          <div>
            <label className="text-xs text-byahero-muted">Default leave time</label>
            <Input type="time" value={leave} onChange={(e) => setLeave(e.target.value)} />
          </div>
        </div>
        <Button onClick={applyWeek}>Apply to whole week</Button>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {filled.map((i) => (
          <Card key={i.day} className="rounded-3xl">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-byahero-navy">{i.day}</p>
              <span className="text-xs text-byahero-muted">Saved locally</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Input value={i.route} onChange={(e) => updateDay(i.day, { route: e.target.value })} placeholder="Route" />
              <Input type="time" value={i.leave} onChange={(e) => updateDay(i.day, { leave: e.target.value })} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

