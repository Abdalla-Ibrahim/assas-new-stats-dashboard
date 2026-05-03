import { CEMENT_FACTORIES } from "@/data/cementFactories";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ComposedChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { TrendingDown, TrendingUp, Minus, AlertCircle, CheckCircle2, Award } from "lucide-react";

const AVG_BAG = 13;
const AVG_BULK = CEMENT_FACTORIES.reduce((s, f) => s + f.bulkPrice, 0) / CEMENT_FACTORIES.length;

const sorted = [...CEMENT_FACTORIES].sort((a, b) => a.bagPrice - b.bagPrice);
const min = sorted[0].bagPrice;
const max = sorted[sorted.length - 1].bagPrice;
const spread = max - min;

const tooltipStyle = {
  background: "rgba(10,15,30,0.97)",
  border: "1px solid rgba(245,184,0,0.35)",
  borderRadius: 10,
  color: "#fff",
  direction: "rtl" as const,
  fontFamily: "Cairo,Tajawal,sans-serif",
  fontSize: 12,
};

function priceColor(price: number) {
  if (price <= AVG_BAG + 0.5) return "#10b981";
  if (price <= AVG_BAG + 2) return "#f5b800";
  return "#ef4444";
}

const bulkData = [...CEMENT_FACTORIES]
  .sort((a, b) => a.bulkPrice - b.bulkPrice)
  .map((f) => ({ name: f.shortName, bulk: f.bulkPrice, color: f.color }));

const trendData = [
  { year: "2020", متوسط: 10.2, أعلى: 11.4, أدنى: 9.5 },
  { year: "2021", متوسط: 11.5, أعلى: 12.8, أدنى: 10.3 },
  { year: "2022", متوسط: 12.8, أعلى: 14.2, أدنى: 11.8 },
  { year: "2023", متوسط: 13.4, أعلى: 15.0, أدنى: 12.1 },
  { year: "2024", متوسط: 14.8, أعلى: 16.4, أدنى: 13.1 },
  { year: "2025 (م)", متوسط: 15.1, أعلى: 16.6, أدنى: 13.1 },
];

