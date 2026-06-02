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

export const regions = pgTable("regions", {
  id: text("id").primaryKey(),
  saCode: text("sa_code").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  centroidLat: numeric("centroid_lat", { precision: 9, scale: 6 }),
  centroidLng: numeric("centroid_lng", { precision: 9, scale: 6 }),
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
  productType: text("product_type").notNull().default("cement"),
  unit: text("unit").notNull().default("bag_ton"),
  effectiveFrom: timestamp("effective_from", { withTimezone: true }).notNull().defaultNow(),
  effectiveTo: timestamp("effective_to", { withTimezone: true }),
  source: text("source").notNull().default("admin"),
  confidence: numeric("confidence", { precision: 5, scale: 2 }).notNull().default("100.00"),
  status: text("status").notNull().default("published"),
  adminUserId: uuid("admin_user_id"),
  notes: text("notes"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const factoryMetricPeriods = pgTable("factory_metric_periods", {
  id: uuid("id").primaryKey().defaultRandom(),
  factoryId: text("factory_id")
    .notNull()
    .references(() => cementFactories.id, { onDelete: "cascade" }),
  regionId: text("region_id")
    .notNull()
    .references(() => regions.id),
  periodType: text("period_type").notNull().default("year"),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  capacity: integer("capacity").notNull().default(0),
  production: integer("production").notNull().default(0),
  utilization: numeric("utilization", { precision: 5, scale: 2 }).notNull().default("0.00"),
  localSales: integer("local_sales").notNull().default(0),
  exportSales: integer("export_sales").notNull().default(0),
  totalSales: integer("total_sales").notNull().default(0),
  clinkerProduced: integer("clinker_produced").notNull().default(0),
  clinkerBought: integer("clinker_bought").notNull().default(0),
  clinkerSold: integer("clinker_sold").notNull().default(0),
  clinkerExported: integer("clinker_exported").notNull().default(0),
  clinkerInventory: integer("clinker_inventory").notNull().default(0),
  marketShare: numeric("market_share", { precision: 5, scale: 2 }).notNull().default("0.00"),
  source: text("source").notNull().default("admin"),
  status: text("status").notNull().default("published"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const shippingCosts = pgTable("shipping_costs", {
  id: uuid("id").primaryKey().defaultRandom(),
  originRegionId: text("origin_region_id")
    .notNull()
    .references(() => regions.id),
  destinationRegionId: text("destination_region_id")
    .notNull()
    .references(() => regions.id),
  productType: text("product_type").notNull().default("bulk"),
  truckType: text("truck_type").notNull().default("tanker"),
  costPerTon: numeric("cost_per_ton", { precision: 10, scale: 2 }).notNull(),
  minimumCharge: numeric("minimum_charge", { precision: 10, scale: 2 }).notNull().default("0.00"),
  currency: text("currency").notNull().default("SAR"),
  deliveryDaysMin: integer("delivery_days_min").notNull().default(1),
  deliveryDaysMax: integer("delivery_days_max").notNull().default(3),
  effectiveFrom: timestamp("effective_from", { withTimezone: true }).notNull().defaultNow(),
  effectiveTo: timestamp("effective_to", { withTimezone: true }),
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
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

export const adminChangeLog = pgTable("admin_change_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminUserId: uuid("admin_user_id").references(() => adminUsers.id),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CementFactory = typeof cementFactories.$inferSelect;
export type NewCementFactory = typeof cementFactories.$inferInsert;
export type Region = typeof regions.$inferSelect;
export type NewRegion = typeof regions.$inferInsert;
export type PriceHistory = typeof priceHistory.$inferSelect;
export type NewPriceHistory = typeof priceHistory.$inferInsert;
export type FactoryMetricPeriod = typeof factoryMetricPeriods.$inferSelect;
export type NewFactoryMetricPeriod = typeof factoryMetricPeriods.$inferInsert;
export type ShippingCost = typeof shippingCosts.$inferSelect;
export type NewShippingCost = typeof shippingCosts.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type AdminChangeLog = typeof adminChangeLog.$inferSelect;
export type NewAdminChangeLog = typeof adminChangeLog.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
