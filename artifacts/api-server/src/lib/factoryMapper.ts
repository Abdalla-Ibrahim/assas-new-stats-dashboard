import type { CementFactory, PriceHistory } from "@workspace/db/schema";

const toNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function parsePriceHistoryNotes(notes: string | null) {
  if (!notes) return {};

  try {
    const parsed = JSON.parse(notes) as {
      bagPrice?: { old?: string | number; new?: string | number };
      bulkPrice?: { old?: string | number; new?: string | number };
    };

    return {
      oldBagPrice: parsed.bagPrice?.old === undefined ? undefined : toNumber(parsed.bagPrice.old),
      newBagPrice: parsed.bagPrice?.new === undefined ? undefined : toNumber(parsed.bagPrice.new),
      oldBulkPrice: parsed.bulkPrice?.old === undefined ? undefined : toNumber(parsed.bulkPrice.old),
      newBulkPrice: parsed.bulkPrice?.new === undefined ? undefined : toNumber(parsed.bulkPrice.new),
    };
  } catch {
    return {};
  }
}

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
    ...parsePriceHistoryNotes(row.notes),
    recordedAt: row.recordedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
