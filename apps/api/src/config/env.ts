import "dotenv/config";
import { z } from "zod";

// Blank ("") is how an unset-but-present .env var shows up, e.g.
// `CLOUDINARY_API_KEY=` — treat it the same as not set at all, rather than
// failing `.min(1)`, for the genuinely optional Cloudinary vars.
const optionalString = () =>
  z.preprocess((v) => (v === "" ? undefined : v), z.string().min(1).optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),
  CLOUDINARY_CLOUD_NAME: optionalString(),
  CLOUDINARY_API_KEY: optionalString(),
  CLOUDINARY_API_SECRET: optionalString(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
