import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getTrips(req: Request, res: Response) {
  const user = (req as any).user;
  const { type, limit } = req.query;

  const trips = await prisma.trip.findMany({
    where: {
      userId: user.id,
      transportType: typeof type === "string" ? type : undefined,
    },
    include: { receipt: true },
    orderBy: { tripDate: "desc" },
    take: typeof limit === "string" ? Number(limit) : undefined,
  });

  return res.json({ trips });
}

export async function createTrip(req: Request, res: Response) {
  const user = (req as any).user;
  const trip = await prisma.trip.create({
    data: {
      ...req.body,
      tripDate: new Date(req.body.tripDate),
      userId: user.id,
    },
  });

  return res.status(201).json({ trip });
}

export async function updateTrip(req: Request, res: Response) {
  const user = (req as any).user;
  const { id } = req.params;
  const trip = await prisma.trip.updateMany({
    where: { id, userId: user.id },
    data: {
      ...req.body,
      tripDate: req.body.tripDate ? new Date(req.body.tripDate) : undefined,
    },
  });
  return res.json({ updated: trip.count });
}

export async function deleteTrip(req: Request, res: Response) {
  const user = (req as any).user;
  const { id } = req.params;
  await prisma.trip.deleteMany({ where: { id, userId: user.id } });
  return res.json({ message: "Deleted" });
}

export async function getSummary(req: Request, res: Response) {
  const user = (req as any).user;
  const trips = await prisma.trip.findMany({ where: { userId: user.id } });

  const now = new Date();
  const today = trips.filter((t) => t.tripDate.toDateString() === now.toDateString());
  const weekly = trips.filter((t) => now.getTime() - t.tripDate.getTime() <= 7 * 24 * 60 * 60 * 1000);
  const monthly = trips.filter((t) => t.tripDate.getMonth() === now.getMonth() && t.tripDate.getFullYear() === now.getFullYear());

  return res.json({
    today: {
      totalSpent: today.reduce((a, t) => a + t.fare, 0),
      totalTrips: today.length,
      totalTravelTime: today.reduce((a, t) => a + t.travelTime, 0),
    },
    weekly: weekly.reduce((a, t) => a + t.fare, 0),
    monthly: monthly.reduce((a, t) => a + t.fare, 0),
  });
}

export async function exportTripsCsv(req: Request, res: Response) {
  const user = (req as any).user;
  const trips = await prisma.trip.findMany({ where: { userId: user.id }, orderBy: { tripDate: "desc" } });
  const header = "origin,destination,transportType,fare,travelTime,tripDate\n";
  const lines = trips
    .map((t) => `${t.origin},${t.destination},${t.transportType},${t.fare},${t.travelTime},${t.tripDate.toISOString()}`)
    .join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=byahero-trips.csv");
  return res.send(`${header}${lines}`);
}

export async function exportTripsPdf(_req: Request, res: Response) {
  res.setHeader("Content-Type", "application/pdf");
  return res.send(Buffer.from("PDF generation endpoint ready. Use Puppeteer integration for full report."));
}
