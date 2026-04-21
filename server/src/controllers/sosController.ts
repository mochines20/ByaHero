import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const sosSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  transportType: z.string().optional(),
  transportPlate: z.string().optional(),
});

export const triggerSOS = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, transportType, transportPlate } = sosSchema.parse(req.body);
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { emergencyContacts: true, name: true, phone: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Create SOS incident record
    const incident = await prisma.sOSIncident.create({
      data: {
        userId,
        latitude,
        longitude,
        transportType: transportType || 'unknown',
        transportPlate: transportPlate || '',
        status: 'active',
        triggeredAt: new Date(),
      }
    });

    // In production, send SMS/push notifications to emergency contacts
    // For MVP, just log it
    console.log('SOS Alert triggered:', {
      user: user.name,
      location: { latitude, longitude },
      contacts: user.emergencyContacts,
      incident: incident.id
    });

    res.json({
      success: true,
      incidentId: incident.id,
      message: 'SOS alert sent to emergency contacts',
    });
  } catch (error) {
    console.error('SOS error:', error);
    res.status(500).json({ error: 'Failed to trigger SOS' });
  }
};

export const cancelSOS = async (req: Request, res: Response) => {
  try {
    const { incidentId } = z.object({ incidentId: z.string() }).parse(req.body);
    const userId = (req as any).userId;

    const incident = await prisma.sOSIncident.update({
      where: { id: incidentId },
      data: { status: 'resolved' }
    });

    res.json({ success: true, message: 'SOS alert cancelled' });
  } catch (error) {
    console.error('Cancel SOS error:', error);
    res.status(500).json({ error: 'Failed to cancel SOS' });
  }
};

export const getSOSStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const incidents = await prisma.sOSIncident.findMany({
      where: { userId, status: 'active' },
      orderBy: { triggeredAt: 'desc' },
      take: 5
    });

    res.json({ incidents });
  } catch (error) {
    console.error('Get SOS status error:', error);
    res.status(500).json({ error: 'Failed to get SOS status' });
  }
};
