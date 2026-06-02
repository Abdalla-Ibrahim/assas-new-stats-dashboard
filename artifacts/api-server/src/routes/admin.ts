import { createRequire } from "node:module";
import { Router, type IRouter } from "express";
import { asc, eq, sql } from "drizzle-orm";
import { db, schema } from "../db";
import { mapFactory } from "../lib/factoryMapper";
import { publishDataChange } from "../lib/dataEvents";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth";
import { mapShippingCost } from "./shipping";
import type { NewCementFactory, NewShippingCost } from "@workspace/db/schema";

const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs") as typeof import("bcryptjs");
const jwt = require("jsonwebtoken") as typeof import("jsonwebtoken");

const router: IRouter = Router();

type Body = Record<string, unknown>;

const get = (body: Body, camelKey: string, snakeKey = camelKey) => body[camelKey] ?? body[snakeKey];
const asText = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);
const asBool = (value: unknown) => (typeof value === "boolean" ? value : undefined);
const asInt = (value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};
const asDecimal = (value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : undefined;
};
const asDate = (value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return undefined;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : undefined;
};

function jwtSecret() {
  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    throw new Error("JWT_SECRET must be set before admin login can be used.");
  }
  return secret;
}

function buildFactoryUpdate(body: Body): Partial<NewCementFactory> {
  const updates: Partial<NewCementFactory> = {};

  const textFields = [
    ["nameAr", "name_ar"],
    ["nameEn", "name_en"],
    ["region", "region"],
    ["regionId", "region_id"],
    ["color", "color"],
    ["stockSymbol", "stock_symbol"],
  ] as const;

  for (const [camel, snake] of textFields) {
    const value = asText(get(body, camel, snake));
    if (value !== undefined) updates[camel] = value;
  }

  const decimalFields = [
    ["bagPrice", "bag_price"],
    ["bulkPrice", "bulk_price"],
    ["marketShare", "market_share"],
    ["stockPrice", "stock_price"],
    ["stockChange", "stock_change"],
    ["stockChangePct", "stock_change_pct"],
  ] as const;

  for (const [camel, snake] of decimalFields) {
    const value = asDecimal(get(body, camel, snake));
    if (value !== undefined) updates[camel] = value;
  }

  const intFields = [
    ["capacity", "capacity"],
    ["production", "production"],
    ["founded", "founded"],
    ["employees", "employees"],
  ] as const;

  for (const [camel, snake] of intFields) {
    const value = asInt(get(body, camel, snake));
    if (value !== undefined) updates[camel] = value;
  }

  const listed = asBool(get(body, "listed"));
  if (listed !== undefined) updates.listed = listed;

  const isActive = asBool(get(body, "isActive", "is_active"));
  if (isActive !== undefined) updates.isActive = isActive;

  if (Object.keys(updates).length > 0) {
    updates.updatedAt = new Date();
  }

  return updates;
}

function assertNonNegativeFactoryValues(values: Partial<NewCementFactory>) {
  const nonNegativeFields = [
    "bagPrice",
    "bulkPrice",
    "marketShare",
    "capacity",
    "production",
    "stockPrice",
    "stockChangePct",
    "founded",
    "employees",
  ] as const;

  for (const field of nonNegativeFields) {
    const value = values[field];
    if (value !== undefined && value !== null && Number(value) < 0) {
      throw new Error(`${field} cannot be negative.`);
    }
  }
}

function buildShippingUpdate(body: Body): Partial<NewShippingCost> {
  const updates: Partial<NewShippingCost> = {};

  const textFields = [
    ["originRegionId", "origin_region_id"],
    ["destinationRegionId", "destination_region_id"],
    ["productType", "product_type"],
    ["truckType", "truck_type"],
    ["currency", "currency"],
    ["notes", "notes"],
  ] as const;

  for (const [camel, snake] of textFields) {
    const value = asText(get(body, camel, snake));
    if (value !== undefined) updates[camel] = value;
  }

  const costPerTon = asDecimal(get(body, "costPerTon", "cost_per_ton"));
  if (costPerTon !== undefined) updates.costPerTon = costPerTon;

  const minimumCharge = asDecimal(get(body, "minimumCharge", "minimum_charge"));
  if (minimumCharge !== undefined) updates.minimumCharge = minimumCharge;

  const deliveryDaysMin = asInt(get(body, "deliveryDaysMin", "delivery_days_min"));
  if (deliveryDaysMin !== undefined) updates.deliveryDaysMin = deliveryDaysMin;

  const deliveryDaysMax = asInt(get(body, "deliveryDaysMax", "delivery_days_max"));
  if (deliveryDaysMax !== undefined) updates.deliveryDaysMax = deliveryDaysMax;

  const effectiveFrom = asDate(get(body, "effectiveFrom", "effective_from"));
  if (effectiveFrom !== undefined) updates.effectiveFrom = effectiveFrom;

  const effectiveTo = asDate(get(body, "effectiveTo", "effective_to"));
  if (effectiveTo !== undefined) updates.effectiveTo = effectiveTo;

  const isActive = asBool(get(body, "isActive", "is_active"));
  if (isActive !== undefined) updates.isActive = isActive;

  if (Object.keys(updates).length > 0) {
    updates.updatedAt = new Date();
  }

  return updates;
}

