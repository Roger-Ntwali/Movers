import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { loginSchema } from "@movers-rwanda/shared";
import { db } from "../db/client.js";
import { adminUsers } from "../db/schema.js";
import { AUTH_COOKIE_NAME, requireAuth, signAuthToken } from "../middleware/auth.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../middleware/errorHandler.js";
import { isProduction } from "../config/env.js";

export const authRouter = Router();

// Frontend (Vercel) and API (Render) live on different domains in
// production, so the auth cookie must be sent cross-site: SameSite=None
// (which browsers require to be paired with Secure, hence isProduction
// gating both together). Locally both run on http://localhost, where a
// Secure cookie can't be set at all, so dev falls back to Lax.
const cookieOptions: {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "none" | "lax";
  maxAge: number;
  path: string;
} = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 12 * 60 * 60 * 1000,
  path: "/",
};

authRouter.post("/login", loginRateLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await db.query.adminUsers.findFirst({ where: eq(adminUsers.email, email) });
    if (!admin) throw new HttpError(401, "Invalid email or password");

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new HttpError(401, "Invalid email or password");

    const token = signAuthToken({ sub: admin.id, email: admin.email });
    res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
    res.json({ id: admin.id, email: admin.email, name: admin.name });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const admin = await db.query.adminUsers.findFirst({ where: eq(adminUsers.id, req.admin!.sub) });
    if (!admin) throw new HttpError(401, "Not authenticated");
    res.json({ id: admin.id, email: admin.email, name: admin.name });
  } catch (err) {
    next(err);
  }
});
