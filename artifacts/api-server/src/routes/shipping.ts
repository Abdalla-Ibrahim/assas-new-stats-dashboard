import { Router, type IRouter } from "express";
import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "../db";

const router: IRouter = Router();

const BAGS_PER_TON = 20;

const toNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function mapShippingCost(row: typeof schema.shippingCosts.$inferSelect) {
  return {
    id: row.id,
    originRegionId: row.originRegionId,
    destinationRegionId: row.destinationRegionId,
    productType: row.productType,
    truckType: row.truckType,
    costPerTon: toNumber(row.costPerTon),
    minimumCharge: toNumber(row.minimumCharge),
    currency: row.currency,
    deliveryDaysMin: row.deliveryDaysMin,
    deliveryDaysMax: row.deliveryDaysMax,
    effectiveFrom: row.effectiveFrom,
    effectiveTo: row.effectiveTo,
    isActive: row.isActive,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

router.get("/costs", async (_req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(schema.shippingCosts)
      .where(eq(schema.shippingCosts.isActive, true))
      .orderBy(asc(schema.shippingCosts.originRegionId), asc(schema.shippingCosts.destinationRegionId));

    res.json({ shippingCosts: rows.map(mapShippingCost) });
  } catch (err) {
    next(err);
  }
});

router.post("/calculate", async (req, res, next) => {
  try {
    const body = req.body as Record<string, unknown>;
    const factoryId = typeof body["factoryId"] === "string" ? body["factoryId"] : "";
    const destinationRegionId = typeof body["destinationRegionId"] === "string" ? body["destinationRegionId"] : "";
    const productType = typeof body["productType"] === "string" ? body["productType"] : "bulk";
    const truckType = typeof body["truckType"] === "string" ? body["truckType"] : productType === "bag" ? "trailer" : "tanker";
    const tons = Math.max(0, Number(body["tons"] ?? 0));

    if (!factoryId || !destinationRegionId || !Number.isFinite(tons) || tons <= 0) {
      return res.status(400).json({ error: "factoryId, destinationRegionId, and a positive tons value are required." });
    }

    const [factory] = await db
      .select()
      .from(schema.cementFactories)
      .where(eq(schema.cementFactories.id, factoryId))
      .limit(1);

    if (!factory || !factory.isActive) {
      return res.status(404).json({ error: "Factory not found." });
    }

    const routeRows = await db
      .select()
      .from(schema.shippingCosts)
      .where(
        and(
          eq(schema.shippingCosts.originRegionId, factory.regionId),
          eq(schema.shippingCosts.destinationRegionId, destinationRegionId),
          eq(schema.shippingCosts.productType, productType),
          eq(schema.shippingCosts.truckType, truckType),
          eq(schema.shippingCosts.isActive, true),
        ),
      )
      .limit(20);

    const now = Date.now();
    const route = routeRows.find((row) => {
      const starts = row.effectiveFrom.getTime() <= now;
      const openEnded = !row.effectiveTo || row.effectiveTo.getTime() >= now;
      return starts && openEnded;
    });

    if (!route) {
      return res.status(404).json({
        error: "No active shipping route exists for this factory, destination, product, and truck type.",
      });
    }

    const unitMaterialCost = productType === "bag" ? toNumber(factory.bagPrice) * BAGS_PER_TON : toNumber(factory.bulkPrice);
    const materialCost = unitMaterialCost * tons;
    const rawShippingCost = toNumber(route.costPerTon) * tons;
    const shippingCost = Math.max(rawShippingCost, toNumber(route.minimumCharge));
    const totalLandedCost = materialCost + shippingCost;
    const landedCostPerTon = totalLandedCost / tons;

    return res.json({
      input: {
        factoryId,
        originRegionId: factory.regionId,
        destinationRegionId,
        productType,
        truckType,
        tons,
        bagsPerTon: BAGS_PER_TON,
      },
      route: mapShippingCost(route),
      materialCost: Number(materialCost.toFixed(2)),
      shippingCost: Number(shippingCost.toFixed(2)),
      totalLandedCost: Number(totalLandedCost.toFixed(2)),
      landedCostPerTon: Number(landedCostPerTon.toFixed(2)),
      landedCostPerBag: Number((landedCostPerTon / BAGS_PER_TON).toFixed(2)),
      deliveryDaysMin: route.deliveryDaysMin,
      deliveryDaysMax: route.deliveryDaysMax,
      currency: route.currency,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;

