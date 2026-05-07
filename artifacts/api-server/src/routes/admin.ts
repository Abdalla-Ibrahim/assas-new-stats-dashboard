import { createRequire } from "node:module";
import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "../db";
import { mapFactory } from "../lib/factoryMapper";
import { requireAuth } from "../middleware/auth";
import type { NewCementFactory } from "@workspace/db/schema";

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

router.put("/factories/:id", async (req, res, next) => {
  try {
    const [existing] = await db
      .select()
      .from(schema.cementFactories)
      .where(eq(schema.cementFactories.id, req.params.id))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: "Factory not found." });
    }

    const updates = buildFactoryUpdate(req.body as Body);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid factory fields provided." });
    }

    const priceChanged =
      (updates.bagPrice !== undefined && Number(updates.bagPrice) !== Number(existing.bagPrice)) ||
      (updates.bulkPrice !== undefined && Number(updates.bulkPrice) !== Number(existing.bulkPrice));

    const [updated] = await db
      .update(schema.cementFactories)
      .set(updates)
      .where(eq(schema.cementFactories.id, req.params.id))
      .returning();

    if (priceChanged) {
      await db.insert(schema.priceHistory).values({
        factoryId: updated.id,
        bagPrice: String(updated.bagPrice),
        bulkPrice: String(updated.bulkPrice),
        recordedAt: new Date(),
      });
    }

    return res.json({ factory: mapFactory(updated) });
  } catch (err) {
    return next(err);
  }
});

router.post("/factories", async (req, res, next) => {
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

    const [created] = await db.insert(schema.cementFactories).values(row).returning();
    await db.insert(schema.priceHistory).values({
      factoryId: created.id,
      bagPrice: String(created.bagPrice),
      bulkPrice: String(created.bulkPrice),
      recordedAt: new Date(),
    });

    return res.status(201).json({ factory: mapFactory(created) });
  } catch (err) {
    return next(err);
  }
});

router.delete("/factories/:id", async (req, res, next) => {
  try {
    const [factory] = await db
      .update(schema.cementFactories)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.cementFactories.id, req.params.id))
      .returning();

    if (!factory) {
      return res.status(404).json({ error: "Factory not found." });
    }

    return res.json({ factory: mapFactory(factory) });
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

router.put("/settings/:key", async (req, res, next) => {
  try {
    const [setting] = await db
      .insert(schema.siteSettings)
      .values({
        key: req.params.key,
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

    return res.json({ setting });
  } catch (err) {
    return next(err);
  }
});

export default router;
