import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CheckCircle2,
  Factory,
  MapPinned,
  Settings,
  ShieldCheck,
  Truck,
} from "lucide-react";

const services = [
  {
    title: "الخدمات الإسمنتية",
    description:
      "توريد الإسمنت السائب والمكيس لكل مناطق المملكة، مع خيارات مناسبة للمقاولين والمشاريع الإنشائية والتجارية.",
    icon: Factory,
  },
  {
    title: "النقل اللوجستي",
    description:
      "تغطية شاملة داخل المملكة عبر أسطول تشغيلي يدعم حركة المواد والمعدات بسرعة وكفاءة حسب الموقع والكمية.",
    icon: Truck,
  },
  {
    title: "قطع الغيار",
    description:
      "توفير قطع الغيار والفلاتر والرديترات لدعم جاهزية المعدات والمركبات وتقليل توقف الأعمال في المواقع.",
    icon: Settings,
  },
];

const identity = [
  "انطلقت أساس الإعمار عام 2020 لتكون شريكاً تشغيلياً موثوقاً للمقاولين والجهات التجارية.",
  "خبرة تمتد لأكثر من 5 سنوات في الخدمات الإسمنتية واللوجستية وقطع الغيار داخل المملكة.",
  "تدعم المشاريع الوطنية الكبرى وتواكب مستهدفات رؤية المملكة 2030 في تطوير البنية التحتية.",
  "يقود المؤسسة م. موسى سالم العايضي بخبرات عملية واستراتيجية داخل وخارج المنطقة.",
];

const locations = [
  { city: "الرياض", label: "المقر الرئيسي", detail: "شارع الصناعة، الرياض — صندوق بريد: 12345" },
  { city: "الدمام", label: "فرع التوزيع", detail: "المنطقة الصناعية، الدمام" },
  { city: "حفر الباطن", label: "نقطة تغطية وتشغيل", detail: "حفر الباطن — صندوق بريد: 12345" },
];

const stats = [
  { value: "2020", label: "عام الانطلاق" },
  { value: "+5", label: "سنوات خبرة تشغيلية" },
  { value: "24-72", label: "ساعة للتوصيل حسب الكمية والموقع" },
  { value: "جميع المناطق", label: "تغطية داخل المملكة" },
];

export default function Home() {
  return (
    <div className="w-full" data-testid="page-home">
      <section className="relative overflow-hidden bg-slate-950 py-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,128,0,0.18),transparent_34%),linear-gradient(120deg,rgba(0,64,128,0.94),rgba(15,23,42,0.98))]" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_50%)] bg-[length:34px_34px] opacity-40" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-secondary" />
                هوية تشغيلية سعودية لقطاع الإنشاءات والخدمات المساندة
              </div>
              <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
                نبني الأساس… <br />
                <span className="text-secondary">ونقود الإنجاز.</span>
              </h1>
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                في أساس الإعمار نقدّم حلولاً متكاملة في توريد الأسمنت، الخدمات اللوجستية، وقطع الغيار داخل المملكة، بخبرة عملية تدعم المقاولين والمشاريع الوطنية الكبرى.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-secondary font-bold text-secondary-foreground hover:bg-secondary/90" asChild>
                  <Link href="/reports/full-report">
                    عرض الإحصاءات الشاملة <ArrowLeft className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/reports">مركز التقارير</Link>
                </Button>
              </div>
            </div>

            <Card className="border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur-md">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm text-slate-300">بطاقة الهوية</p>
                    <h2 className="text-2xl font-black">أساس الإعمار</h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-2xl font-black text-white shadow-lg shadow-secondary/30">
                    أ
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                      <p className="text-2xl font-black text-secondary">{item.value}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">{item.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 font-bold text-secondary">هوية أساس</p>
            <h2 className="mb-4 text-3xl font-black text-slate-950 md:text-4xl">خبرة تُبنى بثقة وتشغيل يعتمد عليه</h2>
            <p className="text-lg leading-relaxed text-slate-600">
              صفحة التقارير هنا لا تعرض أرقاماً فقط، بل تعكس هوية أساس الإعمار كشركة منظمة وشفافة في قطاع الإسمنت والخدمات اللوجستية.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {identity.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-secondary" />
                <p className="leading-relaxed text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-3 font-bold text-secondary">خدماتنا المتكاملة</p>
            <h2 className="text-3xl font-black text-slate-950 md:text-4xl">حلول تدعم المشروع من التوريد إلى التشغيل</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="group border-none shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${index === 1 ? "bg-secondary/10" : "bg-primary/10"}`}>
                      <Icon className={`h-7 w-7 ${index === 1 ? "text-secondary" : "text-primary"}`} />
                    </div>
                    <h3 className="mb-3 text-xl font-black text-slate-950">{service.title}</h3>
                    <p className="leading-relaxed text-slate-600">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-3 font-bold text-secondary">المقرات والتغطية</p>
              <h2 className="mb-4 text-3xl font-black text-slate-950 md:text-4xl">حضور تشغيلي داخل المملكة</h2>
              <p className="leading-relaxed text-slate-600">
                تغطي أساس الإعمار جميع مناطق المملكة: الرياض، مكة المكرمة، المدينة المنورة، الشرقية، عسير، جازان، الجوف، ينبع، والمناطق الشمالية والجنوبية، مع توصيل سريع حسب الكمية والموقع.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {locations.map((location) => (
                <Card key={location.city} className="border-slate-200 bg-slate-50">
                  <CardContent className="p-6">
                    <MapPinned className="mb-4 h-7 w-7 text-primary" />
                    <h3 className="text-lg font-black text-slate-950">{location.city}</h3>
                    <p className="mt-1 font-bold text-secondary">{location.label}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{location.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-center text-primary-foreground">
        <div className="container mx-auto max-w-3xl px-4">
          <Building2 className="mx-auto mb-5 h-10 w-10 text-secondary" />
          <h2 className="mb-6 text-3xl font-black md:text-4xl">اطلع على تقارير الأداء والإحصاءات</h2>
          <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80">
            نوفر صفحة تقارير منظمة تجمع الفلاتر، الجداول، المقارنات، الحصة السوقية، وحركة الكلنكر لتسهيل قراءة المشهد التشغيلي.
          </p>
          <Button size="lg" variant="secondary" className="font-bold" asChild>
            <Link href="/reports/full-report">عرض التقرير الشامل</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
