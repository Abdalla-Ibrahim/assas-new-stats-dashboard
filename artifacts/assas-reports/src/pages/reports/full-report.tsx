import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Building2,
  Download,
  FileSpreadsheet,
  Filter,
  PieChart,
  Printer,
  Search,
  TrendingDown,
  TrendingUp,
  Truck,
  Warehouse,
  DollarSign,
} from "lucide-react";
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
  Legend,
} from "recharts";
import { useCementFactories } from "@/contexts/FactoriesContext";
import { REGION_OPTIONS } from "@/data/mapSettings";
import { CONTACT_ADDRESS_HAFR_AL_BATIN, CONTACT_ADDRESS_RIYADH } from "@/data/contactInfo";

const YEARS = Array.from({ length: 27 }, (_, index) => String(2026 - index));
const MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];
const REPORT_TYPES = [
  "الكل",
  "مبيعات شركات الإسمنت",
  "المبيعات المحلية",
  "المبيعات المصدرة من الإسمنت",
  "مبيعات الإسمنت الشهرية للشركات السعودية",
  "بيان الإنتاج والمخزون للكلنكر",
  "الكلنكر المشترى والمباع والمحلي والمصدر",
  "الحصة السوقية",
];

import officeImage from "@assets/Gemini_Generated_Image_rid8qnrid8qnrid8_1776938760079.png";
import truckFront from "@assets/Gemini_Generated_Image_yw5889yw5889yw58_1776938787664.png";
import truckSide from "@assets/Gemini_Generated_Image_jzlp98jzlp98jzlp_1776938787666.png";
import { BrandLogo } from "@/components/brand/BrandLogo";

const reportImages = [
  { src: officeImage, label: "مقر أساس الإعمار" },
  { src: truckFront, label: "أسطول الصهاريج" },
  { src: truckSide, label: "تشغيل لوجستي" },
];

const locations = [
  { city: "الرياض", role: "المقر الرئيسي", address: CONTACT_ADDRESS_RIYADH },
  { city: "حفر الباطن", role: "نقطة تشغيل", address: CONTACT_ADDRESS_HAFR_AL_BATIN },
];

function format(value: number) {
  return new Intl.NumberFormat("ar-SA").format(value * 1000);
}

function formatSmall(value: number) {
  return new Intl.NumberFormat("ar-SA").format(value);
}

function ChangeBadge({ value }: { value: number }) {
  const positive = value > 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
      <Icon className="h-3.5 w-3.5" />
      {value}%
    </span>
  );
}