function assertShippingValues(values: Partial<NewShippingCost>) {
  if (values.costPerTon !== undefined && Number(values.costPerTon) < 0) {
    throw new Error("costPerTon cannot be negative.");
  }
  if (values.minimumCharge !== undefined && Number(values.minimumCharge) < 0) {
    throw new Error("minimumCharge cannot be negative.");
  }
  if (values.deliveryDaysMin !== undefined && values.deliveryDaysMin < 0) {
    throw new Error("deliveryDaysMin cannot be negative.");
  }
  if (values.deliveryDaysMax !== undefined && values.deliveryDaysMax < 0) {
    throw new Error("deliveryDaysMax cannot be negative.");
  }
  if (
    values.deliveryDaysMin !== undefined &&
    values.deliveryDaysMax !== undefined &&
    values.deliveryDaysMax < values.deliveryDaysMin
  ) {
    throw new Error("deliveryDaysMax must be greater than or equal to deliveryDaysMin.");
  }
  if (values.effectiveFrom && values.effectiveTo && values.effectiveTo < values.effectiveFrom) {
    throw new Error("effectiveTo must be after effectiveFrom.");
  }
}

async function logAdminChange(req: AuthenticatedRequest, entityType: string, entityId: string, action: string, before: unknown, after: unknown) {
  await db.insert(schema.adminChangeLog).values({
    adminUserId: req.admin?.id ?? null,
    entityType,
    entityId,
    action,
    before,
    after,
  });
}

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const [admin] = await db
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, email))
      .limit(1);

    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, name: admin.name },
      jwtSecret(),
      { expiresIn: "8h" },
    );

    return res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.use(requireAuth);

router.get("/factories", async (_req, res, next) => {
  try {
    const factories = await db.select().from(schema.cementFactories).orderBy(schema.cementFactories.nameAr);
    res.json({ factories: factories.map(mapFactory) });
  } catch (err) {
    next(err);
  }
});

router.get("/regions", async (_req, res, next) => {
  try {
    const regions = await db.select().from(schema.regions).orderBy(asc(schema.regions.displayOrder));
    res.json({ regions });
  } catch (err) {
    next(err);
  }
});

router.put("/factories/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const factoryId = String(req.params.id);
    const [existing] = await db
      .select()
      .from(schema.cementFactories)
      .where(eq(schema.cementFactories.id, factoryId))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: "Factory not found." });
    }

    const updates = buildFactoryUpdate(req.body as Body);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid factory fields provided." });
    }
    assertNonNegativeFactoryValues(updates);

    const priceChanged =
      (updates.bagPrice !== undefined && Number(updates.bagPrice) !== Number(existing.bagPrice)) ||
      (updates.bulkPrice !== undefined && Number(updates.bulkPrice) !== Number(existing.bulkPrice));

    const [updated] = await db
      .update(schema.cementFactories)
      .set(updates)
      .where(eq(schema.cementFactories.id, factoryId))
      .returning();

    if (priceChanged) {
      await db.insert(schema.priceHistory).values({
        factoryId: updated.id,
        bagPrice: String(updated.bagPrice),
        bulkPrice: String(updated.bulkPrice),
        productType: "cement",
        unit: "bag_ton",
        source: "admin",
        status: "published",
        adminUserId: req.admin?.id ?? null,
        recordedAt: new Date(),
      });
    }

    await logAdminChange(req, "factory", updated.id, "update", mapFactory(existing), mapFactory(updated));
    publishDataChange("factory", updated.id);

    return res.json({ factory: mapFactory(updated) });
  } catch (err) {
    if (err instanceof Error && err.message.includes("cannot be negative")) {
      return res.status(400).json({ error: err.message });
    }
    return next(err);
  }
});

