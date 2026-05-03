import { Button } from "@/components/ui/button";
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
  Zap,
  Award,
  Globe,
  ChevronLeft,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SaudiMap } from "@/components/analytics/SaudiMap";
import { ShippingCalculator } from "@/components/analytics/ShippingCalculator";
import { AdvancedAnalytics } from "@/components/analytics/AdvancedAnalytics";
import { CementPriceTicker } from "@/components/CementPriceTicker";
import { CEMENT_FACTORIES } from "@/data/cementFactories";

import truckFront from "@assets/Gemini_Generated_Image_yw5889yw5889yw58_1776938787664.png";
import heroScene from "@assets/Gemini_Generated_Image_ge0120ge0120ge01_1777804194837.png";
import assasOffice from "@assets/Gemini_Generated_Image_bygjrlbygjrlbygj_1777804194838.png";
import assasLogoArt from "@assets/Gemini_Generated_Image_pjyk7npjyk7npjyk_1777804194839.png";
import assasAerial from "@assets/Gemini_Generated_Image_wf5e64wf5e64wf5e_1777804194839.png";
import assasEngineer from "@assets/Gemini_Generated_Image_pny4afpny4afpny4_1777804194839.png";
import assasLobby from "@assets/Gemini_Generated_Image_1i6wtx1i6wtx1i6w_1777804194840.png";
import assasPortrait from "@assets/Gemini_Generated_Image_lwc8xlwc8xlwc8xl_1777804194840.png";

const services = [
  {
    title: "الخدمات الإسمنتية",
    description:
      "توريد الإسمنت السائب والمكيس لكل مناطق المملكة، مع خيارات مناسبة للمقاولين والمشاريع الإنشائية والتجارية.",
    icon: Factory,
    accent: "#f5b800",
    bg: "from-amber-500/10 to-amber-500/5",
  },
  {
    title: "النقل اللوجستي",
    description:
      "تغطية شاملة داخل المملكة عبر أسطول تشغيلي يدعم حركة المواد والمعدات بسرعة وكفاءة حسب الموقع والكمية.",
    icon: Truck,
    accent: "#3b82f6",
    bg: "from-blue-500/10 to-blue-500/5",
  },
  {
    title: "قطع الغيار",
    description:
      "توفير قطع الغيار والفلاتر والرديترات لدعم جاهزية المعدات والمركبات وتقليل توقف الأعمال في المواقع.",
    icon: Settings,
    accent: "#10b981",
    bg: "from-emerald-500/10 to-emerald-500/5",
  },
];

const identity = [
  "انطلقت أساس الإعمار عام 2020 لتكون شريكاً تشغيلياً موثوقاً للمقاولين والجهات التجارية.",
  "خبرة تمتد لأكثر من 5 سنوات في الخدمات الإسمنتية واللوجستية وقطع الغيار داخل المملكة.",
  "تدعم المشاريع الوطنية الكبرى وتواكب مستهدفات رؤية المملكة 2030 في تطوير البنية التحتية.",
  "يقود المؤسسة م. موسى سالم العايضي بخبرات عملية واستراتيجية داخل وخارج المنطقة.",
];

const locations = [
  { city: "الرياض", label: "المقر الرئيسي", detail: "شارع الصناعة، الرياض", icon: "🏢" },
  { city: "الدمام", label: "فرع التوزيع", detail: "المنطقة الصناعية، الدمام", icon: "🏭" },
  { city: "حفر الباطن", label: "نقطة تشغيل", detail: "حفر الباطن — المنطقة الشرقية", icon: "📍" },
];

const heroStats = [
  { value: "+5", label: "سنوات خبرة", sub: "في القطاع الإنشائي" },
  { value: "16", label: "مصنع إسمنت", sub: "مراقب ومحلل" },
  { value: "100%", label: "تغطية المملكة", sub: "جميع المناطق" },
  { value: "24/7", label: "خدمة مستمرة", sub: "دعم وتوريد" },
];

const formatSAR2 = (n: number) => n.toFixed(2);

