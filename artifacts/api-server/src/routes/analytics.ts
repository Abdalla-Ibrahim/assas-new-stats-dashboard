import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "../db";
import { mapFactory } from "../lib/factoryMapper";

const router: IRouter = Router();

const toNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

router.get("/regions", async (_req, res, next) => {
  try {
    const [regions, factories] = await Promise.all([
      db.select().from(schema.regions).where(eq(schema.regions.isActive, true)).orderBy(asc(schema.regions.displayOrder)),
      db.select().from(schema.cementFactories).where(eq(schema.cementFactories.isActive, true)),
    ]);

    const factoriesByRegion = factories.reduce<Record<string, typeof factories>>((acc, factory) => {
      if (!acc[factory.regionId]) acc[factory.regionId] = [];
      acc[factory.regionId].push(factory);
      return acc;
    }, {});

    const analytics = regions.map((region) => {
      const regionFactories = factoriesByRegion[region.id] ?? [];
      const capacity = regionFactories.reduce((sum, factory) => sum + factory.capacity, 0);
      const production = regionFactories.reduce((sum, factory) => sum + factory.production, 0);
      const bagPrices = regionFactories.map((factory) => toNumber(factory.bagPrice)).filter((value) => value > 0);
      const bulkPrices = regionFactories.map((factory) => toNumber(factory.bulkPrice)).filter((value) => value > 0);
      const marketShare = regionFactories.reduce((sum, factory) => sum + toNumber(factory.marketShare), 0);

      return {
        id: region.id,
        saCode: region.saCode,
        nameAr: region.nameAr,
        nameEn: region.nameEn,
        displayOrder: region.displayOrder,
        centroidLat: toNumber(region.centroidLat),
        centroidLng: toNumber(region.centroidLng),
        factoryCount: regionFactories.length,
        capacity,
        production,
        utilization: capacity ? Math.round((production / capacity) * 100) : 0,
        avgBagPrice: bagPrices.length
          ? Number((bagPrices.reduce((sum, value) => sum + value, 0) / bagPrices.length).toFixed(2))
          : 0,
        minBagPrice: bagPrices.length ? Math.min(...bagPrices) : 0,
        maxBagPrice: bagPrices.length ? Math.max(...bagPrices) : 0,
        avgBulkPrice: bulkPrices.length
          ? Number((bulkPrices.reduce((sum, value) => sum + value, 0) / bulkPrices.length).toFixed(2))
          : 0,
        marketShare: Number(marketShare.toFixed(2)),
        factories: regionFactories.map(mapFactory),
      };
    });

    res.json({ regions: analytics });
  } catch (err) {
    next(err);
  }
});

export default router;