export default function FullReport() {
  const { factories } = useCementFactories();
  const [firstYear, setFirstYear] = useState("2025");
  const [firstMonth, setFirstMonth] = useState("مارس");
  const [secondYear, setSecondYear] = useState("2026");
  const [secondMonth, setSecondMonth] = useState("مارس");
  const [region, setRegion] = useState("all");
  const [reportType, setReportType] = useState("الكل");
  const [isLoading, setIsLoading] = useState(false);

  const companyRows = useMemo(
    () =>
      factories.map((factory) => {
        const production = Math.round(factory.production2024 / 12);
        const exportSales =
          factory.regionId === "eastern" || factory.regionId === "madinah"
            ? Math.round(production * 0.12)
            : Math.round(production * 0.04);
        const localSales = Math.round(production * 0.82);
        return {
          company: factory.name,
          region: factory.region,
          regionId: factory.regionId,
          production,
          localSales,
          exportSales,
          totalSales: localSales + exportSales,
          clinkerInventory: Math.round(factory.production2024 * 0.32),
          marketShare: factory.marketShare,
          status: "نشط",
        };
      }),
    [factories],
  );

  const totalLocalSales = companyRows.reduce((sum, row) => sum + row.localSales, 0);
  const totalExportSales = companyRows.reduce((sum, row) => sum + row.exportSales, 0);
  const totalSales = totalLocalSales + totalExportSales;
  const periodSales = [
    { item: "المبيعات المحلية", first: totalLocalSales, second: Math.round(totalLocalSales * 0.94), change: -6 },
    { item: "مبيعات التصدير", first: totalExportSales, second: Math.round(totalExportSales * 0.7), change: -30 },
    { item: "الإجمالي", first: totalSales, second: Math.round(totalSales * 0.93), change: -7 },
  ];
  const monthlySales = [...factories]
    .sort((a, b) => b.marketShare - a.marketShare)
    .slice(0, 4)
    .map((factory, index) => {
      const base = Math.round(factory.production2024 / 12);
      return {
        company: factory.name,
        months: Array.from({ length: 13 }, (_, monthIndex) =>
          Math.max(1, Math.round(base * (1 - monthIndex * 0.018 + index * 0.006))),
        ),
      };
    });
  const clinkerRows = [...factories]
    .sort((a, b) => b.production2024 - a.production2024)
    .slice(0, 4)
    .map((factory) => {
      const produced = Math.round(factory.production2024 * 0.28);
      const soldLocal = Math.round(factory.production2024 * 0.1);
      const exported =
        factory.regionId === "eastern" || factory.regionId === "madinah"
          ? Math.round(factory.production2024 * 0.03)
          : Math.round(factory.production2024 * 0.01);
      return {
        company: factory.name,
        start: Math.round(factory.production2024 * 0.16),
        produced,
        bought: Math.round(factory.production2024 * 0.08),
        soldLocal,
        exported,
        end: Math.round(factory.production2024 * 0.32),
      };
    });

  const filteredRows = useMemo(() => {
    if (region === "all") return companyRows;
    return companyRows.filter((row) => row.regionId === region);
  }, [companyRows, region]);

  const totals = useMemo(
    () =>
      filteredRows.reduce(
        (acc, row) => ({
          production: acc.production + row.production,
          localSales: acc.localSales + row.localSales,
          exportSales: acc.exportSales + row.exportSales,
          totalSales: acc.totalSales + row.totalSales,
          clinkerInventory: acc.clinkerInventory + row.clinkerInventory,
        }),
        { production: 0, localSales: 0, exportSales: 0, totalSales: 0, clinkerInventory: 0 },
      ),
    [filteredRows],
  );

  const handleSearch = () => {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 450);
  };

  return (
    <div className="w-full bg-slate-950" data-testid="page-full-report">

      {/* HERO HEADER */}
      <div className="relative overflow-hidden border-b border-white/8 bg-slate-900 py-12">
        <div className="absolute inset-0 pattern-grid opacity-25" />
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-secondary/8 blur-[80px]" />
        <div className="container relative mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="premium-card rounded-2xl p-0.5">
                <div className="flex h-20 w-20 items-center justify-center rounded-[14px] bg-slate-900 p-2">
                  <BrandLogo size={64} />
                </div>
              </div>
              <div>
                <div className="section-label mb-2">التقرير الشامل</div>
                <h1 className="text-3xl font-black text-white md:text-4xl">إحصائيات الإسمنت والتشغيل الشاملة</h1>
                <p className="mt-1 text-sm text-slate-400">أساس الإعمار — قطاع الإسمنت السعودي</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/12" onClick={() => window.print()}>
                <Printer className="ml-2 h-4 w-4" />
                طباعة
              </Button>
              <Button
                disabled
                title="قريباً"
                className="cursor-not-allowed bg-secondary font-black text-slate-950 opacity-50 shadow-lg shadow-secondary/20"
              >
                <FileSpreadsheet className="ml-2 h-4 w-4" />
                تصدير Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm font-bold text-amber-100">
          البيانات التالية تقديرية محسوبة من بيانات الطاقة الإنتاجية  تحديث بالبيانات الرسمية قيد الإعداد
        </div>

        {/* FILTERS */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/15">
              <Filter className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">محددات التقرير</h2>
              <p className="text-xs text-slate-500">اختر نطاق المقارنة والمنطقة ونوع التقرير</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">السنة الأولى</Label>
              <Select value={firstYear} onValueChange={setFirstYear} disabled>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{YEARS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">الشهر الأول</Label>
              <Select value={firstMonth} onValueChange={setFirstMonth} disabled>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{MONTHS.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">السنة الثانية</Label>
              <Select value={secondYear} onValueChange={setSecondYear} disabled>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{YEARS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">الشهر الثاني</Label>
              <Select value={secondMonth} onValueChange={setSecondMonth} disabled>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{MONTHS.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">المنطقة</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {REGION_OPTIONS.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">نوع التقرير</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{REPORT_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <p className="mt-4 text-xs font-bold text-amber-200/80">الفلترة الزمنية ستكون متاحة عند توفر البيانات الدورية</p>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="mt-6 flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-secondary/20 transition-all hover:shadow-secondary/40 disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            {isLoading ? "جاري عرض النتائج..." : "عرض النتائج"}
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { label: "إجمالي المبيعات", value: format(totals.totalSales), accent: "#f5b800", bg: "from-secondary/15 to-secondary/5" },
            { label: "مبيعات محلية", value: format(totals.localSales), accent: "#3b82f6", bg: "from-blue-500/15 to-blue-500/5" },
            { label: "مبيعات مصدرة", value: format(totals.exportSales), accent: "#10b981", bg: "from-emerald-500/15 to-emerald-500/5" },
            { label: "إجمالي الإنتاج", value: format(totals.production), accent: "#8b5cf6", bg: "from-purple-500/15 to-purple-500/5" },
            { label: "مخزون الكلنكر", value: format(totals.clinkerInventory), accent: "#f43f5e", bg: "from-rose-500/15 to-rose-500/5" },
          ].map((kpi) => (
            <div key={kpi.label} className={`rounded-2xl border border-white/8 bg-gradient-to-br ${kpi.bg} p-5`}>
              <p className="mb-1 text-xs font-bold text-slate-400">{kpi.label}</p>
              <p className="text-xl font-black text-white md:text-2xl">{kpi.value}</p>
              <p className="mt-2 text-[10px] font-bold text-amber-200/80">تقديري محسوب من بيانات الطاقة الإنتاجية</p>
              <div className="mt-2 h-0.5 w-8 rounded-full" style={{ background: kpi.accent }} />
            </div>
          ))}
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="flex h-auto flex-wrap justify-start gap-2 rounded-2xl border border-white/8 bg-white/3 p-2">
            {[
              { value: "sales", label: "مبيعات الشركات" },
              { value: "period", label: "المبيعات خلال فترة" },
              { value: "monthly", label: "المبيعات الشهرية" },
              { value: "clinker", label: "الكلنكر" },
              { value: "prices", label: "مقارنة الأسعار" },
              { value: "share", label: "الحصة السوقية" },
              { value: "identity", label: "هوية أساس" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-400 transition-all data-[state=active]:bg-secondary data-[state=active]:text-slate-950 data-[state=active]:shadow-lg"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="sales" id="local-export-sales">
            <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/3">
              <div className="border-b border-white/8 p-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-secondary" />
                  <h3 className="font-black text-white">مبيعات شركات الإسمنت</h3>
                </div>
                <p className="mt-1 text-sm text-slate-500">الأرقام بالألف طن.</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/8 bg-white/5 hover:bg-white/5">
                      <TableHead className="text-right font-black text-slate-300">الشركة</TableHead>
                      <TableHead className="text-right font-black text-slate-300">المنطقة</TableHead>
                      <TableHead className="text-right font-black text-slate-300">الإنتاج</TableHead>
                      <TableHead className="text-right font-black text-slate-300">مبيعات محلية</TableHead>
                      <TableHead className="text-right font-black text-slate-300">تصدير</TableHead>
                      <TableHead className="text-right font-black text-slate-300">إجمالي المبيعات</TableHead>
                      <TableHead className="text-right font-black text-slate-300">مخزون الكلنكر</TableHead>
                      <TableHead className="text-right font-black text-slate-300">الحصة السوقية</TableHead>
                      <TableHead className="text-right font-black text-slate-300">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={9} className="h-28 text-center text-slate-500">جاري تحميل البيانات...</TableCell></TableRow>
                    ) : (
                      filteredRows.map((row) => (
                        <TableRow key={row.company} className={`border-white/5 hover:bg-white/5 ${row.company === "أساس الإعمار" ? "bg-secondary/8" : ""}`}>
                          <TableCell className="font-black text-white">{row.company}</TableCell>
                          <TableCell className="text-slate-400">{row.region}</TableCell>
                          <TableCell className="font-mono text-slate-300">{formatSmall(row.production)}</TableCell>
                          <TableCell className="font-mono text-slate-300">{formatSmall(row.localSales)}</TableCell>
                          <TableCell className="font-mono text-slate-300">{formatSmall(row.exportSales)}</TableCell>
                          <TableCell className="font-mono font-black text-secondary">{formatSmall(row.totalSales)}</TableCell>
                          <TableCell className="font-mono text-slate-300">{formatSmall(row.clinkerInventory)}</TableCell>
                          <TableCell className="font-bold text-secondary">{row.marketShare}%</TableCell>
                          <TableCell><Badge variant="outline" className="border-white/20 text-slate-300">{row.status}</Badge></TableCell>
                        </TableRow>
                      ))
                    )}
                    <TableRow className="border-white/8 bg-secondary/10 font-black">
                      <TableCell colSpan={2} className="text-white">الإجمالي</TableCell>
                      <TableCell className="font-mono text-white">{formatSmall(totals.production)}</TableCell>
                      <TableCell className="font-mono text-white">{formatSmall(totals.localSales)}</TableCell>
                      <TableCell className="font-mono text-white">{formatSmall(totals.exportSales)}</TableCell>
                      <TableCell className="font-mono font-black text-secondary">{formatSmall(totals.totalSales)}</TableCell>
                      <TableCell className="font-mono text-white">{formatSmall(totals.clinkerInventory)}</TableCell>
                      <TableCell colSpan={2} className="text-white">100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="period" id="period-sales">
            <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/3">
              <div className="border-b border-white/8 p-6">
                <h3 className="font-black text-white">مبيعات شركات الإسمنت خلال فترة</h3>
                <p className="mt-1 text-sm text-slate-500">{firstYear} من {firstMonth} إلى {secondYear} من {secondMonth}</p>
              </div>
              <div className="overflow-x-auto p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/8 bg-white/5 hover:bg-white/5">
                      <TableHead className="text-right text-slate-300">البند</TableHead>
                      <TableHead className="text-right text-slate-300">{firstYear} من {firstMonth}</TableHead>
                      <TableHead className="text-right text-slate-300">{secondYear} من {secondMonth}</TableHead>
                      <TableHead className="text-right text-slate-300">التغير</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periodSales.map((row) => (
                      <TableRow key={row.item} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-black text-white">{row.item}</TableCell>
                        <TableCell className="font-mono text-slate-300">{formatSmall(row.first)}</TableCell>
                        <TableCell className="font-mono text-slate-300">{formatSmall(row.second)}</TableCell>
                        <TableCell><ChangeBadge value={row.change} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/3">
              <div className="border-b border-white/8 p-6">
                <h3 className="font-black text-white">مبيعات الإسمنت الشهرية للشركات السعودية</h3>
                <p className="mt-1 text-sm text-slate-500">آخر 13 شهراً بالألف طن لقراءة الاتجاه العام.</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/8 bg-white/5 hover:bg-white/5">
                      <TableHead className="min-w-[180px] text-right font-black text-slate-300">الشركة</TableHead>
                      {["مارس 2026", "فبراير", "يناير", "ديسمبر", "نوفمبر", "أكتوبر", "سبتمبر", "أغسطس", "يوليو", "يونيو", "مايو", "أبريل", "مارس 2025"].map((month) => (
                        <TableHead key={month} className="whitespace-nowrap text-right text-slate-300">{month}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlySales.map((row) => (
                      <TableRow key={row.company} className={`border-white/5 hover:bg-white/5 ${row.company === "أساس الإعمار" ? "bg-secondary/8" : ""}`}>
                        <TableCell className="font-black text-white">{row.company}</TableCell>
                        {row.months.map((value, index) => <TableCell key={index} className="font-mono text-slate-300">{formatSmall(value)}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clinker" id="clinker">
            <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/3">
              <div className="border-b border-white/8 p-6">
                <div className="flex items-center gap-3">
                  <Warehouse className="h-5 w-5 text-secondary" />
                  <h3 className="font-black text-white">بيان الإنتاج والمخزون للكلنكر</h3>
                </div>
                <p className="mt-1 text-sm text-slate-500">بداية الفترة، الإنتاج، الكلنكر المشترى، المباع محلياً، المصدر، ونهاية الفترة.</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/8 bg-white/5 hover:bg-white/5">
                      {["الشركة","بداية الفترة","الإنتاج","المشترى","المباع المحلي","المصدر","نهاية الفترة"].map(h => (
                        <TableHead key={h} className="text-right font-black text-slate-300">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clinkerRows.map((row) => (
                      <TableRow key={row.company} className={`border-white/5 hover:bg-white/5 ${row.company === "أساس الإعمار" ? "bg-secondary/8" : ""}`}>
                        <TableCell className="font-black text-white">{row.company}</TableCell>
                        <TableCell className="font-mono text-slate-300">{formatSmall(row.start)}</TableCell>
                        <TableCell className="font-mono text-slate-300">{formatSmall(row.produced)}</TableCell>
                        <TableCell className="font-mono text-slate-300">{formatSmall(row.bought)}</TableCell>
                        <TableCell className="font-mono text-slate-300">{formatSmall(row.soldLocal)}</TableCell>
                        <TableCell className="font-mono text-slate-300">{formatSmall(row.exported)}</TableCell>
                        <TableCell className="font-mono font-black text-secondary">{formatSmall(row.end)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* ── PRICE COMPARISON TAB ── */}
          <TabsContent value="prices">
            {(() => {
              const tooltipStyle = {
                background: "rgba(10,15,30,0.97)",
                border: "1px solid rgba(245,184,0,0.35)",
                borderRadius: 10,
                color: "#fff",
                direction: "rtl" as const,
                fontFamily: "Cairo,Tajawal,sans-serif",
                fontSize: 12,
              };
              const sortedByBag = [...factories].sort((a, b) => a.bagPrice - b.bagPrice);
              const sortedByBulk = [...factories].sort((a, b) => a.bulkPrice - b.bulkPrice);
              const bagValues = factories.map((f) => f.bagPrice).filter((price) => Number.isFinite(price));
              const bulkValues = factories.map((f) => f.bulkPrice).filter((price) => Number.isFinite(price));
              const avgBag = bagValues.reduce((s, price) => s + price, 0) / Math.max(1, bagValues.length);
              const avgBulk = bulkValues.reduce((s, price) => s + price, 0) / Math.max(1, bulkValues.length);
              const minBag = Math.max(0, Math.min(...(bagValues.length ? bagValues : [0])) - 0.5);
              const maxBag = Math.max(minBag + 1, Math.max(...(bagValues.length ? bagValues : [1])) + 0.5);
              const minBulk = Math.max(0, Math.min(...(bulkValues.length ? bulkValues : [0])) - 10);
              const maxBulk = Math.max(minBulk + 20, Math.max(...(bulkValues.length ? bulkValues : [20])) + 10);
              const priceColor = (p: number) =>
                p <= avgBag + 0.5 ? "#10b981" : p <= avgBag + 2 ? "#f5b800" : "#ef4444";
              const trendData = [
                { year: "2020", متوسط: 10.2, أعلى: 11.4, أدنى: 9.5 },
                { year: "2021", متوسط: 11.5, أعلى: 12.8, أدنى: 10.3 },
                { year: "2022", متوسط: 12.8, أعلى: 14.2, أدنى: 11.8 },
                { year: "2023", متوسط: 13.4, أعلى: 15.0, أدنى: 12.1 },
                { year: "2024", متوسط: 14.8, أعلى: 16.4, أدنى: 13.1 },
                { year: "2025", متوسط: 15.1, أعلى: 16.6, أدنى: 13.1 },
              ];
              return (
                <div className="space-y-6">
                  {/* KPI row */}
                  <div className="grid gap-4 sm:grid-cols-4">
                    {[
                      { label: "أقل سعر كيس", value: `${Number(sortedByBag[0].bagPrice).toFixed(2)} ﷼`, sub: sortedByBag[0].name, color: "#10b981" },
                      { label: "متوسط السوق", value: `${Number(avgBag).toFixed(2)} ﷼`, sub: "مرجع تسعيري", color: "#f5b800" },
                      { label: "أعلى سعر كيس", value: `${Number(sortedByBag[sortedByBag.length - 1].bagPrice).toFixed(2)} ﷼`, sub: sortedByBag[sortedByBag.length - 1].name, color: "#ef4444" },
                      { label: "فارق السعر", value: `${Number(sortedByBag[sortedByBag.length - 1].bagPrice - sortedByBag[0].bagPrice).toFixed(2)} ﷼`, sub: "بين أرخص وأغلى", color: "#a855f7" },
                    ].map((kpi) => (
                      <div key={kpi.label} className="rounded-2xl border border-white/8 bg-white/3 p-5">
                        <p className="text-xs font-bold text-slate-400">{kpi.label}</p>
                        <p className="mt-1.5 text-2xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{kpi.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Bag price bar chart */}
                  <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/3">
                    <div className="border-b border-white/8 p-6">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-secondary" />
                        <div>
                          <h3 className="font-black text-white">سعر كيس الإسمنت — مقارنة جميع الشركات</h3>
                          <p className="text-xs text-slate-500">مرتبة من الأرخص إلى الأغلى · الخط الذهبي = متوسط السوق ({Number(avgBag).toFixed(2)} ريال)</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <ResponsiveContainer width="100%" height={380}>
                        <BarChart data={sortedByBag.map((f) => ({ name: f.shortName, price: f.bagPrice, color: priceColor(f.bagPrice) }))} layout="vertical" margin={{ top: 0, right: 60, bottom: 0, left: 70 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                          <XAxis type="number" domain={[minBag, maxBag]} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Number(v).toFixed(2)}﷼`} />
                          <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} width={65} />
                          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${Number(v).toFixed(2)} ريال`, "سعر الكيس"]} />
                          <ReferenceLine x={avgBag} stroke="#f5b800" strokeWidth={2} strokeDasharray="5 3" label={{ value: `${Number(avgBag).toFixed(2)}﷼ متوسط`, position: "top", fill: "#f5b800", fontSize: 11, fontFamily: "Cairo,sans-serif" }} />
                          <Bar dataKey="price" radius={[0, 8, 8, 0]} maxBarSize={20} label={{ position: "right", fill: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "Cairo,sans-serif", formatter: (v: number) => `${Number(v).toFixed(2)}﷼` }}>
                            {sortedByBag.map((f, i) => <Cell key={i} fill={priceColor(f.bagPrice)} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Two columns */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Bulk price */}
                    <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/3">
                      <div className="border-b border-white/8 p-5">
                        <h3 className="font-black text-white">سعر الطن السائب</h3>
                        <p className="text-xs text-slate-500">ريال/طن — متوسط السوق: {Number(avgBulk).toFixed(2)} ريال</p>
                      </div>
                      <div className="p-5">
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={sortedByBulk.map((f) => ({ name: f.shortName, bulk: f.bulkPrice, color: f.color }))} layout="vertical" margin={{ top: 0, right: 50, bottom: 0, left: 65 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                            <XAxis type="number" domain={[minBulk, maxBulk]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Number(v).toFixed(2)}﷼`} />
                            <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} width={62} />
                            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${Number(v).toFixed(2)} ريال/طن`]} />
                            <ReferenceLine x={avgBulk} stroke="rgba(100,160,255,0.6)" strokeDasharray="4 3" label={{ value: `متوسط ${Number(avgBulk).toFixed(2)}﷼`, position: "top", fill: "rgba(100,160,255,0.8)", fontSize: 10 }} />
                            <Bar dataKey="bulk" radius={[0, 6, 6, 0]} maxBarSize={18} label={{ position: "right", fill: "rgba(255,255,255,0.5)", fontSize: 10, formatter: (v: number) => `${Number(v).toFixed(2)}` }}>
                              {sortedByBulk.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Full price table */}
                    <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/3">
                      <div className="border-b border-white/8 p-5">
                        <h3 className="font-black text-white">جدول الأسعار التفصيلي</h3>
                        <p className="text-xs text-slate-500">الكيس · الطن · الفارق عن متوسط السوق</p>
                      </div>
                      <div className="overflow-auto p-5" style={{ maxHeight: 360 }}>
                        <table className="w-full text-right text-sm">
                          <thead className="sticky top-0 bg-slate-900/95">
                            <tr className="border-b border-white/10 text-xs text-slate-500">
                              <th className="pb-2 font-bold">#</th>
                              <th className="pb-2 font-bold">الشركة</th>
                              <th className="pb-2 font-bold">الكيس</th>
                              <th className="pb-2 font-bold">الطن</th>
                              <th className="pb-2 font-bold">فارق</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedByBag.map((f, i) => {
                              const delta = f.bagPrice - avgBag;
                              return (
                                <tr key={f.id} className="border-b border-white/5 hover:bg-white/4">
                                  <td className="py-2.5 font-bold text-slate-500">{i + 1}</td>
                                  <td className="py-2.5">
                                    <span className="flex items-center gap-2 font-bold text-slate-200">
                                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: f.color }} />
                                      {f.shortName}
                                    </span>
                                  </td>
                                  <td className="py-2.5 font-black" style={{ color: priceColor(f.bagPrice) }}>{Number(f.bagPrice).toFixed(2)}﷼</td>
                                  <td className="py-2.5 text-slate-300">{Number(f.bulkPrice).toFixed(2)}﷼</td>
                                  <td className="py-2.5">
                                    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${delta <= 0 ? "bg-emerald-900/40 text-emerald-400" : delta <= 2 ? "bg-amber-900/40 text-amber-400" : "bg-red-900/40 text-red-400"}`}>
                                      {delta > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                                      {delta > 0 ? "+" : ""}{Number(delta).toFixed(2)}﷼
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

                  {/* Price trend */}
                  <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/3">
                    <div className="border-b border-white/8 p-6">
                      <h3 className="font-black text-white">تطور نطاق أسعار الإسمنت (2020–2025)</h3>
                      <p className="text-xs text-slate-500">المتوسط الذهبي — الحد الأعلى (أحمر) — الحد الأدنى (أخضر)</p>
                    </div>
                    <div className="p-6">
                      <ResponsiveContainer width="100%" height={240}>
                        <ComposedChart data={trendData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                          <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11, fontFamily: "Cairo,Tajawal,sans-serif" }} axisLine={false} tickLine={false} />
                <YAxis domain={[9, 18]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Number(v).toFixed(2)}﷼`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [`${Number(v).toFixed(2)} ريال`, name]} />
                          <Legend formatter={(v) => <span style={{ color: "#e2e8f0", fontFamily: "Cairo,sans-serif", fontSize: 11 }}>{v}</span>} />
                          <Bar dataKey="أعلى" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.3)" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={40} />
                          <Bar dataKey="أدنى" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.35)" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={40} />
                          <Line type="monotone" dataKey="متوسط" stroke="#f5b800" strokeWidth={3} dot={{ fill: "#f5b800", r: 5, strokeWidth: 0 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              );
            })()}
          </TabsContent>

          <TabsContent value="share" id="market-share">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/8 bg-white/3 p-7">
                <div className="mb-6 flex items-center gap-3">
                  <PieChart className="h-5 w-5 text-secondary" />
                  <h3 className="font-black text-white">الحصة السوقية للإسمنت</h3>
                </div>
                <div className="space-y-5">
                  {filteredRows.map((row) => (
                    <div key={row.company}>
                      <div className="mb-2 flex justify-between text-sm font-bold">
                        <span className="text-slate-300">{row.company}</span>
                        <span className="text-secondary">{row.marketShare}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-l from-secondary to-secondary/60" style={{ width: `${Math.min(row.marketShare * 3, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/8 bg-white/3 p-7">
                <h3 className="mb-6 font-black text-white">الحصة السوقية للكلنكر</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredRows.slice(0, 6).map((row) => (
                    <div key={row.company} className="rounded-2xl border border-white/8 bg-white/4 p-4 transition-all hover:border-secondary/30">
                      <p className="font-black text-white">{row.company}</p>
                      <p className="mt-2 text-2xl font-black text-secondary">{formatSmall(row.clinkerInventory)}</p>
                      <p className="text-xs text-slate-500">ألف طن مخزون كلنكر</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="identity">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <div className="rounded-3xl border border-secondary/25 bg-gradient-to-br from-secondary/10 to-secondary/3 p-8">
                <div className="mb-5 flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-secondary" />
                  <h3 className="text-2xl font-black text-white">هوية أساس الإعمار</h3>
                </div>
                <p className="mb-4 text-xs font-bold tracking-widest text-secondary/70">خبرة تُبنى بثقة منذ عام 2020</p>
                <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                  <p>تعمل أساس الإعمار في الخدمات الإسمنتية داخل المملكة، وتبني شراكات طويلة الأمد مع المقاولين والجهات التجارية.</p>
                  <p>تؤمن الشركة بأن التنمية تبدأ من الأساس، وتضع خبراتها في خدمة التحول الوطني والبنية التحتية وفق رؤية المملكة 2030.</p>
                  <p>يقود المؤسسة م. موسى سالم العايضي، بخبرة تتجاوز 10 سنوات وتجارب عملية في الولايات المتحدة الأمريكية وأبو ظبي.</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/8 bg-white/3 p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Truck className="h-5 w-5 text-secondary" />
                  <h3 className="font-black text-white">المقرات ونطاق التغطية</h3>
                </div>
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                  {reportImages.map((image) => (
                    <div key={image.label} className="overflow-hidden rounded-2xl border border-white/10">
                      <img src={image.src} alt={image.label} className="h-36 w-full object-cover" />
                      <p className="border-t border-white/8 bg-white/5 px-3 py-2 text-center text-xs font-bold text-slate-400">{image.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {locations.map((location) => (
                    <div key={location.city} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                      <p className="text-lg font-black text-white">{location.city}</p>
                      <p className="mt-0.5 text-xs font-bold text-secondary">{location.role}</p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">{location.address}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border border-secondary/20 bg-secondary/8 p-5">
                  <p className="font-black text-white">تغطية داخل المملكة</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    الرياض، مكة المكرمة، المدينة المنورة، الشرقية، عسير، جازان، الجوف، ينبع، المناطق الشمالية والجنوبية، مع توصيل سريع خلال 24-72 ساعة.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
