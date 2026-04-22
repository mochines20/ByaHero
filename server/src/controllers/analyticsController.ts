import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function monthlyTrend(req: Request, res: Response) {
  const user = (req as any).user;
  const trips = await prisma.trip.findMany({ where: { userId: user.id } });
  const map = new Map<string, number>();

  trips.forEach((trip) => {
    const month = `${trip.tripDate.getFullYear()}-${String(trip.tripDate.getMonth() + 1).padStart(2, "0")}`;
    map.set(month, (map.get(month) ?? 0) + trip.fare);
  });

  const data = Array.from(map.entries()).map(([month, total]) => ({ month, total }));
  return res.json({ data });
}

export async function byTransport(req: Request, res: Response) {
  const user = (req as any).user;
  const trips = await prisma.trip.findMany({ where: { userId: user.id } });
  const map = new Map<string, number>();
  trips.forEach((t) => map.set(t.transportType, (map.get(t.transportType) ?? 0) + 1));
  const data = Array.from(map.entries()).map(([transportType, count]) => ({ transportType, count }));
  return res.json({ data });
}

export async function weekdaySpending(req: Request, res: Response) {
  const user = (req as any).user;
  const trips = await prisma.trip.findMany({ where: { userId: user.id } });
  
  const days = ["Linggo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado"];
  const spending = new Array(7).fill(0);
  
  trips.forEach((trip) => {
    const dayIndex = trip.tripDate.getDay();
    spending[dayIndex] += trip.fare;
  });

  const data = days.map((day, i) => ({
    day,
    total: spending[i],
  }));

  // Reorder to start with Lunes for Filipino context
  const reordered = [...data.slice(1), data[0]];

  return res.json({ data: reordered });
}

export async function wfhSavings(req: Request, res: Response) {
  const { wfhDays = 8, dailyCost = 120 } = req.query;
  const monthly = Number(wfhDays) * Number(dailyCost);
  const annual = monthly * 12;
  return res.json({ monthly, annual, perDay: Number(dailyCost) });
}
