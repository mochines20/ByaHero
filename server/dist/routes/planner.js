import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { z } from "zod";
import { getRouteOptions } from "../controllers/plannerController";
const router = Router();
const plannerSchema = z.object({
    origin: z.string().min(2),
    destination: z.string().min(2),
    originPlaceId: z.string().min(5).optional(),
    destinationPlaceId: z.string().min(5).optional(),
    departureTime: z.string().datetime().optional(),
});
router.post("/options", authMiddleware, validateBody(plannerSchema), getRouteOptions);
export default router;
