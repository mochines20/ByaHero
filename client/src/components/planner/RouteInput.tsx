import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function RouteInput({
  origin,
  destination,
  onOrigin,
  onDestination,
  onPlan,
}: {
  origin: string;
  destination: string;
  onOrigin: (v: string) => void;
  onDestination: (v: string) => void;
  onPlan: () => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="mb-2 text-sm font-semibold text-byahero-navy">Plan Route</p>
      <div className="grid gap-2 md:grid-cols-2">
        <Input placeholder="Origin" value={origin} onChange={(e) => onOrigin(e.target.value)} />
        <Input placeholder="Destination" value={destination} onChange={(e) => onDestination(e.target.value)} />
      </div>
      <Button className="mt-3" onClick={onPlan}>Get suggestions</Button>
    </div>
  );
}
