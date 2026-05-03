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
} from "lucide-react";

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
const REGIONS = ["الكل", "المنطقة الوسطى", "المنطقة الشمالية", "المنطقة الجنوبية", "المنطقة الشرقية", "المنطقة الغربية"];
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

const companyRows = [
  { company: "أساس الإعمار", region: "الوسطى", production: 450, localSales: 420, exportSales: 0, totalSales: 420, clinkerInventory: 1200, marketShare: 12.5, status: "مؤشر توريد وتشغيل" },
  { company: "أسمنت اليمامة", region: "الوسطى", production: 650, localSales: 610, exportSales: 20, totalSales: 630, clinkerInventory: 2500, marketShare: 18.2, status: "نشط" },
  { company: "أسمنت السعودية", region: "الشرقية", production: 720, localSales: 580, exportSales: 150, totalSales: 730, clinkerInventory: 3100, marketShare: 20.1, status: "نشط" },
  { company: "أسمنت ينبع", region: "الغربية", production: 680, localSales: 490, exportSales: 210, totalSales: 700, clinkerInventory: 2800, marketShare: 19.3, status: "نشط" },
  { company: "أسمنت القصيم", region: "الوسطى", production: 510, localSales: 480, exportSales: 40, totalSales: 520, clinkerInventory: 1900, marketShare: 14.4, status: "نشط" },
  { company: "أسمنت الجنوبية", region: "الجنوبية", production: 480, localSales: 460, exportSales: 15, totalSales: 475, clinkerInventory: 1600, marketShare: 13.1, status: "نشط" },
  { company: "أسمنت الرياض", region: "الوسطى", production: 390, localSales: 201, exportSales: 0, totalSales: 201, clinkerInventory: 1456, marketShare: 6.17, status: "نشط" },
  { company: "أسمنت الشرقية", region: "الشرقية", production: 430, localSales: 215, exportSales: 35, totalSales: 250, clinkerInventory: 1320, marketShare: 7.3, status: "نشط" },
];

const periodSales = [
  { item: "المبيعات المحلية", first: 3453, second: 3258, change: -6 },
  { item: "مبيعات التصدير", first: 158, second: 110, change: -30 },
  { item: "الإجمالي", first: 3611, second: 3368, change: -7 },
];

const monthlySales = [
  { company: "أساس الإعمار", months: [420, 398, 376, 355, 342, 331, 318, 309, 295, 281, 264, 250, 238] },
  { company: "أسمنت اليمامة", months: [499, 472, 468, 451, 430, 425, 410, 396, 378, 365, 350, 338, 321] },
  { company: "أسمنت السعودية", months: [371, 390, 405, 412, 420, 415, 401, 392, 385, 379, 366, 350, 342] },
  { company: "أسمنت الرياض", months: [201, 262, 373, 380, 327, 299, 273, 276, 246, 231, 293, 267, 256] },
];

const clinkerRows = [
  { company: "أساس الإعمار", start: 357, produced: 679, bought: 323, soldLocal: 420, exported: 0, end: 1200 },
  { company: "أسمنت اليمامة", start: 969, produced: 1747, bought: 1012, soldLocal: 610, exported: 20, end: 2500 },
  { company: "أسمنت السعودية", start: 1120, produced: 1880, bought: 650, soldLocal: 580, exported: 150, end: 3100 },
  { company: "أسمنت ينبع", start: 980, produced: 1650, bought: 540, soldLocal: 490, exported: 210, end: 2800 },
];

const locations = [
  { city: "الرياض", role: "المقر الرئيسي", address: "شارع الصناعة، الرياض — صندوق بريد: 12345" },
  { city: "الدمام", role: "فرع التوزيع", address: "المنطقة الصناعية، الدمام" },
  { city: "حفر الباطن", role: "نقطة تشغيل", address: "حفر الباطن — صندوق بريد: 12345" },
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
  const [firstYear, setFirstYear] = useState("2025");
  const [firstMonth, setFirstMonth] = useState("مارس");
  const [secondYear, setSecondYear] = useState("2026");
  const [secondMonth, setSecondMonth] = useState("مارس");
  const [region, setRegion] = useState("الكل");
  const [reportType, setReportType] = useState("الكل");
  const [isLoading, setIsLoading] = useState(false);

  const filteredRows = useMemo(() => {
    if (region === "الكل") return companyRows;
    return companyRows.filter((row) => `المنطقة ${row.region}` === region);
  }, [region]);

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
              <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/12">
                <Printer className="ml-2 h-4 w-4" />
                طباعة
              </Button>
              <Button className="bg-secondary font-black text-slate-950 hover:bg-secondary/90 shadow-lg shadow-secondary/20">
                <FileSpreadsheet className="ml-2 h-4 w-4" />
                تصدير Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

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
              <Select value={firstYear} onValueChange={setFirstYear}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{YEARS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">الشهر الأول</Label>
              <Select value={firstMonth} onValueChange={setFirstMonth}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{MONTHS.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">السنة الثانية</Label>
              <Select value={secondYear} onValueChange={setSecondYear}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{YEARS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">الشهر الثاني</Label>
              <Select value={secondMonth} onValueChange={setSecondMonth}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{MONTHS.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400">المنطقة</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="border-white/10 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>{REGIONS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
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
                  <p>تعمل أساس الإعمار في الخدمات الإسمنتية والخدمات اللوجستية وقطع الغيار داخل المملكة، وتبني شراكات طويلة الأمد مع المقاولين والجهات التجارية.</p>
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
