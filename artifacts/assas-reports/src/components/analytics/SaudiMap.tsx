import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, TrendingUp, Factory } from "lucide-react";
import { CEMENT_FACTORIES, FACTORY_BY_REGION } from "@/data/cementFactories";

type RegionDef = {
  id: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
  totalSales: number;
  fillColor: string;
};

// 13 administrative regions of Saudi Arabia - realistic SVG paths (viewBox 0 0 800 640)
const REGIONS: RegionDef[] = [
  {
    id: "tabuk",
    name: "تبوك",
    path: "M 15,105 L 80,12 L 180,0 L 205,88 L 178,178 L 118,215 L 60,205 L 20,178 Z",
    labelX: 112,
    labelY: 128,
    totalSales: 2980,
    fillColor: "#d97706",
  },
  {
    id: "jouf",
    name: "الجوف",
    path: "M 180,0 L 305,0 L 335,98 L 295,160 L 255,172 L 205,162 L 205,88 Z",
    labelX: 248,
    labelY: 88,
    totalSales: 2400,
    fillColor: "#4f46e5",
  },
  {
    id: "northern",
    name: "الحدود الشمالية",
    path: "M 305,0 L 475,105 L 455,195 L 405,205 L 365,188 L 335,172 L 335,98 Z",
    labelX: 393,
    labelY: 98,
    totalSales: 2650,
    fillColor: "#0891b2",
  },
  {
    id: "hail",
    name: "حائل",
    path: "M 205,162 L 255,172 L 295,160 L 335,172 L 365,188 L 405,205 L 455,195 L 468,255 L 438,308 L 385,328 L 325,330 L 272,300 L 233,260 L 202,225 Z",
    labelX: 328,
    labelY: 258,
    totalSales: 2620,
    fillColor: "#7c3aed",
  },
  {
    id: "madinah",
    name: "المدينة المنورة",
    path: "M 20,178 L 60,205 L 118,215 L 178,178 L 202,225 L 233,260 L 218,312 L 183,362 L 138,375 L 88,370 L 52,345 L 20,310 Z",
    labelX: 118,
    labelY: 295,
    totalSales: 12540,
    fillColor: "#0ea5e9",
  },
  {
    id: "qassim",
    name: "القصيم",
    path: "M 233,260 L 272,300 L 325,330 L 385,328 L 438,308 L 468,255 L 472,308 L 450,358 L 412,378 L 360,388 L 308,376 L 263,352 L 248,310 Z",
    labelX: 360,
    labelY: 335,
    totalSales: 5200,
    fillColor: "#7c3aed",
  },
  {
    id: "eastern",
    name: "المنطقة الشرقية",
    path: "M 455,195 L 475,105 L 515,148 L 550,192 L 648,292 L 768,392 L 800,438 L 785,545 L 705,562 L 645,555 L 585,550 L 522,552 L 478,528 L 468,475 L 468,420 L 462,368 L 450,358 L 472,308 L 468,255 Z",
    labelX: 628,
    labelY: 408,
    totalSales: 18540,
    fillColor: "#059669",
  },
  {
    id: "riyadh",
    name: "الرياض",
    path: "M 248,310 L 263,352 L 308,376 L 360,388 L 412,378 L 450,358 L 462,368 L 468,420 L 468,475 L 478,528 L 455,548 L 385,558 L 322,558 L 268,544 L 222,522 L 188,488 L 168,452 L 152,412 L 138,375 L 183,362 L 218,312 Z",
    labelX: 365,
    labelY: 462,
    totalSales: 22850,
    fillColor: "#15803d",
  },
  {
    id: "makkah",
    name: "مكة المكرمة",
    path: "M 20,310 L 52,345 L 88,370 L 138,375 L 152,412 L 168,452 L 162,498 L 133,518 L 92,508 L 52,482 L 24,452 L 15,402 L 15,348 Z",
    labelX: 92,
    labelY: 438,
    totalSales: 4350,
    fillColor: "#be185d",
  },
  {
    id: "baha",
    name: "الباحة",
    path: "M 188,488 L 218,498 L 228,518 L 218,535 L 202,535 L 185,518 Z",
    labelX: 207,
    labelY: 515,
    totalSales: 800,
    fillColor: "#92400e",
  },
  {
    id: "asir",
    name: "عسير",
    path: "M 162,498 L 188,488 L 185,518 L 202,535 L 218,535 L 228,518 L 218,498 L 222,522 L 268,544 L 290,578 L 252,590 L 213,582 L 178,565 L 148,548 L 133,528 L 133,518 Z",
    labelX: 208,
    labelY: 550,
    totalSales: 4920,
    fillColor: "#b45309",
  },
  {
    id: "najran",
    name: "نجران",
    path: "M 268,544 L 322,558 L 385,558 L 455,548 L 478,528 L 522,552 L 585,550 L 645,555 L 665,578 L 622,598 L 545,612 L 452,618 L 372,612 L 312,598 L 290,578 Z",
    labelX: 458,
    labelY: 585,
    totalSales: 2850,
    fillColor: "#d97706",
  },
  {
    id: "jizan",
    name: "جازان",
    path: "M 24,452 L 52,482 L 92,508 L 133,518 L 133,528 L 148,548 L 178,565 L 213,582 L 252,590 L 290,578 L 312,598 L 312,620 L 262,628 L 192,622 L 132,608 L 88,588 L 62,562 L 38,528 L 18,495 L 15,455 Z",
    labelX: 172,
    labelY: 590,
    totalSales: 2200,
    fillColor: "#dc2626",
  },
];

