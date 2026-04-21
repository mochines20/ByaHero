import { Router } from 'express';
import { chatWithAI } from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1),
  context: z.object({
    origin: z.string().optional(),
    destination: z.string().optional(),
    time: z.string().optional(),
  }).optional(),
});

router.post('/chat', authMiddleware, validateBody(chatSchema), chatWithAI);

export default router;
