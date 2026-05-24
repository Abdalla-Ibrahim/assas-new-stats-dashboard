import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, TrendingUp, Factory, Info } from "lucide-react";
import { useCementFactories } from "@/contexts/FactoriesContext";

type RegionDef = {
  id: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
  totalSales: number;
};

/*
 * SVG map of Saudi Arabia's 13 administrative regions.
 * ViewBox: 0 0 820 680
 *
 * Coordinate mapping (approximate):
 *   Longitude 34.5°E → 56°E  mapped to  x: 10 → 810  (37.1 px/°)
 *   Latitude  33°N   → 15°N  mapped to  y: 10 → 670  (36.7 px/°)
 *
 *   x(lon) = (lon - 34.5) × 37.1 + 10
 *   y(lat) = (33 - lat) × 36.7 + 10
 *
 * Outer Saudi silhouette major waypoints (clockwise from Gulf of Aqaba):
 *   Gulf of Aqaba N (29.5°N,34.9°E)→(28,160)  Jordan border NE →
 *   Iraq border (32°N,38.5°E)→(160,38) → Northern Borders E (32°N,46°E)→(456,38) →
 *   Kuwait/Gulf (28.5°N,48°E)→(519,162) → Gulf coast S → Qatar (25.5°N,51°E)→(631,276) →
 *   UAE border → Oman SE (22°N,55.5°E)→(785,404) → Yemen border W →
 *   Jizan (16.5°N,42.5°E)→(304,610) → Red Sea coast N → Gulf of Aqaba
 */
