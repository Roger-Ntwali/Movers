import { Router } from "express";
import { eq } from "drizzle-orm";
import { blogPostSchema } from "@movers-rwanda/shared";
import { db } from "../db/client.js";
import { blogPosts } from "../db/schema.js";
import { attachAuthIfPresent, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../middleware/errorHandler.js";

export const blogRouter = Router();

blogRouter.get("/", attachAuthIfPresent, async (req, res, next) => {
  try {
    const publicOnly = !(req.query.all && req.admin);
    const rows = await db.query.blogPosts.findMany({
      where: publicOnly ? eq(blogPosts.status, "published") : undefined,
      orderBy: (t, { desc }) => desc(t.publishedAt),
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

blogRouter.get("/:slug", attachAuthIfPresent, async (req, res, next) => {
  try {
    const row = await db.query.blogPosts.findFirst({ where: eq(blogPosts.slug, req.params.slug) });
    if (!row || (row.status !== "published" && !req.admin)) {
      throw new HttpError(404, "Post not found");
    }
    res.json(row);
  } catch (err) {
    next(err);
  }
});

blogRouter.post("/", requireAuth, validateBody(blogPostSchema), async (req, res, next) => {
  try {
    const publishedAt = req.body.status === "published" ? new Date() : null;
    const [created] = await db
      .insert(blogPosts)
      .values({ ...req.body, authorId: req.admin!.sub, publishedAt })
      .returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

blogRouter.patch("/:id", requireAuth, validateBody(blogPostSchema.partial()), async (req, res, next) => {
  try {
    const existing = await db.query.blogPosts.findFirst({ where: eq(blogPosts.id, req.params.id) });
    if (!existing) throw new HttpError(404, "Post not found");

    const publishedAt =
      req.body.status === "published" && !existing.publishedAt ? new Date() : existing.publishedAt;

    const [updated] = await db
      .update(blogPosts)
      .set({ ...req.body, publishedAt, updatedAt: new Date() })
      .where(eq(blogPosts.id, req.params.id))
      .returning();
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

blogRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, req.params.id)).returning();
    if (!deleted) throw new HttpError(404, "Post not found");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
