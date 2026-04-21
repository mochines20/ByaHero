import jwt from "jsonwebtoken";
import { env } from "./env";
export function signAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });
}
export function signRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
