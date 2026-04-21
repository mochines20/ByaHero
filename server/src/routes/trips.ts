import { Router } from "express";
import {
  createTrip,
  deleteTrip,
  exportTripsCsv,
  exportTripsPdf,
  getSummary,
  getTrips,
  updateTrip,
} from "../controllers/tripsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { z } from "zod";

const router = Router();

const tripSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  transportType: z.enum(["jeepney", "mrt", "lrt", "bus", "etrike", "walk", "grab"]),
  fare: z.number().nonnegative(),
  travelTime: z.number().int().positive(),
  tripDate: z.string(),
  notes: z.string().max(500).optional(),
});

router.use(authMiddleware);
router.get("/", getTrips);
router.post("/", validateBody(tripSchema), createTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);
router.get("/summary", getSummary);
router.get("/export/csv", exportTripsCsv);
router.get("/export/pdf", exportTripsPdf);

export default router;
