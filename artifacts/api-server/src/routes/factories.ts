import { Router, type IRouter } from "express";
import { asc, desc, eq } from "drizzle-orm";
import { db, schema } from "../db";
import { mapFactory, mapPriceHistory } from "../lib/factoryMapper";

const router: IRouter = Router();

router.get("/", async (_req, res, next) => {
  try {
    const factories = await db
      .select()
      .from(schema.cementFactories)
      .where(eq(schema.cementFactories.isActive, true))
      .orderBy(asc(schema.cementFactories.bagPrice));

    res.json({ factories: factories.map(mapFactory) });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [factory] = await db
      .select()
      .from(schema.cementFactories)
      .where(eq(schema.cementFactories.id, req.params.id))
      .limit(1);

    if (!factory || !factory.isActive) {
      return res.status(404).json({ error: "Factory not found." });
    }

    const history = await db
      .select()
      .from(schema.priceHistory)
      .where(eq(schema.priceHistory.factoryId, factory.id))
      .orderBy(desc(schema.priceHistory.recordedAt))
      .limit(12);

    return res.json({
      factory: mapFactory(factory),
      priceHistory: history.map(mapPriceHistory),
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
