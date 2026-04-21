import { Router } from "express";
import { changePassword, deleteAccount, updateBudget, updateProfile } from "../controllers/usersController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { z } from "zod";
const router = Router();
router.use(authMiddleware);
router.put("/profile", validateBody(z.object({
    name: z.string().min(2).optional(),
    homeAddress: z.string().optional(),
    workAddress: z.string().optional(),
    phone: z.string().optional(),
    darkMode: z.boolean().optional(),
})), updateProfile);
router.put("/budget", validateBody(z.object({ monthlyBudget: z.number().nonnegative() })), updateBudget);
router.put("/change-password", validateBody(z.object({ currentPassword: z.string().min(8), newPassword: z.string().min(8) })), changePassword);
router.delete("/account", deleteAccount);
export default router;
