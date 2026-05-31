import { SAUDI_REGIONS } from "@/data/saudi-regions";

export const MAP_DISPLAY_SETTINGS_KEY = "map_display_settings";

export const REGION_ID_TO_SA_CODE = {
  riyadh: "SA-01",
  makkah: "SA-02",
  madinah: "SA-03",
  eastern: "SA-04",
  qassim: "SA-05",
  hail: "SA-06",
  tabuk: "SA-07",
  northern: "SA-08",
  jizan: "SA-09",
  najran: "SA-10",
  baha: "SA-11",
  jouf: "SA-12",
  asir: "SA-14",
} as const;

export type RegionId = keyof typeof REGION_ID_TO_SA_CODE;

export type HeatmapMetric = "factory_count" | "production" | "capacity" | "utilization" | "avg_bag_price";

export type MapDisplaySettings = {
  heatmapMetric: HeatmapMetric;
  defaultRegionId: RegionId;
  showLegend: boolean;
  showFactoryList: boolean;
};

export const DEFAULT_MAP_DISPLAY_SETTINGS: MapDisplaySettings = {
  heatmapMetric: "factory_count",
  defaultRegionId: "riyadh",
  showLegend: true,
  showFactoryList: true,
};

export const HEATMAP_METRIC_OPTIONS: Array<{ value: HeatmapMetric; label: string; unit: string }> = [
  { value: "factory_count", label: "عدد المصانع", unit: "مصنع" },
  { value: "production", label: "الإنتاج الفعلي", unit: "ألف طن" },
  { value: "capacity", label: "الطاقة الإنتاجية", unit: "ألف طن" },
  { value: "utilization", label: "نسبة الاستغلال", unit: "%" },
  { value: "avg_bag_price", label: "متوسط سعر الكيس", unit: "ريال" },
];

export const REGION_OPTIONS = Object.entries(REGION_ID_TO_SA_CODE).map(([regionId, saCode]) => {
  const region = SAUDI_REGIONS.find((item) => item.id === saCode);
  return {
    id: regionId as RegionId,
    saCode,
    name: region?.ar.replace("منطقة ", "") ?? regionId,
  };
});

const REGION_IDS = new Set(Object.keys(REGION_ID_TO_SA_CODE));
const HEATMAP_METRICS = new Set<HeatmapMetric>(HEATMAP_METRIC_OPTIONS.map((option) => option.value));

export function normalizeMapDisplaySettings(value: unknown): MapDisplaySettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return DEFAULT_MAP_DISPLAY_SETTINGS;
  }

  const raw = value as Partial<Record<keyof MapDisplaySettings, unknown>>;
  return {
    heatmapMetric:
      typeof raw.heatmapMetric === "string" && HEATMAP_METRICS.has(raw.heatmapMetric as HeatmapMetric)
        ? (raw.heatmapMetric as HeatmapMetric)
        : DEFAULT_MAP_DISPLAY_SETTINGS.heatmapMetric,
    defaultRegionId:
      typeof raw.defaultRegionId === "string" && REGION_IDS.has(raw.defaultRegionId)
        ? (raw.defaultRegionId as RegionId)
        : DEFAULT_MAP_DISPLAY_SETTINGS.defaultRegionId,
    showLegend: typeof raw.showLegend === "boolean" ? raw.showLegend : DEFAULT_MAP_DISPLAY_SETTINGS.showLegend,
    showFactoryList:
      typeof raw.showFactoryList === "boolean" ? raw.showFactoryList : DEFAULT_MAP_DISPLAY_SETTINGS.showFactoryList,
  };
}
