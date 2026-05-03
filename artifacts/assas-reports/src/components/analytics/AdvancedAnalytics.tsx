import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
} from "recharts";
import {
  Activity,
  Award,
  Layers,
  TrendingUp,
  DollarSign,
  BarChart2,
  PieChartIcon,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { CEMENT_FACTORIES, TOTAL_CAPACITY, TOTAL_PRODUCTION } from "@/data/cementFactories";

/* ── Derived data ── */
const top6 = [...CEMENT_FACTORIES].sort((a, b) => b.marketShare - a.marketShare).slice(0, 6);
const top8 = [...CEMENT_FACTORIES].sort((a, b) => b.production2024 - a.production2024).slice(0, 8);
const top5 = [...CEMENT_FACTORIES].sort((a, b) => b.marketShare - a.marketShare).slice(0, 5);

/* Radar data — top 4 factories */
const radarFactories = top6.slice(0, 4);
const radarData = [
  {
    metric: "السعر التنافسي",
    ...Object.fromEntries(radarFactories.map((f) => [f.shortName, Math.round(100 - (f.bagPrice - 14) * 12)])),
  },
  {
    metric: "الطاقة الإنتاجية",
    ...Object.fromEntries(radarFactories.map((f) => [f.shortName, Math.round((f.capacity / 11000) * 100)])),
  },
  {
    metric: "كفاءة الإنتاج",
    ...Object.fromEntries(radarFactories.map((f) => [f.shortName, Math.round((f.production2024 / f.capacity) * 100)])),
  },
  {
    metric: "الحصة السوقية",
    ...Object.fromEntries(radarFactories.map((f) => [f.shortName, Math.round(f.marketShare * 6.2)])),
  },
  {
    metric: "القوى البشرية",
    ...Object.fromEntries(radarFactories.map((f) => [f.shortName, Math.round((f.employees / 1500) * 100)])),
  },
  {
    metric: "أداء السهم",
    ...Object.fromEntries(radarFactories.map((f) => [f.shortName, Math.round((f.stockPrice / 22) * 100)])),
  },
];

/* Market share pie */
const pieData = [
  ...top5.map((f) => ({ name: f.shortName, value: f.marketShare, color: f.color })),
  {
    name: "أخرى",
    value: parseFloat((100 - top5.reduce((s, f) => s + f.marketShare, 0)).toFixed(1)),
    color: "#475569",
  },
];

/* Monthly production trend (2024) */
const monthlyTrend = [
  { month: "يناير",  ينبع: 780, السعودية: 640, اليمامة: 490, القصيم: 415, الرياض: 338 },
  { month: "فبراير", ينبع: 812, السعودية: 658, اليمامة: 505, القصيم: 428, الرياض: 352 },
  { month: "مارس",   ينبع: 855, السعودية: 678, اليمامة: 522, القصيم: 445, الرياض: 368 },
  { month: "أبريل",  ينبع: 870, السعودية: 692, اليمامة: 540, القصيم: 455, الرياض: 382 },
  { month: "مايو",   ينبع: 890, السعودية: 705, اليمامة: 552, القصيم: 462, الرياض: 395 },
  { month: "يونيو",  ينبع: 910, السعودية: 718, اليمامة: 568, القصيم: 475, الرياض: 408 },
  { month: "يوليو",  ينبع: 925, السعودية: 725, اليمامة: 575, القصيم: 480, الرياض: 415 },
  { month: "أغسطس", ينبع: 940, السعودية: 738, اليمامة: 585, القصيم: 490, الرياض: 422 },
  { month: "سبتمبر",ينبع: 958, السعودية: 748, اليمامة: 598, القصيم: 498, الرياض: 430 },
  { month: "أكتوبر",ينبع: 975, السعودية: 762, اليمامة: 612, القصيم: 508, الرياض: 440 },
  { month: "نوفمبر", ينبع: 992, السعودية: 775, اليمامة: 625, القصيم: 518, الرياض: 452 },
  { month: "ديسمبر",ينبع: 1010, السعودية: 790, اليمامة: 640, القصيم: 530, الرياض: 465 },
];

/* Capacity vs production top 8 */
const capacityData = top8.map((f) => ({
  name: f.shortName,
  طاقة: f.capacity,
  إنتاج: f.production2024,
  استغلال: Math.round((f.production2024 / f.capacity) * 100),
  color: f.color,
}));

/* Quarterly performance */
const quarterlyData = [
  { q: "Q1 2024", إجمالي: 14850, clinker: 12650, export: 420 },
  { q: "Q2 2024", إجمالي: 15480, clinker: 13120, export: 485 },
  { q: "Q3 2024", إجمالي: 15920, clinker: 13580, export: 510 },
  { q: "Q4 2024", إجمالي: 15210, clinker: 12940, export: 465 },
  { q: "Q1 2025", إجمالي: 15640, clinker: 13280, export: 498 },
];

/* Bag price comparison by company */
const priceCompare = [...CEMENT_FACTORIES]
  .sort((a, b) => a.bagPrice - b.bagPrice)
  .map((f) => ({ name: f.shortName, price: f.bagPrice, color: f.color }));

/* Stock price performance */
const stockData = [...CEMENT_FACTORIES]
  .sort((a, b) => b.changePct - a.changePct)
  .slice(0, 10)
  .map((f) => ({ name: f.shortName, change: f.changePct, price: f.stockPrice, color: f.color }));

/* Regional demand distribution */
const regionalDemand = [
  { region: "الرياض",     demand: 22.5, color: "#1d4ed8" },
  { region: "مكة المكرمة", demand: 18.2, color: "#d97706" },
  { region: "الشرقية",    demand: 21.0, color: "#0ea5e9" },
  { region: "المدينة",    demand: 10.8, color: "#059669" },
  { region: "القصيم",     demand: 6.5,  color: "#7c3aed" },
  { region: "حائل",       demand: 4.2,  color: "#db2777" },
  { region: "تبوك",       demand: 4.5,  color: "#0891b2" },
  { region: "أخرى",       demand: 12.3, color: "#475569" },
];

const tooltipStyle = {
  background: "rgba(10,15,30,0.97)",
  border: "1px solid rgba(245,184,0,0.35)",
  borderRadius: 10,
  color: "#fff",
  direction: "rtl" as const,
  fontFamily: "Cairo,Tajawal,sans-serif",
  fontSize: 12,
};

const COLORS_RADAR = ["#f5b800", "#0ea5e9", "#10b981", "#a855f7"];

type TabId = "overview" | "production" | "prices" | "market" | "quarterly";

const TABS: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: "overview",   label: "نظرة عامة",      icon: Activity },
  { id: "production", label: "الإنتاج والطاقة", icon: Layers },
  { id: "prices",     label: "مقارنة الأسعار", icon: DollarSign },
  { id: "market",     label: "حصص السوق",      icon: PieChartIcon },
  { id: "quarterly",  label: "الأداء الفصلي",  icon: BarChart2 },
];

