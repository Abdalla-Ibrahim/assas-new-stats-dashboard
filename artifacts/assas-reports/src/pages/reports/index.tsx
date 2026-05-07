import { Link } from "wouter";
import { ArrowLeft, BarChart3, Download, Factory, FileBarChart, FileText, LineChart, PieChart, Warehouse, TrendingUp, Clock, Layers } from "lucide-react";
import { useCementFactories } from "@/contexts/FactoriesContext";

const reports = [
  {
    title: "الإحصاءات الشاملة لقطاع الإسمنت",
    description: "مبيعات شركات الإسمنت، المبيعات المحلية، التصدير، الإنتاج، مخزون الكلنكر، والحصة السوقية في صفحة واحدة.",
    icon: BarChart3,
    link: "/reports/full-report",
    badge: "جاهز",
    badgeColor: "text-emerald-400 bg-emerald-500/15",
    accent: "#10b981",
  },
  {
    title: "مبيعات شركات الإسمنت خلال فترة",
    description: "مقارنة بين سنة أولى وسنة ثانية حسب الشهر والمنطقة مع نسبة التغير لكل بند.",
    icon: LineChart,
    link: "/reports/full-report",
    badge: "تفصيلي",
    badgeColor: "text-secondary bg-secondary/15",
    accent: "#f5b800",
  },
  {
    title: "المبيعات المحلية والمصدرة",
    description: "قراءة شهرية ومنذ بداية العام للمبيعات المحلية والتصدير حسب الشركات والحصة السوقية.",
    icon: FileBarChart,
    link: "/reports/full-report",
    badge: null,
    badgeColor: "",
    accent: "#3b82f6",
  },
  {
    title: "الإنتاج ومخزون الكلنكر",
    description: "بيان الإنتاج، المخزون، الكلنكر المشترى والمباع والمحلي والمصدر لكل شركة ومنطقة.",
    icon: Warehouse,
    link: "/reports/full-report",
    badge: null,
    badgeColor: "",
    accent: "#8b5cf6",
  },
  {
    title: "الحصة السوقية",
    description: "مقارنة حصص الإسمنت والكلنكر بين الشركات مع إبراز الشركة الرائدة في كل منطقة.",
    icon: PieChart,
    link: "/reports/full-report",
    badge: null,
    badgeColor: "",
    accent: "#ec4899",
  },
  {
    title: "هوية أساس ومقرات التشغيل",
    description: "ملخص الهوية، سنة الانطلاق، الخبرة، القيادة، المقر الرئيسي، فروع التوزيع ونطاق التغطية داخل المملكة.",
    icon: Factory,
    link: "/contact",
    badge: "هوية أساس",
    badgeColor: "text-primary bg-primary/15",
    accent: "#1e3a8a",
  },
  {
    title: "التقارير المالية السنوية",
    description: "مساحة مخصصة للبيانات المالية المدققة والميزانية العمومية عند اعتمادها للنشر.",
    icon: FileText,
    link: "#",
    badge: "قريباً",
    badgeColor: "text-slate-400 bg-slate-700/50",
    accent: "#64748b",
  },
  {
    title: "تقارير الاستدامة والجودة",
    description: "مساحة مخصصة لمؤشرات السلامة والجودة وكفاءة التشغيل والاستدامة اللوجستية.",
    icon: Layers,
    link: "#",
    badge: "قريباً",
    badgeColor: "text-slate-400 bg-slate-700/50",
    accent: "#64748b",
  },
];

export default function ReportsIndex() {
  const { factories } = useCementFactories();
  const quickStats = [
    { value: `${factories.length}`, label: "مصنع مُراقب", icon: Factory },
    { value: "8", label: "نوع تقرير", icon: FileText },
    { value: "2026-2000", label: "نطاق التاريخ", icon: Clock },
    { value: "RTL", label: "واجهة عربية", icon: TrendingUp },
  ];

  return (
    <div className="w-full" data-testid="page-reports-index">

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div className="absolute inset-0 pattern-grid opacity-30" />
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-secondary/8 blur-[120px]" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl">
            <div className="section-label mb-4">بوابة التقارير</div>
            <h1 className="mb-5 text-5xl font-black text-white md:text-6xl">
              التقارير
              <br />
              <span className="text-gradient-gold">والإحصاءات</span>
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-400">
              مركز موحد يعرض تفاصيل قطاع الإسمنت والخدمات التشغيلية المرتبطة به، مع إبراز هوية أساس الإعمار كشركة تعمل في التوريد الإسمنتي والنقل اللوجستي داخل المملكة.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
                    <Icon className="mx-auto mb-2 h-5 w-5 text-secondary" />
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* GOLD DIVIDER */}
      <div className="h-px w-full bg-gradient-to-l from-transparent via-secondary/50 to-transparent" />

      {/* REPORTS GRID */}
      <section className="bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <div className="section-label mb-3">جميع التقارير</div>
            <h2 className="text-3xl font-black text-white">اختر التقرير المناسب لاحتياجك</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {reports.map((report) => {
              const Icon = report.icon;
              const disabled = report.link === "#";
              const content = (
                <div
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-7 transition-all duration-300 ${
                    disabled
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:-translate-y-2 hover:border-white/20 cursor-pointer"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${report.accent}20` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: report.accent }} />
                  </div>

                  {/* Badge */}
                  {report.badge && (
                    <span className={`mb-3 inline-block self-start rounded-full px-3 py-0.5 text-xs font-bold ${report.badgeColor}`}>
                      {report.badge}
                    </span>
                  )}

                  <h3 className="mb-3 text-lg font-black text-white leading-snug">{report.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-slate-500">{report.description}</p>

                  {/* Bottom action */}
                  <div className="mt-6 flex items-center gap-2">
                    {disabled ? (
                      <span className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Download className="h-3.5 w-3.5" />
                        قريباً
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold transition-colors" style={{ color: report.accent }}>
                        عرض التفاصيل
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                      </span>
                    )}
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full"
                    style={{ background: `linear-gradient(90deg, ${report.accent}, transparent)` }}
                  />
                </div>
              );

              return disabled ? (
                <div key={report.title}>{content}</div>
              ) : (
                <Link key={report.title} href={report.link} className="flex flex-col">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-gradient-to-l from-secondary/8 via-transparent to-primary/8 p-10 text-center">
            <div className="absolute inset-0 pattern-dots opacity-20" />
            <div className="relative">
              <h2 className="mb-3 text-3xl font-black text-white">
                تريد تقريراً مخصصاً لمشروعك؟
              </h2>
              <p className="mb-8 text-slate-400">
                تواصل مع فريق أساس الإعمار للحصول على تحليل مخصص لمنطقتك والكميات المطلوبة.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-2xl bg-secondary px-8 py-4 font-black text-slate-950 shadow-xl shadow-secondary/20 transition-all hover:shadow-secondary/40 hover:-translate-y-0.5"
              >
                تواصل معنا الآن
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
