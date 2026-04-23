import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, TrendingUp, Building2 } from "lucide-react";

type Region = {
  id: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
  sales: number;
  topCompany: string;
  share: number;
  companies: { name: string; sales: number; color: string }[];
};

const REGIONS: Region[] = [
  {
    id: "riyadh",
    name: "الرياض",
    path: "M 320,210 L 430,200 L 470,260 L 460,330 L 380,360 L 310,330 L 290,270 Z",
    labelX: 380,
    labelY: 285,
    sales: 1850,
    topCompany: "أساس الإعمار",
    share: 28,
    companies: [
      { name: "أساس الإعمار", sales: 520, color: "#1e3a8a" },
      { name: "أسمنت اليمامة", sales: 510, color: "#f5b800" },
      { name: "أسمنت القصيم", sales: 420, color: "#0ea5e9" },
      { name: "أسمنت الرياض", sales: 400, color: "#10b981" },
    ],
  },
  {
    id: "eastern",
    name: "الشرقية",
    path: "M 470,180 L 560,170 L 600,260 L 580,360 L 470,360 L 460,260 Z",
    labelX: 525,
    labelY: 270,
    sales: 1420,
    topCompany: "أسمنت السعودية",
    share: 24,
    companies: [
      { name: "أسمنت السعودية", sales: 580, color: "#1e3a8a" },
      { name: "أساس الإعمار", sales: 380, color: "#f5b800" },
      { name: "أسمنت الشرقية", sales: 290, color: "#0ea5e9" },
      { name: "أسمنت اليمامة", sales: 170, color: "#10b981" },
    ],
  },
  {
    id: "western",
    name: "الغربية",
    path: "M 130,220 L 290,210 L 310,330 L 240,400 L 150,380 L 100,300 Z",
    labelX: 200,
    labelY: 305,
    sales: 1620,
    topCompany: "أسمنت ينبع",
    share: 31,
    companies: [
      { name: "أسمنت ينبع", sales: 620, color: "#1e3a8a" },
      { name: "أسمنت السعودية", sales: 410, color: "#f5b800" },
      { name: "أساس الإعمار", sales: 340, color: "#0ea5e9" },
      { name: "أسمنت اليمامة", sales: 250, color: "#10b981" },
    ],
  },
  {
    id: "northern",
    name: "الشمالية",
    path: "M 200,80 L 380,70 L 460,150 L 470,200 L 320,210 L 200,180 Z",
    labelX: 320,
    labelY: 130,
    sales: 680,
    topCompany: "أساس الإعمار",
    share: 35,
    companies: [
      { name: "أساس الإعمار", sales: 240, color: "#1e3a8a" },
      { name: "أسمنت القصيم", sales: 180, color: "#f5b800" },
      { name: "أسمنت اليمامة", sales: 150, color: "#0ea5e9" },
      { name: "أسمنت الشرقية", sales: 110, color: "#10b981" },
    ],
  },
  {
    id: "southern",
    name: "الجنوبية",
    path: "M 240,400 L 380,360 L 470,360 L 480,460 L 380,510 L 270,490 Z",
    labelX: 370,
    labelY: 435,
    sales: 950,
    topCompany: "أسمنت الجنوبية",
    share: 38,
    companies: [
      { name: "أسمنت الجنوبية", sales: 360, color: "#1e3a8a" },
      { name: "أسمنت السعودية", sales: 220, color: "#f5b800" },
      { name: "أساس الإعمار", sales: 200, color: "#0ea5e9" },
      { name: "أسمنت ينبع", sales: 170, color: "#10b981" },
    ],
  },
];

const BRANCHES = [
  { id: "riyadh", x: 380, y: 285, name: "المقر الرئيسي - الرياض" },
  { id: "dammam", x: 540, y: 245, name: "فرع الدمام" },
  { id: "hafr", x: 500, y: 175, name: "حفر الباطن" },
];

const formatNumber = (value: number) => new Intl.NumberFormat("ar-SA").format(value);

