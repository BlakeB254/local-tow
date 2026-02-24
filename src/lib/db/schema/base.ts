import { pgTable, serial, text, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";

// ============================================================
// SITE CONTENT (key-value JSONB store for CMS content)
// ============================================================

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================
// SITE CONFIG (key-value JSONB store for site settings)
// ============================================================

export const siteConfig = pgTable("site_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================
// MEDIA (Vercel Blob references)
// ============================================================

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type"),
  size: integer("size"),
  alt: text("alt"),
  context: text("context"), // e.g., "vehicle_photo", "truck_photo", "license", "insurance"
  entityId: text("entity_id"), // links to provider/request/job
  entityType: text("entity_type"), // "provider", "tow_request", "job"
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
