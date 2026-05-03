import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { Activity, Award, Layers, TrendingUp, DollarSign } from "lucide-react";
import { CEMENT_FACTORIES } from "@/data/cementFactories";

// TOP 6 factories for radar (by market share)
const top6 = [...CEMENT_FACTORIES].sort((a, b) => b.marketShare - a.marketShare).slice(0, 6);

const radarData = [
  { metric: "السعر التنافسي", ...Object.fromEntries(top6.slice(0, 3).map((f) => [f.shortName, Math.round(100 - (f.bagPrice - 14) * 10)])) },
  { metric: "الطاقة الإنتاجية", ...Object.fromEntries(top6.slice(0, 3).map((f) => [f.shortName, Math.round((f.capacity / 11000) * 100)])) },
  { metric: "الإنتاج الفعلي", ...Object.fromEntries(top6.slice(0, 3).map((f) => [f.shortName, Math.round((f.production2024 / f.capacity) * 100)])) },
  { metric: "الحصة السوقية", ...Object.fromEntries(top6.slice(0, 3).map((f) => [f.shortName, Math.round(f.marketShare * 6)])) },
  { metric: "عدد الموظفين", ...Object.fromEntries(top6.slice(0, 3).map((f) => [f.shortName, Math.round((f.employees / 1500) * 100)])) },
  { metric: "أداء السهم", ...Object.fromEntries(top6.slice(0, 3).map((f) => [f.shortName, Math.round((f.stockPrice / 22) * 100)])) },
];

const marketShare = CEMENT_FACTORIES.map((f) => ({ name: f.shortName, value: f.marketShare, color: f.color }));

const trendData = [
  { month: "يناير", ينبع: 780, السعودية: 640, اليمامة: 490, القصيم: 415, الشرقية: 312, الجنوبية: 380 },
  { month: "فبراير", ينبع: 812, السعودية: 658, اليمامة: 505, القصيم: 428, الشرقية: 325, الجنوبية: 395 },
  { month: "مارس", ينبع: 855, السعودية: 678, اليمامة: 522, القصيم: 445, الشرقية: 340, الجنوبية: 412 },
  { month: "أبريل", ينبع: 870, السعودية: 692, اليمامة: 540, القصيم: 455, الشرقية: 352, الجنوبية: 425 },
  { month: "مايو", ينبع: 890, السعودية: 705, اليمامة: 552, القصيم: 462, الشرقية: 360, الجنوبية: 438 },
  { month: "يونيو", ينبع: 910, السعودية: 718, اليمامة: 568, القصيم: 475, الشرقية: 368, الجنوبية: 445 },
  { month: "يوليو", ينبع: 925, السعودية: 725, اليمامة: 575, القصيم: 480, الشرقية: 375, الجنوبية: 452 },
  { month: "أغسطس", ينبع: 940, السعودية: 738, اليمامة: 585, القصيم: 490, الشرقية: 382, الجنوبية: 460 },
  { month: "سبتمبر", ينبع: 958, السعودية: 748, اليمامة: 598, القصيم: 498, الشرقية: 390, الجنوبية: 470 },
  { month: "أكتوبر", ينبع: 975, السعودية: 762, اليمامة: 612, القصيم: 508, الشرقية: 398, الجنوبية: 480 },
  { month: "نوفمبر", ينبع: 992, السعودية: 775, اليمامة: 625, القصيم: 518, الشرقية: 408, الجنوبية: 492 },
  { month: "ديسمبر", ينبع: 1010, السعودية: 790, اليمامة: 640, القصيم: 530, الشرقية: 418, الجنوبية: 505 },
];

// All 16 factories bar chart data sorted by production
const allFactories = [...CEMENT_FACTORIES]
  .sort((a, b) => b.production2024 - a.production2024)
  .map((f) => ({
    name: f.shortName,
    إنتاج: f.production2024,
    طاقة: f.capacity,
    حصة: parseFloat(f.marketShare.toFixed(1)),
    color: f.color,
  }));

// Price vs market share scatter
const scatterData = CEMENT_FACTORIES.map((f) => ({
  x: f.bagPrice,
  y: f.marketShare,
  z: f.production2024 / 100,
  name: f.shortName,
  color: f.color,
}));

const tooltipStyle = {
  background: "rgba(15, 23, 42, 0.97)",
  border: "1px solid rgba(245, 184, 0, 0.4)",
  borderRadius: 12,
  color: "white",
  fontFamily: "Cairo, sans-serif",
  fontSize: 12,
};

const RADAR_COLORS = ["#f5b800", "#0ea5e9", "#10b981"];

