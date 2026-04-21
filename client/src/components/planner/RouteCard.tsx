type RouteOption = {
  name: string;
  cost: number;
  minutes: number;
  fastest?: boolean;
  crowdLevel?: "Low" | "Moderate" | "High" | "Very High";
  peakWindow?: string;
  avgSpeedKph?: number;
  fareBreakdown?: { mode: string; distanceKm: number; estimatedFare: number; note?: string }[];
  legs: { mode: string; label: string }[];
};

export function RouteCard({ option, onSave, onStart }: { option: RouteOption; onSave: () => void; onStart: () => void }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-byahero-navy">{option.name}</p>
          <p className="text-sm text-byahero-muted">Est. fare ~PHP {option.cost.toFixed(2)} • {option.minutes} mins</p>
        </div>
        {option.fastest && <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Fastest</span>}
      </div>

      <div className="mt-3 grid gap-2 rounded-lg border border-white/40 bg-white/55 p-3 text-xs sm:grid-cols-3">
        <p className="text-byahero-muted">Peak Hours: <span className="font-semibold text-byahero-navy">{option.peakWindow ?? "N/A"}</span></p>
        <p className="text-byahero-muted">Volume: <span className="font-semibold text-byahero-navy">{option.crowdLevel ?? "N/A"}</span></p>
        <p className="text-byahero-muted">Avg Speed: <span className="font-semibold text-byahero-navy">{option.avgSpeedKph ?? 0} kph</span></p>
      </div>

      {option.fareBreakdown?.length ? (
        <div className="mt-3 rounded-lg border border-white/40 bg-white/55 p-3">
          <p className="text-xs font-semibold text-byahero-navy">Fare breakdown (estimate)</p>
          <div className="mt-2 space-y-1 text-xs text-byahero-muted">
            {option.fareBreakdown
              .filter((b) => (b.estimatedFare ?? 0) > 0)
              .map((b, idx) => (
                <div key={`${b.mode}-${idx}`} className="flex items-center justify-between gap-2">
                  <span className="truncate">{b.mode} • {b.distanceKm.toFixed(1)} km</span>
                  <span className="font-semibold text-byahero-navy">PHP {Number(b.estimatedFare).toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>
      ) : null}

      <div className="mt-3 space-y-2">
        {option.legs.map((leg, idx) => (
          <div key={`${leg.mode}-${idx}`} className="rounded-lg border border-white/40 bg-white/55 px-3 py-2 text-xs text-byahero-navy">
            <span className="font-semibold">Step {idx + 1}:</span> {leg.mode} - {leg.label}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button className="min-h-11 rounded-lg border border-byahero-light px-3 text-sm" onClick={onSave}>Save Favorite</button>
        <button className="min-h-11 rounded-full bg-byahero-navy px-4 text-sm font-semibold text-white" onClick={onStart}>Start Trip</button>
      </div>
    </div>
  );
}
