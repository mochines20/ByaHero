import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const bearer = req.headers.authorization;
    const token = bearer?.startsWith("Bearer ") ? bearer.slice(7) : req.cookies.accessToken;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
