import fs from "fs";
import path from "path";
const DATA_DIR = path.join(process.cwd(), "server", "public", "data");
function loadJson(file, fallback) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
        return fallback;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
export class GTFSService {
    constructor() {
        this.mmStops = loadJson("mm_stops.json", []);
        this.mmRoutes = loadJson("mm_routes.json", []);
        this.p2pStops = loadJson("p2p_stops.json", []);
        this.p2pRoutes = loadJson("p2p_routes.json", []);
        this.p2pStopTimes = loadJson("p2p_stop_times.json", {});
    }
    getAllStops() {
        return { mm: this.mmStops, p2p: this.p2pStops };
    }
    getAllRoutes() {
        return { mm: this.mmRoutes, p2p: this.p2pRoutes };
    }
    searchStops(query, limit = 10) {
        const normalized = query.toLowerCase();
        return [...this.mmStops, ...this.p2pStops]
            .filter((stop) => stop.name.toLowerCase().includes(normalized))
            .slice(0, limit);
    }
    getNearbyStops(lat, lon, radiusKm = 0.5) {
        const radius = 6371;
        const toRad = (value) => (value * Math.PI) / 180;
        return [...this.mmStops, ...this.p2pStops].filter((stop) => {
            const latDelta = toRad(stop.lat - lat);
            const lonDelta = toRad(stop.lon - lon);
            const a = Math.sin(latDelta / 2) ** 2 +
                Math.cos(toRad(lat)) * Math.cos(toRad(stop.lat)) * Math.sin(lonDelta / 2) ** 2;
            return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) <= radiusKm;
        });
    }
    getP2PFare(routeId) {
        return this.p2pRoutes.find((route) => route.id === routeId)?.fare ?? 0;
    }
    getStopTimes(tripId) {
        return this.p2pStopTimes[tripId] ?? [];
    }
}
export const gtfsService = new GTFSService();
