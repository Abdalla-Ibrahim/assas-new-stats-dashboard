import { useState, useEffect } from "react";
import { CEMENT_FACTORIES } from "@/data/cementFactories";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Info,
  BarChart2,
} from "lucide-react";

const AVG_BAG = 13;
const AVG_BULK = Math.round(CEMENT_FACTORIES.reduce((s, f) => s + f.bulkPrice, 0) / CEMENT_FACTORIES.length);

/* Buy Signal: cheaper price + high util = buy signal */
function buySignal(f: typeof CEMENT_FACTORIES[0]): { score: number; label: string; color: string; bg: string } {
  const priceScore = Math.max(0, (17 - f.bagPrice) * 15);
  const utilScore = Math.round((f.production2024 / f.capacity) * 30);
  const shareScore = Math.min(20, f.marketShare);
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

/* Simulate live index value */
function useIndexSimulator(base: number, variance: number) {
  const [value, setValue] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => {
        const delta = (Math.random() - 0.48) * variance;
        return parseFloat((Math.max(base * 0.9, v + delta)).toFixed(2));
      });
    }, 2200);
    return () => clearInterval(id);
  }, [base, variance]);
  return value;
}

/* Index history for sparkline */
const generateHistory = (base: number, n: number) => {
  const arr: { t: string; v: number }[] = [];
  let v = base * 0.88;
  for (let i = n; i >= 0; i--) {
    v = Math.max(base * 0.8, v + (Math.random() - 0.46) * base * 0.015);
    const date = new Date();
    date.setDate(date.getDate() - i);
    arr.push({ t: `${date.getDate()}/${date.getMonth() + 1}`, v: parseFloat(v.toFixed(2)) });
  }
  return arr;
};

const priceHistory = generateHistory(14.8, 29);
const volumeHistory = generateHistory(15200, 29);

/* Top buy opportunities */
const buyOpps = [...CEMENT_FACTORIES]
  .map((f) => ({ ...f, sig: buySignal(f) }))
  .sort((a, b) => b.sig.score - a.sig.score)
  .slice(0, 6);

/* Sorted for radar-style bar */
const allWithSig = [...CEMENT_FACTORIES]
  .map((f) => ({ name: f.shortName, score: buySignal(f).score, bagPrice: f.bagPrice, color: f.color, sig: buySignal(f) }))
  .sort((a, b) => b.score - a.score);

