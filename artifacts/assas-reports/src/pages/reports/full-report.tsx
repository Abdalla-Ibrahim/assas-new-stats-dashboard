import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Printer, Search, FileSpreadsheet } from "lucide-react";

// Mock Data
const YEARS = ["2024", "2023", "2022", "2021"];
const MONTHS = [
  { value: "1", label: "يناير" },
  { value: "2", label: "فبراير" },
  { value: "3", label: "مارس" },
  { value: "4", label: "أبريل" },
  { value: "5", label: "مايو" },
  { value: "6", label: "يونيو" },
  { value: "7", label: "يوليو" },
  { value: "8", label: "أغسطس" },
  { value: "9", label: "سبتمبر" },
  { value: "10", label: "أكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" },
];
const REGIONS = [
  { value: "all", label: "الكل" },
  { value: "central", label: "المنطقة الوسطى" },
  { value: "eastern", label: "المنطقة الشرقية" },
  { value: "western", label: "المنطقة الغربية" },
  { value: "southern", label: "المنطقة الجنوبية" },
  { value: "northern", label: "المنطقة الشمالية" },
];

const MOCK_DATA = [
  { id: 1, company: "أساس الإعمار", region: "الوسطى", production: "450,000", localSales: "420,000", exportSales: "0", totalSales: "420,000", clinkerInventory: "1,200,000", marketShare: "12.5%" },
  { id: 2, company: "شركة اليمامة للأسمنت", region: "الوسطى", production: "650,000", localSales: "610,000", exportSales: "20,000", totalSales: "630,000", clinkerInventory: "2,500,000", marketShare: "18.2%" },
  { id: 3, company: "أسمنت السعودية", region: "الشرقية", production: "720,000", localSales: "580,000", exportSales: "150,000", totalSales: "730,000", clinkerInventory: "3,100,000", marketShare: "20.1%" },
  { id: 4, company: "أسمنت ينبع", region: "الشرقية", production: "680,000", localSales: "490,000", exportSales: "210,000", totalSales: "700,000", clinkerInventory: "2,800,000", marketShare: "19.3%" },
  { id: 5, company: "أسمنت القصيم", region: "الغربية", production: "510,000", localSales: "480,000", exportSales: "40,000", totalSales: "520,000", clinkerInventory: "1,900,000", marketShare: "14.4%" },
  { id: 6, company: "أسمنت الجنوبية", region: "الجنوبية", production: "480,000", localSales: "460,000", exportSales: "15,000", totalSales: "475,000", clinkerInventory: "1,600,000", marketShare: "13.1%" },
];

export default function FullReport() {
  const [year, setYear] = useState(YEARS[0]);
  const [month, setMonth] = useState(MONTHS[0].value);
  const [region, setRegion] = useState(REGIONS[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(MOCK_DATA);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-4rem-300px)] py-8" data-testid="page-full-report">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">الإحصاءات الشاملة لقطاع الإسمنت</h1>
            <p className="text-slate-600 text-sm">عرض تقارير المبيعات والإنتاج والمخزون لشركات الإسمنت في المملكة</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-300 text-slate-700 bg-white">
              <Printer className="w-4 h-4 ml-2" />
              طباعة
            </Button>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <FileSpreadsheet className="w-4 h-4 ml-2" />
              تصدير Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="year">السنة</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year" className="w-full bg-slate-50">
                    <SelectValue placeholder="اختر السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="month">الشهر</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger id="month" className="w-full bg-slate-50">
                    <SelectValue placeholder="اختر الشهر" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">المنطقة</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger id="region" className="w-full bg-slate-50">
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSearch} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">جاري البحث...</span>
                ) : (
                  <span className="flex items-center"><Search className="w-4 h-4 ml-2" /> عرض النتائج</span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-primary-foreground/80 font-medium">إجمالي المبيعات (طن)</CardDescription>
              <CardTitle className="text-3xl font-bold">3,500,000</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500 font-medium">إجمالي الإنتاج (طن)</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">3,490,000</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500 font-medium">مخزون الكلنكر (طن)</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">13,100,000</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="font-bold text-slate-900 text-right py-4 px-4 w-[250px]">الشركة</TableHead>
                  <TableHead className="font-bold text-slate-900 text-right py-4 px-4">المنطقة</TableHead>
                  <TableHead className="font-bold text-slate-900 text-right py-4 px-4 whitespace-nowrap">الإنتاج (طن)</TableHead>
                  <TableHead className="font-bold text-slate-900 text-right py-4 px-4 whitespace-nowrap">مبيعات محلية</TableHead>
                  <TableHead className="font-bold text-slate-900 text-right py-4 px-4 whitespace-nowrap">تصدير</TableHead>
                  <TableHead className="font-bold text-slate-900 text-right py-4 px-4 whitespace-nowrap bg-slate-200/50">إجمالي المبيعات</TableHead>
                  <TableHead className="font-bold text-slate-900 text-right py-4 px-4 whitespace-nowrap">مخزون الكلنكر</TableHead>
                  <TableHead className="font-bold text-slate-900 text-right py-4 px-4 whitespace-nowrap">الحصة السوقية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                      جاري تحميل البيانات...
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {data.map((row) => (
                      <TableRow key={row.id} className={row.company === "أساس الإعمار" ? "bg-primary/5" : ""}>
                        <TableCell className="font-semibold text-slate-900 px-4 py-3 border-l border-slate-100">{row.company}</TableCell>
                        <TableCell className="text-slate-600 px-4 py-3">{row.region}</TableCell>
                        <TableCell className="text-slate-600 px-4 py-3 font-mono">{row.production}</TableCell>
                        <TableCell className="text-slate-600 px-4 py-3 font-mono">{row.localSales}</TableCell>
                        <TableCell className="text-slate-600 px-4 py-3 font-mono">{row.exportSales}</TableCell>
                        <TableCell className="font-bold text-slate-900 px-4 py-3 font-mono bg-slate-50/50">{row.totalSales}</TableCell>
                        <TableCell className="text-slate-600 px-4 py-3 font-mono">{row.clinkerInventory}</TableCell>
                        <TableCell className="font-semibold text-secondary px-4 py-3">{row.marketShare}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300">
                      <TableCell colSpan={2} className="text-slate-900 px-4 py-4">الإجمالي الكلي</TableCell>
                      <TableCell className="text-slate-900 px-4 py-4 font-mono">3,490,000</TableCell>
                      <TableCell className="text-slate-900 px-4 py-4 font-mono">3,065,000</TableCell>
                      <TableCell className="text-slate-900 px-4 py-4 font-mono">435,000</TableCell>
                      <TableCell className="text-primary px-4 py-4 font-mono text-lg">3,500,000</TableCell>
                      <TableCell className="text-slate-900 px-4 py-4 font-mono">13,100,000</TableCell>
                      <TableCell className="text-slate-900 px-4 py-4">100%</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

      </div>
    </div>
  );
}
