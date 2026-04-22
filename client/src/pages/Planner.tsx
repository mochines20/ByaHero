import { useState } from "react";
import { RouteCard } from "../components/planner/RouteCard";
import { RouteMap } from "../components/planner/RouteMap";
import { api } from "../lib/api";
import { useToastStore } from "../store/uiStore";
import { motion, AnimatePresence } from "framer-motion";

export function PlannerPage() {
  const pushToast = useToastStore((s) => s.pushToast);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originPlaceId, setOriginPlaceId] = useState<string | null>(null);
  const [destinationPlaceId, setDestinationPlaceId] = useState<string | null>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const plan = async () => {
    if (!origin.trim() || !destination.trim()) {
      pushToast("Pakisulat muna ang iyong origin at destination.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/planner/options", {
        origin,
        destination,
        originPlaceId: originPlaceId ?? undefined,
        destinationPlaceId: destinationPlaceId ?? undefined,
        departureTime: new Date().toISOString(),
      });
      setOptions(data.options || []);
      if (!data.options?.length) pushToast("Naku! Walang nahanap na ruta sa byaheng ito.");
    } catch (error: any) {
      pushToast(error.message || "Nagka-error sa pag-hanap ng ruta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col gap-2">
        <h2 className="font-brand text-4xl font-black text-white italic tracking-tighter">Mag-plano ng Byahe</h2>
        <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Bawat kanto, may plano.</p>
      </header>

      <div className="glass-card overflow-hidden rounded-[3rem] border border-white/20 shadow-2xl h-[400px] relative">
        <RouteMap
          origin={origin}
          destination={destination}
          originPlaceId={originPlaceId}
          destinationPlaceId={destinationPlaceId}
          onOriginChange={setOrigin}
          onDestinationChange={setDestination}
          onOriginPlaceIdChange={setOriginPlaceId}
          onDestinationPlaceIdChange={setDestinationPlaceId}
          onPlan={plan}
          options={options}
          planning={loading}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-brand text-2xl font-black text-white">Mga Option Para Sayo</h3>
          {options.length > 0 && <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{options.length} route(s) found</span>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {loading && (
            <div className="md:col-span-2 glass-card flex flex-col items-center justify-center rounded-[2.5rem] py-20 border border-byahero-yellow/10">
              <div className="h-12 w-12 rounded-full border-4 border-byahero-yellow/20 border-t-byahero-yellow animate-spin mb-4" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-byahero-yellow">Naghahanap ng best route...</p>
            </div>
          )}
          
          <AnimatePresence>
            {options.map((option, i) => (
              <motion.div
                key={option.id || option.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <RouteCard
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
                      notes: `Paboritong ruta: ${option.name}`,
                    });
                    pushToast("Nice! Nilagay ko na sa favorites mo.");
                  }}
                  onStart={() => pushToast("Byahe na! Ingat po, Hero.")}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && options.length === 0 && (
            <div className="md:col-span-2 py-12 text-center opacity-30">
              <p className="text-xs font-black uppercase tracking-[0.5em]">Search from the map header above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
