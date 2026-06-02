import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Factory, Info, MapPin, TrendingUp } from "lucide-react";
import { useCementFactories } from "@/contexts/FactoriesContext";
import { SAUDI_REGIONS } from "@/data/saudi-regions";
import {
  DEFAULT_MAP_DISPLAY_SETTINGS,
  HEATMAP_METRIC_OPTIONS,
  MAP_DISPLAY_SETTINGS_KEY,
  REGION_ID_TO_SA_CODE,
  type RegionId,
  normalizeMapDisplaySettings,
} from "@/data/mapSettings";
import { SaudiHeatmap, type RegionValues } from "./SaudiHeatmap";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const SA_CODE_TO_REGION_ID = Object.fromEntries(
  Object.entries(REGION_ID_TO_SA_CODE).map(([regionId, saCode]) => [saCode, regionId]),
) as Record<string, RegionId>;

const REGION_OPTIONS = Object.entries(REGION_ID_TO_SA_CODE).map(([regionId, saCode]) => {
  const region = SAUDI_REGIONS.find((item) => item.id === saCode);
  return {
    id: regionId as RegionId,
    saCode,
    name: region?.ar.replace("منطقة ", "") ?? regionId,
  };
});

const formatNumber = (value: number) => new Intl.NumberFormat("ar-SA").format(value);

function getRegionName(saCode: string, fallback: string) {
  return SAUDI_REGIONS.find((region) => region.id === saCode)?.ar.replace("منطقة ", "") ?? fallback;
}

