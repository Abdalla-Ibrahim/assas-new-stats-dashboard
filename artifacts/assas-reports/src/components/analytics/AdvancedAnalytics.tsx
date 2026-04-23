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
} from "recharts";
import { Activity, Award, Layers, TrendingUp } from "lucide-react";

const radarData = [
  { metric: "السعر", "أساس": 92, "اليمامة": 78, "الرياض": 75 },
  { metric: "السرعة", "أساس": 95, "اليمامة": 70, "الرياض": 72 },
  { metric: "التغطية", "أساس": 88, "اليمامة": 85, "الرياض": 68 },
  { metric: "الجودة", "أساس": 90, "اليمامة": 92, "الرياض": 80 },
  { metric: "الدعم", "أساس": 94, "اليمامة": 75, "الرياض": 70 },
  { metric: "السعة", "أساس": 80, "اليمامة": 95, "الرياض": 65 },
];

const marketShare = [
  { name: "أسمنت السعودية", value: 20.1, color: "#1e3a8a" },
  { name: "أسمنت ينبع", value: 19.3, color: "#3b5bb8" },
  { name: "أسمنت اليمامة", value: 18.2, color: "#f5b800" },
  { name: "أسمنت القصيم", value: 14.4, color: "#fbbf24" },
  { name: "أسمنت الجنوبية", value: 13.1, color: "#0ea5e9" },
  { name: "أساس الإعمار", value: 12.5, color: "#10b981" },
  { name: "أخرى", value: 2.4, color: "#94a3b8" },
];

const trendData = [
  { month: "يناير", أساس: 250, السوق: 2800 },
  { month: "فبراير", أساس: 264, السوق: 2950 },
  { month: "مارس", أساس: 281, السوق: 3050 },
  { month: "أبريل", أساس: 295, السوق: 3120 },
  { month: "مايو", أساس: 309, السوق: 3180 },
  { month: "يونيو", أساس: 318, السوق: 3220 },
  { month: "يوليو", أساس: 331, السوق: 3290 },
  { month: "أغسطس", أساس: 342, السوق: 3340 },
  { month: "سبتمبر", أساس: 355, السوق: 3400 },
  { month: "أكتوبر", أساس: 376, السوق: 3450 },
  { month: "نوفمبر", أساس: 398, السوق: 3520 },
  { month: "ديسمبر", أساس: 420, السوق: 3611 },
];

const ranking = [
  { name: "أساس", growth: 28, efficiency: 92 },
  { name: "اليمامة", growth: 8, efficiency: 78 },
  { name: "السعودية", growth: 12, efficiency: 81 },
  { name: "ينبع", growth: 6, efficiency: 76 },
  { name: "القصيم", growth: 9, efficiency: 74 },
  { name: "الجنوبية", growth: 14, efficiency: 80 },
  { name: "الرياض", growth: 4, efficiency: 70 },
];

const tooltipStyle = {
  background: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(245, 184, 0, 0.4)",
  borderRadius: 12,
  color: "white",
  fontFamily: "Cairo, sans-serif",
};

export function AdvancedAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar comparison */}
        <Card className="border-slate-200 bg-white shadow-xl">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-xs font-bold text-secondary">بطاقة الأداء الشاملة</p>
                <h3 className="text-lg font-black text-slate-950">مقارنة متعددة الأبعاد بين الشركات</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#1e293b", fontSize: 13, fontWeight: 700 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar name="أساس الإعمار" dataKey="أساس" stroke="#f5b800" fill="#f5b800" fillOpacity={0.55} strokeWidth={2.5} />
                <Radar name="أسمنت اليمامة" dataKey="اليمامة" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.25} strokeWidth={2} />
                <Radar name="أسمنت الرياض" dataKey="الرياض" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, paddingTop: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Market share donut */}
        <Card className="border-slate-200 bg-white shadow-xl">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-bold text-secondary">الحصة السوقية</p>
                <h3 className="text-lg font-black text-slate-950">توزيع الحصة بين شركات الإسمنت</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={marketShare}
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {marketShare.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [`${value}%`, "حصة"]}
                />
                <Legend wrapperStyle={{ fontFamily: "Cairo, sans-serif", fontSize: 12, fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Growth area chart */}
      <Card className="border-slate-200 bg-white shadow-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-xs font-bold text-secondary">الاتجاه السنوي</p>
                <h3 className="text-lg font-black text-slate-950">تطور مبيعات أساس مقابل إجمالي السوق (ألف طن)</h3>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">+68% نمو سنوي</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gAssas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5b800" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#f5b800" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gMarket" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11, fontFamily: "Cairo" }} />
              <YAxis yAxisId="left" tick={{ fill: "#475569", fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#475569", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontFamily: "Cairo, sans-serif", fontWeight: 700 }} />
              <Area yAxisId="right" type="monotone" dataKey="السوق" stroke="#1e3a8a" strokeWidth={2.5} fill="url(#gMarket)" />
              <Area yAxisId="left" type="monotone" dataKey="أساس" stroke="#f5b800" strokeWidth={3} fill="url(#gAssas)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Growth & efficiency dual bars */}
      <Card className="border-slate-200 bg-white shadow-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs font-bold text-secondary">معدل النمو والكفاءة</p>
              <h3 className="text-lg font-black text-slate-950">مؤشر النمو السنوي وكفاءة التشغيل لكل شركة</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ranking} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12, fontWeight: 700, fontFamily: "Cairo" }} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontFamily: "Cairo, sans-serif", fontWeight: 700 }} />
              <Bar dataKey="growth" name="النمو السنوي %" fill="#f5b800" radius={[8, 8, 0, 0]} />
              <Bar dataKey="efficiency" name="مؤشر الكفاءة %" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