/* ── Formatters ── */
const fmtAR = (n: number) => new Intl.NumberFormat("ar-SA").format(n);

export function AdvancedAnalytics() {
  const [tab, setTab] = useState<TabId>("overview");

  const utilRate = Math.round((TOTAL_PRODUCTION / TOTAL_CAPACITY) * 100);

  return (
    <div className="space-y-6">
      {/* ── KPI banner ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "إجمالي الطاقة الإنتاجية",
            value: `${fmtAR(TOTAL_CAPACITY)} ألف طن`,
            icon: Layers,
            color: "#0ea5e9",
            sub: "السنوية لعام 2024",
          },
          {
            label: "الإنتاج الفعلي 2024",
            value: `${fmtAR(TOTAL_PRODUCTION)} ألف طن`,
            icon: Activity,
            color: "#10b981",
            sub: `نسبة الاستغلال ${utilRate}%`,
          },
          {
            label: "متوسط سعر الكيس",
            value: "13 ريال",
            icon: DollarSign,
            color: "#f5b800",
            sub: "مرجع تسعيري موحد",
          },
          {
            label: "عدد الشركات المُراقبة",
            value: `${CEMENT_FACTORIES.length} شركة`,
            icon: Award,
            color: "#a855f7",
            sub: "مدرجة في تداول",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="border-slate-700/50 bg-slate-900/80">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">{kpi.label}</p>
                  <div className="rounded-xl p-2" style={{ background: `${kpi.color}22` }}>
                    <Icon className="h-4 w-4" style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">{kpi.value}</p>
                <p className="mt-1 text-xs text-slate-500">{kpi.sub}</p>
                <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: kpi.color }} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Tab navigation ── */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${
                tab === t.id
                  ? "bg-secondary text-slate-950 shadow-lg shadow-secondary/25"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════
          TAB: OVERVIEW
      ══════════════════════════════════════════ */}
      {tab === "overview" && (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Radar chart */}
          <Card className="border-slate-700/50 bg-slate-900">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">مقارنة متعددة الأبعاد</p>
                <h4 className="text-lg font-black text-white">بطاقة الأداء — أكبر 4 شركات</h4>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }}
                  />
                  {radarFactories.map((f, i) => (
                    <Radar
                      key={f.id}
                      name={f.shortName}
                      dataKey={f.shortName}
                      stroke={COLORS_RADAR[i]}
                      fill={COLORS_RADAR[i]}
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend
                    formatter={(v) => <span style={{ color: "#e2e8f0", fontFamily: "Cairo,sans-serif", fontSize: 11 }}>{v}</span>}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly trend area */}
          <Card className="border-slate-700/50 bg-slate-900">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">2024</p>
                <h4 className="text-lg font-black text-white">تطور الإنتاج الشهري (ألف طن)</h4>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrend} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <defs>
                    {["ينبع", "السعودية", "اليمامة", "القصيم", "الرياض"].map((name, i) => (
                      <linearGradient key={name} id={`mg-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS_RADAR[i] ?? "#475569"} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={COLORS_RADAR[i] ?? "#475569"} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  {["ينبع", "السعودية", "اليمامة", "القصيم", "الرياض"].map((name, i) => (
                    <Area
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={COLORS_RADAR[i] ?? "#475569"}
                      strokeWidth={2}
                      fill={`url(#mg-${i})`}
                      dot={false}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stock performance */}
          <Card className="border-slate-700/50 bg-slate-900 xl:col-span-2">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">أسواق المال</p>
                <h4 className="text-lg font-black text-white">أداء أسهم شركات الإسمنت — التغيّر اليومي (%)</h4>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={stockData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "التغيّر"]} />
                  <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                  <Bar dataKey="change" radius={[0, 6, 6, 0]} maxBarSize={18}>
                    {stockData.map((entry, i) => (
                      <Cell key={i} fill={entry.change >= 0 ? "#10b981" : "#ef4444"} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB: PRODUCTION & CAPACITY
      ══════════════════════════════════════════ */}
      {tab === "production" && (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Grouped bar: capacity vs production */}
          <Card className="border-slate-700/50 bg-slate-900 xl:col-span-2">
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-secondary">2024 — أكبر 8 شركات</p>
                  <h4 className="text-lg font-black text-white">الطاقة الإنتاجية مقابل الإنتاج الفعلي (ألف طن)</h4>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-sky-500" /> الطاقة</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-secondary" /> الإنتاج</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={capacityData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${fmtAR(v)} ألف طن`]} />
                  <Bar dataKey="طاقة" fill="rgba(14,165,233,0.35)" stroke="#0ea5e9" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="إنتاج" radius={[4, 4, 0, 0]} maxBarSize={36}>
                    {capacityData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Utilization rate bars */}
          <Card className="border-slate-700/50 bg-slate-900">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">الكفاءة التشغيلية</p>
                <h4 className="text-lg font-black text-white">نسبة استغلال الطاقة الإنتاجية</h4>
              </div>
              <div className="space-y-3">
                {[...CEMENT_FACTORIES]
                  .sort((a, b) => b.production2024 / b.capacity - a.production2024 / a.capacity)
                  .map((f) => {
                    const util = Math.round((f.production2024 / f.capacity) * 100);
                    return (
                      <div key={f.id}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 font-bold text-slate-300">
                            <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                            {f.shortName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black ${util >= 90 ? "text-emerald-400" : util >= 78 ? "text-amber-400" : "text-red-400"}`}>
                              {util >= 90 ? <ArrowUpRight className="inline h-3 w-3" /> : <ArrowDownRight className="inline h-3 w-3" />}
                              {util}%
                            </span>
                          </div>
                        </div>
                        <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${util}%`,
                              background: util >= 90 ? "#10b981" : util >= 78 ? "#f5b800" : "#ef4444",
                            }}
                          />
                          {/* 90% reference line */}
                          <div className="absolute inset-y-0 w-px bg-white/30" style={{ right: "10%" }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <p className="mt-4 text-[11px] text-slate-500">الخط العمودي = 90% (مستوى الكفاءة المثلى)</p>
            </CardContent>
          </Card>

          {/* Production share donut-like bar */}
          <Card className="border-slate-700/50 bg-slate-900">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">مساهمة كل شركة</p>
                <h4 className="text-lg font-black text-white">توزيع الإنتاج الكلي 2024</h4>
              </div>
              <div className="space-y-2.5">
                {[...CEMENT_FACTORIES]
                  .sort((a, b) => b.production2024 - a.production2024)
                  .map((f) => {
                    const pct = ((f.production2024 / TOTAL_PRODUCTION) * 100).toFixed(1);
                    return (
                      <div key={f.id} className="flex items-center gap-3">
                        <span className="w-14 shrink-0 text-[11px] font-bold text-slate-300 text-right">{f.shortName}</span>
                        <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-white/8">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: f.color }}
                          />
                        </div>
                        <span className="w-10 shrink-0 text-right text-[11px] font-black text-slate-300">{pct}%</span>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB: PRICES
      ══════════════════════════════════════════ */}
      {tab === "prices" && (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Bag price bar chart */}
          <Card className="border-slate-700/50 bg-slate-900 xl:col-span-2">
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-secondary">مقارنة تسعيرية</p>
                  <h4 className="text-lg font-black text-white">سعر كيس الإسمنت لدى جميع الشركات (ريال)</h4>
                </div>
                <div className="rounded-xl border border-secondary/30 bg-secondary/10 px-3 py-1.5 text-center">
                  <p className="text-[10px] text-slate-400">المتوسط</p>
                  <p className="text-lg font-black text-secondary">13 ريال</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={priceCompare} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" domain={[13, 16.5]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}﷼`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} width={56} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} ريال`, "سعر الكيس"]} />
                  <ReferenceLine x={13} stroke="#f5b800" strokeWidth={1.5} strokeDasharray="4 3" label={{ value: "متوسط 13﷼", position: "top", fill: "#f5b800", fontSize: 10, fontFamily: "Cairo,sans-serif" }} />
                  <Bar dataKey="price" radius={[0, 6, 6, 0]} maxBarSize={18}>
                    {priceCompare.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bulk price vs bag price scatter equivalent */}
          <Card className="border-slate-700/50 bg-slate-900">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">مقارنة مزدوجة</p>
                <h4 className="text-lg font-black text-white">سعر الكيس مقابل سعر الطن</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-slate-400">
                      <th className="pb-2 font-bold">الشركة</th>
                      <th className="pb-2 font-bold">الكيس</th>
                      <th className="pb-2 font-bold">الطن السائب</th>
                      <th className="pb-2 font-bold">الفارق</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...CEMENT_FACTORIES].sort((a, b) => a.bagPrice - b.bagPrice).map((f) => {
                      const impliedBulk = f.bagPrice * 20;
                      const diff = ((f.bulkPrice - impliedBulk) / impliedBulk * 100).toFixed(1);
                      return (
                        <tr key={f.id} className="border-b border-white/5 hover:bg-white/4">
                          <td className="py-2">
                            <span className="flex items-center gap-2 font-bold text-slate-200">
                              <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                              {f.shortName}
                            </span>
                          </td>
                          <td className="py-2 font-black text-white">{f.bagPrice} ﷼</td>
                          <td className="py-2 font-black text-secondary">{f.bulkPrice} ﷼</td>
                          <td className="py-2">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${parseFloat(diff) < 0 ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/40 text-amber-400"}`}>
                              {diff}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Price trend line */}
          <Card className="border-slate-700/50 bg-slate-900">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">اتجاه الأسعار</p>
                <h4 className="text-lg font-black text-white">تطور متوسط سعر الكيس (2020–2024)</h4>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={[
                    { year: "2020", سعر: 10.2, مستهدف: 12 },
                    { year: "2021", سعر: 11.5, مستهدف: 12 },
                    { year: "2022", سعر: 12.8, مستهدف: 13 },
                    { year: "2023", سعر: 13.4, مستهدف: 13 },
                    { year: "2024", سعر: 15.1, مستهدف: 13 },
                  ]}
                  margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "Cairo,sans-serif" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[9, 17]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}﷼`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [`${v} ريال`, name]} />
                  <ReferenceLine y={13} stroke="#f5b800" strokeDasharray="5 3" strokeWidth={1.5} />
                  <Line type="monotone" dataKey="سعر" stroke="#f5b800" strokeWidth={3} dot={{ fill: "#f5b800", r: 5, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="مستهدف" stroke="rgba(100,200,100,0.5)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
                  <Legend formatter={(v) => <span style={{ color: "#e2e8f0", fontFamily: "Cairo,sans-serif", fontSize: 11 }}>{v}</span>} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB: MARKET SHARE
      ══════════════════════════════════════════ */}
      {tab === "market" && (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Pie chart */}
          <Card className="border-slate-700/50 bg-slate-900">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">الحصة السوقية 2024</p>
                <h4 className="text-lg font-black text-white">توزيع السوق بين الشركات الكبرى</h4>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine={{ stroke: "rgba(255,255,255,0.3)" }}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`${v}%`, "الحصة السوقية"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Regional demand */}
          <Card className="border-slate-700/50 bg-slate-900">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">توزيع الطلب</p>
                <h4 className="text-lg font-black text-white">الطلب على الإسمنت حسب المنطقة (%)</h4>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalDemand} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="region" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} width={68} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "نسبة الطلب"]} />
                  <Bar dataKey="demand" radius={[0, 6, 6, 0]} maxBarSize={22}>
                    {regionalDemand.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Full market share table */}
          <Card className="border-slate-700/50 bg-slate-900 xl:col-span-2">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">جدول مفصل</p>
                <h4 className="text-lg font-black text-white">ترتيب الشركات حسب الحصة السوقية</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-slate-400">
                      <th className="pb-2 pr-2 font-bold">#</th>
                      <th className="pb-2 font-bold">الشركة</th>
                      <th className="pb-2 font-bold">الحصة %</th>
                      <th className="pb-2 font-bold">الإنتاج (ألف طن)</th>
                      <th className="pb-2 font-bold">الطاقة (ألف طن)</th>
                      <th className="pb-2 font-bold">الكفاءة</th>
                      <th className="pb-2 font-bold">شريط</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...CEMENT_FACTORIES].sort((a, b) => b.marketShare - a.marketShare).map((f, i) => {
                      const util = Math.round((f.production2024 / f.capacity) * 100);
                      return (
                        <tr key={f.id} className="border-b border-white/5 hover:bg-white/4">
                          <td className="py-2 pr-2 text-slate-500 font-bold">{i + 1}</td>
                          <td className="py-2">
                            <span className="flex items-center gap-2 font-bold text-slate-200">
                              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: f.color }} />
                              {f.name}
                            </span>
                          </td>
                          <td className="py-2 font-black text-white">{f.marketShare}%</td>
                          <td className="py-2 text-slate-300">{fmtAR(f.production2024)}</td>
                          <td className="py-2 text-slate-400">{fmtAR(f.capacity)}</td>
                          <td className="py-2">
                            <span className={`font-bold ${util >= 90 ? "text-emerald-400" : util >= 78 ? "text-amber-400" : "text-red-400"}`}>{util}%</span>
                          </td>
                          <td className="py-2 w-28">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                              <div className="h-full rounded-full" style={{ width: `${(f.marketShare / 16) * 100}%`, background: f.color }} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB: QUARTERLY PERFORMANCE
      ══════════════════════════════════════════ */}
      {tab === "quarterly" && (
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Quarterly combined chart */}
          <Card className="border-slate-700/50 bg-slate-900 xl:col-span-2">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">الأداء الفصلي (ألف طن)</p>
                <h4 className="text-lg font-black text-white">الإنتاج الإجمالي — الكلنكر — الصادرات (2024–2025)</h4>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={quarterlyData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="q" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [`${fmtAR(v)} ألف طن`, name]} />
                  <Legend formatter={(v) => <span style={{ color: "#e2e8f0", fontFamily: "Cairo,sans-serif", fontSize: 11 }}>{v}</span>} />
                  <Bar yAxisId="left" dataKey="إجمالي" fill="rgba(14,165,233,0.25)" stroke="#0ea5e9" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar yAxisId="left" dataKey="clinker" fill="rgba(245,184,0,0.3)" stroke="#f5b800" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={50} name="الكلنكر" />
                  <Line yAxisId="right" type="monotone" dataKey="export" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 5, strokeWidth: 0 }} name="الصادرات" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Q comparison cards */}
          {quarterlyData.map((q, i) => {
            const prev = i > 0 ? quarterlyData[i - 1] : null;
            const growthPct = prev ? (((q.إجمالي - prev.إجمالي) / prev.إجمالي) * 100).toFixed(1) : null;
            const utilPct = Math.round((q.clinker / q.إجمالي) * 100);
            return (
              <Card key={q.q} className="border-slate-700/50 bg-slate-900">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h5 className="font-black text-white">{q.q}</h5>
                    {growthPct && (
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${parseFloat(growthPct) >= 0 ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/40 text-red-400"}`}>
                        {parseFloat(growthPct) >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {growthPct}%
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: "الإنتاج الكلي", value: `${fmtAR(q.إجمالي)} ألف طن`, color: "text-secondary" },
                      { label: "الكلنكر", value: `${fmtAR(q.clinker)} ألف طن`, color: "text-sky-400" },
                      { label: "الصادرات", value: `${fmtAR(q.export)} ألف طن`, color: "text-emerald-400" },
                      { label: "نسبة الكلنكر", value: `${utilPct}%`, color: "text-violet-400" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between">
                        <span className="text-slate-400">{s.label}</span>
                        <span className={`font-black ${s.color}`}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Employees & founding year */}
          <Card className="border-slate-700/50 bg-slate-900 xl:col-span-2">
            <CardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs font-bold text-secondary">البيانات المؤسسية</p>
                <h4 className="text-lg font-black text-white">عدد الموظفين وسنة التأسيس لكل شركة</h4>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart
                  data={[...CEMENT_FACTORIES].sort((a, b) => b.employees - a.employees).map((f) => ({
                    name: f.shortName,
                    موظفون: f.employees,
                    تأسيس: f.founded,
                    color: f.color,
                  }))}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 10, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[1950, 2020]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar yAxisId="left" dataKey="موظفون" radius={[4, 4, 0, 0]} maxBarSize={36}>
                    {CEMENT_FACTORIES.sort((a, b) => b.employees - a.employees).map((f, i) => <Cell key={i} fill={f.color} />)}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="تأسيس" stroke="#f5b800" strokeWidth={2} dot={{ fill: "#f5b800", r: 3, strokeWidth: 0 }} />
                  <Legend formatter={(v) => <span style={{ color: "#e2e8f0", fontFamily: "Cairo,sans-serif", fontSize: 11 }}>{v}</span>} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer note */}
      <p className="text-center text-xs text-slate-600">
        البيانات تقديرية لأغراض المقارنة والتحليل — أبريل 2026 — أساس الإعمار التجارية
      </p>
    </div>
  );
}