export function SaudiMap() {
  const { factories, FACTORY_BY_REGION, regionAnalytics } = useCementFactories();
  const [mapSettings, setMapSettings] = useState(DEFAULT_MAP_DISPLAY_SETTINGS);
  const [activeMetricValue, setActiveMetricValue] = useState(DEFAULT_MAP_DISPLAY_SETTINGS.heatmapMetric);
  const [activeId, setActiveId] = useState<RegionId>(DEFAULT_MAP_DISPLAY_SETTINGS.defaultRegionId);
  const lastDefaultRegionRef = useRef<RegionId>(DEFAULT_MAP_DISPLAY_SETTINGS.defaultRegionId);

  useEffect(() => {
    const fetchMapSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/${MAP_DISPLAY_SETTINGS_KEY}`, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) return;

        const payload = (await response.json()) as { setting?: { value?: unknown } };
        const nextSettings = normalizeMapDisplaySettings(payload.setting?.value);
        setMapSettings(nextSettings);
        setActiveMetricValue(nextSettings.heatmapMetric);
        setActiveId((current) => {
          if (current !== lastDefaultRegionRef.current) return current;
          lastDefaultRegionRef.current = nextSettings.defaultRegionId;
          return nextSettings.defaultRegionId;
        });
      } catch {
        setMapSettings(DEFAULT_MAP_DISPLAY_SETTINGS);
      }
    };

    void fetchMapSettings();
    const interval = window.setInterval(() => {
      void fetchMapSettings();
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const activeSaudiId = REGION_ID_TO_SA_CODE[activeId];
  const activeRegionAnalytics = useMemo(
    () => regionAnalytics.find((region) => region.id === activeId),
    [activeId, regionAnalytics],
  );
  const activeRegionName =
    activeRegionAnalytics?.nameAr ?? getRegionName(activeSaudiId, FACTORY_BY_REGION[activeId]?.[0]?.region ?? "الرياض");

  const activeFactories = useMemo(
    () => activeRegionAnalytics?.factories ?? FACTORY_BY_REGION[activeId] ?? [],
    [FACTORY_BY_REGION, activeId, activeRegionAnalytics],
  );
  const activeCapacity = activeRegionAnalytics?.capacity ?? activeFactories.reduce((sum, factory) => sum + factory.capacity, 0);
  const activeProduction =
    activeRegionAnalytics?.production ?? activeFactories.reduce((sum, factory) => sum + factory.production2024, 0);
  const maxProduction = useMemo(
    () => Math.max(1, ...factories.map((factory) => factory.production2024)),
    [factories],
  );

  const heatmapValues = useMemo<RegionValues>(() => {
    const values = SAUDI_REGIONS.reduce<RegionValues>((acc, region) => {
      acc[region.id] = 0;
      return acc;
    }, {});

    if (regionAnalytics.length > 0) {
      regionAnalytics.forEach((region) => {
        if (activeMetricValue === "factory_count") values[region.saCode] = region.factoryCount;
        if (activeMetricValue === "production") values[region.saCode] = region.production;
        if (activeMetricValue === "capacity") values[region.saCode] = region.capacity;
        if (activeMetricValue === "utilization") values[region.saCode] = region.utilization;
        if (activeMetricValue === "avg_bag_price") values[region.saCode] = region.avgBagPrice;
      });
      return values;
    }

    const counts = SAUDI_REGIONS.reduce<Record<string, number>>((acc, region) => {
      acc[region.id] = 0;
      return acc;
    }, {});
    const productionByRegion = { ...values };
    const capacityByRegion = { ...values };

    factories.forEach((factory) => {
      const saCode = REGION_ID_TO_SA_CODE[factory.regionId as RegionId];
      if (!saCode) return;

      counts[saCode] = (counts[saCode] ?? 0) + 1;
      productionByRegion[saCode] = (productionByRegion[saCode] ?? 0) + factory.production2024;
      capacityByRegion[saCode] = (capacityByRegion[saCode] ?? 0) + factory.capacity;

      if (activeMetricValue === "factory_count") {
        values[saCode] = (values[saCode] ?? 0) + 1;
      } else if (activeMetricValue === "production") {
        values[saCode] = (values[saCode] ?? 0) + factory.production2024;
      } else if (activeMetricValue === "capacity") {
        values[saCode] = (values[saCode] ?? 0) + factory.capacity;
      } else if (activeMetricValue === "avg_bag_price") {
        values[saCode] = (values[saCode] ?? 0) + factory.bagPrice;
      }
    });

    if (activeMetricValue === "avg_bag_price") {
      Object.keys(values).forEach((saCode) => {
        values[saCode] = counts[saCode] ? Number((values[saCode] / counts[saCode]).toFixed(2)) : 0;
      });
    } else if (activeMetricValue === "utilization") {
      Object.keys(values).forEach((saCode) => {
        values[saCode] = capacityByRegion[saCode]
          ? Math.round((productionByRegion[saCode] / capacityByRegion[saCode]) * 100)
          : 0;
      });
    }

    return values;
  }, [activeMetricValue, factories, regionAnalytics]);

  const activeMetric = HEATMAP_METRIC_OPTIONS.find((option) => option.value === activeMetricValue);

  const handleRegionSelect = (saCode: string) => {
    const nextRegionId = SA_CODE_TO_REGION_ID[saCode];
    if (nextRegionId) setActiveId(nextRegionId);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
      <Card className="overflow-hidden border-slate-700/50 bg-gradient-to-br from-[#060d1a] to-slate-950 shadow-2xl">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-secondary uppercase">خريطة تفاعلية</p>
              <h3 className="text-lg font-black text-white">مناطق المملكة العربية السعودية الـ13</h3>
            </div>
            <div className="flex flex-col items-end gap-1 text-[10px] text-white/45">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-secondary" /> المنطقة المختارة
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" /> مصانع أكثر
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-slate-800" /> مصانع أقل
              </span>
            </div>
          </div>

          <div
            className="relative w-full overflow-hidden rounded-2xl border border-white/5 px-3 py-4"
            style={{ background: "radial-gradient(ellipse at 60% 40%, #0d1f3c 0%, #060c18 100%)" }}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {HEATMAP_METRIC_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActiveMetricValue(option.value)}
                  className={`rounded-xl px-3 py-2 text-[11px] font-black transition ${
                    activeMetricValue === option.value
                      ? "bg-secondary text-slate-950"
                      : "bg-white/8 text-white/65 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <SaudiHeatmap
              values={heatmapValues}
              unit={activeMetric?.unit ?? "مصنع"}
              selectedRegionId={activeSaudiId}
              onRegionSelect={handleRegionSelect}
              showLegend={mapSettings.showLegend}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {REGION_OPTIONS.map((region) => (
              <button
                key={region.id}
                onClick={() => setActiveId(region.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all duration-200 ${
                  region.id === activeId
                    ? "bg-secondary text-slate-950 shadow-md shadow-secondary/30"
                    : "bg-white/8 text-white/60 hover:bg-white/15 hover:text-white"
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="overflow-hidden border-secondary/25 shadow-2xl">
          <div className="bg-gradient-to-br from-primary via-primary/90 to-slate-900 p-6 text-white">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                <MapPin className="h-3.5 w-3.5" /> المنطقة المختارة
              </span>
              <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold text-secondary">
                {activeFactories.length} {activeFactories.length === 1 ? "مصنع" : "مصانع"}
              </span>
            </div>
            <h3 className="text-3xl font-black">{activeRegionName}</h3>
            <p className="mt-1 text-sm text-white/50">إجمالي إنتاج الإسمنت في المنطقة</p>
            <p className="mt-2 text-4xl font-black text-secondary">
              {formatNumber(activeProduction)}
              <span className="mr-2 text-base text-white/45">ألف طن</span>
            </p>
            {activeFactories.length === 0 && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/65">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary/70" />
                لا يوجد مصنع إسمنت مسجّل في هذه المنطقة حالياً
              </div>
            )}
          </div>
        </Card>

        {mapSettings.showFactoryList && activeFactories.length > 0 && (
          <Card className="border-slate-700/50 bg-slate-900 shadow-lg">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Factory className="h-5 w-5 text-secondary" />
                <h4 className="font-black text-white">مصانع الإسمنت في {activeRegionName}</h4>
              </div>
              <div className="space-y-3">
                {activeFactories.map((factory, index) => {
                  const pct = (factory.production2024 / maxProduction) * 100;
                  const util = factory.capacity ? Math.round((factory.production2024 / factory.capacity) * 100) : 0;
                  return (
                    <div key={factory.id}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-bold text-slate-200">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-white">
                            {index + 1}
                          </span>
                          <span className="h-2 w-2 rounded-full" style={{ background: factory.color }} />
                          {factory.name}
                        </span>
                        <div className="flex items-center gap-3 text-xs">
                          <span
                            className={`rounded-full px-2 py-0.5 font-black ${
                              util >= 90
                                ? "bg-emerald-900/50 text-emerald-400"
                                : util >= 75
                                  ? "bg-amber-900/50 text-amber-400"
                                  : "bg-red-900/40 text-red-400"
                            }`}
                          >
                            {util}% استغلال
                          </span>
                          <span className="font-black text-white">{formatNumber(factory.production2024)} ألف طن</span>
                        </div>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: factory.color }}
                        />
                      </div>
                      <div className="mt-0.5 flex justify-between text-[10px] text-slate-500">
                        <span>طاقة: {formatNumber(factory.capacity)} ألف طن</span>
                        <span>
                          {factory.listed
                            ? `السهم: ${Number(factory.stockPrice).toFixed(2)} ريال (${factory.change >= 0 ? "+" : ""}${Number(factory.changePct).toFixed(2)}%)`
                            : "شركة غير مدرجة"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-700/50 bg-slate-900 shadow-lg">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <h4 className="text-sm font-black text-white">مؤشرات منطقة {activeRegionName}</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "الطاقة الإنتاجية",
                  value: `${formatNumber(activeCapacity)} ألف طن`,
                  color: "text-sky-400",
                },
                {
                  label: "الإنتاج الفعلي 2024",
                  value: `${formatNumber(activeProduction)} ألف طن`,
                  color: "text-secondary",
                },
                {
                  label: "متوسط سعر الكيس",
                  value: activeFactories.length
                    ? `${Number(activeFactories.reduce((sum, factory) => sum + factory.bagPrice, 0) / activeFactories.length).toFixed(2)} ريال`
                    : "—",
                  color: "text-emerald-400",
                },
                {
                  label: "نسبة الاستغلال",
                  value: activeCapacity ? `${Math.round((activeProduction / activeCapacity) * 100)}%` : "—",
                  color: "text-violet-400",
                },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/5 p-3">
                  <p className="text-[10px] text-slate-400">{stat.label}</p>
                  <p className={`mt-1 text-base font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
