import { Router } from "express";
import { eq } from "drizzle-orm";
import { serviceSchema } from "@movers-rwanda/shared";
import { db } from "../db/client.js";
import { services } from "../db/schema.js";
import { attachAuthIfPresent, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../middleware/errorHandler.js";

export const servicesRouter = Router();

servicesRouter.get("/", attachAuthIfPresent, async (req, res, next) => {
  try {
    const publicOnly = !(req.query.all && req.admin);
    const rows = await db.query.services.findMany({
      where: publicOnly ? eq(services.isActive, true) : undefined,
      orderBy: (t, { asc }) => asc(t.displayOrder),
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

servicesRouter.post("/", requireAuth, validateBody(serviceSchema), async (req, res, next) => {
  try {
    const [created] = await db.insert(services).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

servicesRouter.patch("/:id", requireAuth, validateBody(serviceSchema.partial()), async (req, res, next) => {
  try {
    const [updated] = await db
      .update(services)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(services.id, req.params.id))
      .returning();
    if (!updated) throw new HttpError(404, "Service not found");
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

servicesRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const [deleted] = await db.delete(services).where(eq(services.id, req.params.id)).returning();
    if (!deleted) throw new HttpError(404, "Service not found");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
