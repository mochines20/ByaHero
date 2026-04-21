import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { sendEmail } from "../lib/email";
import { env } from "../lib/env";

const authUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} as const;

function sha(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function setAuthCookies(res: Response, accessToken: string, refreshToken: string, rememberMe: boolean) {
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const secure = env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge,
  });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return res.status(409).json({ message: "Email already in use" });

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      accounts: {
        create: { provider: "email", providerAccountId: email },
      },
    },
  });

  const verifyToken = crypto.randomBytes(32).toString("hex");
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash: sha(verifyToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  const verifyUrl = `${env.CLIENT_URL}/verify-email/${verifyToken}`;
  await sendEmail(email, "Verify your ByaHero email", `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`);

  return res.status(201).json({ message: "Registered. Please verify your email." });
}

export async function login(req: Request, res: Response) {
  const { email, password, rememberMe } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { ...authUserSelect, password: true },
  });
  if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: sha(refreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  setAuthCookies(res, accessToken, refreshToken, Boolean(rememberMe));

  return res.json({
    user: { id: user.id, name: user.name, email: user.email, image: user.image },
    accessToken,
  });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = verifyRefreshToken(token);
    const existing = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        tokenHash: sha(token),
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!existing) return res.status(401).json({ message: "Invalid refresh token" });

    await prisma.refreshToken.update({ where: { id: existing.id }, data: { revoked: true } });

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: authUserSelect,
  });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const newAccess = signAccessToken({ sub: user.id, email: user.email });
    const newRefresh = signRefreshToken({ sub: user.id, email: user.email });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: sha(newRefresh),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, newAccess, newRefresh, true);
    return res.json({ accessToken: newAccess });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  if (token) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: sha(token) },
      data: { revoked: true },
    });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
}

export async function me(req: Request, res: Response) {
  const user = (req as any).user;
  return res.json({ user: { id: user.id, name: user.name, email: user.email, image: user.image } });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { ...authUserSelect },
  });

  if (!user) return res.json({ message: "If email exists, reset link was sent." });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: sha(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const url = `${env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail(user.email, "Reset your ByaHero password", `<p>Reset link: <a href="${url}">${url}</a></p>`);

  return res.json({ message: "If email exists, reset link was sent." });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, password } = req.body;
  const tokenHash = sha(token);
  const reset = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!reset) return res.status(400).json({ message: "Invalid or expired token" });

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: reset.userId }, data: { password: hashed } });
  await prisma.passwordResetToken.update({ where: { id: reset.id }, data: { used: true } });

  return res.json({ message: "Password reset successful" });
}

export async function oauthCallback(req: Request, res: Response) {
  const user = req.user as any;
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: sha(refreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  setAuthCookies(res, accessToken, refreshToken, true);
  return res.redirect(`${env.CLIENT_URL}/dashboard`);
}