const formatNumber = (value: number) => new Intl.NumberFormat("ar-SA").format(value);

// Color intensity based on sales
function getRegionFill(region: RegionDef, activeId: string | null) {
  if (activeId === region.id) return "#f5b800";
  const maxSales = Math.max(...REGIONS.map((r) => r.totalSales));
  const intensity = region.totalSales / maxSales;
  // Mix from olive-green (low) to dark-green (high)
  const lightness = Math.round(45 + (1 - intensity) * 30);
  return `hsl(${88 + intensity * 20}, ${65 + intensity * 20}%, ${lightness}%)`;
}

// Factory locations for pins
const FACTORY_PINS = CEMENT_FACTORIES.map((f) => {
  const region = REGIONS.find((r) => r.id === f.regionId);
  if (!region) return null;
  // Scatter around label center
  const hash = f.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const dx = ((hash % 60) - 30);
  const dy = (((hash * 3) % 60) - 30);
  return { ...f, pinX: region.labelX + dx, pinY: region.labelY + dy };
}).filter(Boolean);

export function SaudiMap() {
  const [activeId, setActiveId] = useState<string>("riyadh");

  const activeRegion = useMemo(() => REGIONS.find((r) => r.id === activeId)!, [activeId]);
  const activeFactories = useMemo(() => FACTORY_BY_REGION[activeId] ?? [], [activeId]);
  const maxProduction = Math.max(...CEMENT_FACTORIES.map((f) => f.production2024));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      {/* MAP CARD */}
      <Card className="overflow-hidden border-slate-200 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-secondary">خريطة تفاعلية</p>
              <h3 className="text-lg font-black text-white">مناطق المملكة العربية السعودية الـ13</h3>
            </div>
            <div className="flex flex-col items-end gap-1 text-[10px] text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-secondary" /> المنطقة المختارة
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#84cc16]" /> إنتاج مرتفع
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#ca8a04]" /> إنتاج منخفض
              </span>
            </div>
          </div>

          {/* SVG MAP */}
          <div className="relative w-full overflow-hidden rounded-2xl" style={{ background: "#0a0f1e" }}>
            <svg viewBox="0 0 800 640" className="w-full" style={{ maxHeight: 480 }}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-gold">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background */}
              <rect width="800" height="640" fill="#0a0f1e" />

              {/* Regions */}
              {REGIONS.map((region) => {
                const isActive = region.id === activeId;
                return (
                  <g key={region.id}>
                    <path
                      d={region.path}
                      fill={getRegionFill(region, activeId)}
                      stroke={isActive ? "#f5b800" : "#0a0f1e"}
                      strokeWidth={isActive ? 3 : 1.5}
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setActiveId(region.id)}
                      filter={isActive ? "url(#glow-gold)" : undefined}
                      style={{ opacity: isActive ? 1 : 0.82 }}
                    />
                    {/* Region labels - only show name for larger regions */}
                    {region.totalSales > 2000 && (
                      <text
                        x={region.labelX}
                        y={region.labelY}
                        textAnchor="middle"
                        fontSize={isActive ? "15" : "13"}
                        fontWeight="800"
                        fill={isActive ? "#1e3a8a" : "rgba(0,0,0,0.75)"}
                        className="pointer-events-none select-none"
                        style={{ fontFamily: "Cairo, sans-serif" }}
                      >
                        {region.name}
                      </text>
                    )}
                    {region.totalSales <= 2000 && (
                      <text
                        x={region.labelX}
                        y={region.labelY}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill={isActive ? "#1e3a8a" : "rgba(0,0,0,0.7)"}
                        className="pointer-events-none select-none"
                        style={{ fontFamily: "Cairo, sans-serif" }}
                      >
                        {region.name}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Factory pins */}
              {FACTORY_PINS.map((pin) => {
                if (!pin) return null;
                const isInActive = pin.regionId === activeId;
                return (
                  <g key={pin.id} className="pointer-events-none">
                    {isInActive && (
                      <circle cx={pin.pinX} cy={pin.pinY} r="10" fill={pin.color} opacity="0.3">
                        <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      cx={pin.pinX}
                      cy={pin.pinY}
                      r={isInActive ? "6" : "4"}
                      fill={isInActive ? pin.color : "rgba(255,255,255,0.4)"}
                      stroke={isInActive ? "#fff" : "rgba(255,255,255,0.2)"}
                      strokeWidth={isInActive ? "2" : "1"}
                      filter={isInActive ? "url(#glow)" : undefined}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Region buttons */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                  r.id === activeId
                    ? "bg-secondary text-secondary-foreground shadow-lg"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DETAIL PANEL */}
      <div className="space-y-4">
        <Card className="border-secondary/30 bg-gradient-to-br from-primary to-primary/80 text-white shadow-2xl">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                <MapPin className="h-4 w-4" />
                المنطقة المختارة
              </div>
              <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold text-secondary">
                {activeFactories.length} مصنع
              </span>
            </div>
            <h3 className="text-3xl font-black">{activeRegion.name}</h3>
            <p className="mt-1 text-sm text-white/60">إجمالي إنتاج الإسمنت في المنطقة</p>
            <p className="mt-1 text-4xl font-black text-secondary">
              {formatNumber(activeRegion.totalSales)}
              <span className="mr-2 text-lg text-white/60">ألف طن</span>
            </p>
            {activeFactories.length === 0 && (
              <div className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/70">
                لا يوجد مصنع إسمنت مسجّل في هذه المنطقة حالياً
              </div>
            )}
          </CardContent>
        </Card>

        {activeFactories.length > 0 && (
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Factory className="h-5 w-5 text-primary" />
                <h4 className="font-black text-slate-950">مصانع الإسمنت في {activeRegion.name}</h4>
              </div>
              <div className="space-y-3">
                {activeFactories.map((f, i) => {
                  const pct = (f.production2024 / maxProduction) * 100;
                  return (
                    <div key={f.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-bold text-slate-700">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black">
                            {i + 1}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                            {f.name}
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">رمز: {f.symbol}</span>
                          <span className="font-black text-slate-900">{formatNumber(f.production2024)} ألف طن</span>
                        </div>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: f.color }}
                        />
                      </div>
                      <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
                        <span>طاقة: {formatNumber(f.capacity)} ألف طن</span>
                        <span>سعر السهم: {f.stockPrice} ريال</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h4 className="text-sm font-black text-slate-950">نظرة سريعة على أداء منطقة {activeRegion.name}</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "إجمالي الطاقة الإنتاجية", value: `${formatNumber(activeFactories.reduce((s, f) => s + f.capacity, 0))} ألف طن`, color: "text-primary" },
                { label: "الإنتاج الفعلي 2024", value: `${formatNumber(activeFactories.reduce((s, f) => s + f.production2024, 0))} ألف طن`, color: "text-secondary" },
                { label: "متوسط سعر الكيس", value: `${(activeFactories.reduce((s, f) => s + f.bagPrice, 0) / (activeFactories.length || 1)).toFixed(2)} ريال`, color: "text-emerald-600" },
                { label: "عدد الموظفين", value: formatNumber(activeFactories.reduce((s, f) => s + f.employees, 0)), color: "text-purple-600" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-500">{item.label}</p>
                  <p className={`text-sm font-black ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
