import { useState } from "react";
import { RouteCard } from "../components/planner/RouteCard";
import { RouteInput } from "../components/planner/RouteInput";
import { RouteMap } from "../components/planner/RouteMap";
import { api } from "../lib/api";
import { useToastStore } from "../store/uiStore";

export function PlannerPage() {
  const pushToast = useToastStore((s) => s.pushToast);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const plan = async () => {
    if (!origin.trim() || !destination.trim()) {
      pushToast("Enter both origin and destination.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/planner/options", {
        origin,
        destination,
        departureTime: new Date().toISOString(),
      });
      setOptions(data.options || []);
      if (!data.options?.length) pushToast("No routes found for this trip.");
    } catch (error: any) {
      pushToast(error.message || "Failed to fetch route options");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <RouteInput origin={origin} destination={destination} onOrigin={setOrigin} onDestination={setDestination} onPlan={plan} />
      <RouteMap origin={origin} destination={destination} />
      <div className="grid gap-3 md:grid-cols-2">
        {loading && <div className="glass-card rounded-xl p-4 text-sm text-byahero-muted">Loading route options from Google Maps...</div>}
        {options.map((option) => (
          <RouteCard
            key={option.name}
            option={option}
            onSave={async () => {
              const primaryMode = String(option?.legs?.find((l: any) => l.mode !== "Walk")?.mode || "walk").toLowerCase();
              const transportType =
                primaryMode.includes("bus") ? "bus"
                : primaryMode.includes("jeep") ? "jeepney"
                : primaryMode.includes("tricycle") ? "etrike"
                : primaryMode.includes("uv") ? "bus"
                : primaryMode.includes("mrt") || primaryMode.includes("lrt") || primaryMode.includes("train") || primaryMode.includes("subway") ? "mrt"
                : "walk";

              await api.post("/trips", {
                origin,
                destination,
                transportType,
                fare: option.cost,
                travelTime: option.minutes,
                tripDate: new Date().toISOString(),
                notes: `Favorite route: ${option.name}`,
              });
              pushToast("Route saved");
            }}
            onStart={() => pushToast("Trip started. Auto-log on completion is ready for backend hook.")}
          />
        ))}
      </div>
    </div>
  );
}
