import type { CementFactory, PriceHistory } from "@workspace/db/schema";

const toNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function mapFactory(factory: CementFactory) {
  return {
    id: factory.id,
    name: factory.nameAr,
    shortName: factory.nameEn ?? factory.nameAr,
    symbol: factory.stockSymbol ?? "خاص",
    listed: factory.listed,
    region: factory.region,
    regionId: factory.regionId,
    capacity: factory.capacity,
    production2024: factory.production,
    marketShare: toNumber(factory.marketShare),
    bagPrice: toNumber(factory.bagPrice),
    bulkPrice: toNumber(factory.bulkPrice),
    stockPrice: toNumber(factory.stockPrice),
    change: toNumber(factory.stockChange),
    changePct: toNumber(factory.stockChangePct),
    color: factory.color,
    founded: factory.founded,
    employees: factory.employees,
    isActive: factory.isActive,
    createdAt: factory.createdAt,
    updatedAt: factory.updatedAt,
  };
}

export function mapPriceHistory(row: PriceHistory) {
  return {
    id: row.id,
    factoryId: row.factoryId,
    bagPrice: toNumber(row.bagPrice),
    bulkPrice: toNumber(row.bulkPrice),
    recordedAt: row.recordedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
