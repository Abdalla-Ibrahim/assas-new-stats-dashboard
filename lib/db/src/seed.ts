import { readFileSync } from "node:fs";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { adminUsers, cementFactories, factoryMetricPeriods, priceHistory, regions, shippingCosts } from "./schema";

function loadLocalEnv() {
  if (process.env.DATABASE_URL) return;

  try {
    const envText = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of envText.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator);
      const value = trimmed.slice(separator + 1);
      process.env[key] = value;
    }
  } catch {
    // The DB module throws a clear DATABASE_URL error if no env file exists.
  }
}

loadLocalEnv();

const { db, pool } = await import("./index");

type StaticCementFactory = {
  id: string;
  name: string;
  shortName: string;
  symbol: string;
  listed: boolean;
  region: string;
  regionId: string;
  capacity: number;
  production2024: number;
  marketShare: number;
  bagPrice: number;
  bulkPrice: number;
  stockPrice: number;
  change: number;
  changePct: number;
  color: string;
  founded: number;
  employees: number;
};

const factoryModuleUrl = new URL(
  "../../../artifacts/assas-reports/src/data/cementFactories.ts",
  import.meta.url,
).href;

const { CEMENT_FACTORIES } = (await import(factoryModuleUrl)) as {
  CEMENT_FACTORIES: StaticCementFactory[];
};

const toDecimal = (value: number) => value.toFixed(2);

const REGION_ROWS = [
  { id: "riyadh", saCode: "SA-01", nameAr: "الرياض", nameEn: "Riyadh", displayOrder: 1, centroidLat: "24.713600", centroidLng: "46.675300" },
  { id: "makkah", saCode: "SA-02", nameAr: "مكة المكرمة", nameEn: "Makkah", displayOrder: 2, centroidLat: "21.389100", centroidLng: "39.857900" },
  { id: "madinah", saCode: "SA-03", nameAr: "المدينة المنورة", nameEn: "Madinah", displayOrder: 3, centroidLat: "24.524700", centroidLng: "39.569200" },
  { id: "eastern", saCode: "SA-04", nameAr: "المنطقة الشرقية", nameEn: "Eastern Province", displayOrder: 4, centroidLat: "26.420700", centroidLng: "50.088800" },
  { id: "qassim", saCode: "SA-05", nameAr: "القصيم", nameEn: "Qassim", displayOrder: 5, centroidLat: "26.359200", centroidLng: "43.981800" },
  { id: "hail", saCode: "SA-06", nameAr: "حائل", nameEn: "Hail", displayOrder: 6, centroidLat: "27.511400", centroidLng: "41.720800" },
  { id: "tabuk", saCode: "SA-07", nameAr: "تبوك", nameEn: "Tabuk", displayOrder: 7, centroidLat: "28.383800", centroidLng: "36.555000" },
  { id: "northern", saCode: "SA-08", nameAr: "الحدود الشمالية", nameEn: "Northern Borders", displayOrder: 8, centroidLat: "30.975300", centroidLng: "41.038100" },
  { id: "jizan", saCode: "SA-09", nameAr: "جازان", nameEn: "Jazan", displayOrder: 9, centroidLat: "16.889200", centroidLng: "42.561100" },
  { id: "najran", saCode: "SA-10", nameAr: "نجران", nameEn: "Najran", displayOrder: 10, centroidLat: "17.565600", centroidLng: "44.228900" },
  { id: "baha", saCode: "SA-11", nameAr: "الباحة", nameEn: "Al Baha", displayOrder: 11, centroidLat: "20.012900", centroidLng: "41.467700" },
  { id: "jouf", saCode: "SA-12", nameAr: "الجوف", nameEn: "Al Jouf", displayOrder: 12, centroidLat: "29.969700", centroidLng: "40.206400" },
  { id: "asir", saCode: "SA-14", nameAr: "عسير", nameEn: "Asir", displayOrder: 13, centroidLat: "18.216400", centroidLng: "42.505300" },
];

function routeCost(originOrder: number, destinationOrder: number, productType: "bulk" | "bag") {
  const sameRegion = originOrder === destinationOrder;
  const distanceBand = Math.abs(originOrder - destinationOrder);
  const base = sameRegion ? 18 : 34 + distanceBand * 3.75;
  return toDecimal(productType === "bag" ? base + 6 : base);
}

