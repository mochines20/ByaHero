import { Card } from "../ui/Card";
import { TRANSPORT_COLORS } from "../../lib/constants";

export function RecentTrips({ trips }: { trips: any[] }) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-byahero-navy">Recent Trips</h3>
      <ul className="space-y-2">
        {trips.slice(0, 5).map((trip) => (
          <li key={trip.id} className="rounded-lg border border-byahero-light p-3">
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium">{trip.origin} ? {trip.destination}</p>
              <p className="font-semibold">?{Number(trip.fare).toFixed(2)}</p>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-byahero-muted">
              <span className="rounded-full px-2 py-1 text-white" style={{ backgroundColor: TRANSPORT_COLORS[trip.transportType] }}>
                {trip.transportType}
              </span>
              <span>{new Date(trip.tripDate).toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
