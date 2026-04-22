import { Request, Response, Router } from "express";
import { gtfsService } from "../services/gtfsService";

const router = Router();

router.get("/stops", (req: Request, res: Response) => {
  const { q, lat, lon, radius } = req.query;

  if (q) {
    res.json(gtfsService.searchStops(String(q)));
    return;
  }

  if (lat && lon) {
    res.json(
      gtfsService.getNearbyStops(
        Number.parseFloat(String(lat)),
        Number.parseFloat(String(lon)),
        radius ? Number.parseFloat(String(radius)) : 0.5
      )
    );
    return;
  }

  res.json(gtfsService.getAllStops());
});

router.get("/routes", (_req: Request, res: Response) => {
  res.json(gtfsService.getAllRoutes());
});

router.get("/p2p-fare/:routeId", (req: Request, res: Response) => {
  const routeId = String(req.params.routeId ?? "");

  res.json({
    routeId,
    fare: gtfsService.getP2PFare(routeId),
    currency: "PHP",
  });
});

export default router;
