import fs from "fs";
import path from "path";

interface Stop {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface Route {
  id: string;
  agency: string;
  shortName: string;
  longName: string;
  type?: number;
  fare?: number;
}

const DATA_DIR = path.join(process.cwd(), "server", "public", "data");

function loadJson<T>(file: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, file);

  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

export class GTFSService {
  private mmStops = loadJson<Stop[]>("mm_stops.json", []);
  private mmRoutes = loadJson<Route[]>("mm_routes.json", []);
  private p2pStops = loadJson<Stop[]>("p2p_stops.json", []);
  private p2pRoutes = loadJson<Route[]>("p2p_routes.json", []);
  private p2pStopTimes = loadJson<Record<string, unknown[]>>("p2p_stop_times.json", {});

  getAllStops() {
    return { mm: this.mmStops, p2p: this.p2pStops };
  }

  getAllRoutes() {
    return { mm: this.mmRoutes, p2p: this.p2pRoutes };
  }

  searchStops(query: string, limit = 10) {
    const normalized = query.toLowerCase();
    return [...this.mmStops, ...this.p2pStops]
      .filter((stop) => stop.name.toLowerCase().includes(normalized))
      .slice(0, limit);
  }

  getNearbyStops(lat: number, lon: number, radiusKm = 0.5) {
    const radius = 6371;
    const toRad = (value: number) => (value * Math.PI) / 180;

    return [...this.mmStops, ...this.p2pStops].filter((stop) => {
      const latDelta = toRad(stop.lat - lat);
      const lonDelta = toRad(stop.lon - lon);
      const a =
        Math.sin(latDelta / 2) ** 2 +
        Math.cos(toRad(lat)) * Math.cos(toRad(stop.lat)) * Math.sin(lonDelta / 2) ** 2;

      return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) <= radiusKm;
    });
  }

  getP2PFare(routeId: string) {
    return this.p2pRoutes.find((route) => route.id === routeId)?.fare ?? 0;
  }

  getStopTimes(tripId: string) {
    return this.p2pStopTimes[tripId] ?? [];
  }
}

export const gtfsService = new GTFSService();
