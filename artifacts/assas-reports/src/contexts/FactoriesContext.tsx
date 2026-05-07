import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CEMENT_FACTORIES as STATIC_CEMENT_FACTORIES,
  type CementFactory,
} from "@/data/cementFactories";

type ApiFactory = Partial<CementFactory> & {
  nameAr?: string;
  name_ar?: string;
  nameEn?: string | null;
  name_en?: string | null;
  bag_price?: number | string;
  bulk_price?: number | string;
  market_share?: number | string;
  production?: number;
  stock_price?: number | string | null;
  stock_change?: number | string | null;
  stock_change_pct?: number | string | null;
  stock_symbol?: string | null;
  region_id?: string;
  is_active?: boolean;
};

type FactoriesContextValue = {
  factories: CementFactory[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: Date | null;
  TOTAL_CAPACITY: number;
  TOTAL_PRODUCTION: number;
  FACTORY_BY_REGION: Record<string, CementFactory[]>;
};

const FactoriesContext = createContext<FactoriesContextValue | null>(null);

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const staticById = new Map(STATIC_CEMENT_FACTORIES.map((factory) => [factory.id, factory]));

function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeFactory(factory: ApiFactory): CementFactory {
  const fallback = factory.id ? staticById.get(factory.id) : undefined;
  const name = factory.name ?? factory.nameAr ?? factory.name_ar ?? fallback?.name ?? "";
  const shortName = factory.shortName ?? factory.nameEn ?? factory.name_en ?? fallback?.shortName ?? name;
  const symbol = factory.symbol ?? factory.stock_symbol ?? fallback?.symbol ?? "خاص";

  return {
    id: factory.id ?? fallback?.id ?? crypto.randomUUID(),
    name,
    shortName,
    symbol,
    listed: factory.listed ?? fallback?.listed ?? symbol !== "خاص",
    region: factory.region ?? fallback?.region ?? "",
    regionId: factory.regionId ?? factory.region_id ?? fallback?.regionId ?? "riyadh",
    capacity: toNumber(factory.capacity, fallback?.capacity ?? 0),
    production2024: toNumber(factory.production2024 ?? factory.production, fallback?.production2024 ?? 0),
    marketShare: toNumber(factory.marketShare ?? factory.market_share, fallback?.marketShare ?? 0),
    bagPrice: toNumber(factory.bagPrice ?? factory.bag_price, fallback?.bagPrice ?? 0),
    bulkPrice: toNumber(factory.bulkPrice ?? factory.bulk_price, fallback?.bulkPrice ?? 0),
    stockPrice: toNumber(factory.stockPrice ?? factory.stock_price, fallback?.stockPrice ?? 0),
    change: toNumber(factory.change ?? factory.stock_change, fallback?.change ?? 0),
    changePct: toNumber(factory.changePct ?? factory.stock_change_pct, fallback?.changePct ?? 0),
    color: factory.color ?? fallback?.color ?? "#f5b800",
    founded: toNumber(factory.founded, fallback?.founded ?? 2000),
    employees: toNumber(factory.employees, fallback?.employees ?? 0),
  };
}

function computeFactoryByRegion(factories: CementFactory[]) {
  return factories.reduce<Record<string, CementFactory[]>>((acc, factory) => {
    if (!acc[factory.regionId]) acc[factory.regionId] = [];
    acc[factory.regionId].push(factory);
    return acc;
  }, {});
}

export function FactoriesProvider({ children }: { children: ReactNode }) {
  const [factories, setFactories] = useState<CementFactory[]>(STATIC_CEMENT_FACTORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchFactories = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/factories`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const payload = (await response.json()) as { factories?: ApiFactory[] };
      const nextFactories = Array.isArray(payload.factories) ? payload.factories.map(normalizeFactory) : [];

      if (nextFactories.length === 0) {
        throw new Error("API returned no factories");
      }

      setFactories(nextFactories);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setFactories((current) => (current.length > 0 ? current : STATIC_CEMENT_FACTORIES));
      setError(err instanceof Error ? err.message : "Unable to fetch factories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFactories();
    const interval = window.setInterval(() => {
      void fetchFactories();
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [fetchFactories]);

  const value = useMemo<FactoriesContextValue>(() => {
    const TOTAL_CAPACITY = factories.reduce((sum, factory) => sum + factory.capacity, 0);
    const TOTAL_PRODUCTION = factories.reduce((sum, factory) => sum + factory.production2024, 0);
    const FACTORY_BY_REGION = computeFactoryByRegion(factories);

    return {
      factories,
      isLoading,
      error,
      refetch: () => {
        void fetchFactories();
      },
      lastUpdated,
      TOTAL_CAPACITY,
      TOTAL_PRODUCTION,
      FACTORY_BY_REGION,
    };
  }, [error, factories, fetchFactories, isLoading, lastUpdated]);

  return <FactoriesContext.Provider value={value}>{children}</FactoriesContext.Provider>;
}

export function useCementFactories() {
  const context = useContext(FactoriesContext);
  if (!context) {
    throw new Error("useCementFactories must be used inside FactoriesProvider.");
  }
  return context;
}

export type { CementFactory };
