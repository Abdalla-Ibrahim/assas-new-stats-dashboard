import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart, Download, ArrowLeft } from "lucide-react";

export default function ReportsIndex() {
  const reports = [
    {
      id: 1,
      title: "الإحصاءات الشاملة",
      description: "نظرة عامة على مبيعات الإسمنت، المخزون، والإنتاج للشركات في المملكة",
      icon: <BarChart className="w-8 h-8 text-primary" />,
      link: "/reports/full-report",
      badge: "الأكثر طلباً",
    },
    {
      id: 2,
      title: "التقارير المالية السنوية",
      description: "البيانات المالية المدققة للسنوات السابقة والميزانية العمومية",
      icon: <FileText className="w-8 h-8 text-slate-400" />,
      link: "#",
      badge: null,
    },
    {
      id: 3,
      title: "تقارير الاستدامة",
      description: "جهود الشركة في الحفاظ على البيئة وتقليل الانبعاثات الكربونية",
      icon: <FileText className="w-8 h-8 text-slate-400" />,
      link: "#",
      badge: null,
    },
    {
      id: 4,
      title: "نشرات الإصدار",
      description: "نشرات الإصدار الخاصة بالأسهم والسندات",
      icon: <FileText className="w-8 h-8 text-slate-400" />,
      link: "#",
      badge: null,
    }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-4rem-300px)] py-12" data-testid="page-reports-index">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">التقارير والإحصاءات</h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            الوصول إلى أحدث التقارير، الإحصاءات والبيانات المالية لشركة أساس الإعمار. 
            نوفر لعملائنا وشركائنا الشفافية التامة حول الأداء والمؤشرات الرئيسية.
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-primary/20 group">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-primary/5 transition-colors">
                    {report.icon}
                  </div>
                  {report.badge && (
                    <span className="bg-secondary/10 text-secondary text-xs font-bold px-2.5 py-1 rounded-full">
                      {report.badge}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 mt-4">{report.title}</CardTitle>
                <CardDescription className="text-slate-600 mt-2 text-sm leading-relaxed">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {report.link !== "#" ? (
                  <Button variant="outline" className="w-full justify-between group-hover:border-primary group-hover:text-primary transition-colors" asChild>
                    <Link href={report.link}>
                      عرض التقرير <ArrowLeft className="w-4 h-4 ml-2 rtl:rotate-180" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full justify-between opacity-50 cursor-not-allowed" disabled>
                    قريباً <Download className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
