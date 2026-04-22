import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, InfoWindow, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { GTFSStop, useGTFS } from "../hooks/useGTFS";
import { calculateFare, TransportMode } from "../utils/fareEngine";

type Filter = "all" | "train" | "p2p" | "bus";
type RouteTag = "fastest" | "tipid" | "balance";

export type PlannerRouteOption = {
  id: string;
  name: string;
  label?: string;
  tag?: RouteTag;
  cost: number;
  minutes: number;
  crowdLevel?: "Low" | "Moderate" | "High" | "Very High";
  peakWindow?: string;
  avgSpeedKph?: number;
  legs: { mode: string; label: string }[];
};

type ByaHeroMapProps = {
  origin: string;
  destination: string;
  originPlaceId: string | null;
  destinationPlaceId: string | null;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onOriginPlaceIdChange: (value: string | null) => void;
  onDestinationPlaceIdChange: (value: string | null) => void;
  onPlan: () => void;
  options: PlannerRouteOption[];
  planning: boolean;
};

const CENTER = { lat: 14.5995, lng: 120.9842 };
const LIBRARIES: ("places")[] = ["places"];
const AUTOCOMPLETE_REQUEST_DELAY = 180;

type PlacePrediction = {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
};

type PresetSuggestion = {
  aliases: string[];
  description: string;
  mainText: string;
  secondaryText: string;
};

const PRESET_ORIGIN_SUGGESTIONS: PresetSuggestion[] = [
  {
    aliases: ["vtx", "vista terminal", "vista terminal exchange", "las pinas vtx"],
    description: "Vista Terminal Exchange (VTX), Las Pinas, Metro Manila, Philippines",
    mainText: "Vista Terminal Exchange (VTX)",
    secondaryText: "Las Pinas, Metro Manila",
  },
  {
    aliases: ["pitx", "paranaque integrated terminal"],
    description: "Paranaque Integrated Terminal Exchange (PITX), Parañaque, Metro Manila, Philippines",
    mainText: "Paranaque Integrated Terminal Exchange (PITX)",
    secondaryText: "Parañaque, Metro Manila",
  },
];

const PRESET_DESTINATION_SUGGESTIONS: PresetSuggestion[] = [
  {
    aliases: ["market market", "market! market", "market market bgc", "bgc market market"],
    description: "Market! Market!, Bonifacio Global City, Taguig, Metro Manila, Philippines",
    mainText: "Market! Market!",
    secondaryText: "Bonifacio Global City, Taguig",
  },
  {
    aliases: ["bgc", "bonifacio global city"],
    description: "Bonifacio Global City, Taguig, Metro Manila, Philippines",
    mainText: "Bonifacio Global City (BGC)",
    secondaryText: "Taguig, Metro Manila",
  },
];

const AGENCY_COLORS: Record<string, string> = {
  LRTA: "#22c55e",
  MRTC: "#3b82f6",
  PNR: "#ef4444",
  ROBINSONS: "#ec4899",
  FROEHLICH: "#f97316",
  RRCG: "#06b6d4",
  LINGKODPINOY: "#84cc16",
  METROEXPRESS: "#a855f7",
  TASTRANS: "#78716c",
  LTFRB: "#f59e0b",
  FORT: "#8b5cf6",
};

const ROUTE_COLORS: Record<RouteTag, string> = {
  fastest: "#FFD60A",
  tipid: "#34D399",
  balance: "#60A5FA",
};

function getModeFromAgency(agency: string): TransportMode {
  if (agency === "LRTA") return "lrt1";
  if (agency === "MRTC") return "mrt3";
  if (agency === "PNR") return "pnr";
  if (["ROBINSONS", "FROEHLICH", "RRCG", "LINGKODPINOY", "METROEXPRESS", "TASTRANS"].includes(agency)) return "p2p";
  return "bus";
}

function getAgency(stop: GTFSStop, p2pStopIds: Set<string>, p2pRouteById: Map<string, string>) {
  if (p2pStopIds.has(stop.id)) {
    const routeKey = stop.id.replace(/^S_/, "P2P_").split("_").slice(0, 3).join("_");
    return p2pRouteById.get(routeKey) ?? "LTFRB";
  }

  if (stop.id.startsWith("LRTA")) return "LRTA";
  if (stop.id.startsWith("MRTC")) return "MRTC";
  if (stop.id.startsWith("PNR")) return "PNR";
  return "LTFRB";
}

function makeCircleIcon(color: string) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 0.95,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: 6,
  };
}

function normalizeQuery(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9!\s]/g, " ").replace(/\s+/g, " ").trim();
}

