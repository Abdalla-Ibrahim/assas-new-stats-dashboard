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
};

/*
 * Accurate SVG paths for the 13 administrative regions of Saudi Arabia.
 * ViewBox: 0 0 820 660
 *
 * Geographic mapping (approximate):
 *   Longitude 35°E→57°E mapped to x  48→714
 *   Latitude  33°N→15°N mapped to y  36→632
 *
 * The outer silhouette closely traces the real border:
 *   NW Gulf of Aqaba → N border (Jordan/Iraq) → NE Kuwait →
 *   Persian Gulf coast → UAE → Oman SE → Yemen S →
 *   Jizan coast → Red Sea coast back to Gulf of Aqaba
 */
const REGIONS: RegionDef[] = [
  {
    id: "tabuk",
    name: "تبوك",
    // NW: Gulf of Aqaba + Red Sea coast + N border to Jordan
    path: "M 48,162 L 105,40 L 182,36 L 190,84 L 184,168 L 156,218 L 120,240 L 82,226 L 62,196 Z",
    labelX: 122,
    labelY: 148,
    totalSales: 2980,
  },
  {
    id: "jouf",
    name: "الجوف",
    // N, between Tabuk and Northern Borders
    path: "M 182,36 L 250,42 L 270,88 L 253,150 L 220,174 L 190,170 L 190,84 Z",
    labelX: 222,
    labelY: 105,
    totalSales: 2400,
  },
  {
    id: "northern",
    name: "الحدود الشمالية",
    // NE, along Iraq border
    path: "M 250,42 L 338,46 L 420,65 L 478,120 L 470,175 L 434,200 L 394,204 L 356,190 L 312,177 L 277,153 L 270,88 Z",
    labelX: 375,
    labelY: 120,
    totalSales: 2650,
  },
  {
    id: "hail",
    name: "حائل",
    // N center
    path: "M 190,170 L 220,174 L 253,150 L 270,88 L 277,153 L 312,177 L 356,190 L 394,204 L 434,200 L 450,235 L 425,290 L 382,314 L 330,320 L 280,300 L 244,264 L 216,224 L 184,212 Z",
    labelX: 318,
    labelY: 260,
    totalSales: 2620,
  },
  {
    id: "madinah",
    name: "المدينة المنورة",
    // W coast (Red Sea), large region
    path: "M 62,196 L 82,226 L 120,240 L 156,218 L 184,168 L 184,212 L 216,224 L 244,264 L 230,310 L 203,350 L 172,364 L 136,352 L 100,332 L 72,300 L 53,264 L 48,224 Z",
    labelX: 118,
    labelY: 295,
    totalSales: 12540,
  },
  {
    id: "qassim",
    name: "القصيم",
    // Center, between Ha'il (N) and Riyadh (S)
    path: "M 244,264 L 280,300 L 330,320 L 382,314 L 425,290 L 450,235 L 470,175 L 486,192 L 488,242 L 462,302 L 432,335 L 390,350 L 348,358 L 306,348 L 268,323 L 248,297 L 230,310 Z",
    labelX: 362,
    labelY: 308,
    totalSales: 5200,
  },
  {
    id: "eastern",
    name: "المنطقة الشرقية",
    // Entire E side: Gulf coast, largest region
    path: "M 470,175 L 478,120 L 486,192 L 508,238 L 555,293 L 574,316 L 568,335 L 590,348 L 608,352 L 714,354 L 706,428 L 658,530 L 575,578 L 450,612 L 420,600 L 440,570 L 454,540 L 462,498 L 456,450 L 445,405 L 440,360 L 440,335 L 462,302 L 488,242 Z",
    labelX: 620,
    labelY: 415,
    totalSales: 18540,
  },
  {
    id: "riyadh",
    name: "الرياض",
    // Central large region — capital
    path: "M 230,310 L 248,297 L 268,323 L 306,348 L 348,358 L 390,350 L 432,335 L 440,335 L 440,360 L 445,405 L 456,450 L 462,498 L 454,540 L 440,570 L 420,600 L 380,610 L 330,598 L 285,578 L 246,555 L 215,525 L 188,492 L 165,452 L 148,412 L 136,374 L 172,364 L 203,350 Z",
    labelX: 365,
    labelY: 465,
    totalSales: 22850,
  },
  {
    id: "makkah",
    name: "مكة المكرمة",
    // W coast — Jeddah / Makkah
    path: "M 53,264 L 72,300 L 100,332 L 136,352 L 148,374 L 148,412 L 165,452 L 188,492 L 175,514 L 148,528 L 115,518 L 88,492 L 62,458 L 42,422 L 36,382 L 38,336 Z",
    labelX: 90,
    labelY: 430,
    totalSales: 4350,
  },
  {
    id: "baha",
    name: "الباحة",
    // Tiny SW mountain region
    path: "M 188,492 L 215,502 L 225,520 L 216,537 L 200,537 L 183,520 Z",
    labelX: 207,
    labelY: 515,
    totalSales: 800,
  },
  {
    id: "asir",
    name: "عسير",
    // SW mountains, border with Yemen
    path: "M 175,514 L 188,492 L 183,520 L 200,537 L 216,537 L 225,520 L 215,502 L 215,525 L 246,555 L 268,580 L 248,592 L 215,584 L 180,568 L 150,548 L 136,530 L 132,518 L 148,528 Z",
    labelX: 205,
    labelY: 552,
    totalSales: 4920,
  },
  {
    id: "najran",
    name: "نجران",
    // S, along Yemen / Oman border
    path: "M 268,580 L 285,578 L 330,598 L 380,610 L 420,600 L 450,612 L 658,530 L 678,555 L 652,582 L 575,612 L 450,632 L 322,625 L 268,605 Z",
    labelX: 460,
    labelY: 600,
    totalSales: 2850,
  },
  {
    id: "jizan",
    name: "جازان",
    // SW coast, Red Sea, Yemen border — small but important
    path: "M 38,336 L 42,422 L 62,458 L 88,492 L 115,518 L 132,518 L 136,530 L 150,548 L 180,568 L 215,584 L 248,592 L 268,580 L 268,605 L 232,622 L 175,628 L 118,618 L 78,598 L 52,568 L 32,530 L 22,492 L 20,450 L 30,410 Z",
    labelX: 145,
    labelY: 582,
    totalSales: 2200,
  },
];

