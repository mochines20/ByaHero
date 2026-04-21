import { Router } from 'express';
import { startLocationShare, updateLocation, stopLocationShare, getActiveShares } from '../controllers/locationController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validate';
import { z } from 'zod';
const router = Router();
const startShareSchema = z.object({
    recipientName: z.string().min(1),
    recipientPhone: z.string().optional(),
});
const updateLocationSchema = z.object({
    shareId: z.string(),
    latitude: z.number(),
    longitude: z.number(),
});
const stopShareSchema = z.object({
    shareId: z.string(),
});
router.post('/start', authMiddleware, validateBody(startShareSchema), startLocationShare);
router.post('/update', authMiddleware, validateBody(updateLocationSchema), updateLocation);
router.post('/stop', authMiddleware, validateBody(stopShareSchema), stopLocationShare);
router.get('/active', authMiddleware, getActiveShares);
export default router;