function getPresetSuggestions(query: string, presets: PresetSuggestion[]): PlacePrediction[] {
  const normalizedQuery = normalizeQuery(query);
  if (normalizedQuery.length < 2) {
    return [];
  }

  return presets
    .filter((preset) => preset.aliases.some((alias) => normalizeQuery(alias).includes(normalizedQuery) || normalizedQuery.includes(normalizeQuery(alias))))
    .map((preset) => ({
      description: preset.description,
      placeId: "",
      mainText: preset.mainText,
      secondaryText: preset.secondaryText,
    }));
}

function mergePredictions(primary: PlacePrediction[], fallback: PlacePrediction[]) {
  const seen = new Set<string>();
  return [...fallback, ...primary].filter((item) => {
    const key = `${item.description}|${item.placeId}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export default function ByaHeroMap({
  origin,
  destination,
  originPlaceId,
  destinationPlaceId,
  onOriginChange,
  onDestinationChange,
  onOriginPlaceIdChange,
  onDestinationPlaceIdChange,
  onPlan,
  options,
  planning,
}: ByaHeroMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "byahero-google-map",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
    libraries: LIBRARIES,
  });
  const { mmStops, p2pStops, p2pRoutes, loading, error, getNearbyStops } = useGTFS();

  const [selected, setSelected] = useState<GTFSStop | null>(null);
  const [nearby, setNearby] = useState<GTFSStop[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [fareMode, setFareMode] = useState<TransportMode>("bus");
  const [fareKm, setFareKm] = useState(5);
  const [fareStations, setFareStations] = useState(3);
  const [fareRouteId, setFareRouteId] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [routePaths, setRoutePaths] = useState<Record<string, google.maps.LatLngLiteral[]>>({});
  const [originPredictions, setOriginPredictions] = useState<PlacePrediction[]>([]);
  const [destinationPredictions, setDestinationPredictions] = useState<PlacePrediction[]>([]);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const placesContainerRef = useRef<HTMLDivElement | null>(null);

  const p2pStopIds = useMemo(() => new Set(p2pStops.map((stop) => stop.id)), [p2pStops]);
  const p2pRouteById = useMemo(
    () => new Map(p2pRoutes.map((route) => [route.id, route.agency])),
    [p2pRoutes]
  );

  const visibleStops = useMemo(() => {
    const allStops = [...mmStops, ...p2pStops];
    const filtered =
      filter === "all"
        ? allStops
        : filter === "train"
          ? allStops.filter((stop) => stop.id.startsWith("LRTA") || stop.id.startsWith("MRTC") || stop.id.startsWith("PNR"))
          : filter === "p2p"
            ? p2pStops
            : allStops.filter((stop) => !(stop.id.startsWith("LRTA") || stop.id.startsWith("MRTC") || stop.id.startsWith("PNR")));

    return filtered.slice(0, 800);
  }, [filter, mmStops, p2pStops]);

  const selectedAgency = selected ? getAgency(selected, p2pStopIds, p2pRouteById) : null;
  const selectedMode = selectedAgency ? getModeFromAgency(selectedAgency) : null;
  const selectedFareSample = selectedMode
    ? calculateFare(selectedMode, {
        distanceKm: 5,
        stationCount: 3,
        routeId: selectedMode === "p2p" ? p2pRoutes[0]?.id ?? "" : "",
      })
    : null;

  const fare = calculateFare(fareMode, {
    distanceKm: fareKm,
    stationCount: fareStations,
    routeId: fareRouteId,
  });

  const highlightedRoutes = useMemo(
    () =>
      options
        .map((option) => ({
          ...option,
          path: routePaths[option.id] ?? [],
        }))
        .filter((option) => option.path.length > 0 && option.tag),
    [options, routePaths]
  );

  const onSelect = (stop: GTFSStop) => {
    setSelected(stop);
    setNearby(getNearbyStops(stop.lat, stop.lon, 0.5));

    if (map) {
      map.panTo({ lat: stop.lat, lng: stop.lon });
      map.setZoom(16);
    }
  };

  useEffect(() => {
    if (!isLoaded || !placesContainerRef.current) {
      return;
    }

    autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
    placesServiceRef.current = new google.maps.places.PlacesService(placesContainerRef.current);
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !autocompleteServiceRef.current || originPlaceId || origin.trim().length < 2) {
      setOriginPredictions([]);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      autocompleteServiceRef.current?.getPlacePredictions(
        {
          input: origin,
          componentRestrictions: { country: "ph" },
        },
        (predictions) => {
          const googlePredictions = (predictions ?? []).slice(0, 6).map((prediction) => ({
            description: prediction.description,
            placeId: prediction.place_id,
            mainText: prediction.structured_formatting.main_text,
            secondaryText: prediction.structured_formatting.secondary_text ?? "",
          }));
          setOriginPredictions(mergePredictions(googlePredictions, getPresetSuggestions(origin, PRESET_ORIGIN_SUGGESTIONS)).slice(0, 6));
        }
      );
    }, AUTOCOMPLETE_REQUEST_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [isLoaded, origin, originPlaceId]);

  useEffect(() => {
    if (!isLoaded || !autocompleteServiceRef.current || destinationPlaceId || destination.trim().length < 2) {
      setDestinationPredictions([]);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      autocompleteServiceRef.current?.getPlacePredictions(
        {
          input: destination,
          componentRestrictions: { country: "ph" },
        },
        (predictions) => {
          const googlePredictions = (predictions ?? []).slice(0, 6).map((prediction) => ({
            description: prediction.description,
            placeId: prediction.place_id,
            mainText: prediction.structured_formatting.main_text,
            secondaryText: prediction.structured_formatting.secondary_text ?? "",
          }));
          setDestinationPredictions(
            mergePredictions(googlePredictions, getPresetSuggestions(destination, PRESET_DESTINATION_SUGGESTIONS)).slice(0, 6)
          );
        }
      );
    }, AUTOCOMPLETE_REQUEST_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [destination, destinationPlaceId, isLoaded]);

  const selectPrediction = (
    prediction: PlacePrediction,
    target: "origin" | "destination"
  ) => {
    const applySelection = (description: string, placeId: string | null) => {
      if (target === "origin") {
        onOriginChange(description);
        onOriginPlaceIdChange(placeId);
        setOriginPredictions([]);
      } else {
        onDestinationChange(description);
        onDestinationPlaceIdChange(placeId);
        setDestinationPredictions([]);
      }
    };

    if (!prediction.placeId || !placesServiceRef.current) {
      applySelection(prediction.description, prediction.placeId);
      return;
    }

    placesServiceRef.current.getDetails(
      {
        placeId: prediction.placeId,
        fields: ["place_id", "formatted_address", "name"],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          applySelection(prediction.description, prediction.placeId);
          return;
        }

        applySelection(place.formatted_address || place.name || prediction.description, place.place_id || prediction.placeId);
      }
    );
  };

  useEffect(() => {
    if (!map || selected || highlightedRoutes.length > 0 || visibleStops.length === 0) {
      return;
    }

    if (visibleStops.length === 1) {
      map.panTo({ lat: visibleStops[0].lat, lng: visibleStops[0].lon });
      map.setZoom(15);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    visibleStops.forEach((stop) => {
      bounds.extend({ lat: stop.lat, lng: stop.lon });
    });

    map.fitBounds(bounds, 48);
  }, [highlightedRoutes.length, map, selected, visibleStops]);

  useEffect(() => {
    if (!isLoaded || !origin.trim() || !destination.trim() || options.length === 0) {
      setRoutePaths({});
      return;
    }

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: originPlaceId ? `place_id:${originPlaceId}` : origin,
        destination: destinationPlaceId ? `place_id:${destinationPlaceId}` : destination,
        travelMode: google.maps.TravelMode.TRANSIT,
        provideRouteAlternatives: true,
        transitOptions: {
          departureTime: new Date(),
        },
      },
      (result, status) => {
        if (status !== google.maps.DirectionsStatus.OK || !result) {
          setRoutePaths({});
          return;
        }

        const nextPaths: Record<string, google.maps.LatLngLiteral[]> = {};
        options.forEach((option) => {
          const routeIndex = Number(option.id.replace("route-", ""));
          const route = result.routes[routeIndex];
          if (!route?.overview_path) {
            return;
          }

          nextPaths[option.id] = route.overview_path.map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
          }));
        });

        setRoutePaths(nextPaths);
      }
    );
  }, [destination, destinationPlaceId, isLoaded, options, origin, originPlaceId]);

  useEffect(() => {
    if (!map || highlightedRoutes.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    highlightedRoutes.forEach((route) => {
      route.path.forEach((point) => bounds.extend(point));
    });

    map.fitBounds(bounds, 72);
  }, [highlightedRoutes, map]);

  if (loading) {
    return (
      <div className="grid h-full place-items-center bg-slate-950 text-sm text-slate-300">
        Loading transit data...
      </div>
    );
  }

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="grid h-full place-items-center bg-slate-950 px-6 text-center text-sm text-slate-300">
        Add `VITE_GOOGLE_MAPS_API_KEY` to load the interactive transit map.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="grid h-full place-items-center bg-slate-950 text-sm text-slate-300">
        Loading map...
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-950 text-slate-100">
      <div className="space-y-3 border-b border-white/10 bg-slate-900/90 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-brand text-xl font-black italic tracking-tight text-byahero-yellow">ByaHero Map</span>
          <span className="rounded-full border border-byahero-yellow/20 bg-byahero-yellow/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-byahero-yellow">
            Live Traffic View
          </span>

          <div className="grid min-w-[260px] flex-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
            <div className="relative">
              <input
                value={origin}
                onChange={(event) => {
                  onOriginChange(event.target.value);
                  onOriginPlaceIdChange(null);
                }}
                onBlur={() => {
                  window.setTimeout(() => setOriginPredictions([]), 120);
                }}
                onFocus={() => {
                  if (origin.trim().length >= 2 && !originPlaceId) {
                    setOriginPredictions((current) => current);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onPlan();
                }}
                placeholder="Saan ka manggagaling?"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              />
              {originPredictions.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl">
                  {originPredictions.map((prediction) => (
                    <button
                      key={prediction.placeId}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        selectPrediction(prediction, "origin");
                      }}
                      className="block w-full border-b border-white/5 px-3 py-2 text-left last:border-b-0 hover:bg-white/5"
                    >
                      <div className="text-sm font-semibold text-white">{prediction.mainText}</div>
                      {prediction.secondaryText && (
                        <div className="text-xs text-slate-400">{prediction.secondaryText}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <input
                value={destination}
                onChange={(event) => {
                  onDestinationChange(event.target.value);
                  onDestinationPlaceIdChange(null);
                }}
                onBlur={() => {
                  window.setTimeout(() => setDestinationPredictions([]), 120);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onPlan();
                }}
                placeholder="Saan ang punta?"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              />
              {destinationPredictions.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl">
                  {destinationPredictions.map((prediction) => (
                    <button
                      key={prediction.placeId}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        selectPrediction(prediction, "destination");
                      }}
                      className="block w-full border-b border-white/5 px-3 py-2 text-left last:border-b-0 hover:bg-white/5"
                    >
                      <div className="text-sm font-semibold text-white">{prediction.mainText}</div>
                      {prediction.secondaryText && (
                        <div className="text-xs text-slate-400">{prediction.secondaryText}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onPlan}
              className="rounded-xl bg-byahero-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-950 transition hover:brightness-110"
            >
              {planning ? "Loading..." : "Hanap Ruta"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["all", "train", "p2p", "bus"] as Filter[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.2em] ${
                filter === value ? "bg-byahero-yellow text-slate-950" : "bg-white/10 text-slate-300"
              }`}
            >
              {value}
            </button>
          ))}

          <span className="ml-auto text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            {visibleStops.length} visible
          </span>
        </div>

        {options.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <div key={option.id} className="rounded-2xl border border-white/10 bg-slate-950/95 px-3 py-2 text-xs text-white">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: ROUTE_COLORS[option.tag ?? "balance"] }}
                  />
                  <span className="font-black uppercase tracking-[0.18em] text-byahero-yellow">
                    {option.label ?? option.name}
                  </span>
                </div>
                <div className="mt-1 text-white/70">
                  PHP {option.cost} • {option.minutes} mins
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="min-h-0 flex-1">
          <GoogleMap
            center={selected ? { lat: selected.lat, lng: selected.lon } : CENTER}
            zoom={12}
            onLoad={(instance) => setMap(instance)}
            onClick={() => setSelected(null)}
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {highlightedRoutes.map((route) => (
              <Polyline
                key={route.id}
                path={route.path}
                options={{
                  strokeColor: ROUTE_COLORS[route.tag ?? "balance"],
                  strokeOpacity: route.tag === "fastest" ? 0.95 : 0.78,
                  strokeWeight: route.tag === "fastest" ? 6 : 5,
                }}
              />
            ))}

            {highlightedRoutes.length === 0 &&
              visibleStops.map((stop) => {
                const agency = getAgency(stop, p2pStopIds, p2pRouteById);

                return (
                  <Marker
                    key={stop.id}
                    position={{ lat: stop.lat, lng: stop.lon }}
                    icon={makeCircleIcon(AGENCY_COLORS[agency] ?? "#64748b")}
                    onClick={() => onSelect(stop)}
                  />
                );
              })}

            {selected && selectedAgency && selectedFareSample && (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lon }}
                onCloseClick={() => setSelected(null)}
                options={{ pixelOffset: new google.maps.Size(0, -6) }}
              >
                <div className="min-w-[190px] text-slate-900">
                  <div className="text-sm font-bold">{selected.name}</div>
                  <div className="text-xs text-slate-500">{selected.id}</div>
                  <div className="mt-2 text-xs">
                    <div>Agency: {selectedAgency}</div>
                    <div>Regular: PHP {selectedFareSample.regularFare}</div>
                    <div>Student: PHP {selectedFareSample.studentFare}</div>
                    <div>Senior/PWD: PHP {selectedFareSample.seniorFare}</div>
                  </div>
                </div>
              </InfoWindow>
            )}

            {selected &&
              nearby
                .filter((stop) => stop.id !== selected.id)
                .map((stop) => (
                  <Marker
                    key={`nearby-${stop.id}`}
                    position={{ lat: stop.lat, lng: stop.lon }}
                    icon={makeCircleIcon("#fbbf24")}
                  />
                ))}
          </GoogleMap>
        </div>

        <aside className="hidden h-full w-80 shrink-0 overflow-y-auto border-l border-white/10 bg-slate-900/95 p-4 xl:flex xl:flex-col xl:gap-4">
          <div>
            <div className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-byahero-yellow">Fare Calculator</div>

            <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">Transport Mode</label>
            <select
              value={fareMode}
              onChange={(event) => setFareMode(event.target.value as TransportMode)}
              className="mb-3 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm"
            >
              <option value="jeepney">Jeepney</option>
              <option value="bus">Bus</option>
              <option value="lrt1">LRT-1</option>
              <option value="lrt2">LRT-2</option>
              <option value="mrt3">MRT-3</option>
              <option value="pnr">PNR</option>
              <option value="ferry">Pasig Ferry</option>
              <option value="p2p">P2P Bus</option>
            </select>

            {["jeepney", "bus", "pnr"].includes(fareMode) && (
              <>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Distance: {fareKm} km
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={fareKm}
                  onChange={(event) => setFareKm(Number(event.target.value))}
                  className="mb-3 w-full"
                />
              </>
            )}

            {["lrt1", "lrt2", "mrt3"].includes(fareMode) && (
              <>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">
                  Stations: {fareStations}
                </label>
                <input
                  type="range"
                  min={1}
                  max={fareMode === "lrt1" ? 25 : 13}
                  value={fareStations}
                  onChange={(event) => setFareStations(Number(event.target.value))}
                  className="mb-3 w-full"
                />
              </>
            )}

            {fareMode === "p2p" && (
              <>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">P2P Route</label>
                <select
                  value={fareRouteId}
                  onChange={(event) => setFareRouteId(event.target.value)}
                  className="mb-3 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm"
                >
                  <option value="">Select a route</option>
                  {p2pRoutes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.shortName} (PHP {route.fare ?? 0})
                    </option>
                  ))}
                </select>
              </>
            )}

            <div className="rounded-2xl bg-slate-950 p-3 text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Regular</span>
                <span>PHP {fare.regularFare}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Student</span>
                <span>PHP {fare.studentFare}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Senior</span>
                <span>PHP {fare.seniorFare}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">PWD</span>
                <span>PHP {fare.pwdFare}</span>
              </div>
            </div>
          </div>

          {selected && (
            <div className="rounded-2xl bg-slate-950 p-3 text-sm">
              <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-byahero-yellow">Selected Stop</div>
              <div className="font-bold">{selected.name}</div>
              <div className="text-xs text-slate-400">
                {selected.lat.toFixed(5)}, {selected.lon.toFixed(5)}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                {Math.max(nearby.length - 1, 0)} nearby stops within 500m
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-slate-950 p-3 text-sm">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-byahero-yellow">P2P Routes</div>
            <div className="space-y-2">
              {p2pRoutes.length > 0 ? (
                p2pRoutes.map((route) => (
                  <div key={route.id} className="rounded-xl border border-white/5 bg-white/5 p-2">
                    <div className="font-semibold">{route.shortName}</div>
                    <div className="text-xs text-slate-400">{route.longName}</div>
                    <div className="mt-1 text-xs font-bold text-byahero-yellow">PHP {route.fare ?? 0}</div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">No P2P route file loaded yet.</div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {error && (
        <div className="border-t border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs text-amber-100">
          {error}
        </div>
      )}

      <div ref={placesContainerRef} className="hidden" />
    </div>
  );
}
