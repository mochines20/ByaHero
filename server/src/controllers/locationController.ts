import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const startShareSchema = z.object({
  recipientName: z.string().min(1),
  recipientPhone: z.string().optional(),
});

const updateLocationSchema = z.object({
  shareId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const startLocationShare = async (req: Request, res: Response) => {
  try {
    const { recipientName, recipientPhone } = startShareSchema.parse(req.body);
    const userId = (req as any).userId;

    const share = await prisma.locationShare.create({
      data: {
        userId,
        recipientName,
        recipientPhone: recipientPhone || '',
        isActive: true,
        startedAt: new Date(),
      }
    });

    res.json({ success: true, shareId: share.id, message: 'Location sharing started' });
  } catch (error) {
    console.error('Start share error:', error);
    res.status(500).json({ error: 'Failed to start location sharing' });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { shareId, latitude, longitude } = updateLocationSchema.parse(req.body);
    const userId = (req as any).userId;

    const share = await prisma.locationShare.findUnique({
      where: { id: shareId }
    });

    if (!share || share.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.locationShare.update({
      where: { id: shareId },
      data: {
        lastLatitude: latitude,
        lastLongitude: longitude,
        updatedAt: new Date(),
      }
    });

    res.json({ success: true, message: 'Location updated' });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

export const stopLocationShare = async (req: Request, res: Response) => {
  try {
    const { shareId } = z.object({ shareId: z.string() }).parse(req.body);
    const userId = (req as any).userId;

    const share = await prisma.locationShare.findUnique({
      where: { id: shareId }
    });

    if (!share || share.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.locationShare.update({
      where: { id: shareId },
      data: { isActive: false, stoppedAt: new Date() }
    });

    res.json({ success: true, message: 'Location sharing stopped' });
  } catch (error) {
    console.error('Stop share error:', error);
    res.status(500).json({ error: 'Failed to stop location sharing' });
  }
};

export const getActiveShares = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const shares = await prisma.locationShare.findMany({
      where: { userId, isActive: true },
      orderBy: { startedAt: 'desc' }
    });

    res.json({ shares });
  } catch (error) {
    console.error('Get shares error:', error);
    res.status(500).json({ error: 'Failed to get shares' });
  }
};
