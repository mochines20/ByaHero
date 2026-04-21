import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export function TripList({ trips, onDelete }: { trips: any[]; onDelete: (id: string) => Promise<void> }) {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {trips.map((trip) => (
        <div key={trip.id} className="rounded-xl border border-byahero-light bg-white p-3 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{trip.origin} ? {trip.destination}</p>
              <p className="text-xs text-byahero-muted">{trip.transportType} • {new Date(trip.tripDate).toLocaleString()}</p>
            </div>
            <p className="font-bold text-byahero-navy">?{Number(trip.fare).toFixed(2)}</p>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button className="min-h-11 min-w-11 rounded-lg border border-byahero-light p-2" aria-label="Edit trip">
              <Pencil size={16} />
            </button>
            <button
              className="min-h-11 min-w-11 rounded-lg border border-red-200 p-2 text-red-600"
              aria-label="Delete trip"
              onClick={() => setPendingDelete(trip.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      <Modal open={Boolean(pendingDelete)} title="Delete trip" onClose={() => setPendingDelete(null)}>
        <p className="mb-3 text-sm text-byahero-muted">Are you sure you want to remove this entry?</p>
        <div className="flex justify-end gap-2">
          <Button className="secondary" onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (pendingDelete) {
                await onDelete(pendingDelete);
                setPendingDelete(null);
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}
