import { Router } from "express";
import passport from "../lib/passport";
import { forgotPassword, login, logout, me, oauthCallback, refresh, register, resetPassword, } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authRateLimiter } from "../middleware/rateLimiter";
import { validateBody } from "../middleware/validate";
import { z } from "zod";
const router = Router();
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
}).refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords must match" });
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    rememberMe: z.boolean().optional(),
});
router.post("/register", authRateLimiter, validateBody(registerSchema), register);
router.post("/login", authRateLimiter, validateBody(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", authRateLimiter, validateBody(z.object({ email: z.string().email() })), forgotPassword);
router.post("/reset-password", authRateLimiter, validateBody(z.object({ token: z.string().min(1), password: z.string().min(8) })), resetPassword);
router.get("/me", authMiddleware, me);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }), oauthCallback);
router.get("/apple", passport.authenticate("apple", { scope: ["name", "email"] }));
router.post("/apple/callback", passport.authenticate("apple", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }), oauthCallback);
export default router;
