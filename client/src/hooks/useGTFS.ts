import { useEffect, useMemo, useState } from "react";

export interface GTFSStop {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface GTFSRoute {
  id: string;
  agency: string;
  shortName: string;
  longName: string;
  type?: number;
  color?: string;
  fare?: number;
}

export interface StopTime {
  stopId: string;
  arrival: string;
  departure: string;
  seq: number;
}

interface GTFSState {
  mmStops: GTFSStop[];
  mmRoutes: GTFSRoute[];
  p2pStops: GTFSStop[];
  p2pRoutes: GTFSRoute[];
  p2pStopTimes: Record<string, StopTime[]>;
}

async function loadJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

function distanceKm(fromLat: number, fromLon: number, toLat: number, toLon: number) {
  const radius = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const latDelta = toRad(toLat - fromLat);
  const lonDelta = toRad(toLon - fromLon);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(lonDelta / 2) ** 2;

  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useGTFS() {
  const [data, setData] = useState<GTFSState>({
    mmStops: [],
    mmRoutes: [],
    p2pStops: [],
    p2pRoutes: [],
    p2pStopTimes: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [mmStops, mmRoutes, p2pStops, p2pRoutes, p2pStopTimes] = await Promise.all([
          loadJson<GTFSStop[]>("/data/mm_stops.json", []),
          loadJson<GTFSRoute[]>("/data/mm_routes.json", []),
          loadJson<GTFSStop[]>("/data/p2p_stops.json", []),
          loadJson<GTFSRoute[]>("/data/p2p_routes.json", []),
          loadJson<Record<string, StopTime[]>>("/data/p2p_stop_times.json", {}),
        ]);

        if (!mounted) {
          return;
        }

        setData({ mmStops, mmRoutes, p2pStops, p2pRoutes, p2pStopTimes });
        const hasMinimumData = mmStops.length > 0 || p2pRoutes.length > 0 || p2pStops.length > 0;
        setError(hasMinimumData ? null : "Transit data files are not available yet.");
      } catch {
        if (mounted) {
          setError("Failed to load transit data.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const allStops = useMemo(() => [...data.mmStops, ...data.p2pStops], [data.mmStops, data.p2pStops]);

  const searchStops = (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) {
      return [];
    }

    return allStops.filter((stop) => stop.name.toLowerCase().includes(normalized)).slice(0, 10);
  };

  const getP2PRoutesForStop = (stopId: string) => {
    const relatedTripIds = Object.entries(data.p2pStopTimes)
      .filter(([, times]) => times.some((time) => time.stopId === stopId))
      .map(([tripId]) => tripId);

    return data.p2pRoutes.filter((route) =>
      relatedTripIds.some((tripId) => tripId.includes(route.id.replace("P2P_", "T_").split("_").slice(0, 3).join("_")))
    );
  };

  const getNearbyStops = (lat: number, lon: number, radius = 0.5) =>
    allStops.filter((stop) => distanceKm(lat, lon, stop.lat, stop.lon) <= radius);

  return {
    ...data,
    allStops,
    loading,
    error,
    searchStops,
    getP2PRoutesForStop,
    getNearbyStops,
  };
}