export function PriceInsights() {
  return (
    <div className="space-y-8">
      {/* ── KPI Row ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "أقل سعر كيس",
            value: `${min.toFixed(2)} ريال`,
            sub: sorted[0].name,
            icon: TrendingDown,
            color: "#10b981",
            bg: "from-emerald-500/15 to-emerald-500/5",
          },
          {
            label: "متوسط السوق",
            value: `${AVG_BAG} ريال`,
            sub: "مرجع تسعيري معتمد",
            icon: Minus,
            color: "#f5b800",
            bg: "from-amber-500/15 to-amber-500/5",
          },
          {
            label: "أعلى سعر كيس",
            value: `${max.toFixed(2)} ريال`,
            sub: sorted[sorted.length - 1].name,
            icon: TrendingUp,
            color: "#ef4444",
            bg: "from-red-500/15 to-red-500/5",
          },
          {
            label: "فارق السعر",
            value: `${spread.toFixed(2)} ريال`,
            sub: "بين أرخص وأغلى شركة",
            icon: Award,
            color: "#a855f7",
            bg: "from-purple-500/15 to-purple-500/5",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`rounded-2xl border border-white/8 bg-gradient-to-br ${kpi.bg} p-5`}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400">{kpi.label}</p>
                <div className="rounded-xl p-2" style={{ background: `${kpi.color}22` }}>
                  <Icon className="h-4 w-4" style={{ color: kpi.color }} />
                </div>
              </div>
              <p className="text-2xl font-black text-white">{kpi.value}</p>
              <p className="mt-1 text-xs text-slate-500">{kpi.sub}</p>
              <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: kpi.color }} />
            </div>
          );
        })}
      </div>

      {/* ── Main Horizontal Bar Chart — Bag Price ── */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-secondary">مقارنة تسعيرية مباشرة</p>
            <h3 className="text-xl font-black text-white">سعر كيس الإسمنت — جميع الشركات السعودية</h3>
            <p className="mt-1 text-sm text-slate-400">
              الخط الذهبي = متوسط السوق ({AVG_BAG} ريال) · الألوان: أخضر = أقل من المتوسط، ذهبي = قريب من المتوسط، أحمر = أعلى من المتوسط
            </p>
          </div>
          <div className="flex gap-3 text-xs">
            {[
              { color: "#10b981", label: "أقل من المتوسط" },
              { color: "#f5b800", label: "قريب من المتوسط" },
              { color: "#ef4444", label: "أعلى من المتوسط" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2.5 w-5 rounded-full" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={sorted.map((f) => ({ name: f.shortName, price: f.bagPrice, color: priceColor(f.bagPrice) }))}
            layout="vertical"
            margin={{ top: 5, right: 70, bottom: 5, left: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis
              type="number"
              domain={[12.5, 17]}
              tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}﷼`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "Cairo,Tajawal,sans-serif" }}
              axisLine={false}
              tickLine={false}
              width={65}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number) => [`${v.toFixed(2)} ريال`, "سعر الكيس"]}
            />
            <ReferenceLine
              x={AVG_BAG}
              stroke="#f5b800"
              strokeWidth={2}
              strokeDasharray="5 3"
              label={{
                value: `متوسط ${AVG_BAG}﷼`,
                position: "top",
                fill: "#f5b800",
                fontSize: 11,
                fontFamily: "Cairo,sans-serif",
              }}
            />
            <Bar dataKey="price" radius={[0, 8, 8, 0]} maxBarSize={22} label={{ position: "right", fill: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "Cairo,sans-serif", formatter: (v: number) => `${v.toFixed(2)}﷼` }}>
              {sorted.map((f, i) => (
                <Cell key={i} fill={priceColor(f.bagPrice)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Two-column section ── */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Bulk price bar chart */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
          <div className="mb-4">
            <p className="text-xs font-bold text-secondary">السعر السائب</p>
            <h3 className="text-lg font-black text-white">سعر الطن السائب (ريال/طن)</h3>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={bulkData} layout="vertical" margin={{ top: 0, right: 50, bottom: 0, left: 65 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis
                type="number"
              domain={[190, 220]}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}﷼`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }}
                axisLine={false}
                tickLine={false}
                width={62}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} ريال/طن`, "سعر الطن"]} />
              <ReferenceLine
                x={Math.round(AVG_BULK)}
                stroke="rgba(100,160,255,0.6)"
                strokeDasharray="4 3"
                label={{ value: `متوسط ${Math.round(AVG_BULK)}﷼`, position: "top", fill: "rgba(100,160,255,0.8)", fontSize: 10, fontFamily: "Cairo,sans-serif" }}
              />
              <Bar dataKey="bulk" radius={[0, 6, 6, 0]} maxBarSize={18} label={{ position: "right", fill: "rgba(255,255,255,0.5)", fontSize: 10, formatter: (v: number) => `${v}` }}>
                {bulkData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed delta table */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
          <div className="mb-4">
            <p className="text-xs font-bold text-secondary">الفارق عن المتوسط</p>
            <h3 className="text-lg font-black text-white">ترتيب الشركات حسب سعر الكيس</h3>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
            <table className="w-full text-right text-sm">
              <thead className="sticky top-0 bg-slate-900">
                <tr className="border-b border-white/10 text-xs text-slate-500">
                  <th className="pb-2 font-bold">#</th>
                  <th className="pb-2 font-bold">الشركة</th>
                  <th className="pb-2 font-bold">الكيس</th>
                  <th className="pb-2 font-bold">الطن</th>
                  <th className="pb-2 font-bold">فارق</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((f, i) => {
                  const delta = f.bagPrice - AVG_BAG;
                  const isBelow = delta <= 0;
                  const isNear = Math.abs(delta) <= 0.5;
                  return (
                    <tr key={f.id} className="border-b border-white/5 transition-colors hover:bg-white/4">
                      <td className="py-2.5 font-bold text-slate-500">{i + 1}</td>
                      <td className="py-2.5">
                        <span className="flex items-center gap-2 font-bold text-slate-200">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: f.color }} />
                          {f.shortName}
                        </span>
                      </td>
                      <td className="py-2.5 font-black" style={{ color: priceColor(f.bagPrice) }}>
                        {f.bagPrice.toFixed(2)}﷼
                      </td>
                      <td className="py-2.5 text-slate-300">{f.bulkPrice}﷼</td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black ${
                            isNear
                              ? "bg-amber-900/40 text-amber-400"
                              : isBelow
                              ? "bg-emerald-900/40 text-emerald-400"
                              : "bg-red-900/40 text-red-400"
                          }`}
                        >
                          {isBelow ? <TrendingDown className="h-2.5 w-2.5" /> : isNear ? <Minus className="h-2.5 w-2.5" /> : <TrendingUp className="h-2.5 w-2.5" />}
                          {delta > 0 ? "+" : ""}
                          {delta.toFixed(2)}﷼
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Price Trend Over Years ── */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
        <div className="mb-5">
          <p className="text-xs font-bold text-secondary">الاتجاه التاريخي</p>
          <h3 className="text-xl font-black text-white">تطور نطاق أسعار الإسمنت (2020–2025)</h3>
          <p className="mt-1 text-sm text-slate-400">المتوسط الذهبي — الحد الأعلى الأحمر — الحد الأدنى الأخضر</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={trendData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[9, 18]}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}﷼`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number, name: string) => [`${v} ريال`, name]}
            />
            <ReferenceLine y={AVG_BAG} stroke="rgba(245,184,0,0.35)" strokeDasharray="4 3" />
            <Bar dataKey="أعلى" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.3)" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="أدنى" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.35)" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Line
              type="monotone"
              dataKey="متوسط"
              stroke="#f5b800"
              strokeWidth={3}
              dot={{ fill: "#f5b800", r: 5, strokeWidth: 0 }}
              activeDot={{ r: 7, fill: "#f5b800" }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Insights row */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              color: "#ef4444",
              label: "ارتفاع الأسعار 2020–2025",
              value: "+48%",
              sub: "من 10.2 ريال إلى 15.1 ريال",
            },
            {
              icon: AlertCircle,
              color: "#f5b800",
              label: "أعلى سعر سُجّل",
              value: "16.6 ريال",
              sub: "كيس — 2025 (تقديري)",
            },
            {
              icon: CheckCircle2,
              color: "#10b981",
              label: "أدنى سعر في السوق",
              value: "13.10 ريال",
              sub: "كيس — أسمنت السعودية",
            },
          ].map((ins) => {
            const Icon = ins.icon;
            return (
              <div key={ins.label} className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
                <div className="mt-0.5 rounded-lg p-1.5" style={{ background: `${ins.color}22` }}>
                  <Icon className="h-4 w-4" style={{ color: ins.color }} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">{ins.label}</p>
                  <p className="text-lg font-black text-white">{ins.value}</p>
                  <p className="text-[11px] text-slate-400">{ins.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-600">
        الأسعار تقديرية للمقارنة والتحليل — مصدر: أساس الإعمار التجارية — أبريل 2026
      </p>
    </div>
  );
}
