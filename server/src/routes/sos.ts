import { Router } from 'express';
import { triggerSOS, cancelSOS, getSOSStatus } from '../controllers/sosController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const sosSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  transportType: z.string().optional(),
  transportPlate: z.string().optional(),
});

const cancelSchema = z.object({
  incidentId: z.string(),
});

router.post('/trigger', authMiddleware, validateBody(sosSchema), triggerSOS);
router.post('/cancel', authMiddleware, validateBody(cancelSchema), cancelSOS);
router.get('/status', authMiddleware, getSOSStatus);

export default router;
