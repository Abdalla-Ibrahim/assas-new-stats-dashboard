import { useMemo } from "react";
import { useCementFactories, type CementFactory } from "@/contexts/FactoriesContext";
import { BarChart2, CheckCircle2, Factory, Gauge, Info, Package, Zap } from "lucide-react";
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function buySignal(factory: CementFactory): { score: number; label: string; color: string; bg: string } {
  const priceScore = Math.max(0, (17 - factory.bagPrice) * 15);
  const utilization = factory.capacity ? factory.production2024 / factory.capacity : 0;
  const utilScore = Math.round(utilization * 30);
  const shareScore = Math.min(20, factory.marketShare);
  const total = Math.min(100, Math.round(priceScore + utilScore + shareScore));
  if (total >= 75) return { score: total, label: "توصية شراء قوية", color: "#10b981", bg: "bg-emerald-900/30 border-emerald-700/40" };
  if (total >= 55) return { score: total, label: "توصية معتدلة", color: "#f5b800", bg: "bg-amber-900/30 border-amber-700/40" };
  return { score: total, label: "مراقبة", color: "#94a3b8", bg: "bg-slate-800/60 border-slate-700/40" };
}

const tooltipStyle = {
  background: "rgba(10,15,30,0.97)",
  border: "1px solid rgba(245,184,0,0.35)",
  borderRadius: 10,
  color: "#fff",
  direction: "rtl" as const,
  fontFamily: "Cairo,Tajawal,sans-serif",
  fontSize: 12,
};

export function MarketIntelligence() {
  const { factories } = useCementFactories();
  const activeFactories = factories.filter((factory) => factory.bagPrice > 0 || factory.bulkPrice > 0);
  const totalCapacity = factories.reduce((sum, factory) => sum + factory.capacity, 0);
  const averageUtilization =
    factories.length > 0
      ? factories.reduce((sum, factory) => sum + (factory.capacity ? (factory.production2024 / factory.capacity) * 100 : 0), 0) /
        factories.length
      : 0;

  const buyOpps = useMemo(
    () =>
      [...factories]
        .map((factory) => ({ ...factory, sig: buySignal(factory) }))
        .sort((a, b) => b.sig.score - a.sig.score)
        .slice(0, 6),
    [factories],
  );

  const allWithSignal = useMemo(
    () =>
      [...factories]
        .map((factory) => ({
          name: factory.shortName,
          score: buySignal(factory).score,
          bagPrice: factory.bagPrice,
          sig: buySignal(factory),
        }))
        .sort((a, b) => b.score - a.score),
    [factories],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "إجمالي الطاقة الإنتاجية",
            value: totalCapacity.toLocaleString("ar-SA"),
            unit: "ألف طن",
            icon: Package,
            color: "#f5b800",
            bg: "from-amber-500/15 to-amber-500/5",
          },
          {
            label: "متوسط نسبة الاستغلال",
            value: `${averageUtilization.toFixed(1)}%`,
            unit: "من الطاقة المتاحة",
            icon: Gauge,
            color: "#0ea5e9",
            bg: "from-sky-500/15 to-sky-500/5",
          },
          {
            label: "عدد المصانع النشطة",
            value: activeFactories.length.toLocaleString("ar-SA"),
            unit: "مصنع",
            icon: Factory,
            color: "#10b981",
            bg: "from-emerald-500/15 to-emerald-500/5",
          },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className={`rounded-2xl border border-white/8 bg-gradient-to-br ${metric.bg} p-6`}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400">{metric.label}</p>
                <div className="rounded-xl p-2" style={{ background: `${metric.color}22` }}>
                  <Icon className="h-4 w-4" style={{ color: metric.color }} />
                </div>
              </div>
              <p className="text-3xl font-black text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-500">{metric.unit}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 p-6 text-center">
        <BarChart2 className="mx-auto h-7 w-7 text-amber-300" />
        <h3 className="mt-3 text-lg font-black text-white">سيتوفر التاريخ الكامل عند تراكم البيانات</h3>
        <p className="mt-1 text-sm text-amber-100/75">
          الرسوم التاريخية العشوائية أزيلت. ستظهر اتجاهات الأسعار والإنتاج عند توفر بيانات دورية حقيقية.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-secondary">ذكاء التوريد</p>
            <h3 className="text-xl font-black text-white">أفضل فرص التوريد</h3>
            <p className="mt-1 text-sm text-slate-400">محسوبة من تنافسية السعر وكفاءة الإنتاج والحصة السوقية.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
            <Info className="h-3.5 w-3.5 text-secondary" />
            مؤشر مقارن لا يمثل توصية مالية
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buyOpps.map((factory, index) => (
            <div key={factory.id} className={`rounded-xl border p-4 transition-all hover:-translate-y-1 ${factory.sig.bg}`}>
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 font-black text-white">
                  <span className="text-lg font-black text-slate-500">{index + 1}</span>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: factory.color }} />
                  {factory.shortName}
                </span>
                <span className="text-xs font-bold text-slate-400">{factory.symbol}</span>
              </div>
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs text-slate-500">درجة التوصية</p>
                  <p className="text-lg font-black" style={{ color: factory.sig.color }}>{factory.sig.score}</p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-black/30">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${factory.sig.score}%`, background: `linear-gradient(90deg, ${factory.sig.color}aa, ${factory.sig.color})` }}
                  />
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">سعر الكيس</span>
                  <span className="font-black" style={{ color: factory.sig.color }}>{factory.bagPrice.toFixed(2)} ريال</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">سعر الطن</span>
                  <span className="font-bold">{factory.bulkPrice.toFixed(2)} ريال</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">الحالة</span>
                  <span className="flex items-center gap-1 font-bold" style={{ color: factory.sig.color }}>
                    {factory.sig.score >= 75 ? <CheckCircle2 className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                    {factory.sig.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
        <div className="mb-5">
          <p className="text-xs font-bold text-secondary">الترتيب الكامل</p>
          <h3 className="text-lg font-black text-white">درجة التوصية لجميع الشركات</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={allWithSignal} margin={{ top: 5, right: 40, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${Number(value).toFixed(2)}﷼`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [name === "score" ? `${value} نقطة` : `${Number(value).toFixed(2)} ريال`, name === "score" ? "درجة التوصية" : "سعر الكيس"]} />
            <Bar yAxisId="left" dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={30}>
              {allWithSignal.map((item) => <Cell key={item.name} fill={item.sig.color} />)}
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="bagPrice" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }} strokeDasharray="4 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