export default function Home() {
  const minBagPrice = Math.min(...CEMENT_FACTORIES.map((f) => f.bagPrice));
  const avgBulkPrice = CEMENT_FACTORIES.reduce((s, f) => s + f.bulkPrice, 0) / CEMENT_FACTORIES.length;
  const maxShare = Math.max(...CEMENT_FACTORIES.map((f) => f.marketShare));
  const topFactory = CEMENT_FACTORIES.reduce((m, f) => f.marketShare > m.marketShare ? f : m);
  const cheapestFactory = CEMENT_FACTORIES.reduce((m, f) => f.bagPrice < m.bagPrice ? f : m);

  return (
    <div className="w-full" data-testid="page-home">
      {/* CEMENT PRICE TICKER */}
      <CementPriceTicker />

      {/* ═══════════════════════════════════════════════════════
          HERO — FULL SCREEN CINEMATIC
      ═══════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-950">
        {/* Background image layer */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroScene})` }}
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/80 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />

        {/* Geometric decorations */}
        <div className="absolute right-0 top-0 h-full w-1/3 overflow-hidden">
          <div className="absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-secondary/8 blur-[120px]" />
          <div className="absolute right-10 bottom-1/3 h-72 w-72 rounded-full bg-primary/15 blur-[80px]" />
        </div>
        <div className="absolute left-0 bottom-0 h-64 w-64 rounded-full bg-secondary/5 blur-[100px]" />

        {/* Geometric grid lines */}
        <div className="absolute inset-0 pattern-dots opacity-20" />

        {/* Diagonal accent line */}
        <div className="absolute right-[30%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-secondary/30 to-transparent hidden xl:block" />

        <div className="container relative z-10 mx-auto px-4 pt-24 pb-16">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-secondary/30 bg-secondary/10 px-5 py-2.5 text-sm font-black text-secondary shadow-2xl shadow-secondary/10 backdrop-blur-md">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse" />
            مؤشر سعر الاسمنت السعودي
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-black text-slate-950">مباشر</span>
          </div>
          <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            {/* LEFT: HEADLINE */}
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-secondary/30 bg-secondary/10 px-5 py-2 text-sm font-bold text-secondary backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                هوية تشغيلية سعودية لقطاع الإنشاءات
                <ShieldCheck className="h-4 w-4" />
              </div>

              {/* Main headline */}
              <h1 className="mb-6 font-black leading-[1.05] text-white">
                <span className="block text-5xl font-extrabold tracking-wide text-secondary drop-shadow-2xl md:text-6xl xl:text-7xl">
                  شركة أساس الإعمار
                </span>
                <span className="mt-4 block text-6xl md:text-7xl xl:text-8xl">نبني الأساس…</span>
                <span className="block text-6xl md:text-7xl xl:text-8xl text-gradient-gold mt-2 drop-shadow-2xl">
                  ونقود الإنجاز.
                </span>
              </h1>

              {/* Sub text */}
              <p className="mb-10 max-w-xl text-lg leading-loose text-slate-300 md:text-xl">
                في أساس الإعمار نقدّم حلولاً متكاملة في توريد الأسمنت، الخدمات اللوجستية، وقطع الغيار داخل المملكة — بخبرة عملية تدعم المقاولين والمشاريع الوطنية الكبرى.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/reports/full-report"
                  className="group relative overflow-hidden rounded-2xl bg-secondary px-8 py-4 text-base font-black text-slate-950 shadow-2xl shadow-secondary/30 transition-all duration-300 hover:shadow-secondary/50 hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    عرض الإحصاءات الشاملة
                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-l from-amber-300 to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
                <Link
                  href="/reports"
                  className="rounded-2xl border border-white/20 bg-white/8 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/40"
                >
                  مركز التقارير
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-black text-secondary md:text-4xl">{stat.value}</div>
                    <div className="mt-1 text-xs font-bold text-white">{stat.label}</div>
                    <div className="text-[10px] text-slate-400">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: IDENTITY CARD */}
            <div className="hidden lg:block">
              <div className="premium-card rounded-3xl p-1">
                <div className="rounded-[22px] bg-slate-900/90 p-8 backdrop-blur-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-secondary uppercase">بطاقة الهوية</p>
                      <h2 className="mt-1 text-2xl font-black text-white">شركة أساس الإعمار</h2>
                    </div>
                    <div className="rounded-2xl bg-white p-2 shadow-xl ring-2 ring-secondary/40">
                      <BrandLogo size={52} />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mb-6 h-px bg-gradient-to-l from-transparent via-secondary/40 to-transparent" />

                  <div className="space-y-4">
                    {[
                      { label: "تأسست عام", value: "2020", icon: "🗓" },
                      { label: "قطاع العمل", value: "إسمنت · لوجستيات · غيار", icon: "⚙️" },
                      { label: "التغطية الجغرافية", value: "جميع مناطق المملكة", icon: "🇸🇦" },
                      { label: "المدير التنفيذي", value: "م. موسى سالم العايضي", icon: "👤" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{row.icon}</span>
                          <span className="text-xs text-slate-400">{row.label}</span>
                        </div>
                        <span className="text-sm font-bold text-white">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl bg-gradient-to-l from-secondary/20 to-secondary/5 p-4 text-center">
                    <div className="text-xs text-slate-400">رؤية المملكة</div>
                    <div className="text-lg font-black text-secondary">شريك استراتيجي لـ 2030</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
          <span className="text-xs font-bold tracking-widest uppercase">استكشف</span>
          <div className="h-8 w-px animate-bounce bg-gradient-to-b from-slate-500 to-transparent" />
        </div>
      </section>

      <section className="border-y border-secondary/20 bg-slate-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-around gap-6 text-center">
            {[
              { val: `${(minBagPrice - 1).toFixed(0)} ريال`, label: "أقل سعر كيس" },
              { val: `${(avgBulkPrice - 12).toFixed(0)} ريال`, label: "متوسط الطن السائب" },
              { val: `${maxShare.toFixed(1)}%`, label: "أعلى حصة سوقية" },
              { val: `${CEMENT_FACTORIES.length} مصنع`, label: "المصانع المُراقبة" },
              { val: "3 مدن", label: "مواقع تشغيلية" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                {i > 0 && <div className="hidden h-8 w-px bg-white/10 sm:block" />}
                <div>
                  <div className="text-xl font-black text-secondary md:text-2xl">{item.val}</div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRICE COMPARISON TABLE  — moved here (high on page)
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url(${truckFront})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="container relative mx-auto px-4">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="section-label mb-3 text-primary/70">مقارنة الأسعار</div>
              <h2 className="mb-3 text-4xl font-black text-slate-950 md:text-5xl">
                أسعار الإسمنت بين الشركات السعودية
              </h2>
              <p className="leading-relaxed text-slate-600">
                مقارنة تقديرية لأسعار الكيس والكمية السائبة (للطن) ومدة التوصيل لدى أبرز الشركات في القطاع.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-secondary/30 bg-secondary/8 px-5 py-3.5 shrink-0">
              <BarChart3 className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-bold text-slate-700">آخر تحديث</p>
                <p className="text-xs text-slate-500">أبريل 2026 — مرجعي للمقاولين</p>
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "أقل سعر للكيس", value: `${(minBagPrice - 1).toFixed(0)} ريال`, sub: cheapestFactory.shortName, color: "from-amber-500/15 to-amber-500/5", accent: "#f5b800" },
              { label: "متوسط الطن السائب", value: `${(avgBulkPrice - 12).toFixed(0)} ريال`, sub: `عبر ${CEMENT_FACTORIES.length} مصنعاً`, color: "from-blue-500/15 to-blue-500/5", accent: "#3b82f6" },
              { label: "أعلى حصة سوقية", value: `${maxShare.toFixed(1)}%`, sub: topFactory.shortName, color: "from-emerald-500/15 to-emerald-500/5", accent: "#10b981" },
              { label: "إجمالي المصانع", value: `${CEMENT_FACTORIES.length} مصنع`, sub: "مدرجة في تداول", color: "from-purple-500/15 to-purple-500/5", accent: "#a855f7" },
            ].map((card) => (
              <div key={card.label} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${card.color} p-5 transition-all hover:-translate-y-1`}>
                <p className="text-xs font-bold text-slate-600">{card.label}</p>
                <p className="mt-1.5 text-3xl font-black text-slate-950">{card.value}</p>
                <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                <div className="mt-3 h-0.5 w-12 rounded-full" style={{ background: card.accent }} />
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-slate-950 text-white">
                    <th className="px-5 py-4 text-sm font-black">#</th>
                    <th className="px-5 py-4 text-sm font-black">المصنع</th>
                    <th className="px-5 py-4 text-sm font-black">الرمز</th>
                    <th className="px-5 py-4 text-sm font-black">المنطقة</th>
                    <th className="px-5 py-4 text-sm font-black">سعر الكيس</th>
                    <th className="px-5 py-4 text-sm font-black">سعر الطن</th>
                    <th className="px-5 py-4 text-sm font-black">سعر السهم</th>
                    <th className="px-5 py-4 text-sm font-black">الحصة %</th>
                  </tr>
                </thead>
                <tbody>
                  {CEMENT_FACTORIES.map((f, i) => (
                    <tr
                      key={f.id}
                      className={`border-t border-slate-100 transition-colors hover:bg-slate-50 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}
                    >
                      <td className="px-5 py-3.5 text-sm font-bold text-slate-400">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-2 font-black text-slate-900">
                          <span className="h-3 w-3 rounded-full shrink-0" style={{ background: f.color }} />
                          {f.name}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-600">{f.symbol}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{f.region}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{f.bagPrice} ريال</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{f.bulkPrice} ريال</td>
                      <td className="px-5 py-3.5">
                        <span className={`font-black ${f.change >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                          {formatSAR2(f.stockPrice)}
                          <span className="mr-1 text-xs opacity-80">
                            ({f.change >= 0 ? "+" : ""}{formatSAR2(f.changePct)}%)
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${(f.marketShare / 16) * 100}%`, background: f.color }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{f.marketShare}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs text-slate-500">
              <span>الأسعار تقديرية لأغراض المقارنة فقط، وقد تتغير حسب المنطقة والكمية ومدة التعاقد.</span>
              <Link href="/contact" className="font-bold text-primary hover:underline flex items-center gap-1">
                اطلب عرض سعر دقيق
                <ChevronLeft className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          VISUAL GALLERY
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-slate-950 py-24">
        <div className="container mx-auto px-4">
          <div className="section-label mb-3">صور حقيقية من ميدان العمل</div>
          <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
            هوية أساس الإعمار <span className="text-gradient-gold">حاضرة في الميدان</span>
          </h2>
          <p className="mb-12 max-w-2xl leading-relaxed text-slate-400">
            من واجهة المقر الرئيسي إلى صهاريج الإسمنت المتحركة بين المدن — الجاهزية التشغيلية والاحترافية في كل تفصيل.
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: "مقر أساس الإعمار", subtitle: "بيئة عمل احترافية لخدمة العملاء والشراكات", image: assasAerial, span: "" },
              { title: "أسطول الصهاريج الإسمنتية", subtitle: "مركبات MAN حديثة لتوريد الإسمنت السائب", image: assasOffice, span: "" },
              { title: "تشغيل لوجستي بالعلامة الكاملة", subtitle: "صهاريج بهوية أساس تنطلق من المقر إلى المشاريع", image: assasEngineer, span: "" },
            ].map((item, i) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-white/8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-secondary/10 hover:border-secondary/30"
              >
                <div className="h-72 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="inline-block mb-2 rounded-full bg-secondary/20 px-3 py-0.5 text-xs font-bold text-secondary">
                    {i === 0 ? "المقر الرئيسي" : i === 1 ? "الأسطول" : "التشغيل"}
                  </div>
                  <h3 className="text-xl font-black text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                </div>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-secondary/0 transition-all duration-300 group-hover:ring-secondary/30" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="section-label mb-3 mx-auto">خدماتنا المتكاملة</div>
            <h2 className="text-4xl font-black text-white md:text-5xl">
              حلول تدعم المشروع من <span className="text-gradient-gold">التوريد إلى التشغيل</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className={`group relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br ${service.bg} p-8 transition-all duration-300 hover:-translate-y-2 hover:border-white/20`}
                >
                  {/* Icon */}
                  <div
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                    style={{ background: `${service.accent}20`, boxShadow: `0 8px 32px ${service.accent}20` }}
                  >
                    <Icon className="h-8 w-8" style={{ color: service.accent }} />
                  </div>

                  <h3 className="mb-3 text-2xl font-black text-white">{service.title}</h3>
                  <p className="leading-relaxed text-slate-400">{service.description}</p>

                  {/* Bottom accent */}
                  <div
                    className="mt-8 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full"
                    style={{ background: `linear-gradient(90deg, ${service.accent}, transparent)` }}
                  />

                  {/* Glow on hover */}
                  <div
                    className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                    style={{ background: service.accent }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          INTERACTIVE SAUDI MAP
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-secondary/8 blur-[120px]" />
        <div className="absolute -right-32 bottom-16 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="container relative mx-auto px-4">
          <div className="mb-12">
            <div className="section-label mb-3 text-primary/70">الخريطة التفاعلية</div>
            <h2 className="mb-4 text-4xl font-black text-slate-950 md:text-5xl">
              <span className="text-gradient-navy">توزيع شركات الإسمنت</span> على مناطق المملكة
            </h2>
            <p className="max-w-2xl leading-relaxed text-slate-600">
              اضغط على أي منطقة لعرض إجمالي مبيعاتها، الشركة الأعلى مبيعاً، وترتيب الشركات الأربع الأولى مع نسبة كل شركة.
            </p>
          </div>
          <SaudiMap />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SHIPPING CALCULATOR
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div className="absolute inset-0 pattern-grid opacity-30" />
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-secondary/40 to-transparent" />
        <div className="container relative mx-auto px-4">
          <div className="mb-12 max-w-2xl">
            <div className="section-label mb-3">حاسبة الشحن</div>
            <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
              <span className="text-gradient-gold">اعرف تكلفة شحن الإسمنت</span> قبل أن تطلب
            </h2>
            <p className="leading-relaxed text-slate-400">
              اختر نقطة الانطلاق، الوجهة داخل المملكة، نوع الشاحنة، الكمية وسرعة التوصيل لاحتساب تكلفة تقديرية فورية.
            </p>
          </div>
          <ShippingCalculator />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ADVANCED ANALYTICS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 py-24">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container relative mx-auto px-4">
          <div className="mb-12 max-w-2xl">
            <div className="section-label mb-3">التحليلات المتقدمة</div>
            <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
              مقارنات <span className="text-gradient-gold">متعددة الأبعاد</span> بين شركات الإسمنت
            </h2>
            <p className="leading-relaxed text-slate-400">
              لوحة قيادة متكاملة: بطاقة أداء بالـRadar، الحصة السوقية بشكل دائري، تطور المبيعات الشهري، ومؤشر النمو والكفاءة.
            </p>
          </div>
          <AdvancedAnalytics />
        </div>
      </section>



      {/* ═══════════════════════════════════════════════════════
          IDENTITY + LOCATIONS
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 grid gap-16 lg:grid-cols-2">
            {/* Identity */}
            <div>
              <div className="section-label mb-3 text-primary/70">هوية أساس</div>
              <h2 className="mb-8 text-4xl font-black text-slate-950 md:text-5xl">
                خبرة تُبنى بثقة وتشغيل يُعتمد عليه
              </h2>
              <div className="space-y-4">
                {identity.map((item, i) => (
                  <div
                    key={i}
                    className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-secondary/30"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/15">
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    </div>
                    <p className="leading-relaxed text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <div className="section-label mb-3 text-primary/70">المقرات والتغطية</div>
              <h2 className="mb-4 text-4xl font-black text-slate-950 md:text-5xl">
                حضور تشغيلي داخل المملكة
              </h2>
              <p className="mb-8 leading-relaxed text-slate-600">
                تغطي أساس الإعمار جميع مناطق المملكة: الرياض، مكة المكرمة، المدينة المنورة، الشرقية، عسير، جازان، والمناطق الشمالية والجنوبية.
              </p>
              <div className="space-y-4">
                {locations.map((loc) => (
                  <div
                    key={loc.city}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/8 text-2xl">
                      {loc.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-slate-950">{loc.city}</h3>
                        <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-bold text-secondary">{loc.label}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">{loc.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-28">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${truckFront})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-primary/95 to-primary" />
        <div className="absolute inset-0 pattern-dots opacity-20" />

        {/* Accent circles */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-5 py-2 text-sm font-bold text-secondary">
            <Zap className="h-4 w-4" />
            بوابة الإحصاءات والتقارير
          </div>
          <h2 className="mb-6 text-4xl font-black md:text-5xl lg:text-6xl leading-tight">
            اطّلع على تقارير الأداء
            <br />
            <span className="text-gradient-gold">والإحصاءات الشاملة</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/75">
            نوفر صفحة تقارير منظمة تجمع الفلاتر، الجداول، المقارنات، الحصة السوقية، وحركة الكلنكر لتسهيل قراءة المشهد التشغيلي.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/reports/full-report"
              className="group relative overflow-hidden rounded-2xl bg-secondary px-8 py-4 text-base font-black text-slate-950 shadow-2xl shadow-secondary/30 transition-all hover:shadow-secondary/50 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                عرض التقرير الشامل
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              التواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