async function seed() {
  if (CEMENT_FACTORIES.length !== 17) {
    throw new Error(`Expected 17 factories, found ${CEMENT_FACTORIES.length}`);
  }

  await db
    .insert(regions)
    .values(REGION_ROWS.map((region) => ({ ...region, isActive: true, updatedAt: new Date() })))
    .onConflictDoUpdate({
      target: regions.id,
      set: {
        saCode: sql`excluded.sa_code`,
        nameAr: sql`excluded.name_ar`,
        nameEn: sql`excluded.name_en`,
        displayOrder: sql`excluded.display_order`,
        centroidLat: sql`excluded.centroid_lat`,
        centroidLng: sql`excluded.centroid_lng`,
        isActive: sql`excluded.is_active`,
        updatedAt: new Date(),
      },
    });

  const factoryRows = CEMENT_FACTORIES.map((factory) => ({
    id: factory.id,
    nameAr: factory.name,
    nameEn: factory.shortName,
    bagPrice: toDecimal(factory.bagPrice),
    bulkPrice: toDecimal(factory.bulkPrice),
    marketShare: toDecimal(factory.marketShare),
    capacity: factory.capacity,
    production: factory.production2024,
    region: factory.region,
    regionId: factory.regionId,
    color: factory.color,
    listed: factory.listed,
    stockPrice: factory.listed ? toDecimal(factory.stockPrice) : null,
    stockChange: factory.listed ? toDecimal(factory.change) : null,
    stockChangePct: factory.listed ? toDecimal(factory.changePct) : "0.00",
    stockSymbol: factory.listed ? factory.symbol : null,
    founded: factory.founded,
    employees: factory.employees,
    isActive: true,
    updatedAt: new Date(),
  }));

  await db
    .insert(cementFactories)
    .values(factoryRows)
    .onConflictDoUpdate({
      target: cementFactories.id,
      set: {
        nameAr: sql`excluded.name_ar`,
        nameEn: sql`excluded.name_en`,
        bagPrice: sql`excluded.bag_price`,
        bulkPrice: sql`excluded.bulk_price`,
        marketShare: sql`excluded.market_share`,
        capacity: sql`excluded.capacity`,
        production: sql`excluded.production`,
        region: sql`excluded.region`,
        regionId: sql`excluded.region_id`,
        color: sql`excluded.color`,
        listed: sql`excluded.listed`,
        stockPrice: sql`excluded.stock_price`,
        stockChange: sql`excluded.stock_change`,
        stockChangePct: sql`excluded.stock_change_pct`,
        stockSymbol: sql`excluded.stock_symbol`,
        founded: sql`excluded.founded`,
        employees: sql`excluded.employees`,
        isActive: sql`excluded.is_active`,
        updatedAt: new Date(),
      },
    });

  await db.insert(priceHistory).values(
    CEMENT_FACTORIES.map((factory) => ({
      factoryId: factory.id,
      bagPrice: toDecimal(factory.bagPrice),
      bulkPrice: toDecimal(factory.bulkPrice),
      productType: "cement",
      unit: "bag_ton",
      effectiveFrom: new Date(),
      source: "seed",
      status: "published",
      recordedAt: new Date(),
    })),
  );

  const [{ metricCount }] = await db
    .select({ metricCount: sql<number>`count(*)::int` })
    .from(factoryMetricPeriods);

  if (metricCount === 0) {
    await db.insert(factoryMetricPeriods).values(
      CEMENT_FACTORIES.map((factory) => {
        const localSales = Math.round(factory.production2024 * 0.82);
        const exportSales = Math.max(0, factory.production2024 - localSales);
        return {
          factoryId: factory.id,
          regionId: factory.regionId,
          periodType: "year",
          periodStart: new Date("2024-01-01T00:00:00.000Z"),
          periodEnd: new Date("2024-12-31T23:59:59.000Z"),
          capacity: factory.capacity,
          production: factory.production2024,
          utilization: factory.capacity ? toDecimal((factory.production2024 / factory.capacity) * 100) : "0.00",
          localSales,
          exportSales,
          totalSales: factory.production2024,
          clinkerProduced: Math.round(factory.production2024 * 0.92),
          clinkerBought: 0,
          clinkerSold: Math.round(factory.production2024 * 0.08),
          clinkerExported: Math.round(factory.production2024 * 0.04),
          clinkerInventory: Math.round(factory.production2024 * 0.18),
          marketShare: toDecimal(factory.marketShare),
          source: "seed",
          status: "published",
          notes: "Baseline period seeded from the static 2024 dataset.",
          updatedAt: new Date(),
        };
      }),
    );
  }

  const [{ shippingCount }] = await db
    .select({ shippingCount: sql<number>`count(*)::int` })
    .from(shippingCosts);

  if (shippingCount === 0) {
    const shippingRows = REGION_ROWS.flatMap((origin) =>
      REGION_ROWS.flatMap((destination) =>
        (["bulk", "bag"] as const).map((productType) => ({
          originRegionId: origin.id,
          destinationRegionId: destination.id,
          productType,
          truckType: productType === "bulk" ? "tanker" : "trailer",
          costPerTon: routeCost(origin.displayOrder, destination.displayOrder, productType),
          minimumCharge: productType === "bulk" ? "450.00" : "550.00",
          currency: "SAR",
          deliveryDaysMin: origin.id === destination.id ? 1 : 2,
          deliveryDaysMax: origin.id === destination.id ? 1 : Math.min(7, 2 + Math.abs(origin.displayOrder - destination.displayOrder)),
          effectiveFrom: new Date("2024-01-01T00:00:00.000Z"),
          isActive: true,
          notes: "Seeded region-level baseline route. Replace with contracted lane pricing in admin.",
          updatedAt: new Date(),
        })),
      ),
    );
    await db.insert(shippingCosts).values(shippingRows);
  }

  const passwordHash = await bcrypt.hash("Assas2024!", 10);
  await db
    .insert(adminUsers)
    .values({
      email: "admin@assas.sa",
      passwordHash,
      name: "Assas Admin",
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: adminUsers.email,
      set: {
        passwordHash: sql`excluded.password_hash`,
        name: sql`excluded.name`,
        updatedAt: new Date(),
      },
    });

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(cementFactories);

  console.log(`Seeded ${count} cement factories, ${REGION_ROWS.length} regions, and first admin user.`);
}

try {
  await seed();
} finally {
  await pool.end();
}
