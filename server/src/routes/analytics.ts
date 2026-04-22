import { Router } from "express";
import { byTransport, monthlyTrend, weekdaySpending, wfhSavings } from "../controllers/analyticsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);
router.get("/monthly-trend", monthlyTrend);
router.get("/by-transport", byTransport);
router.get("/weekday-spending", weekdaySpending);
router.get("/wfh-savings", wfhSavings);

export default router;
