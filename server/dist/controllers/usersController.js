import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
export async function updateProfile(req, res) {
    const user = req.user;
    const { name, homeAddress, workAddress, phone, darkMode, emergencyContacts } = req.body;
    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { name, homeAddress, workAddress, phone, darkMode, emergencyContacts },
    });
    return res.json({ user: updated });
}
export async function updateBudget(req, res) {
    const user = req.user;
    const { monthlyBudget } = req.body;
    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { monthlyBudget: Number(monthlyBudget) },
    });
    return res.json({ user: updated, alertAt: Number(monthlyBudget) * 0.8 });
}
export async function changePassword(req, res) {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;
    const found = await prisma.user.findUnique({ where: { id: user.id } });
    if (!found?.password)
        return res.status(400).json({ message: "Password login not enabled" });
    const ok = await bcrypt.compare(currentPassword, found.password);
    if (!ok)
        return res.status(400).json({ message: "Current password is incorrect" });
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    return res.json({ message: "Password changed" });
}
export async function deleteAccount(req, res) {
    const user = req.user;
    await prisma.user.delete({ where: { id: user.id } });
    return res.json({ message: "Account deleted" });
}
