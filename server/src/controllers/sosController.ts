import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendEmail } from '../lib/email';

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
      select: { email: true, emergencyContacts: true, name: true, phone: true }
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

    // REAL-WORLD NOTIFICATION: Send emails to emergency contacts
    if (user.emergencyContacts.length > 0) {
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const subject = `BYAHERO SOS: Emergency Alert from ${user.name}`;
      const body = `
        <div style="font-family: sans-serif; color: #333;">
          <h1 style="color: #e11d48;">EMERGENCY ALERT</h1>
          <p>Your contact <strong>${user.name}</strong> has triggered an SOS alert via ByaHero.</p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p><strong>Location:</strong> <a href="${googleMapsUrl}" style="color: #1d4ed8; font-weight: bold;">View on Google Maps</a></p>
            <p><strong>Coordinates:</strong> ${latitude}, ${longitude}</p>
            <p><strong>Vehicle:</strong> ${transportType || 'Not specified'} ${transportPlate ? `(Plate: ${transportPlate})` : ""}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>Please check on them immediately.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b;">This is an automated emergency message from <a href="https://byahero.ph">ByaHero</a>.</p>
        </div>
      `;

      for (const contactEmail of user.emergencyContacts) {
        try {
          await sendEmail(contactEmail, subject, body);
        } catch (err) {
          console.error(`Failed to send SOS email to ${contactEmail}:`, err);
        }
      }
    }

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
