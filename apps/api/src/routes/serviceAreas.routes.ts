import { Router } from "express";
import { eq } from "drizzle-orm";
import { serviceAreaSchema } from "@movers-rwanda/shared";
import { db } from "../db/client.js";
import { serviceAreas } from "../db/schema.js";
import { attachAuthIfPresent, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../middleware/errorHandler.js";

export const serviceAreasRouter = Router();

serviceAreasRouter.get("/", attachAuthIfPresent, async (req, res, next) => {
  try {
    const publicOnly = !(req.query.all && req.admin);
    const rows = await db.query.serviceAreas.findMany({
      where: publicOnly ? eq(serviceAreas.isActive, true) : undefined,
      orderBy: (t, { asc }) => asc(t.displayOrder),
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

serviceAreasRouter.post("/", requireAuth, validateBody(serviceAreaSchema), async (req, res, next) => {
  try {
    const [created] = await db.insert(serviceAreas).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

serviceAreasRouter.patch(
  "/:id",
  requireAuth,
  validateBody(serviceAreaSchema.partial()),
  async (req, res, next) => {
    try {
      const [updated] = await db
        .update(serviceAreas)
        .set(req.body)
        .where(eq(serviceAreas.id, req.params.id))
        .returning();
      if (!updated) throw new HttpError(404, "Service area not found");
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
);

serviceAreasRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const [deleted] = await db
      .delete(serviceAreas)
      .where(eq(serviceAreas.id, req.params.id))
      .returning();
    if (!deleted) throw new HttpError(404, "Service area not found");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
