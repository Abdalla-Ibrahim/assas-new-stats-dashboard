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
    <div className="min-h-[calc(100vh-4rem-300px)] w-full bg-slate-50 py-8" data-testid="page-full-report">
      <div className="container mx-auto px-4">
        <div className="mb-8 overflow-hidden rounded-3xl bg-slate-950 text-white">
          <div className="grid gap-6 p-8 md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <Badge className="mb-4 bg-secondary text-white hover:bg-secondary">هوية أساس الإعمار للتقارير</Badge>
              <h1 className="mb-3 text-3xl font-black md:text-5xl">إحصائيات الإسمنت والتشغيل الشاملة</h1>
              <p className="max-w-4xl leading-relaxed text-slate-300">
                صفحة عربية تفصيلية تجمع تقارير مبيعات شركات الإسمنت، المبيعات المحلية والمصدرة، الإنتاج ومخزون الكلنكر، الحصة السوقية، ومقرات أساس الإعمار ونطاق تغطيتها داخل المملكة.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                <Printer className="ml-2 h-4 w-4" />
                طباعة
              </Button>
              <Button className="bg-secondary text-white hover:bg-secondary/90">
                <FileSpreadsheet className="ml-2 h-4 w-4" />
                تصدير Excel
              </Button>
            </div>
          </div>
        </div>

        <Card className="mb-8 border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black">
              <Filter className="h-5 w-5 text-primary" />
              محددات التقرير
            </CardTitle>
            <CardDescription>اختر نطاق المقارنة والمنطقة ونوع التقرير كما في صفحات الإحصاءات الرسمية.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-6">
              <div className="space-y-2">
                <Label>السنة الأولى</Label>
                <Select value={firstYear} onValueChange={setFirstYear}>
                  <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>{YEARS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الشهر الأول</Label>
                <Select value={firstMonth} onValueChange={setFirstMonth}>
                  <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>{MONTHS.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>السنة الثانية</Label>
                <Select value={secondYear} onValueChange={setSecondYear}>
                  <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>{YEARS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الشهر الثاني</Label>
                <Select value={secondMonth} onValueChange={setSecondMonth}>
                  <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>{MONTHS.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المنطقة</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>{REGIONS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>اختر التقرير</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>{REPORT_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSearch} className="mt-6 w-full md:w-auto" disabled={isLoading}>
              <Search className="ml-2 h-4 w-4" />
              {isLoading ? "جاري عرض النتائج..." : "عرض النتائج"}
            </Button>
          </CardContent>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-5">
          <Card className="border-none bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardDescription className="font-bold text-primary-foreground/80">إجمالي المبيعات</CardDescription>
              <CardTitle className="text-2xl font-black">{format(totals.totalSales)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardDescription>مبيعات محلية</CardDescription>
              <CardTitle className="text-2xl font-black text-slate-950">{format(totals.localSales)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardDescription>مبيعات مصدرة</CardDescription>
              <CardTitle className="text-2xl font-black text-slate-950">{format(totals.exportSales)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardDescription>إجمالي الإنتاج</CardDescription>
              <CardTitle className="text-2xl font-black text-slate-950">{format(totals.production)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardDescription>مخزون الكلنكر</CardDescription>
              <CardTitle className="text-2xl font-black text-slate-950">{format(totals.clinkerInventory)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="sales" className="border bg-white data-[state=active]:bg-primary data-[state=active]:text-white">مبيعات الشركات</TabsTrigger>
            <TabsTrigger value="period" className="border bg-white data-[state=active]:bg-primary data-[state=active]:text-white">المبيعات خلال فترة</TabsTrigger>
            <TabsTrigger value="monthly" className="border bg-white data-[state=active]:bg-primary data-[state=active]:text-white">المبيعات الشهرية</TabsTrigger>
            <TabsTrigger value="clinker" className="border bg-white data-[state=active]:bg-primary data-[state=active]:text-white">الكلنكر</TabsTrigger>
            <TabsTrigger value="share" className="border bg-white data-[state=active]:bg-primary data-[state=active]:text-white">الحصة السوقية</TabsTrigger>
            <TabsTrigger value="identity" className="border bg-white data-[state=active]:bg-primary data-[state=active]:text-white">هوية ومقرات أساس</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" id="local-export-sales">
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-black"><BarChart3 className="h-5 w-5 text-primary" /> مبيعات شركات الإسمنت</CardTitle>
                <CardDescription>الأرقام بالألف طن مع إبراز أساس الإعمار كمؤشر مرتبط بالتوريد والتشغيل.</CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead className="text-right font-black">الشركة</TableHead>
                      <TableHead className="text-right font-black">المنطقة</TableHead>
                      <TableHead className="text-right font-black">الإنتاج</TableHead>
                      <TableHead className="text-right font-black">مبيعات محلية</TableHead>
                      <TableHead className="text-right font-black">تصدير</TableHead>
                      <TableHead className="text-right font-black">إجمالي المبيعات</TableHead>
                      <TableHead className="text-right font-black">مخزون الكلنكر</TableHead>
                      <TableHead className="text-right font-black">الحصة السوقية</TableHead>
                      <TableHead className="text-right font-black">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={9} className="h-28 text-center text-slate-500">جاري تحميل البيانات...</TableCell></TableRow>
                    ) : (
                      filteredRows.map((row) => (
                        <TableRow key={row.company} className={row.company === "أساس الإعمار" ? "bg-primary/5" : ""}>
                          <TableCell className="font-black text-slate-950">{row.company}</TableCell>
                          <TableCell>{row.region}</TableCell>
                          <TableCell className="font-mono">{formatSmall(row.production)}</TableCell>
                          <TableCell className="font-mono">{formatSmall(row.localSales)}</TableCell>
                          <TableCell className="font-mono">{formatSmall(row.exportSales)}</TableCell>
                          <TableCell className="font-mono font-black text-primary">{formatSmall(row.totalSales)}</TableCell>
                          <TableCell className="font-mono">{formatSmall(row.clinkerInventory)}</TableCell>
                          <TableCell className="font-bold text-secondary">{row.marketShare}%</TableCell>
                          <TableCell><Badge variant="outline">{row.status}</Badge></TableCell>
                        </TableRow>
                      ))
                    )}
                    <TableRow className="bg-slate-100 font-black">
                      <TableCell colSpan={2}>الإجمالي</TableCell>
                      <TableCell>{formatSmall(totals.production)}</TableCell>
                      <TableCell>{formatSmall(totals.localSales)}</TableCell>
                      <TableCell>{formatSmall(totals.exportSales)}</TableCell>
                      <TableCell className="text-primary">{formatSmall(totals.totalSales)}</TableCell>
                      <TableCell>{formatSmall(totals.clinkerInventory)}</TableCell>
                      <TableCell colSpan={2}>100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="period" id="period-sales">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-black">مبيعات شركات الإسمنت خلال فترة</CardTitle>
                <CardDescription>{firstYear} من {firstMonth} إلى {secondYear} من {secondMonth}</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead className="text-right">البند</TableHead>
                      <TableHead className="text-right">{firstYear} من {firstMonth} إلى {firstMonth}</TableHead>
                      <TableHead className="text-right">{secondYear} من {secondMonth} إلى {secondMonth}</TableHead>
                      <TableHead className="text-right">التغير</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periodSales.map((row) => (
                      <TableRow key={row.item}>
                        <TableCell className="font-black">{row.item}</TableCell>
                        <TableCell className="font-mono">{formatSmall(row.first)}</TableCell>
                        <TableCell className="font-mono">{formatSmall(row.second)}</TableCell>
                        <TableCell><ChangeBadge value={row.change} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-black">مبيعات الإسمنت الشهرية للشركات السعودية</CardTitle>
                <CardDescription>آخر 13 شهراً بالألف طن لقراءة الاتجاه العام.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead className="min-w-[180px] text-right">الشركة</TableHead>
                      {["مارس 2026", "فبراير", "يناير", "ديسمبر", "نوفمبر", "أكتوبر", "سبتمبر", "أغسطس", "يوليو", "يونيو", "مايو", "أبريل", "مارس 2025"].map((month) => (
                        <TableHead key={month} className="text-right whitespace-nowrap">{month}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlySales.map((row) => (
                      <TableRow key={row.company} className={row.company === "أساس الإعمار" ? "bg-primary/5" : ""}>
                        <TableCell className="font-black">{row.company}</TableCell>
                        {row.months.map((value, index) => <TableCell key={index} className="font-mono">{formatSmall(value)}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinker" id="clinker">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-black"><Warehouse className="h-5 w-5 text-primary" /> بيان الإنتاج والمخزون للكلنكر</CardTitle>
                <CardDescription>يشمل بداية الفترة، الإنتاج، الكلنكر المشترى، المباع محلياً، المصدر، ونهاية الفترة.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead className="text-right">الشركة</TableHead>
                      <TableHead className="text-right">بداية الفترة</TableHead>
                      <TableHead className="text-right">الإنتاج</TableHead>
                      <TableHead className="text-right">المشترى</TableHead>
                      <TableHead className="text-right">المباع المحلي</TableHead>
                      <TableHead className="text-right">المصدر</TableHead>
                      <TableHead className="text-right">نهاية الفترة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clinkerRows.map((row) => (
                      <TableRow key={row.company} className={row.company === "أساس الإعمار" ? "bg-primary/5" : ""}>
                        <TableCell className="font-black">{row.company}</TableCell>
                        <TableCell className="font-mono">{formatSmall(row.start)}</TableCell>
                        <TableCell className="font-mono">{formatSmall(row.produced)}</TableCell>
                        <TableCell className="font-mono">{formatSmall(row.bought)}</TableCell>
                        <TableCell className="font-mono">{formatSmall(row.soldLocal)}</TableCell>
                        <TableCell className="font-mono">{formatSmall(row.exported)}</TableCell>
                        <TableCell className="font-mono font-black text-primary">{formatSmall(row.end)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="share" id="market-share">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-black"><PieChart className="h-5 w-5 text-primary" /> الحصة السوقية للإسمنت</CardTitle>
                  <CardDescription>مقارنة تقريبية حسب إجمالي المبيعات.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredRows.map((row) => (
                    <div key={row.company}>
                      <div className="mb-2 flex justify-between text-sm font-bold">
                        <span>{row.company}</span>
                        <span className="text-secondary">{row.marketShare}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(row.marketShare * 3, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="font-black">الحصة السوقية للكلنكر</CardTitle>
                  <CardDescription>إظهار المخزون كقوة تشغيلية واستمرارية توريد.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {filteredRows.slice(0, 6).map((row) => (
                    <div key={row.company} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-black text-slate-950">{row.company}</p>
                      <p className="mt-2 text-2xl font-black text-primary">{formatSmall(row.clinkerInventory)}</p>
                      <p className="text-sm text-slate-500">ألف طن مخزون كلنكر</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="identity">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <Card className="border-none bg-primary text-primary-foreground shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-black"><Building2 className="h-6 w-6 text-secondary" /> هوية أساس الإعمار</CardTitle>
                  <CardDescription className="text-primary-foreground/75">خبرة تُبنى بثقة منذ عام 2020.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 leading-relaxed text-primary-foreground/90">
                  <p>تعمل أساس الإعمار في الخدمات الإسمنتية والخدمات اللوجستية وقطع الغيار داخل المملكة، وتبني شراكات طويلة الأمد مع المقاولين والجهات التجارية.</p>
                  <p>تؤمن الشركة بأن التنمية تبدأ من الأساس، وتضع خبراتها في خدمة التحول الوطني والبنية التحتية وفق رؤية المملكة 2030.</p>
                  <p>يقود المؤسسة م. موسى سالم العايضي، بخبرة تتجاوز 10 سنوات وتجارب عملية في الولايات المتحدة الأمريكية وأبو ظبي.</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-black"><Truck className="h-5 w-5 text-primary" /> المقرات ونطاق التغطية</CardTitle>
                  <CardDescription>مواقع تشغيلية مستخرجة من بيانات أساس الإعمار المتاحة.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {locations.map((location) => (
                      <div key={location.city} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-xl font-black text-slate-950">{location.city}</p>
                        <p className="mt-1 font-bold text-secondary">{location.role}</p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">{location.address}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
                    <p className="font-black">تغطية داخل المملكة</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      الرياض، مكة المكرمة، المدينة المنورة، الشرقية، عسير، جازان، الجوف، ينبع، المناطق الشمالية والجنوبية، مع توصيل سريع خلال 24-72 ساعة حسب الكمية والموقع الدقيق.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
