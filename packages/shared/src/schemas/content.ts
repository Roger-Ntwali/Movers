import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  tag: z.string().trim().max(40).optional(),
  lead: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  includes: z.array(z.string().trim().max(60)).max(12).default([]),
  imageUrls: z.array(z.string().url()).max(8).default([]),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const galleryImageSchema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().trim().max(160).optional(),
  altText: z.string().trim().max(160).optional(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;

export const testimonialSchema = z.object({
  authorName: z.string().trim().min(2).max(120),
  authorRoleOrLocation: z.string().trim().max(160).optional(),
  quote: z.string().trim().min(10).max(1200),
  rating: z.number().int().min(1).max(5).optional(),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const serviceAreaSchema = z.object({
  districtName: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});
export type ServiceAreaInput = z.infer<typeof serviceAreaSchema>;

export const BLOG_STATUSES = ["draft", "published"] as const;

export const blogPostSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  excerpt: z.string().trim().max(400).optional(),
  body: z.string().trim().min(1),
  coverImageUrl: z.string().url().optional().nullable(),
  category: z.string().trim().max(60).optional(),
  status: z.enum(BLOG_STATUSES).default("draft"),
});
export type BlogPostInput = z.infer<typeof blogPostSchema>;

export const siteSettingSchema = z.object({
  key: z.string().trim().min(1).max(80),
  value: z.string().trim().max(2000),
});
export type SiteSettingInput = z.infer<typeof siteSettingSchema>;