const REGIONS: RegionDef[] = [
  {
    id: "tabuk",
    name: "تبوك",
    /*
     * Covers NW Saudi: Gulf of Aqaba coast, Jordan border,
     * east to ~38°E, south to ~27°N
     */
    path: [
      "M 28,160",
      "L 38,142 L 52,120 L 68,100 L 88,76 L 108,58 L 132,42",
      "L 165,52 L 160,98 L 142,148 L 122,195 L 102,232",
      "L 86,240 L 72,205 L 58,175",
      "Z",
    ].join(" "),
    labelX: 100,
    labelY: 158,
    totalSales: 2980,
  },
  {
    id: "jouf",
    name: "الجوف",
    /*
     * N interior: Jordan/Iraq border, between Tabuk and Northern Borders.
     * E to ~42°E, S to ~29.5°N
     */
    path: [
      "M 132,42",
      "L 168,36 L 248,32 L 298,32",
      "L 295,78 L 278,112 L 255,135 L 225,148 L 198,145 L 172,132 L 162,98 L 165,52",
      "Z",
    ].join(" "),
    labelX: 222,
    labelY: 105,
    totalSales: 2400,
  },
  {
    id: "northern",
    name: "الحدود الشمالية",
    /*
     * Northernmost strip: Iraq border from ~42°E to ~47°E, Kuwait junction
     */
    path: [
      "M 298,32",
      "L 362,34 L 408,52 L 445,75 L 465,96 L 448,112 L 415,110 L 382,112 L 348,118 L 318,115 L 295,110 L 295,78",
      "Z",
    ].join(" "),
    labelX: 382,
    labelY: 80,
    totalSales: 2650,
  },
  {
    id: "hail",
    name: "حائل",
    /*
     * Central-N: bounded by Jouf/Northern Borders (N),
     * Madinah (W), Qassim (E), Qassim/Riyadh (S)
     * Roughly 26°N–30°N, 38°E–44°E
     */
    path: [
      "M 162,98 L 172,132 L 198,145 L 225,148 L 255,135 L 278,112 L 295,110 L 318,115 L 348,118 L 382,112 L 415,110 L 448,112",
      "L 440,162 L 420,205 L 395,230 L 362,248 L 325,255 L 292,260 L 262,260 L 232,255 L 206,250 L 182,242 L 162,240",
      "L 158,198 L 142,148 L 160,98",
      "Z",
    ].join(" "),
    labelX: 308,
    labelY: 208,
    totalSales: 2620,
  },
  {
    id: "madinah",
    name: "المدينة المنورة",
    /*
     * W coast: Red Sea from ~27°N to ~24°N,
     * inland to ~38°E
     */
    path: [
      "M 86,240",
      "L 102,232 L 122,195 L 142,148 L 158,198 L 162,240 L 182,242 L 206,250 L 200,302 L 182,352 L 158,392 L 132,358 L 112,320 L 98,280",
      "Z",
    ].join(" "),
    labelX: 150,
    labelY: 302,
    totalSales: 12540,
  },
  {
    id: "qassim",
    name: "القصيم",
    /*
     * Center: between Hail (N), Eastern (E), Riyadh (S), Madinah/Hail (W)
     * Roughly 25°N–27°N, 42°E–46°E
     */
    path: [
      "M 292,260",
      "L 325,255 L 362,248 L 395,230 L 420,205 L 440,162 L 465,178 L 478,218 L 480,258 L 465,298 L 438,322 L 405,340 L 368,345 L 332,342 L 298,332 L 275,315 L 262,298 L 262,260",
      "Z",
    ].join(" "),
    labelX: 368,
    labelY: 302,
    totalSales: 5200,
  },
  {
    id: "eastern",
    name: "المنطقة الشرقية",
    /*
     * E: entire Arabian Gulf coast, from Kuwait junction to UAE.
     * Largest region by area — includes all Gulf coast.
     */
    path: [
      "M 448,112",
      "L 465,96 L 445,75 L 476,96 L 495,118 L 505,148 L 516,178 L 525,205 L 535,228 L 550,248 L 568,265 L 585,275 L 602,285 L 620,298 L 640,322 L 655,352 L 668,382 L 662,415 L 645,448 L 620,448 L 592,445 L 562,440 L 530,438 L 500,428 L 475,415 L 455,398 L 440,372 L 435,348 L 438,322 L 465,298 L 480,258 L 478,218 L 465,178 L 440,162",
      "Z",
    ].join(" "),
    labelX: 572,
    labelY: 355,
    totalSales: 18540,
  },
  {
    id: "riyadh",
    name: "الرياض",
    /*
     * Central: by far the largest by population.
     * Borders Qassim (N), Eastern (E), Najran (S), Makkah/Asir (W)
     */
    path: [
      "M 262,298",
      "L 275,315 L 298,332 L 332,342 L 368,345 L 405,340 L 438,322 L 435,348 L 440,372 L 455,398 L 475,415 L 500,428 L 530,438 L 502,492 L 475,528 L 445,548 L 408,555 L 372,555 L 335,548 L 298,542 L 270,530 L 242,510 L 220,488 L 205,462 L 194,432 L 192,402 L 198,368 L 210,340 L 222,315 L 232,295 L 262,260 L 262,298",
      "Z",
    ].join(" "),
    labelX: 372,
    labelY: 455,
    totalSales: 22850,
  },
  {
    id: "makkah",
    name: "مكة المكرمة",
    /*
     * W: Red Sea coast (Jeddah/Makkah), between Madinah (N) and Asir/Baha (S)
     * Includes the Hejaz coastal strip
     */
    path: [
      "M 98,280",
      "L 112,320 L 132,358 L 158,392 L 182,352 L 200,302 L 206,250 L 232,255 L 262,260 L 232,295 L 222,315 L 210,340 L 198,368 L 192,402 L 194,432 L 180,448 L 162,462 L 142,462 L 122,452 L 108,428 L 95,405 L 85,378 L 72,352 L 65,322",
      "Z",
    ].join(" "),
    labelX: 158,
    labelY: 390,
    totalSales: 4350,
  },
  {
    id: "baha",
    name: "الباحة",
    /*
     * Tiny SW mountain region between Makkah and Asir
     */
    path: [
      "M 194,432",
      "L 205,462 L 220,488 L 208,495 L 192,478 L 175,462 L 162,462 L 180,448",
      "Z",
    ].join(" "),
    labelX: 198,
    labelY: 468,
    totalSales: 800,
  },
  {
    id: "asir",
    name: "عسير",
    /*
     * SW mountains: between Makkah/Baha (N), Najran (E), Jizan (S)
     */
    path: [
      "M 220,488",
      "L 242,510 L 270,530 L 298,542 L 302,558 L 272,562 L 242,555 L 215,542 L 196,520 L 178,498 L 165,480 L 175,462 L 192,478 L 208,495",
      "Z",
    ].join(" "),
    labelX: 245,
    labelY: 528,
    totalSales: 4920,
  },
  {
    id: "najran",
    name: "نجران",
    /*
     * S: along Yemen border from Riyadh SE corner to Asir
     */
    path: [
      "M 298,542",
      "L 335,548 L 372,555 L 408,555 L 445,548 L 475,528 L 502,492 L 495,515 L 480,538 L 462,552 L 432,560 L 398,565 L 362,565 L 328,560 L 302,558",
      "Z",
    ].join(" "),
    labelX: 398,
    labelY: 548,
    totalSales: 2850,
  },
  {
    id: "jizan",
    name: "جازان",
    /*
     * SW Red Sea coast strip, Yemen border — smallest area but strategic
     */
    path: [
      "M 108,428",
      "L 122,452 L 142,462 L 162,462 L 165,480 L 178,498 L 196,520 L 215,542 L 242,555 L 272,562 L 302,558 L 328,560 L 325,575 L 302,582 L 268,585 L 232,578 L 198,562 L 170,540 L 148,518 L 130,492 L 112,468 L 98,445",
      "Z",
    ].join(" "),
    labelX: 215,
    labelY: 550,
    totalSales: 2200,
  },
];

