import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const cementFactories = pgTable("cement_factories", {
  id: text("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  bagPrice: numeric("bag_price", { precision: 10, scale: 2 }).notNull(),
  bulkPrice: numeric("bulk_price", { precision: 10, scale: 2 }).notNull(),
  marketShare: numeric("market_share", { precision: 5, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  production: integer("production").notNull(),
  region: text("region").notNull(),
  regionId: text("region_id").notNull().default("riyadh"),
  color: text("color").notNull(),
  listed: boolean("listed").notNull().default(true),
  stockPrice: numeric("stock_price", { precision: 10, scale: 2 }),
  stockChange: numeric("stock_change", { precision: 10, scale: 2 }),
  stockChangePct: numeric("stock_change_pct", { precision: 10, scale: 2 }).notNull().default("0"),
  stockSymbol: text("stock_symbol"),
  founded: integer("founded").notNull().default(2000),
  employees: integer("employees").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const priceHistory = pgTable("price_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  factoryId: text("factory_id")
    .notNull()
    .references(() => cementFactories.id, { onDelete: "cascade" }),
  bagPrice: numeric("bag_price", { precision: 10, scale: 2 }).notNull(),
  bulkPrice: numeric("bulk_price", { precision: 10, scale: 2 }).notNull(),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CementFactory = typeof cementFactories.$inferSelect;
export type NewCementFactory = typeof cementFactories.$inferInsert;
export type PriceHistory = typeof priceHistory.$inferSelect;
export type NewPriceHistory = typeof priceHistory.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