export function SaudiMap() {
  const [activeId, setActiveId] = useState<string>("riyadh");
  const active = useMemo(() => REGIONS.find((r) => r.id === activeId)!, [activeId]);
  const maxSales = Math.max(...REGIONS.map((r) => r.sales));

  const getRegionColor = (region: Region) => {
    const intensity = region.sales / maxSales;
    if (region.id === activeId) return "#f5b800";
    return `rgba(30, 58, 138, ${0.35 + intensity * 0.55})`;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card className="overflow-hidden border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-xl">
        <CardContent className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-secondary">خريطة تفاعلية</p>
              <h3 className="text-xl font-black text-slate-950">توزيع المبيعات حسب مناطق المملكة</h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-secondary" /> منطقة محددة
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-primary/60" /> كثافة المبيعات
              </span>
            </div>
          </div>
          <div className="relative aspect-[7/6] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-50 to-amber-50/40">
            <svg viewBox="0 0 700 580" className="h-full w-full">
              <defs>
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#1e3a8a" opacity="0.08" />
                </pattern>
              </defs>
              <rect width="700" height="580" fill="url(#dots)" />

              {REGIONS.map((region) => (
                <g key={region.id}>
                  <path
                    d={region.path}
                    fill={getRegionColor(region)}
                    stroke={region.id === activeId ? "#1e3a8a" : "#fff"}
                    strokeWidth={region.id === activeId ? 3 : 2}
                    className="cursor-pointer transition-all duration-300 hover:opacity-90"
                    onClick={() => setActiveId(region.id)}
                    style={{ filter: region.id === activeId ? "drop-shadow(0 6px 18px rgba(245,184,0,0.45))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.08))" }}
                  />
                  <text
                    x={region.labelX}
                    y={region.labelY}
                    textAnchor="middle"
                    fontSize="20"
                    fontWeight="900"
                    fill={region.id === activeId ? "#1e3a8a" : "#fff"}
                    className="pointer-events-none select-none"
                    style={{ fontFamily: "Cairo, sans-serif" }}
                  >
                    {region.name}
                  </text>
                  <text
                    x={region.labelX}
                    y={region.labelY + 22}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill={region.id === activeId ? "#1e3a8a" : "rgba(255,255,255,0.9)"}
                    className="pointer-events-none select-none"
                    style={{ fontFamily: "Cairo, sans-serif" }}
                  >
                    {formatNumber(region.sales)} ألف طن
                  </text>
                </g>
              ))}

              {BRANCHES.map((branch) => (
                <g key={branch.id} className="pointer-events-none">
                  <circle cx={branch.x} cy={branch.y} r="14" fill="#f5b800" opacity="0.25">
                    <animate attributeName="r" values="14;22;14" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={branch.x} cy={branch.y} r="7" fill="#f5b800" stroke="#fff" strokeWidth="2.5" />
                  <circle cx={branch.x} cy={branch.y} r="3" fill="#1e3a8a" />
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  r.id === activeId
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-secondary/30 bg-gradient-to-br from-primary to-primary/85 text-white shadow-2xl">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                <MapPin className="h-4 w-4" />
                المنطقة المختارة
              </div>
              <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold text-secondary">
                حصة {active.share}%
              </span>
            </div>
            <h3 className="text-3xl font-black">{active.name}</h3>
            <p className="mt-2 text-sm text-white/70">إجمالي مبيعات الإسمنت في المنطقة</p>
            <p className="mt-1 text-4xl font-black text-secondary">{formatNumber(active.sales)} <span className="text-lg text-white/70">ألف طن</span></p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
              <Building2 className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-xs text-white/70">الشركة الأعلى مبيعاً</p>
                <p className="font-black">{active.topCompany}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h4 className="font-black text-slate-950">ترتيب الشركات في {active.name}</h4>
            </div>
            <div className="space-y-3">
              {active.companies.map((c, i) => {
                const pct = (c.sales / active.companies[0].sales) * 100;
                return (
                  <div key={c.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-bold text-slate-700">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-600">
                          {i + 1}
                        </span>
                        {c.name}
                      </span>
                      <span className="font-black text-slate-900">{formatNumber(c.sales)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: c.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
