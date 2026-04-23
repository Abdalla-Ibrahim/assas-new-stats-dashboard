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
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

import officeImage from "@assets/Gemini_Generated_Image_rid8qnrid8qnrid8_1776938760079.png";
import truckFront from "@assets/Gemini_Generated_Image_yw5889yw5889yw58_1776938787664.png";
import truckSide from "@assets/Gemini_Generated_Image_jzlp98jzlp98jzlp_1776938787666.png";

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

const visualGallery = [
  {
    title: "مقر أساس الإعمار",
    subtitle: "بيئة عمل احترافية لخدمة العملاء والشراكات",
    image: officeImage,
  },
  {
    title: "أسطول الصهاريج الإسمنتية",
    subtitle: "مركبات MAN حديثة لتوريد الإسمنت السائب",
    image: truckFront,
  },
  {
    title: "تشغيل لوجستي بالعلامة الكاملة",
    subtitle: "صهاريج بهوية أساس تنطلق من المقر إلى المشاريع",
    image: truckSide,
  },
];

type PriceRow = {
  company: string;
  bagPrice: number;
  bulkPrice: number;
  delivery: string;
  highlighted?: boolean;
  trend: "up" | "down" | "flat";
};

const priceComparison: PriceRow[] = [
  { company: "أساس الإعمار", bagPrice: 14.5, bulkPrice: 285, delivery: "24-72 ساعة", highlighted: true, trend: "down" },
  { company: "أسمنت اليمامة", bagPrice: 15.0, bulkPrice: 295, delivery: "48-96 ساعة", trend: "up" },
  { company: "أسمنت الرياض", bagPrice: 15.25, bulkPrice: 298, delivery: "48-72 ساعة", trend: "flat" },
  { company: "أسمنت القصيم", bagPrice: 15.5, bulkPrice: 305, delivery: "72-120 ساعة", trend: "up" },
  { company: "أسمنت الجنوبية", bagPrice: 14.75, bulkPrice: 289, delivery: "48-96 ساعة", trend: "down" },
  { company: "أسمنت ينبع", bagPrice: 15.1, bulkPrice: 292, delivery: "72-120 ساعة", trend: "flat" },
];

const formatNumber = (value: number) =>
  new Intl.NumberFormat("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const creativeIdeas = [
  {
    title: "خريطة تغطية تفاعلية",
    description: "عرض مسارات التوصيل من الرياض والدمام وحفر الباطن إلى المدن الرئيسية مع مدة تقديرية لكل منطقة.",
    icon: MapPinned,
  },
  {
    title: "مؤشر جاهزية التوريد",
    description: "بطاقات يومية توضح توفر الإسمنت المكيس والسائب، الطاقة المتاحة، ومؤشر الطلب حسب المنطقة.",
    icon: BarChart3,
  },
  {
    title: "بوابة عروض الأسعار",
    description: "تحويل نموذج التواصل إلى رحلة طلب كاملة: المدينة، الكمية، نوع الإسمنت، وقت التسليم، ثم رقم طلب للمتابعة.",
    icon: Building2,
  },
  {
    title: "كتالوج مرئي للمنتجات",
    description: "صفحة صور للمنتجات وقطع الغيار مع تصنيفات واضحة وفلاتر حسب الاستخدام والمدينة.",
    icon: Factory,
  },
];