/* Accurate outer border path for glow / shadow effect */
const OUTER_PATH = [
  "M 28,160",
  "L 38,142 L 52,120 L 68,100 L 88,76 L 108,58 L 132,42",
  "L 168,36 L 248,32 L 298,32 L 362,34 L 408,52 L 445,75",
  "L 476,96 L 495,118 L 505,148 L 516,178 L 525,205 L 535,228",
  "L 550,248 L 568,265 L 585,275 L 602,285 L 620,298",
  "L 640,322 L 655,352 L 668,382 L 662,415 L 645,448",
  "L 620,480 L 578,510 L 530,530 L 475,542 L 422,548 L 362,548",
  "L 298,542 L 272,562 L 302,582 L 268,585 L 232,578",
  "L 198,562 L 170,540 L 148,518 L 130,492 L 112,468 L 98,445",
  "L 85,378 L 72,352 L 65,322 L 98,280 L 86,240 L 72,205 L 58,175",
  "Z",
].join(" ");

const formatNumber = (value: number) => new Intl.NumberFormat("ar-SA").format(value);

function getRegionFill(region: RegionDef, activeId: string | null) {
  if (activeId === region.id) return "#f5b800";
  const maxSales = Math.max(...REGIONS.map((r) => r.totalSales));
  const intensity = region.totalSales / maxSales;
  // green-teal gradient for production intensity
  const hue = 168 + intensity * 18;
  const sat = Math.round(45 + intensity * 30);
  const light = Math.round(28 + (1 - intensity) * 22);
  return `hsl(${hue},${sat}%,${light}%)`;
}