router.post("/factories", async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = req.body as Body;
    const id = asText(get(body, "id"));
    const nameAr = asText(get(body, "nameAr", "name_ar"));
    const bagPrice = asDecimal(get(body, "bagPrice", "bag_price"));
    const bulkPrice = asDecimal(get(body, "bulkPrice", "bulk_price"));

    if (!id || !nameAr || !bagPrice || !bulkPrice) {
      return res.status(400).json({ error: "id, name_ar, bag_price, and bulk_price are required." });
    }

    const row: NewCementFactory = {
      id,
      nameAr,
      nameEn: asText(get(body, "nameEn", "name_en")) ?? nameAr,
      bagPrice,
      bulkPrice,
      marketShare: asDecimal(get(body, "marketShare", "market_share")) ?? "0.00",
      capacity: asInt(get(body, "capacity")) ?? 0,
      production: asInt(get(body, "production")) ?? 0,
      region: asText(get(body, "region")) ?? "غير محدد",
      regionId: asText(get(body, "regionId", "region_id")) ?? "riyadh",
      color: asText(get(body, "color")) ?? "#f5b800",
      listed: asBool(get(body, "listed")) ?? false,
      stockPrice: asDecimal(get(body, "stockPrice", "stock_price")) ?? null,
      stockChange: asDecimal(get(body, "stockChange", "stock_change")) ?? null,
      stockChangePct: asDecimal(get(body, "stockChangePct", "stock_change_pct")) ?? "0.00",
      stockSymbol: asText(get(body, "stockSymbol", "stock_symbol")) ?? null,
      founded: asInt(get(body, "founded")) ?? 2000,
      employees: asInt(get(body, "employees")) ?? 0,
      isActive: asBool(get(body, "isActive", "is_active")) ?? true,
      updatedAt: new Date(),
    };
    assertNonNegativeFactoryValues(row);

    const [created] = await db.insert(schema.cementFactories).values(row).returning();
    await db.insert(schema.priceHistory).values({
      factoryId: created.id,
      bagPrice: String(created.bagPrice),
      bulkPrice: String(created.bulkPrice),
      productType: "cement",
      unit: "bag_ton",
      source: "admin",
      status: "published",
      adminUserId: req.admin?.id ?? null,
      recordedAt: new Date(),
    });

    await logAdminChange(req, "factory", created.id, "create", null, mapFactory(created));
    publishDataChange("factory", created.id);

    return res.status(201).json({ factory: mapFactory(created) });
  } catch (err) {
    if (err instanceof Error && err.message.includes("cannot be negative")) {
      return res.status(400).json({ error: err.message });
    }
    return next(err);
  }
});

router.delete("/factories/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const factoryId = String(req.params.id);
    const [existing] = await db
      .select()
      .from(schema.cementFactories)
      .where(eq(schema.cementFactories.id, factoryId))
      .limit(1);

    const [factory] = await db
      .update(schema.cementFactories)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.cementFactories.id, factoryId))
      .returning();

    if (!factory) {
      return res.status(404).json({ error: "Factory not found." });
    }

    await logAdminChange(req, "factory", factory.id, "deactivate", existing ? mapFactory(existing) : null, mapFactory(factory));
    publishDataChange("factory", factory.id);

    return res.json({ factory: mapFactory(factory) });
  } catch (err) {
    return next(err);
  }
});

router.get("/shipping-costs", async (_req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(schema.shippingCosts)
      .orderBy(asc(schema.shippingCosts.originRegionId), asc(schema.shippingCosts.destinationRegionId));

    res.json({ shippingCosts: rows.map(mapShippingCost) });
  } catch (err) {
    next(err);
  }
});

