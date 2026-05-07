import { readFileSync } from "node:fs";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { adminUsers, cementFactories, priceHistory } from "./schema";

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

async function seed() {
  if (CEMENT_FACTORIES.length !== 17) {
    throw new Error(`Expected 17 factories, found ${CEMENT_FACTORIES.length}`);
  }

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
      recordedAt: new Date(),
    })),
  );

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

  console.log(`Seeded ${count} cement factories and first admin user.`);
}

try {
  await seed();
} finally {
  await pool.end();
}
