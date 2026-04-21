import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { cloudinary, uploadToCloudinary } from "../lib/cloudinary";

export async function uploadReceipt(req: Request, res: Response) {
  const user = (req as any).user;
  const tripId = String(req.body.tripId || "");
  const file = req.file;

  if (!file) return res.status(400).json({ message: "Missing file" });

  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: user.id } });
  if (!trip) return res.status(404).json({ message: "Trip not found" });

  const uploaded = await uploadToCloudinary(file.buffer);

  const receipt = await prisma.receipt.upsert({
    where: { tripId },
    update: {
      imageUrl: uploaded.secure_url,
      cloudinaryId: uploaded.public_id,
    },
    create: {
      tripId,
      imageUrl: uploaded.secure_url,
      cloudinaryId: uploaded.public_id,
    },
  });

  return res.status(201).json({ receipt });
}

export async function deleteReceipt(req: Request, res: Response) {
  const user = (req as any).user;
  const { id } = req.params;

  const receipt = await prisma.receipt.findUnique({ where: { id }, include: { trip: true } });
  if (!receipt || receipt.trip.userId !== user.id) return res.status(404).json({ message: "Receipt not found" });

  await cloudinary.uploader.destroy(receipt.cloudinaryId);
  await prisma.receipt.delete({ where: { id } });

  return res.json({ message: "Deleted" });
}