export function MarketIntelligence() {
  const priceIndex = useIndexSimulator(14.8, 0.08);
  const demandIndex = useIndexSimulator(78, 1.2);
  const supplySurplus = useIndexSimulator(112, 1.8);

  const priceChange = ((priceIndex - 14.8) / 14.8 * 100).toFixed(2);
  const isUp = parseFloat(priceChange) >= 0;

  return (
    <div className="space-y-8">
      {/* Live Index Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "مؤشر السعر الموزون",
            value: `${priceIndex.toFixed(2)} ﷼`,
            change: `${isUp ? "+" : ""}${priceChange}%`,
            isUp,
            icon: Activity,
            color: "#f5b800",
            bg: "from-amber-500/15 to-amber-500/5",
            sub: "متوسط مرجح بالإنتاج — مباشر",
          },
          {
            label: "مؤشر الطلب المحلي",
            value: `${demandIndex.toFixed(0)}`,
            change: demandIndex >= 78 ? "+نمو" : "-تراجع",
            isUp: demandIndex >= 78,
            icon: TrendingUp,
            color: "#0ea5e9",
            bg: "from-sky-500/15 to-sky-500/5",
            sub: "قياس مستوى الطلب القطاعي",
          },
          {
            label: "الفائض التشغيلي",
            value: `${supplySurplus.toFixed(0)}%`,
            change: supplySurplus > 100 ? "فائض عرض" : "ضغط طلب",
            isUp: supplySurplus <= 110,
            icon: BarChart2,
            color: "#10b981",
            bg: "from-emerald-500/15 to-emerald-500/5",
            sub: "نسبة العرض إلى الطلب الفعلي",
          },
        ].map((ind) => {
          const Icon = ind.icon;
          return (
            <div key={ind.label} className={`rounded-2xl border border-white/8 bg-gradient-to-br ${ind.bg} p-6`}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400">{ind.label}</p>
                <div className="rounded-xl p-2" style={{ background: `${ind.color}22` }}>
                  <Icon className="h-4 w-4" style={{ color: ind.color }} />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-black text-white">{ind.value}</p>
                <span className={`mb-1 flex items-center gap-1 text-sm font-bold ${ind.isUp ? "text-emerald-400" : "text-red-400"}`}>
                  {ind.isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {ind.change}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{ind.sub}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: ind.color }} />
                <span className="text-[10px] text-slate-500">تحديث مباشر</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Index Sparkline + Volume */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Price history */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
          <div className="mb-4">
            <p className="text-xs font-bold text-secondary">آخر 30 يوماً</p>
            <h3 className="text-lg font-black text-white">حركة مؤشر سعر الكيس</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={priceHistory} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5b800" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f5b800" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9, fontFamily: "Cairo,sans-serif" }} axisLine={false} tickLine={false} interval={4} />
              <YAxis domain={["auto", "auto"]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}﷼`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v.toFixed(2)} ريال`, "سعر الكيس"]} />
              <Area type="monotone" dataKey="v" stroke="#f5b800" strokeWidth={2} fill="url(#priceGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Volume/demand proxy */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
          <div className="mb-4">
            <p className="text-xs font-bold text-secondary">آخر 30 يوماً</p>
            <h3 className="text-lg font-black text-white">مؤشر حجم الإنتاج (ألف طن)</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volumeHistory} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9, fontFamily: "Cairo,sans-serif" }} axisLine={false} tickLine={false} interval={4} />
              <YAxis domain={["auto", "auto"]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000).toFixed(1) + "k"} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${(v).toLocaleString("ar-SA")} ألف طن`, "حجم الإنتاج"]} />
              <Area type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={2} fill="url(#volGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Buy Opportunity Score — top 6 */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-secondary">ذكاء التوريد</p>
            <h3 className="text-xl font-black text-white">أفضل فرص التوريد — درجة التوصية</h3>
            <p className="mt-1 text-sm text-slate-400">محسوبة من: تنافسية السعر · كفاءة الإنتاج · الحصة السوقية</p>
          </div>
          <div className="flex gap-3 text-xs text-slate-500">
            {[
              { color: "#10b981", label: "توصية قوية ≥75" },
              { color: "#f5b800", label: "معتدل 55–74" },
              { color: "#94a3b8", label: "مراقبة <55" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buyOpps.map((f, i) => (
            <div
              key={f.id}
              className={`rounded-xl border p-4 transition-all hover:-translate-y-1 ${f.sig.bg}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 font-black text-white">
                  <span className="text-lg font-black text-slate-500">{i + 1}</span>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />
                  {f.shortName}
                </span>
                <span className="text-xs font-bold text-slate-400">{f.symbol}</span>
              </div>

              {/* Score gauge */}
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs text-slate-500">درجة التوصية</p>
                  <p className="text-lg font-black" style={{ color: f.sig.color }}>{f.sig.score}</p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-black/30">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${f.sig.score}%`, background: `linear-gradient(90deg, ${f.sig.color}aa, ${f.sig.color})` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">سعر الكيس</span>
                  <span className="font-black" style={{ color: f.sig.color }}>{f.bagPrice.toFixed(2)} ريال</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">سعر الطن</span>
                  <span className="font-bold">{f.bagPrice * 20} ريال</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">الحالة</span>
                  <span className="flex items-center gap-1 font-bold" style={{ color: f.sig.color }}>
                    {f.sig.score >= 75 ? <CheckCircle2 className="h-3 w-3" /> : f.sig.score >= 55 ? <Info className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                    {f.sig.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All companies score bar */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
        <div className="mb-5">
          <p className="text-xs font-bold text-secondary">الترتيب الكامل</p>
          <h3 className="text-lg font-black text-white">درجة التوصية لجميع شركات الإسمنت</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={allWithSig.map((d) => ({ name: d.name, score: d.score, price: d.bagPrice, color: d.sig.color }))}
            margin={{ top: 5, right: 40, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}﷼`} domain={[12, 17]} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [name === "score" ? `${v} نقطة` : `${v.toFixed(2)} ريال`, name === "score" ? "درجة التوصية" : "سعر الكيس"]} />
            <Bar yAxisId="left" dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={30}>
              {allWithSig.map((d, i) => <Cell key={i} fill={d.sig.color} />)}
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="price" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }} strokeDasharray="4 3" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded-sm bg-slate-400" /> الأعمدة = درجة التوصية</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 border-t-2 border-dashed border-red-500" /> الخط = سعر الكيس</span>
        </div>
      </div>

      <p className="text-center text-xs text-slate-600">
        المؤشرات حسابية للمقارنة والتحليل — لا تمثل توصية مالية — أساس الإعمار التجارية — أبريل 2026
      </p>
    </div>
  );
}