router.post("/shipping-costs", async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = req.body as Body;
    const row: NewShippingCost = {
      originRegionId: asText(get(body, "originRegionId", "origin_region_id")) ?? "",
      destinationRegionId: asText(get(body, "destinationRegionId", "destination_region_id")) ?? "",
      productType: asText(get(body, "productType", "product_type")) ?? "bulk",
      truckType: asText(get(body, "truckType", "truck_type")) ?? "tanker",
      costPerTon: asDecimal(get(body, "costPerTon", "cost_per_ton")) ?? "",
      minimumCharge: asDecimal(get(body, "minimumCharge", "minimum_charge")) ?? "0.00",
      currency: asText(get(body, "currency")) ?? "SAR",
      deliveryDaysMin: asInt(get(body, "deliveryDaysMin", "delivery_days_min")) ?? 1,
      deliveryDaysMax: asInt(get(body, "deliveryDaysMax", "delivery_days_max")) ?? 3,
      effectiveFrom: asDate(get(body, "effectiveFrom", "effective_from")) ?? new Date(),
      effectiveTo: asDate(get(body, "effectiveTo", "effective_to")),
      isActive: asBool(get(body, "isActive", "is_active")) ?? true,
      notes: asText(get(body, "notes")),
      updatedAt: new Date(),
    };

    if (!row.originRegionId || !row.destinationRegionId || !row.costPerTon) {
      return res.status(400).json({ error: "originRegionId, destinationRegionId, and costPerTon are required." });
    }
    assertShippingValues(row);

    const [created] = await db.insert(schema.shippingCosts).values(row).returning();
    await logAdminChange(req, "shipping_cost", created.id, "create", null, mapShippingCost(created));
    publishDataChange("shipping_cost", created.id);

    return res.status(201).json({ shippingCost: mapShippingCost(created) });
  } catch (err) {
    if (err instanceof Error && (err.message.includes("cannot be negative") || err.message.includes("must be"))) {
      return res.status(400).json({ error: err.message });
    }
    return next(err);
  }
});

router.put("/shipping-costs/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const shippingCostId = String(req.params.id);
    const [existing] = await db
      .select()
      .from(schema.shippingCosts)
      .where(eq(schema.shippingCosts.id, shippingCostId))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: "Shipping cost not found." });
    }

    const updates = buildShippingUpdate(req.body as Body);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid shipping fields provided." });
    }
    assertShippingValues({ ...existing, ...updates });

    const [updated] = await db
      .update(schema.shippingCosts)
      .set(updates)
      .where(eq(schema.shippingCosts.id, shippingCostId))
      .returning();

    await logAdminChange(req, "shipping_cost", updated.id, "update", mapShippingCost(existing), mapShippingCost(updated));
    publishDataChange("shipping_cost", updated.id);

    return res.json({ shippingCost: mapShippingCost(updated) });
  } catch (err) {
    if (err instanceof Error && (err.message.includes("cannot be negative") || err.message.includes("must be"))) {
      return res.status(400).json({ error: err.message });
    }
    return next(err);
  }
});

router.delete("/shipping-costs/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const shippingCostId = String(req.params.id);
    const [existing] = await db
      .select()
      .from(schema.shippingCosts)
      .where(eq(schema.shippingCosts.id, shippingCostId))
      .limit(1);

    const [updated] = await db
      .update(schema.shippingCosts)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.shippingCosts.id, shippingCostId))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Shipping cost not found." });
    }

    await logAdminChange(
      req,
      "shipping_cost",
      updated.id,
      "deactivate",
      existing ? mapShippingCost(existing) : null,
      mapShippingCost(updated),
    );
    publishDataChange("shipping_cost", updated.id);

    return res.json({ shippingCost: mapShippingCost(updated) });
  } catch (err) {
    return next(err);
  }
});

router.get("/settings", async (_req, res, next) => {
  try {
    const settings = await db.select().from(schema.siteSettings).orderBy(schema.siteSettings.key);
    res.json({ settings });
  } catch (err) {
    next(err);
  }
});

router.put("/settings/:key", async (req: AuthenticatedRequest, res, next) => {
  try {
    const settingKey = String(req.params.key);
    const [existing] = await db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, settingKey))
      .limit(1);

    const [setting] = await db
      .insert(schema.siteSettings)
      .values({
        key: settingKey,
        value: (req.body as Body)["value"] ?? "",
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.siteSettings.key,
        set: {
          value: sql`excluded.value`,
          updatedAt: new Date(),
        },
      })
      .returning();

    await logAdminChange(req, "site_setting", setting.key, "upsert", existing ?? null, setting);
    publishDataChange("site_setting", setting.key);

    return res.json({ setting });
  } catch (err) {
    return next(err);
  }
});

export default router;
