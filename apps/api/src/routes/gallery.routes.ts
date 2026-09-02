import { Router } from "express";
import { eq } from "drizzle-orm";
import { galleryImageSchema } from "@movers-rwanda/shared";
import { db } from "../db/client.js";
import { galleryImages } from "../db/schema.js";
import { attachAuthIfPresent, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../middleware/errorHandler.js";

export const galleryRouter = Router();

galleryRouter.get("/", attachAuthIfPresent, async (req, res, next) => {
  try {
    const publicOnly = !(req.query.all && req.admin);
    const rows = await db.query.galleryImages.findMany({
      where: publicOnly ? eq(galleryImages.isActive, true) : undefined,
      orderBy: (t, { asc }) => asc(t.displayOrder),
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

galleryRouter.post("/", requireAuth, validateBody(galleryImageSchema), async (req, res, next) => {
  try {
    const [created] = await db.insert(galleryImages).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

galleryRouter.patch("/:id", requireAuth, validateBody(galleryImageSchema.partial()), async (req, res, next) => {
  try {
    const [updated] = await db
      .update(galleryImages)
      .set(req.body)
      .where(eq(galleryImages.id, req.params.id))
      .returning();
    if (!updated) throw new HttpError(404, "Gallery image not found");
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

galleryRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const [deleted] = await db
      .delete(galleryImages)
      .where(eq(galleryImages.id, req.params.id))
      .returning();
    if (!deleted) throw new HttpError(404, "Gallery image not found");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
