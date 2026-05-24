import { Link } from "wouter";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileBarChart,
  MapPinned,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SaudiMap } from "@/components/analytics/SaudiMap";
import { PriceInsights } from "@/components/analytics/PriceInsights";
import { MarketIntelligence } from "@/components/analytics/MarketIntelligence";
import { ShippingCalculator } from "@/components/analytics/ShippingCalculator";
import { CementPriceTicker } from "@/components/CementPriceTicker";
import { useCementFactories } from "@/contexts/FactoriesContext";
import { useLang } from "@/contexts/LanguageContext";

import truckFront from "@assets/Gemini_Generated_Image_yw5889yw5889yw58_1776938787664.png";
import heroScene from "@assets/Gemini_Generated_Image_ge0120ge0120ge01_1777804194837.png";

const formatSAR2 = (n: number) => Number(n).toFixed(2);

export default function Home() {
  const { t, locale } = useLang();
  const { factories } = useCementFactories();

  const copy =
    locale === "en"
      ? {
          exchangeBadge: "Saudi Cement Exchange",
          headline: "Saudi Cement Price Index",
          headlineAccent: "Market Intelligence Platform",
          subheadline:
            "A compact market view for comparing Saudi cement prices, regional movement, suppliers, and reports using estimated demo data.",
          operatorBadge: "Operated by Assas Al-A'mar",
          dataStatus: "Demo version · Estimated data · Last updated: April 2026",
          ctaReports: "View Market Reports",
          ctaCompare: "Compare Cement Prices",
          snapshotLabel: "Market Snapshot",
          snapshotTitle: "Saudi cement market snapshot",
          snapshotSub:
            "Estimated indicators covering monitored factories, average pricing, regional coverage, and market-share signals.",
          priceSignalLabel: "Price Intelligence",
          priceSignalTitle: "Price analysis and market signals",
          priceSignalSub:
            "Clear comparison of bag prices, bulk prices, spreads, supplier ranking, and demand signals based on the current static dataset.",
          mapLabel: "Regional Visibility",
          mapTitle: "Regional cement market visibility",
          mapSub:
            "Compare factory presence, production intensity, capacity utilization, and supplier concentration across Saudi regions.",
          reportsLabel: "Reports Platform",
          reportsTitle: "Professional cement price and market reports",
          reportsSub:
            "Reports organize price movement, supplier performance, clinker movement, and regional analysis into a decision-ready market view.",
          supplierLabel: "Supplier Intelligence",
          supplierTitle: "Monitored factory and supplier benchmark",
          supplierSub:
            "Evaluate monitored cement companies by bag price, bulk price, market share, production capacity, utilization, and listed-market movement.",
          operatorLabel: "Platform Operator",
          operatorTitle: "Assas Al-A'mar operates the market intelligence layer",
          operatorSub:
            "Assas remains visible as the operating and trust layer behind the platform, while the homepage leads with the Saudi cement index product.",
          finalTitle: "Access the Saudi cement market view",
          finalSub:
            "Review the current product demo and the full market-intelligence capability, with a foundation that can later scale into controlled access for institutions.",
        }
      : locale === "zh"
      ? {
          exchangeBadge: "沙特水泥市场指数",
          headline: "沙特水泥价格指数",
          headlineAccent: "市场情报平台",
          subheadline: "用于比较沙特水泥价格、区域变化、供应商和报告的紧凑市场视图，基于估算演示数据。",
          operatorBadge: "由阿萨斯建筑运营",
          dataStatus: "演示版本 · 估算数据 · 最近更新：2026年4月",
          ctaReports: "查看市场报告",
          ctaCompare: "比较水泥价格",
          snapshotLabel: "市场快照",
          snapshotTitle: "沙特水泥市场快照",
          snapshotSub: "估算指标覆盖监测工厂、平均价格、区域覆盖和市场份额信号。",
          priceSignalLabel: "价格情报",
          priceSignalTitle: "价格分析与市场信号",
          priceSignalSub: "基于当前静态数据，清晰比较袋装价格、散装价格、价差、供应商排名和需求信号。",
          mapLabel: "区域可见性",
          mapTitle: "区域水泥市场可见性",
          mapSub: "比较沙特各地区的工厂覆盖、生产强度、产能利用率和供应商集中度。",
          reportsLabel: "报告平台",
          reportsTitle: "专业水泥价格和市场报告",
          reportsSub: "报告将价格走势、供应商表现、熟料流动和区域分析整理为可辅助决策的市场视图。",
          supplierLabel: "供应商情报",
          supplierTitle: "监测工厂和供应商基准",
          supplierSub: "按袋装价格、散装价格、市场份额、产能、利用率和上市市场变化评估被监测的水泥企业。",
          operatorLabel: "平台运营方",
          operatorTitle: "阿萨斯建筑运营市场情报层",
          operatorSub: "阿萨斯作为平台背后的运营和信任层保持可见，首页优先呈现沙特水泥指数产品。",
          finalTitle: "进入沙特水泥市场视图",
          finalSub: "查看当前产品演示和完整市场情报能力，并为未来机构级访问控制打好基础。",
        }
      : {
          exchangeBadge: "مؤشر سوق الإسمنت السعودي",
          headline: "منصة تحليل سوق الإسمنت السعودي",
          headlineAccent: "منصة تحليلات سوقية",
          subheadline:
            "واجهة مختصرة لمقارنة أسعار الإسمنت بين الشركات السعودية واستعراض تقارير السوق المهنية.",
          operatorBadge: "تشغّلها أساس الإعمار",
          dataStatus: "بيانات تقديرية · آخر تحديث: أبريل 2026",
          ctaReports: "عرض تقارير السوق",
          ctaCompare: "مقارنة أسعار الإسمنت",
          snapshotLabel: "لمحة السوق",
          snapshotTitle: "لمحة سوقية عن أسعار الإسمنت السعودي",
          snapshotSub:
            "مؤشرات تقديرية تغطي المصانع المراقبة، متوسط الأسعار، التغطية الإقليمية، وإشارات الحصة السوقية.",
          priceSignalLabel: "ذكاء الأسعار",
          priceSignalTitle: "تحليل متقدم (نسخة تجريبية)",
          priceSignalSub:
            "مقارنة واضحة لأسعار الكيس والطن، نطاقات السعر، ترتيب الموردين، وإشارات الطلب بناءً على البيانات الثابتة الحالية.",
          mapLabel: "الرؤية الإقليمية",
          mapTitle: "الرؤية الإقليمية لسوق الإسمنت",
          mapSub:
            "قارن حضور المصانع، كثافة الإنتاج، استغلال الطاقة، وتركيز الموردين عبر مناطق المملكة.",
          reportsLabel: "منصة التقارير",
          reportsTitle: "تقارير مهنية لأسعار وسوق الإسمنت",
          reportsSub:
            "تنظم التقارير حركة الأسعار، أداء الموردين، حركة الكلنكر، والتحليل الإقليمي في عرض سوقي جاهز لاتخاذ القرار.",
          supplierLabel: "ذكاء الموردين",
          supplierTitle: "معيارية المصانع والموردين المراقبين",
          supplierSub:
            "قيّم الشركات الإسمنتية المراقبة حسب سعر الكيس، سعر الطن، الحصة السوقية، الطاقة الإنتاجية، الاستغلال، وحركة الشركات المدرجة.",
          operatorLabel: "مشغّل المنصة",
          operatorTitle: "أساس الإعمار تشغّل طبقة تحليلات السوق",
          operatorSub:
            "تبقى هوية أساس واضحة كطبقة تشغيل وثقة خلف المنصة، بينما تقود الصفحة الرئيسية بمنتج مؤشر الإسمنت السعودي.",
          finalTitle: "ادخل إلى رؤية السوق الإسمنتي السعودي",
          finalSub:
            "راجع العرض التوضيحي الحالي وقدرات التحليل السوقي الكاملة، مع أساس قابل للتوسع لاحقاً لوصول مؤسسي مخصص.",
        };

  const identity =
    locale === "en"
      ? [
          "Founded in 2020 with operational experience in the Saudi cement and construction supply market.",
          "Positioned to operate a professional cement index and market intelligence layer for decision-makers.",
          "Supports contractors, suppliers, investors, procurement teams, and construction-sector stakeholders.",
        ]
      : locale === "zh"
      ? [
          "成立于2020年，具备沙特水泥和建筑供应市场的运营经验。",
          "定位为面向决策者的专业水泥指数和市场情报运营层。",
          "服务承包商、供应商、投资者、采购团队和建筑行业相关方。",
        ]
      : [
          "تأسست عام 2020 بخبرة تشغيلية في سوق الإسمنت وتوريد قطاع الإنشاءات داخل المملكة.",
          "تتموضع لتشغيل طبقة مهنية لمؤشر الإسمنت وتحليلات السوق لصنّاع القرار.",
          "تخدم المقاولين، الموردين، المستثمرين، فرق المشتريات، والجهات المؤثرة في قطاع البناء.",
        ];

  const locations =
    locale === "en"
      ? [
          { city: "Riyadh", label: "HQ", detail: "Market operations and platform coordination" },
          { city: "Dammam", label: "Eastern Coverage", detail: "Industrial and supply-chain visibility" },
          { city: "Hafar Al-Batin", label: "Operating Point", detail: "Northern and Eastern operational reach" },
        ]
      : locale === "zh"
      ? [
          { city: "利雅得", label: "总部", detail: "市场运营与平台协调" },
          { city: "达曼", label: "东部覆盖", detail: "工业和供应链可见性" },
          { city: "哈法尔巴廷", label: "运营点", detail: "北部和东部运营覆盖" },
        ]
      : [
          { city: "الرياض", label: "المقر الرئيسي", detail: "تشغيل السوق وتنسيق المنصة" },
          { city: "الدمام", label: "تغطية الشرقية", detail: "رؤية صناعية ولوجستية لسلاسل التوريد" },
          { city: "حفر الباطن", label: "نقطة تشغيل", detail: "امتداد تشغيلي شمالي وشرقي" },
        ];

  const minBagPrice = Number(Math.min(...factories.map((f) => f.bagPrice)).toFixed(2));
  const avgBagPrice = Number((factories.reduce((s, f) => s + f.bagPrice, 0) / factories.length).toFixed(2));
  const minBulkPrice = Number(Math.min(...factories.map((f) => f.bulkPrice)).toFixed(2));
  const avgBulkPrice = Number((factories.reduce((s, f) => s + f.bulkPrice, 0) / factories.length).toFixed(2));
  const maxBulkPrice = Number(Math.max(...factories.map((f) => f.bulkPrice)).toFixed(2));
  const maxShare = Math.max(...factories.map((f) => f.marketShare));
  const topFactory = factories.reduce((m, f) => (f.marketShare > m.marketShare ? f : m));
  const cheapestFactory = factories.reduce((m, f) => (f.bagPrice < m.bagPrice ? f : m));
  const cheapestBulkFactory = factories.reduce((m, f) => (f.bulkPrice < m.bulkPrice ? f : m));
  const totalCapacity = factories.reduce((s, f) => s + f.capacity, 0);
  const regionsCount = new Set(factories.map((f) => f.regionId)).size;
  const sortedByPrice = [...factories].sort((a, b) => a.bagPrice - b.bagPrice);
  const topFactories = [...factories].sort((a, b) => b.marketShare - a.marketShare).slice(0, 4);

  const priceMin = sortedByPrice[0].bagPrice;
  const priceMax = sortedByPrice[sortedByPrice.length - 1].bagPrice;
  const priceRange = priceMax - priceMin;
  const priceColor = (p: number) =>
    p <= avgBagPrice ? "#10b981" : p <= avgBagPrice + 0.75 ? "#f59e0b" : "#ef4444";

  const marketSnapshot = [
    { value: `${formatSAR2(minBagPrice)} ${t.priceTable.sar}`, label: t.stats.lowestBag, sub: cheapestFactory.shortName },
    { value: `${formatSAR2(avgBagPrice)} ${t.priceTable.sar}`, label: t.stats.avgBag, sub: t.priceTable.avgBagSub },
    { value: `${formatSAR2(maxShare)}%`, label: t.stats.topShare, sub: topFactory.shortName },
    { value: `${factories.length}`, label: t.stats.factories, sub: t.priceTable.listedIn },
    { value: `${regionsCount}`, label: locale === "en" ? "Regions Covered" : locale === "zh" ? "覆盖区域" : "مناطق مغطاة", sub: "KSA" },
  ];

  const bulkSnapshot = [
    { value: `${formatSAR2(minBulkPrice)} ${t.priceTable.sar}`, label: "أقل سعر للطن", sub: cheapestBulkFactory.shortName, color: "from-amber-500/15 to-amber-500/5", accent: "#f5b800" },
    { value: `${formatSAR2(avgBulkPrice)} ${t.priceTable.sar}`, label: "متوسط سعر الطن", sub: "مرجع تسعيري تقريبي", color: "from-blue-500/15 to-blue-500/5", accent: "#3b82f6" },
    { value: `${formatSAR2(maxBulkPrice)} ${t.priceTable.sar}`, label: "أعلى سعر للطن", sub: "", color: "from-emerald-500/15 to-emerald-500/5", accent: "#10b981" },
    { value: `${totalCapacity.toLocaleString("ar-SA")} طن/سنة`, label: "إجمالي الطاقة الإنتاجية", sub: "", color: "from-purple-500/15 to-purple-500/5", accent: "#a855f7" },
  ];

  return (
    <div className="w-full" data-testid="page-home">
      <CementPriceTicker />

      {/* HERO — COMPACT MARKET HEADER */}
      <section className="relative overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroScene})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/86 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
        <div className="absolute inset-0 pattern-dots opacity-15" />

        <div className="container relative z-10 mx-auto px-4 py-4 md:py-5">
          <div className="max-w-5xl">
            <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-secondary/35 bg-secondary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-secondary">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                {copy.exchangeBadge}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-bold text-white/80 backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
                {copy.operatorBadge}
              </span>
            </div>

            <h1 className="max-w-4xl text-2xl font-black leading-tight text-white md:text-3xl xl:text-4xl">{copy.headline}</h1>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
              {copy.subheadline}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-xl border border-secondary/25 bg-slate-950/55 px-4 py-2 text-xs font-bold text-slate-300 backdrop-blur-md">
                <BarChart3 className="h-4 w-4 text-secondary" />
                {copy.dataStatus}
              </div>

              <a
                href="#price-comparison"
                className="rounded-xl border border-white/20 bg-white/8 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/15"
              >
                {copy.ctaCompare}
              </a>
              <Link
                href="/reports/full-report"
                className="group relative overflow-hidden rounded-xl bg-secondary px-4 py-2 text-sm font-black text-slate-950 shadow-xl shadow-secondary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-secondary/35"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {copy.ctaReports}
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRICE COMPARISON TABLE */}
      <section id="price-comparison" className="relative scroll-mt-28 overflow-hidden bg-slate-50 py-16 md:py-20">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-transparent via-secondary to-transparent" />
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: `url(${truckFront})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="container relative mx-auto px-4">
          <div className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl md:p-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <div className="section-label mb-3">
                  {locale === "en" ? "Price Comparison" : locale === "zh" ? "价格对比" : "مقارنة الأسعار"}
                </div>
                <h2 className="mb-3 text-4xl font-black text-white md:text-5xl">
                  {locale === "en"
                    ? "Cement Prices Across Saudi Companies"
                    : locale === "zh"
                    ? "沙特各公司水泥价格"
                    : "أسعار الإسمنت بين الشركات السعودية"}
                </h2>
                <p className="max-w-2xl leading-relaxed text-slate-400">
                  {locale === "en"
                    ? "Compare bag and bulk ton prices across monitored Saudi cement companies, with price indicators, market-share context, and estimated data status."
                    : locale === "zh"
                    ? "比较被监测的沙特水泥公司袋装和散装吨价，并查看价格指标、市场份额背景和估算数据状态。"
                    : "قارن أسعار الكيس والطن بين الشركات السعودية المراقبة، مع مؤشرات السعر، سياق الحصة السوقية، وحالة البيانات التقديرية."}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 md:items-end">
                <div className="flex items-center gap-3 rounded-2xl border border-secondary/30 bg-secondary/10 px-5 py-3.5">
                  <BarChart3 className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="text-sm font-black text-secondary">{copy.dataStatus}</p>
                    <p className="text-xs text-slate-500">{t.priceTable.updatedSub}</p>
                  </div>
                </div>
                <Link
                  href="/reports/full-report"
                  className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5 hover:shadow-secondary/40"
                >
                  {locale === "en" ? "View Full Price Analysis" : locale === "zh" ? "查看完整价格分析" : "عرض تحليل الأسعار الكامل"}
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bulkSnapshot.map((card) => (
              <div key={card.label} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${card.color} p-5 transition-all hover:-translate-y-1`}>
                <p className="text-xs font-bold text-slate-600">{card.label}</p>
                <p className="mt-1.5 text-3xl font-black text-slate-950">{card.value}</p>
                <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                <div className="mt-3 h-0.5 w-12 rounded-full" style={{ background: card.accent }} />
              </div>
            ))}
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t.priceTable.lowestBag, value: `${formatSAR2(minBagPrice)} ${t.priceTable.sar}`, sub: cheapestFactory.shortName, color: "from-amber-500/15 to-amber-500/5", accent: "#f5b800" },
              { label: t.priceTable.avgBag, value: `${formatSAR2(avgBagPrice)} ${t.priceTable.sar}`, sub: t.priceTable.avgBagSub, color: "from-blue-500/15 to-blue-500/5", accent: "#3b82f6" },
              { label: t.priceTable.topShare, value: `${formatSAR2(maxShare)}%`, sub: topFactory.shortName, color: "from-emerald-500/15 to-emerald-500/5", accent: "#10b981" },
              { label: t.priceTable.totalFactories, value: `${factories.length} ${t.stats.factoryUnit}`, sub: t.priceTable.listedIn, color: "from-purple-500/15 to-purple-500/5", accent: "#a855f7" },
            ].map((card) => (
              <div key={card.label} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${card.color} p-5 transition-all hover:-translate-y-1`}>
                <p className="text-xs font-bold text-slate-600">{card.label}</p>
                <p className="mt-1.5 text-3xl font-black text-slate-950">{card.value}</p>
                <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                <div className="mt-3 h-0.5 w-12 rounded-full" style={{ background: card.accent }} />
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-slate-950 text-white">
                    <th className="px-5 py-4 text-sm font-black">{t.priceTable.col.num}</th>
                    <th className="px-5 py-4 text-sm font-black">{t.priceTable.col.factory}</th>
                    <th className="px-5 py-4 text-sm font-black">{t.priceTable.col.symbol}</th>
                    <th className="px-5 py-4 text-sm font-black">{t.priceTable.col.region}</th>
                    <th className="px-5 py-4 text-sm font-black">{t.priceTable.col.bagPrice}</th>
                    <th className="min-w-[160px] px-5 py-4 text-sm font-black">{t.priceTable.col.priceBar}</th>
                    <th className="px-5 py-4 text-sm font-black">{t.priceTable.col.tonPrice}</th>
                    <th className="px-5 py-4 text-sm font-black">{t.priceTable.col.stockPrice}</th>
                    <th className="px-5 py-4 text-sm font-black">{t.priceTable.col.share}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByPrice.map((f, i) => {
                    const barWidth = priceRange > 0 ? ((f.bagPrice - priceMin) / priceRange) * 100 : 50;
                    const color = priceColor(f.bagPrice);
                    return (
                      <tr
                        key={f.id}
                        className={`border-t border-slate-100 transition-colors hover:bg-slate-50 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}
                      >
                        <td className="px-5 py-3.5 text-sm font-bold text-slate-400">{i + 1}</td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-2 font-black text-slate-900">
                            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: f.color }} />
                            {f.name}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-600">{f.symbol}</span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600">{f.region}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-lg font-black" style={{ color }}>{Number(f.bagPrice).toFixed(2)}</span>
                          <span className="mr-1 text-xs text-slate-500">{t.priceTable.sar}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="relative h-3 w-32 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(8, barWidth)}%`, background: color }}
                              />
                            </div>
                            <span className="text-[10px] font-bold" style={{ color }}>
                              {f.id === cheapestFactory.id
                                ? locale === "en"
                                  ? "Lowest"
                                  : locale === "zh"
                                  ? "最低"
                                  : "الأقل"
                                : ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-800">{formatSAR2(f.bulkPrice)} {t.priceTable.sar}</td>
                        <td className="px-5 py-3.5">
                          {f.listed ? (
                            <span className={`font-black ${f.change >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                              {formatSAR2(f.stockPrice)}
                              <span className="mr-1 text-xs opacity-80">
                                ({f.change >= 0 ? "+" : ""}{formatSAR2(f.changePct)}%)
                              </span>
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                              {locale === "en" ? "Private" : locale === "zh" ? "未上市" : "غير مدرجة"}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${(f.marketShare / 16) * 100}%`, background: f.color }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{f.marketShare}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs text-slate-500">
              <span>{copy.dataStatus}</span>
              <Link href="/reports/full-report" className="flex items-center gap-1 font-bold text-primary hover:underline">
                {copy.ctaReports}
                <ArrowLeft className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARKET SNAPSHOT */}
      <section className="border-y border-secondary/20 bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <div className="section-label mb-2">{copy.snapshotLabel}</div>
              <h2 className="text-2xl font-black text-white md:text-3xl">{copy.snapshotTitle}</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">{copy.snapshotSub}</p>
            </div>
            <div className="rounded-xl border border-secondary/25 bg-secondary/8 px-4 py-2 text-xs font-bold text-secondary">
              {copy.dataStatus}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {marketSnapshot.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <div className="text-2xl font-black text-secondary">{item.value}</div>
                <div className="mt-1 text-sm font-bold text-white">{item.label}</div>
                <div className="text-xs text-slate-500">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE INSIGHTS / MARKET SIGNALS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 py-24">
        <div className="absolute inset-0 pattern-dots opacity-15" />
        <div className="container relative mx-auto px-4">
          <div className="mb-12 max-w-2xl">
            <div className="section-label mb-3">{copy.priceSignalLabel}</div>
            <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">{copy.priceSignalTitle}</h2>
            <p className="leading-relaxed text-slate-400">{copy.priceSignalSub}</p>
          </div>
          <PriceInsights />
        </div>
      </section>

      <section className="py-24" style={{ background: "linear-gradient(180deg,#070c1a 0%,#0a0f1e 100%)" }}>
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="section-label mb-3">{locale === "en" ? "Market Signals" : locale === "zh" ? "市场信号" : "إشارات السوق"}</div>
            <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
              {locale === "en" ? "Supplier opportunity and demand signals" : locale === "zh" ? "供应机会与需求信号" : "فرص التوريد وإشارات الطلب"}
            </h2>
            <p className="max-w-2xl leading-relaxed text-slate-400">{copy.priceSignalSub}</p>
          </div>
          <MarketIntelligence />
        </div>
      </section>

      {/* SHIPPING COST CALCULATOR */}
      <section className="relative overflow-hidden bg-slate-50 py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-secondary/40 to-transparent" />
        <div className="container relative mx-auto px-4">
          <div className="mb-10 max-w-2xl">
            <div className="section-label mb-3 text-primary/70">
              {locale === "en" ? "Support Tool · Estimated Data" : locale === "zh" ? "辅助工具 · 估算数据" : "أداة مساعدة · بيانات تقديرية"}
            </div>
            <h2 className="mb-4 text-4xl font-black text-slate-950 md:text-5xl">
              {locale === "en" ? "Transport Cost Calculator" : locale === "zh" ? "运输成本计算器" : "حاسبة تكلفة النقل"}
            </h2>
            <p className="leading-relaxed text-slate-600">
              {locale === "en"
                ? "An estimated tool for calculating how transport distance and quantity affect cement cost."
                : locale === "zh"
                ? "一个估算工具，用于计算运输距离和数量对水泥成本的影响。"
                : "أداة تقديرية لحساب أثر النقل على تكلفة الإسمنت حسب المسافة والكمية."}
            </p>
          </div>
          <ShippingCalculator />
        </div>
      </section>

      {/* SAUDI REGIONAL VISIBILITY */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-secondary/8 blur-[120px]" />
        <div className="absolute -right-32 bottom-16 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="container relative mx-auto px-4">
          <div className="mb-12">
            <div className="section-label mb-3 text-primary/70">{copy.mapLabel}</div>
            <h2 className="mb-4 text-4xl font-black text-slate-950 md:text-5xl">{copy.mapTitle}</h2>
            <p className="max-w-2xl leading-relaxed text-slate-600">{copy.mapSub}</p>
          </div>
          <SaudiMap />
        </div>
      </section>

      {/* REPORTS PREVIEW */}
      <section className="bg-slate-950 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="section-label mb-3">{copy.reportsLabel}</div>
              <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">{copy.reportsTitle}</h2>
              <p className="leading-relaxed text-slate-400">{copy.reportsSub}</p>
            </div>
            <Link
              href="/reports"
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-secondary/30 bg-secondary/10 px-6 py-3 text-sm font-black text-secondary transition-all hover:bg-secondary hover:text-slate-950"
            >
              {copy.ctaReports}
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: FileBarChart,
                title: locale === "en" ? "Full Market Statistics" : locale === "zh" ? "完整市场统计" : "الإحصاءات السوقية الشاملة",
                body: locale === "en" ? "Sales, prices, market share, clinker, and supplier performance." : locale === "zh" ? "销售、价格、市场份额、熟料和供应商表现。" : "المبيعات، الأسعار، الحصة السوقية، الكلنكر، وأداء الموردين.",
              },
              {
                icon: BarChart3,
                title: locale === "en" ? "Price Movement Reports" : locale === "zh" ? "价格走势报告" : "تقارير حركة الأسعار",
                body: locale === "en" ? "Professional demo reports for tracking monthly and regional price movement." : locale === "zh" ? "用于跟踪月度和区域价格变化的专业演示报告。" : "تقارير مهنية ضمن العرض التوضيحي لمتابعة حركة الأسعار الشهرية والإقليمية.",
              },
              {
                icon: MapPinned,
                title: locale === "en" ? "Regional Intelligence" : locale === "zh" ? "区域情报" : "التحليلات الإقليمية",
                body: locale === "en" ? "Visibility into factories, capacity, and supplier concentration by region." : locale === "zh" ? "按地区查看工厂、产能和供应商集中度。" : "رؤية للمصانع والطاقة وتركيز الموردين حسب المنطقة.",
              },
            ].map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.title} className="rounded-3xl border border-white/8 bg-white/4 p-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-black text-white">{report.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-500">{report.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SUPPLIER / FACTORY INTELLIGENCE */}
      <section className="bg-slate-900 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-2xl">
            <div className="section-label mb-3">{copy.supplierLabel}</div>
            <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">{copy.supplierTitle}</h2>
            <p className="leading-relaxed text-slate-400">{copy.supplierSub}</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {topFactories.map((factory, index) => {
              const util = Math.round((factory.production2024 / factory.capacity) * 100);
              return (
                <div key={factory.id} className="rounded-3xl border border-white/8 bg-white/4 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/15 text-sm font-black text-secondary">
                      {index + 1}
                    </span>
                    <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-slate-400">{factory.symbol}</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{factory.shortName}</h3>
                  <p className="mt-1 text-sm text-slate-500">{factory.name}</p>
                  <div className="mt-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.priceTable.col.bagPrice}</span>
                      <span className="font-black text-secondary">{formatSAR2(factory.bagPrice)} {t.priceTable.sar}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{t.priceTable.col.share}</span>
                      <span className="font-black text-white">{factory.marketShare}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{locale === "en" ? "Utilization" : locale === "zh" ? "利用率" : "استغلال الطاقة"}</span>
                      <span className="font-black text-emerald-400">{util}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ASSAS OPERATOR CREDIBILITY */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="section-label mb-3 text-primary/70">{copy.operatorLabel}</div>
              <h2 className="mb-4 text-4xl font-black text-slate-950 md:text-5xl">{copy.operatorTitle}</h2>
              <p className="mb-8 max-w-2xl leading-relaxed text-slate-600">{copy.operatorSub}</p>
              <div className="space-y-4">
                {identity.map((item) => (
                  <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/15">
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    </div>
                    <p className="leading-relaxed text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-2xl bg-white p-2 shadow-lg ring-2 ring-secondary/30">
                  <BrandLogo size={56} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">{copy.operatorBadge}</p>
                  <h3 className="text-2xl font-black text-slate-950">{t.idCard.name}</h3>
                </div>
              </div>
              <div className="grid gap-3">
                {locations.map((loc) => (
                  <div key={loc.city} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-black text-slate-950">{loc.city}</h4>
                      <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold text-secondary">{loc.label}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{loc.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${truckFront})` }} />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-primary/95 to-primary" />
        <div className="absolute inset-0 pattern-dots opacity-20" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-5 py-2 text-sm font-bold text-secondary">
            <Zap className="h-4 w-4" />
            {copy.exchangeBadge}
          </div>
          <h2 className="mb-6 text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
            {copy.finalTitle}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/75">{copy.finalSub}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/reports/full-report"
              className="group relative overflow-hidden rounded-2xl bg-secondary px-8 py-4 text-base font-black text-slate-950 shadow-2xl shadow-secondary/30 transition-all hover:-translate-y-1 hover:shadow-secondary/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                {copy.ctaReports}
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
            <a
              href="#price-comparison"
              className="rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              {copy.ctaCompare}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
