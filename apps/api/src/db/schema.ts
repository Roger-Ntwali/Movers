import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
]);

export const blogStatusEnum = pgEnum("blog_status", ["draft", "published"]);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  pickup: varchar("pickup", { length: 200 }).notNull(),
  dropoff: varchar("dropoff", { length: 200 }).notNull(),
  moveType: varchar("move_type", { length: 60 }).notNull(),
  moveDate: varchar("move_date", { length: 20 }).notNull(),
  rooms: varchar("rooms", { length: 60 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }),
  status: leadStatusEnum("status").notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  tag: varchar("tag", { length: 40 }),
  lead: varchar("lead", { length: 200 }),
  description: text("description"),
  includes: text("includes").array().notNull().default([]),
  imageUrls: text("image_urls").array().notNull().default([]),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageUrl: text("image_url").notNull(),
  caption: varchar("caption", { length: 160 }),
  altText: varchar("alt_text", { length: 160 }),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorName: varchar("author_name", { length: 120 }).notNull(),
  authorRoleOrLocation: varchar("author_role_or_location", { length: 160 }),
  quote: text("quote").notNull(),
  rating: integer("rating"),
  isFeatured: boolean("is_featured").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const serviceAreas = pgTable("service_areas", {
  id: uuid("id").primaryKey().defaultRandom(),
  districtName: varchar("district_name", { length: 120 }).notNull(),
  description: varchar("description", { length: 500 }),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 400 }),
  body: text("body").notNull(),
  coverImageUrl: text("cover_image_url"),
  category: varchar("category", { length: 60 }),
  status: blogStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  authorId: uuid("author_id").references(() => adminUsers.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: text("value").notNull(),
});
