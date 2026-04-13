import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, BarChart3, Truck, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full" data-testid="page-home">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-32">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/20 to-slate-900/90 z-10" />
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              نبني الأساس… <br/>
              <span className="text-secondary">ونقود الإنجاز.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              شريكك الموثوق في قطاع المقاولات، توريد الإسمنت، النقل اللوجستي، وخدمات قطع الغيار عبر المملكة العربية السعودية.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold" asChild>
                <Link href="/reports">
                  مركز التقارير <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 font-semibold" asChild>
                <Link href="/contact">تواصل معنا</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">خدماتنا المتكاملة</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">نقدم حلولاً شاملة لدعم قطاع الإنشاءات والمقاولات بأعلى معايير الجودة</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">خدمات الاسمنتية</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  توريد أجود أنواع الإسمنت لجميع المشاريع الإنشائية مع ضمان استمرارية التوريد حسب الجدول الزمني.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                  <Truck className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">خدمات النقل اللوجستي</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  أسطول حديث ومجهز لضمان نقل المواد والمعدات بأمان وفعالية إلى كافة مناطق المملكة.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Settings className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">خدمات قطع الغيار</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  توفير قطع الغيار الأصلية للمعدات الثقيلة لضمان استمرارية العمل في مواقع المشاريع دون توقف.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">اطلع على تقارير الأداء والإحصاءات</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            نوفر لعملائنا وشركائنا شفافية تامة من خلال تقارير دورية مفصلة عن حركة المبيعات والمخزون في القطاع.
          </p>
          <Button size="lg" variant="secondary" className="font-bold" asChild>
            <Link href="/reports/full-report">عرض التقرير الشامل</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
