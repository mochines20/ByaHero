import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function TripForm({ onSubmit }: { onSubmit: (payload: any) => Promise<void> }) {
  const [data, setData] = useState({
    origin: "",
    destination: "",
    transportType: "jeepney",
    fare: "",
    travelTime: "",
    tripDate: new Date().toISOString().slice(0, 16),
    notes: "",
  });

  return (
    <form
      className="grid gap-3 rounded-xl border border-byahero-light bg-white p-4 shadow-card md:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({ ...data, fare: Number(data.fare), travelTime: Number(data.travelTime) });
      }}
    >
      <div>
        <label className="text-sm font-medium">Origin</label>
        <Input value={data.origin} onChange={(e) => setData((s) => ({ ...s, origin: e.target.value }))} required />
      </div>
      <div>
        <label className="text-sm font-medium">Destination</label>
        <Input value={data.destination} onChange={(e) => setData((s) => ({ ...s, destination: e.target.value }))} required />
      </div>
      <div>
        <label className="text-sm font-medium">Transport</label>
        <select
          className="h-12 w-full rounded-lg border border-byahero-light px-3 md:h-10"
          value={data.transportType}
          onChange={(e) => setData((s) => ({ ...s, transportType: e.target.value }))}
        >
          <option value="jeepney">Jeepney</option>
          <option value="mrt">MRT</option>
          <option value="lrt">LRT</option>
          <option value="bus">Bus</option>
          <option value="etrike">E-trike</option>
          <option value="walk">Walking</option>
          <option value="grab">Grab</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Fare (?)</label>
        <Input type="number" value={data.fare} onChange={(e) => setData((s) => ({ ...s, fare: e.target.value }))} required />
      </div>
      <div>
        <label className="text-sm font-medium">Travel Time (min)</label>
        <Input type="number" value={data.travelTime} onChange={(e) => setData((s) => ({ ...s, travelTime: e.target.value }))} required />
      </div>
      <div>
        <label className="text-sm font-medium">Date/Time</label>
        <Input type="datetime-local" value={data.tripDate} onChange={(e) => setData((s) => ({ ...s, tripDate: e.target.value }))} required />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="h-28 w-full rounded-lg border border-byahero-light p-3"
          value={data.notes}
          onChange={(e) => setData((s) => ({ ...s, notes: e.target.value }))}
        />
      </div>
      <div className="md:col-span-2">
        <Button className="w-full md:w-auto">Save Trip</Button>
      </div>
    </form>
  );
}