const formatNumber = (value: number) => new Intl.NumberFormat("ar-SA").format(value);

function getRegionFill(region: RegionDef, activeId: string | null) {
  if (activeId === region.id) return "#f5b800";
  const maxSales = Math.max(...REGIONS.map((r) => r.totalSales));
  const intensity = region.totalSales / maxSales;
  const lightness = Math.round(38 + (1 - intensity) * 28);
  const sat = Math.round(60 + intensity * 25);
  return `hsl(${100 + intensity * 15}, ${sat}%, ${lightness}%)`;
}

const FACTORY_PINS = CEMENT_FACTORIES.map((f) => {
  const region = REGIONS.find((r) => r.id === f.regionId);
  if (!region) return null;
  const hash = f.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const dx = (hash % 44) - 22;
  const dy = ((hash * 3) % 44) - 22;
  return { ...f, pinX: region.labelX + dx, pinY: region.labelY + dy };
}).filter(Boolean);

export function SaudiMap() {
  const [activeId, setActiveId] = useState<string>("riyadh");

  const activeRegion = useMemo(() => REGIONS.find((r) => r.id === activeId)!, [activeId]);
  const activeFactories = useMemo(() => FACTORY_BY_REGION[activeId] ?? [], [activeId]);
  const maxProduction = Math.max(...CEMENT_FACTORIES.map((f) => f.production2024));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      {/* MAP CARD */}
      <Card className="overflow-hidden border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl">
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
                <span className="h-2.5 w-2.5 rounded-sm bg-[#6fa832]" /> إنتاج مرتفع
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#a8b832]" /> إنتاج منخفض
              </span>
            </div>
          </div>

          {/* SVG MAP */}
          <div className="relative w-full overflow-hidden rounded-2xl" style={{ background: "#070c1a" }}>
            <svg viewBox="0 0 820 660" className="w-full" style={{ maxHeight: 500 }}>
              <defs>
                <filter id="map-glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="map-glow-gold">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="map-shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.6)" />
                </filter>
                {/* Sea gradient for surroundings */}
                <radialGradient id="sea-bg" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#0d1b2e" />
                  <stop offset="100%" stopColor="#070c1a" />
                </radialGradient>
              </defs>

              {/* Sea background */}
              <rect width="820" height="660" fill="url(#sea-bg)" />

              {/* Subtle grid lines to suggest geographic context */}
              {[100, 200, 300, 400, 500, 600, 700].map((x) => (
                <line key={`vg-${x}`} x1={x} y1="0" x2={x} y2="660" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
              ))}
              {[100, 200, 300, 400, 500, 600].map((y) => (
                <line key={`hg-${y}`} x1="0" y1={y} x2="820" y2={y} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
              ))}

              {/* Country outer glow / shadow */}
              <path
                d="M 48,162 L 105,40 L 182,36 L 250,42 L 338,46 L 420,65 L 478,120 L 486,192 L 508,238 L 555,293 L 574,316 L 568,335 L 590,348 L 608,352 L 714,354 L 706,428 L 658,530 L 575,578 L 450,612 L 330,598 L 268,580 L 268,605 L 232,622 L 175,628 L 118,618 L 78,598 L 52,568 L 32,530 L 22,492 L 20,450 L 30,410 L 38,336 L 36,382 L 42,422 L 62,458 L 88,492 L 62,196 Z"
                fill="none"
                stroke="rgba(245,184,0,0.18)"
                strokeWidth="4"
                filter="url(#map-glow-gold)"
              />

              {/* Regions */}
              {REGIONS.map((region) => {
                const isActive = region.id === activeId;
                const fontSize = region.totalSales > 5000 ? (isActive ? "14" : "12") : (isActive ? "12" : "10");
                const textFill = isActive ? "#0a1628" : "rgba(0,0,0,0.72)";
                return (
                  <g key={region.id} onClick={() => setActiveId(region.id)} className="cursor-pointer">
                    {/* Shadow copy for depth */}
                    <path
                      d={region.path}
                      fill="rgba(0,0,0,0.35)"
                      transform="translate(2,3)"
                    />
                    <path
                      d={region.path}
                      fill={getRegionFill(region, activeId)}
                      stroke={isActive ? "#f5b800" : "#0a0f1e"}
                      strokeWidth={isActive ? 2.5 : 1}
                      filter={isActive ? "url(#map-glow-gold)" : undefined}
                      style={{ opacity: isActive ? 1 : 0.88, transition: "all 0.25s" }}
                    />
                    {/* Region name label */}
                    <text
                      x={region.labelX}
                      y={region.labelY}
                      textAnchor="middle"
                      fontSize={fontSize}
                      fontWeight="900"
                      fill={textFill}
                      className="pointer-events-none select-none"
                      style={{ fontFamily: "Cairo, Tajawal, sans-serif" }}
                    >
                      {region.name}
                    </text>
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
                      <circle cx={pin.pinX} cy={pin.pinY} r="10" fill={pin.color} opacity="0.25">
                        <animate attributeName="r" values="10;18;10" dur="2.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="2.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      cx={pin.pinX}
                      cy={pin.pinY}
                      r={isInActive ? "5.5" : "3.5"}
                      fill={isInActive ? pin.color : "rgba(255,255,255,0.45)"}
                      stroke={isInActive ? "#fff" : "rgba(255,255,255,0.15)"}
                      strokeWidth={isInActive ? "1.5" : "1"}
                      filter={isInActive ? "url(#map-glow)" : undefined}
                    />
                  </g>
                );
              })}

              {/* Compass rose (bottom-left) */}
              <g transform="translate(42, 610)">
                <circle cx="0" cy="0" r="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <text x="0" y="-16" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" fontWeight="bold">N</text>
                <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <line x1="-10" y1="0" x2="10" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <polygon points="0,-9 -3,0 0,3 3,0" fill="rgba(245,184,0,0.7)" />
              </g>

              {/* Scale label */}
              <text x="780" y="650" textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.22)" style={{ fontFamily: "Cairo, sans-serif" }}>
                المملكة العربية السعودية
              </text>
            </svg>
          </div>

          {/* Region quick-select buttons */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all duration-200 ${
                  r.id === activeId
                    ? "bg-secondary text-slate-950 shadow-md shadow-secondary/30"
                    : "bg-white/8 text-white/65 hover:bg-white/16 hover:text-white"
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
        {/* Region header card */}
        <Card className="overflow-hidden border-secondary/25 shadow-2xl">
          <div className="bg-gradient-to-br from-primary via-primary/90 to-slate-900 p-6 text-white">
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
            <p className="mt-1 text-sm text-white/55">إجمالي إنتاج الإسمنت في المنطقة</p>
            <p className="mt-2 text-4xl font-black text-secondary">
              {formatNumber(activeRegion.totalSales)}
              <span className="mr-2 text-base text-white/50">ألف طن</span>
            </p>
            {activeFactories.length === 0 && (
              <div className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/65">
                لا يوجد مصنع إسمنت مسجّل في هذه المنطقة حالياً
              </div>
            )}
          </div>
        </Card>

        {/* Factory list */}
        {activeFactories.length > 0 && (
          <Card className="border-slate-700/50 bg-slate-900 shadow-lg">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Factory className="h-5 w-5 text-secondary" />
                <h4 className="font-black text-white">مصانع الإسمنت في {activeRegion.name}</h4>
              </div>
              <div className="space-y-3">
                {activeFactories.map((f, i) => {
                  const pct = (f.production2024 / maxProduction) * 100;
                  return (
                    <div key={f.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-bold text-slate-200">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-white">
                            {i + 1}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                            {f.name}
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">رمز: {f.symbol}</span>
                          <span className="font-black text-white">{formatNumber(f.production2024)} ألف طن</span>
                        </div>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: f.color }}
                        />
                      </div>
                      <div className="mt-0.5 flex justify-between text-[10px] text-slate-500">
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

        {/* Quick stats */}
        <Card className="border-slate-700/50 bg-slate-900 shadow-lg">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <h4 className="text-sm font-black text-white">نظرة سريعة على منطقة {activeRegion.name}</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "الطاقة الإنتاجية",
                  value: `${formatNumber(activeFactories.reduce((s, f) => s + f.capacity, 0))} ألف طن`,
                  color: "text-primary",
                },
                {
                  label: "الإنتاج الفعلي 2024",
                  value: `${formatNumber(activeFactories.reduce((s, f) => s + f.production2024, 0))} ألف طن`,
                  color: "text-secondary",
                },
                {
                  label: "متوسط سعر الكيس",
                  value: `${(activeFactories.reduce((s, f) => s + f.bagPrice, 0) / (activeFactories.length || 1)).toFixed(0)} ريال`,
                  color: "text-emerald-400",
                },
                {
                  label: "عدد الموظفين",
                  value: formatNumber(activeFactories.reduce((s, f) => s + f.employees, 0)),
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
