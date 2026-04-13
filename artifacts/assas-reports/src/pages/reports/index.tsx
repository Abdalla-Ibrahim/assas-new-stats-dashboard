import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Download, Factory, FileBarChart, FileText, LineChart, PieChart, Warehouse } from "lucide-react";

const reports = [
  {
    title: "الإحصاءات الشاملة لقطاع الإسمنت",
    description: "مبيعات شركات الإسمنت، المبيعات المحلية، التصدير، الإنتاج، مخزون الكلنكر، والحصة السوقية في صفحة واحدة.",
    icon: BarChart3,
    link: "/reports/full-report",
    badge: "جاهز للعرض",
  },
  {
    title: "مبيعات شركات الإسمنت خلال فترة",
    description: "مقارنة بين سنة أولى وسنة ثانية حسب الشهر والمنطقة مع نسبة التغير لكل بند.",
    icon: LineChart,
    link: "/reports/full-report#period-sales",
    badge: "تفصيلي",
  },
  {
    title: "المبيعات المحلية والمصدرة",
    description: "قراءة شهرية ومنذ بداية العام للمبيعات المحلية والتصدير حسب الشركات والحصة السوقية.",
    icon: FileBarChart,
    link: "/reports/full-report#local-export-sales",
    badge: null,
  },
  {
    title: "الإنتاج ومخزون الكلنكر",
    description: "بيان الإنتاج، المخزون، الكلنكر المشترى والمباع والمحلي والمصدر لكل شركة ومنطقة.",
    icon: Warehouse,
    link: "/reports/full-report#clinker",
    badge: null,
  },
  {
    title: "الحصة السوقية",
    description: "مقارنة حصص الإسمنت والكلنكر بين الشركات مع إبراز موقع أساس الإعمار كمؤشر توريد وتشغيل.",
    icon: PieChart,
    link: "/reports/full-report#market-share",
    badge: null,
  },
  {
    title: "هوية أساس ومقرات التشغيل",
    description: "ملخص الهوية، سنة الانطلاق، الخبرة، القيادة، المقر الرئيسي، فروع التوزيع ونطاق التغطية داخل المملكة.",
    icon: Factory,
    link: "/contact",
    badge: "هوية أساس",
  },
  {
    title: "التقارير المالية السنوية",
    description: "مساحة مخصصة للبيانات المالية المدققة والميزانية العمومية عند اعتمادها للنشر.",
    icon: FileText,
    link: "#",
    badge: "قريباً",
  },
  {
    title: "تقارير الاستدامة والجودة",
    description: "مساحة مخصصة لمؤشرات السلامة والجودة وكفاءة التشغيل والاستدامة اللوجستية.",
    icon: FileText,
    link: "#",
    badge: "قريباً",
  },
];

export default function ReportsIndex() {
  return (
    <div className="min-h-[calc(100vh-4rem-300px)] w-full bg-slate-50 py-12" data-testid="page-reports-index">
      <div className="container mx-auto px-4">
        <div className="mb-12 rounded-3xl bg-slate-950 p-8 text-white md:p-12">
          <p className="mb-3 font-bold text-secondary">بوابة التقارير</p>
          <h1 className="mb-4 text-3xl font-black md:text-5xl">التقارير والإحصاءات</h1>
          <p className="max-w-4xl text-lg leading-relaxed text-slate-300">
            مركز موحد يعرض تفاصيل قطاع الإسمنت والخدمات التشغيلية المرتبطة به، مع إبراز هوية أساس الإعمار كشركة تعمل في التوريد الإسمنتي والنقل اللوجستي وقطع الغيار داخل المملكة.
          </p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-5">
              <p className="text-2xl font-black text-primary">8</p>
              <p className="text-sm text-slate-600">أنواع تقارير</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-5">
              <p className="text-2xl font-black text-primary">5</p>
              <p className="text-sm text-slate-600">مناطق تشغيلية</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-5">
              <p className="text-2xl font-black text-primary">2026-2000</p>
              <p className="text-sm text-slate-600">نطاق سنوات للفلترة</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-5">
              <p className="text-2xl font-black text-primary">RTL</p>
              <p className="text-sm text-slate-600">واجهة عربية كاملة</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => {
            const Icon = report.icon;
            const disabled = report.link === "#";
            return (
              <Card key={report.title} className="group border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="rounded-xl bg-primary/5 p-3 transition-colors group-hover:bg-primary/10">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    {report.badge && (
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${report.badge === "قريباً" ? "bg-slate-100 text-slate-500" : "bg-secondary/10 text-secondary"}`}>
                        {report.badge}
                      </span>
                    )}
                  </div>
                  <CardTitle className="mt-4 text-xl font-black text-slate-950">{report.title}</CardTitle>
                  <CardDescription className="mt-2 text-sm leading-relaxed text-slate-600">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {disabled ? (
                    <Button variant="outline" className="w-full justify-between opacity-60" disabled>
                      قريباً <Download className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full justify-between transition-colors group-hover:border-primary group-hover:text-primary" asChild>
                      <Link href={report.link}>
                        عرض التفاصيل <ArrowLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