export function SaudiMap() {
  const { factories, FACTORY_BY_REGION } = useCementFactories();
  const [activeId, setActiveId] = useState<string>("riyadh");

  const activeRegion = useMemo(() => REGIONS.find((r) => r.id === activeId)!, [activeId]);
  const activeFactories = useMemo(() => FACTORY_BY_REGION[activeId] ?? [], [FACTORY_BY_REGION, activeId]);
  const FACTORY_PINS = useMemo(
    () =>
      factories
        .map((f) => {
          const region = REGIONS.find((r) => r.id === f.regionId);
          if (!region) return null;
          const hash = f.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
          const dx = (hash % 38) - 19;
          const dy = ((hash * 3) % 38) - 19;
          return { ...f, pinX: region.labelX + dx, pinY: region.labelY + dy };
        })
        .filter(Boolean),
    [factories],
  );
  const maxProduction = Math.max(...factories.map((f) => f.production2024));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
      {/* ── MAP CARD ── */}
      <Card className="overflow-hidden border-slate-700/50 bg-gradient-to-br from-[#060d1a] to-slate-950 shadow-2xl">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-secondary uppercase">خريطة تفاعلية</p>
              <h3 className="text-lg font-black text-white">مناطق المملكة العربية السعودية الـ13</h3>
            </div>
            <div className="flex flex-col items-end gap-1 text-[10px] text-white/45">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-secondary" /> المنطقة المختارة
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(180,65%,32%)" }} /> إنتاج مرتفع
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(172,50%,42%)" }} /> إنتاج منخفض
              </span>
            </div>
          </div>

          {/* SVG MAP */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/5" style={{ background: "radial-gradient(ellipse at 60% 40%, #0d1f3c 0%, #060c18 100%)" }}>
            <svg viewBox="0 0 820 640" className="w-full" style={{ maxHeight: 480, display: "block" }}>
              <defs>
                <filter id="sm-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="sm-glow-gold" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="sm-shadow">
                  <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.7)" />
                </filter>
                <radialGradient id="sea-bg" cx="55%" cy="40%" r="65%">
                  <stop offset="0%" stopColor="#0d1f3a" />
                  <stop offset="100%" stopColor="#060c18" />
                </radialGradient>
                {/* subtle water-ripple pattern */}
                <pattern id="water-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0,20 Q10,15 20,20 Q30,25 40,20" fill="none" stroke="rgba(100,180,255,0.06)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Sea background */}
              <rect width="820" height="640" fill="url(#sea-bg)" />
              <rect width="820" height="640" fill="url(#water-pat)" />

              {/* Subtle lat/lon grid */}
              {[100, 200, 300, 400, 500, 600, 700].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="640" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
              ))}
              {[100, 200, 300, 400, 500, 600].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="820" y2={y} stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
              ))}

              {/* Red Sea label */}
              <text x="32" y="340" fontSize="9" fill="rgba(140,200,255,0.3)" transform="rotate(-75,32,340)" style={{ fontFamily: "Cairo,Tajawal,sans-serif", letterSpacing: 2 }}>البحر الأحمر</text>

              {/* Arabian Gulf label */}
              <text x="628" y="215" fontSize="9" fill="rgba(140,200,255,0.3)" transform="rotate(40,628,215)" style={{ fontFamily: "Cairo,Tajawal,sans-serif", letterSpacing: 2 }}>الخليج العربي</text>

              {/* Outer glow / border */}
              <path
                d={OUTER_PATH}
                fill="none"
                stroke="rgba(245,184,0,0.25)"
                strokeWidth="3.5"
                filter="url(#sm-glow-gold)"
              />

              {/* Region polygons */}
              {REGIONS.map((region) => {
                const isActive = region.id === activeId;
                const fill = getRegionFill(region, activeId);
                const bigRegion = region.totalSales > 8000;
                const fontSize = bigRegion ? (isActive ? 13 : 11) : (isActive ? 11 : 9);
                return (
                  <g key={region.id} onClick={() => setActiveId(region.id)} className="cursor-pointer">
                    {/* depth shadow */}
                    <path d={region.path} fill="rgba(0,0,0,0.4)" transform="translate(2,3)" />
                    {/* region fill */}
                    <path
                      d={region.path}
                      fill={fill}
                      stroke={isActive ? "#f5b800" : "rgba(0,0,0,0.55)"}
                      strokeWidth={isActive ? 2.5 : 0.8}
                      filter={isActive ? "url(#sm-glow-gold)" : "url(#sm-shadow)"}
                      style={{ opacity: isActive ? 1 : 0.9, transition: "all 0.22s" }}
                    />
                    {/* inner highlight */}
                    <path
                      d={region.path}
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                      transform="translate(-1,-1)"
                    />
                    {/* label */}
                    <text
                      x={region.labelX}
                      y={region.labelY}
                      textAnchor="middle"
                      fontSize={fontSize}
                      fontWeight="900"
                      fill={isActive ? "#0a1628" : "rgba(255,255,255,0.88)"}
                      className="pointer-events-none select-none"
                      style={{ fontFamily: "Cairo,Tajawal,sans-serif", textShadow: isActive ? "none" : "0 1px 3px rgba(0,0,0,0.8)" }}
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
                      <circle cx={pin.pinX} cy={pin.pinY} r="12" fill={pin.color} opacity="0.22">
                        <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      cx={pin.pinX}
                      cy={pin.pinY}
                      r={isInActive ? 5.5 : 3}
                      fill={isInActive ? pin.color : "rgba(255,255,255,0.4)"}
                      stroke={isInActive ? "#fff" : "rgba(0,0,0,0.3)"}
                      strokeWidth={isInActive ? 1.5 : 0.8}
                      filter={isInActive ? "url(#sm-glow)" : undefined}
                    />
                  </g>
                );
              })}

              {/* Compass rose */}
              <g transform="translate(44,598)">
                <circle r="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <text y="-20" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.38)" fontWeight="bold">N</text>
                <polygon points="0,-12 -3.5,0 0,4 3.5,0" fill="rgba(245,184,0,0.8)" />
                <polygon points="0,12 -3.5,0 0,-4 3.5,0" fill="rgba(255,255,255,0.22)" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
              </g>

              {/* Scale bar */}
              <g transform="translate(650,618)">
                <line x1="0" y1="0" x2="80" y2="0" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <line x1="80" y1="-4" x2="80" y2="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <text x="40" y="-6" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)" style={{ fontFamily: "Cairo,sans-serif" }}>٨٠٠ كم</text>
              </g>

              <text x="806" y="634" textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.18)" style={{ fontFamily: "Cairo,sans-serif" }}>المملكة العربية السعودية</text>
            </svg>
          </div>

          {/* Region quick-select */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all duration-200 ${
                  r.id === activeId
                    ? "bg-secondary text-slate-950 shadow-md shadow-secondary/30"
                    : "bg-white/8 text-white/60 hover:bg-white/15 hover:text-white"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── DETAIL PANEL ── */}
      <div className="space-y-4">
        {/* Region header */}
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
            <h3 className="text-3xl font-black">{activeRegion.name}</h3>
            <p className="mt-1 text-sm text-white/50">إجمالي إنتاج الإسمنت في المنطقة</p>
            <p className="mt-2 text-4xl font-black text-secondary">
              {formatNumber(activeRegion.totalSales)}
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
                  const util = Math.round((f.production2024 / f.capacity) * 100);
                  return (
                    <div key={f.id}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-bold text-slate-200">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-white">{i + 1}</span>
                          <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                          {f.name}
                        </span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className={`rounded-full px-2 py-0.5 font-black ${util >= 90 ? "bg-emerald-900/50 text-emerald-400" : util >= 75 ? "bg-amber-900/50 text-amber-400" : "bg-red-900/40 text-red-400"}`}>
                            {util}% استغلال
                          </span>
                          <span className="font-black text-white">{formatNumber(f.production2024)} ألف طن</span>
                        </div>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: f.color }} />
                      </div>
                      <div className="mt-0.5 flex justify-between text-[10px] text-slate-500">
                        <span>طاقة: {formatNumber(f.capacity)} ألف طن</span>
                        <span>
                          {f.listed
                        ? `السهم: ${Number(f.stockPrice).toFixed(2)} ريال (${f.change >= 0 ? "+" : ""}${Number(f.changePct).toFixed(2)}%)`
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

        {/* Quick stats */}
        <Card className="border-slate-700/50 bg-slate-900 shadow-lg">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <h4 className="text-sm font-black text-white">مؤشرات منطقة {activeRegion.name}</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "الطاقة الإنتاجية",
                  value: `${formatNumber(activeFactories.reduce((s, f) => s + f.capacity, 0))} ألف طن`,
                  color: "text-sky-400",
                },
                {
                  label: "الإنتاج الفعلي 2024",
                  value: `${formatNumber(activeFactories.reduce((s, f) => s + f.production2024, 0))} ألف طن`,
                  color: "text-secondary",
                },
                {
                  label: "متوسط سعر الكيس",
                  value: activeFactories.length
                        ? `${Number(activeFactories.reduce((s, f) => s + f.bagPrice, 0) / activeFactories.length).toFixed(2)} ريال`
                    : "—",
                  color: "text-emerald-400",
                },
                {
                  label: "نسبة الاستغلال",
                  value: activeFactories.length
                    ? `${Math.round((activeFactories.reduce((s, f) => s + f.production2024, 0) / activeFactories.reduce((s, f) => s + f.capacity, 0)) * 100)}%`
                    : "—",
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
