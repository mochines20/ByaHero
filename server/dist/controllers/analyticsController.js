import { prisma } from "../lib/prisma";
export async function monthlyTrend(req, res) {
    const user = req.user;
    const trips = await prisma.trip.findMany({ where: { userId: user.id } });
    const map = new Map();
    trips.forEach((trip) => {
        const month = `${trip.tripDate.getFullYear()}-${String(trip.tripDate.getMonth() + 1).padStart(2, "0")}`;
        map.set(month, (map.get(month) ?? 0) + trip.fare);
    });
    const data = Array.from(map.entries()).map(([month, total]) => ({ month, total }));
    return res.json({ data });
}
export async function byTransport(req, res) {
    const user = req.user;
    const trips = await prisma.trip.findMany({ where: { userId: user.id } });
    const map = new Map();
    trips.forEach((t) => map.set(t.transportType, (map.get(t.transportType) ?? 0) + 1));
    const data = Array.from(map.entries()).map(([transportType, count]) => ({ transportType, count }));
    return res.json({ data });
}
export async function wfhSavings(req, res) {
    const { wfhDays = 8, dailyCost = 120 } = req.query;
    const monthly = Number(wfhDays) * Number(dailyCost);
    const annual = monthly * 12;
    return res.json({ monthly, annual, perDay: Number(dailyCost) });
}
