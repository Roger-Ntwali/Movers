import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { leadsRouter } from "./routes/leads.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { servicesRouter } from "./routes/services.routes.js";
import { galleryRouter } from "./routes/gallery.routes.js";
import { testimonialsRouter } from "./routes/testimonials.routes.js";
import { serviceAreasRouter } from "./routes/serviceAreas.routes.js";
import { blogRouter } from "./routes/blog.routes.js";
import { settingsRouter } from "./routes/settings.routes.js";
import { uploadsRouter } from "./routes/uploads.routes.js";

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/leads", leadsRouter);
app.use("/api/auth", authRouter);
app.use("/api/services", servicesRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/service-areas", serviceAreasRouter);
app.use("/api/blog", blogRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/uploads", uploadsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