export default function Home() {
  return (
    <div className="w-full" data-testid="page-home">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${truckSide})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/95 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(135deg,transparent_0%,rgba(245,166,35,0.08)_50%,transparent_50%)] bg-[length:34px_34px] opacity-60" />
        <div className="container relative z-10 mx-auto px-4 py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-secondary" />
                هوية تشغيلية سعودية لقطاع الإنشاءات والخدمات المساندة
              </div>
              <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
                نبني الأساس… <br />
                <span className="text-secondary drop-shadow-lg">ونقود الإنجاز.</span>
              </h1>
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-slate-200 md:text-xl">
                في أساس الإعمار نقدّم حلولاً متكاملة في توريد الأسمنت، الخدمات اللوجستية، وقطع الغيار داخل المملكة، بخبرة عملية تدعم المقاولين والمشاريع الوطنية الكبرى.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-secondary font-bold text-secondary-foreground shadow-xl shadow-secondary/30 hover:bg-secondary/90" asChild>
                  <Link href="/reports/full-report">
                    عرض الإحصاءات الشاملة <ArrowLeft className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white bg-white/5 text-white backdrop-blur hover:bg-white/15" asChild>
                  <Link href="/reports">مركز التقارير</Link>
                </Button>
              </div>
            </div>

            <Card className="border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-md">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm text-slate-300">بطاقة الهوية</p>
                    <h2 className="text-2xl font-black">شركة أساس الإعمار</h2>
                  </div>
                  <div className="rounded-2xl bg-white p-2 shadow-lg shadow-secondary/20 ring-4 ring-white/10">
                    <BrandLogo size={64} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
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

      {/* GALLERY WITH REAL IMAGES */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 font-bold text-secondary">صور حقيقية من ميدان العمل</p>
            <h2 className="mb-4 text-3xl font-black md:text-4xl">هوية أساس الإعمار حاضرة في المقر والأسطول</h2>
            <p className="leading-relaxed text-slate-300">
              من واجهة المقر الرئيسي إلى صهاريج الإسمنت المتحركة بين المدن، تعكس هذه الصور الجاهزية التشغيلية والاحترافية في كل تفصيل.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {visualGallery.map((item, i) => (
              <div
                key={item.title}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl transition-all hover:-translate-y-1 hover:shadow-secondary/20 ${
                  i === 0 ? "md:col-span-1" : ""
                }`}
              >
                <div className="h-72 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-6 pt-16">
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE COMPARISON */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-20">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url(${truckFront})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="container relative mx-auto px-4">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 font-bold text-secondary">مقارنة الأسعار</p>
              <h2 className="mb-3 text-3xl font-black text-slate-950 md:text-4xl">
                أسعار الإسمنت بين الشركات السعودية
              </h2>
              <p className="leading-relaxed text-slate-600">
                مقارنة تقديرية لأسعار الكيس والكمية السائبة (للطن) ومدة التوصيل لدى أبرز الشركات في القطاع — مع تمييز موقع أساس الإعمار التنافسي.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-secondary/30 bg-secondary/10 px-5 py-3">
              <BarChart3 className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-bold text-slate-700">آخر تحديث</p>
                <p className="text-xs text-slate-500">أبريل 2026 — مرجعي للمقاولين</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-6 py-4 text-sm font-black">الشركة</th>
                    <th className="px-6 py-4 text-sm font-black">سعر الكيس (ريال)</th>
                    <th className="px-6 py-4 text-sm font-black">سعر الطن سائب (ريال)</th>
                    <th className="px-6 py-4 text-sm font-black">مدة التوصيل</th>
                    <th className="px-6 py-4 text-sm font-black">الاتجاه</th>
                  </tr>
                </thead>
                <tbody>
                  {priceComparison.map((row) => {
                    const TrendIcon =
                      row.trend === "up" ? TrendingUp : row.trend === "down" ? TrendingDown : BarChart3;
                    const trendColor =
                      row.trend === "up"
                        ? "text-rose-600 bg-rose-50"
                        : row.trend === "down"
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-600 bg-slate-100";
                    return (
                      <tr
                        key={row.company}
                        className={`border-t border-slate-100 transition-colors ${
                          row.highlighted ? "bg-primary/5" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {row.highlighted && (
                              <span className="inline-flex h-2 w-2 rounded-full bg-secondary" />
                            )}
                            <span className={`font-black ${row.highlighted ? "text-primary" : "text-slate-800"}`}>
                              {row.company}
                            </span>
                            {row.highlighted && (
                              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white">
                                موقعنا
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-700">{formatNumber(row.bagPrice)}</td>
                        <td className="px-6 py-5 font-bold text-slate-700">{formatNumber(row.bulkPrice)}</td>
                        <td className="px-6 py-5 text-sm text-slate-600">{row.delivery}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${trendColor}`}>
                            <TrendIcon className="h-3.5 w-3.5" />
                            {row.trend === "up" ? "ارتفاع" : row.trend === "down" ? "انخفاض" : "ثابت"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs text-slate-500">
              <span>الأسعار تقديرية لأغراض المقارنة فقط، وقد تتغير حسب المنطقة والكمية ومدة التعاقد.</span>
              <Link href="/contact" className="font-bold text-primary hover:underline">
                اطلب عرض سعر دقيق ←
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="border-secondary/40 bg-white shadow-md">
              <CardContent className="p-5">
                <p className="text-xs font-bold text-secondary">أقل سعر للكيس</p>
                <p className="mt-1 text-2xl font-black text-slate-950">{formatNumber(14.5)} ريال</p>
                <p className="mt-1 text-xs text-slate-500">لدى أساس الإعمار</p>
              </CardContent>
            </Card>
            <Card className="border-primary/30 bg-white shadow-md">
              <CardContent className="p-5">
                <p className="text-xs font-bold text-primary">متوسط الطن السائب</p>
                <p className="mt-1 text-2xl font-black text-slate-950">{formatNumber(294)} ريال</p>
                <p className="mt-1 text-xs text-slate-500">عبر 6 شركات سعودية</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white shadow-md">
              <CardContent className="p-5">
                <p className="text-xs font-bold text-slate-600">أسرع توصيل</p>
                <p className="mt-1 text-2xl font-black text-slate-950">24-72 ساعة</p>
                <p className="mt-1 text-xs text-slate-500">حسب المنطقة والكمية</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* IDENTITY */}
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

      {/* SERVICES */}
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

      {/* LOCATIONS */}
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

      {/* CREATIVE IDEAS */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 font-bold text-secondary">أفكار إبداعية إضافية</p>
            <h2 className="mb-4 text-3xl font-black text-slate-950 md:text-4xl">اقتراحات تجعل الموقع أداة عمل وليس واجهة تعريف فقط</h2>
            <p className="leading-relaxed text-slate-600">
              هذه الأفكار وضعتها كقسم جاهز للعرض، ويمكن تحويل أي فكرة منها لاحقاً إلى صفحة كاملة أو نظام تفاعلي مرتبط ببيانات حقيقية.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {creativeIdeas.map((idea) => {
              const Icon = idea.icon;
              return (
                <Card key={idea.title} className="border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-black text-slate-950">{idea.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{idea.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary py-20 text-center text-primary-foreground">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${truckFront})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-l from-primary via-primary/95 to-primary/80" />
        <div className="container relative mx-auto max-w-3xl px-4">
          <Building2 className="mx-auto mb-5 h-10 w-10 text-secondary" />
          <h2 className="mb-6 text-3xl font-black md:text-4xl">اطلع على تقارير الأداء والإحصاءات</h2>
          <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80">
            نوفر صفحة تقارير منظمة تجمع الفلاتر، الجداول، المقارنات، الحصة السوقية، وحركة الكلنكر لتسهيل قراءة المشهد التشغيلي.
          </p>
          <Button size="lg" variant="secondary" className="font-bold shadow-xl" asChild>
            <Link href="/reports/full-report">عرض التقرير الشامل</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