export function AdvancedAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar - top 3 factories */}
        <Card className="border-white/10 bg-white/5 shadow-xl">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-xs font-bold text-secondary">بطاقة الأداء الشاملة</p>
                <h3 className="text-lg font-black text-white">مقارنة أكبر 3 مصانع (6 محاور)</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#e2e8f0", fontSize: 12, fontWeight: 700 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} />
                {top6.slice(0, 3).map((f, i) => (
                  <Radar
                    key={f.id}
                    name={f.name}
                    dataKey={f.shortName}
                    stroke={RADAR_COLORS[i]}
                    fill={RADAR_COLORS[i]}
                    fillOpacity={0.2 + i * 0.05}
                    strokeWidth={2.5}
                  />
                ))}
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, paddingTop: 8, color: "#e2e8f0" }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Market share donut - all 16 */}
        <Card className="border-white/10 bg-white/5 shadow-xl">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary/80" />
              <div>
                <p className="text-xs font-bold text-secondary">الحصة السوقية 2024</p>
                <h3 className="text-lg font-black text-white">توزيع الحصة بين المصانع الـ16</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={marketShare}
                  innerRadius={62}
                  outerRadius={115}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {marketShare.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v.toFixed(1)}%`, "حصة"]} />
                <Legend
                  wrapperStyle={{ fontFamily: "Cairo, sans-serif", fontSize: 10, fontWeight: 700, color: "#e2e8f0" }}
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly production trend - top 6 */}
      <Card className="border-white/10 bg-white/5 shadow-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-xs font-bold text-secondary">الاتجاه الشهري لعام 2024</p>
                <h3 className="text-lg font-black text-white">مبيعات أكبر 6 مصانع شهرياً (ألف طن)</h3>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                {["ينبع", "السعودية", "اليمامة", "القصيم", "الشرقية", "الجنوبية"].map((key, i) => {
                  const colors = ["#f5b800", "#0ea5e9", "#10b981", "#7c3aed", "#b45309", "#059669"];
                  return (
                    <linearGradient key={key} id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors[i]} stopOpacity={0.6} />
                      <stop offset="100%" stopColor={colors[i]} stopOpacity={0.02} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "Cairo" }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, color: "#e2e8f0" }} />
              {["ينبع", "السعودية", "اليمامة", "القصيم", "الشرقية", "الجنوبية"].map((key, i) => {
                const colors = ["#f5b800", "#0ea5e9", "#10b981", "#7c3aed", "#b45309", "#059669"];
                return (
                  <Area key={key} type="monotone" dataKey={key} stroke={colors[i]} strokeWidth={2} fill={`url(#g${i})`} />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* All 16 factories - production vs capacity */}
      <Card className="border-white/10 bg-white/5 shadow-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-xs font-bold text-secondary">مقارنة شاملة — المصانع الـ16</p>
              <h3 className="text-lg font-black text-white">الطاقة الإنتاجية مقابل الإنتاج الفعلي 2024 (ألف طن)</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={allFactories} barGap={3} margin={{ top: 5, right: 20, bottom: 20, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700, fontFamily: "Cairo" }} angle={-35} textAnchor="end" height={55} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, color: "#e2e8f0" }} />
              <Bar dataKey="طاقة" name="الطاقة الإنتاجية" fill="rgba(255,255,255,0.18)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="إنتاج" name="الإنتاج الفعلي 2024" radius={[6, 6, 0, 0]}>
                {allFactories.map((entry, i) => (
                  <Cell key={i} fill={CEMENT_FACTORIES.find((f) => f.shortName === entry.name)?.color ?? "#f5b800"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price comparison table */}
      <Card className="border-white/10 bg-white/5 shadow-xl">
        <CardContent className="p-6">
          <div className="mb-5 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-xs font-bold text-secondary">جدول مقارنة الأسعار</p>
              <h3 className="text-lg font-black text-white">أسعار الكيس والسائب وسهم البورصة لجميع المصانع الـ16</h3>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-right">
                  <th className="py-3 pr-4 text-xs font-black text-secondary">المصنع</th>
                  <th className="py-3 px-3 text-xs font-black text-secondary">الرمز</th>
                  <th className="py-3 px-3 text-xs font-black text-secondary">المنطقة</th>
                  <th className="py-3 px-3 text-xs font-black text-secondary">سعر الكيس</th>
                  <th className="py-3 px-3 text-xs font-black text-secondary">سعر السائب (طن)</th>
                  <th className="py-3 px-3 text-xs font-black text-secondary">سعر السهم</th>
                  <th className="py-3 px-3 text-xs font-black text-secondary">الحصة %</th>
                </tr>
              </thead>
              <tbody>
                {CEMENT_FACTORIES.map((f, i) => (
                  <tr
                    key={f.id}
                    className={`border-b border-white/5 text-right transition-colors hover:bg-white/5 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                  >
                    <td className="py-2.5 pr-4">
                      <span className="flex items-center gap-2 font-bold text-white">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />
                        {f.shortName}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-white/60">{f.symbol}</td>
                    <td className="px-3 py-2.5 text-xs text-white/70">{f.region}</td>
                    <td className="px-3 py-2.5 font-bold text-white">{f.bagPrice} ر.س</td>
                    <td className="px-3 py-2.5 font-bold text-white">{f.bulkPrice} ر.س</td>
                    <td className="px-3 py-2.5">
                      <span className={`font-black ${f.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {f.stockPrice} ر.س
                        <span className="mr-1 text-[10px]">({f.change >= 0 ? "+" : ""}{f.changePct}%)</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full" style={{ width: `${(f.marketShare / 16) * 100}%`, background: f.color }} />
                        </div>
                        <span className="text-xs font-bold text-white/80">{f.marketShare}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
