import { Link } from "wouter";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ArrowLeft, Globe, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/reports", label: "مركز التقارير" },
  { href: "/reports/full-report", label: "الإحصاءات الشاملة" },
  { href: "/contact", label: "المقرات والتواصل" },
];

const services = [
  "توريد الإسمنت السائب",
  "توريد الإسمنت المكيس",
  "النقل اللوجستي",
  "قطع الغيار والفلاتر",
  "إحصاءات قطاع الإسمنت",
];

export function Footer() {
  return (
    <footer className="bg-[#060c1a] text-slate-400" data-testid="footer-main">
      {/* Top gold line */}
      <div className="h-px w-full bg-gradient-to-l from-transparent via-secondary/60 to-transparent" />

      {/* CTA band */}
      <div className="border-b border-white/5 bg-gradient-to-l from-primary/10 via-transparent to-secondary/5 py-12">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-right">
          <div>
            <h3 className="mb-1 text-2xl font-black text-white">هل تحتاج عرض سعر؟</h3>
            <p className="text-sm text-slate-400">تواصل معنا اليوم واحصل على أفضل أسعار الإسمنت والشحن لمشروعك.</p>
          </div>
          <Link
            href="/contact"
            className="group flex shrink-0 items-center gap-2 rounded-2xl bg-secondary px-8 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-secondary/20 transition-all hover:shadow-secondary/40 hover:-translate-y-0.5"
          >
            طلب عرض سعر
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-16 md:grid-cols-4">
        {/* Brand col */}
        <div className="md:col-span-2">
          <Link href="/" className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-lg ring-2 ring-secondary/20">
              <BrandLogo size={44} />
            </div>
            <div>
              <span className="block text-xl font-black text-white">شركة أساس الإعمار</span>
              <span className="text-xs font-bold tracking-widest text-secondary/80">نبني الأساس ونقود الإنجاز</span>
            </div>
          </Link>
          <p className="mb-8 max-w-sm text-sm leading-loose text-slate-500">
            حلول متكاملة في توريد الإسمنت، النقل اللوجستي، وقطع الغيار داخل المملكة — بخبرة تشغيلية تمتد منذ 2020 لدعم المقاولين والمشاريع الوطنية.
          </p>

          {/* Contact pills */}
          <div className="space-y-3">
            {[
              { icon: MapPin, text: "الرياض، المملكة العربية السعودية" },
              { icon: Phone, text: "+966 5X XXX XXXX" },
              { icon: Mail, text: "info@assas-alemaar.sa" },
              { icon: Globe, text: "تغطية جميع مناطق المملكة" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-3 text-sm">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <Icon className="h-3.5 w-3.5 text-secondary" />
                  </div>
                  <span className="text-slate-400">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-5 text-xs font-black tracking-widest text-white uppercase">روابط سريعة</h3>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-white"
                >
                  <span className="h-px w-4 bg-secondary/40 transition-all group-hover:w-6 group-hover:bg-secondary" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-5 text-xs font-black tracking-widest text-white uppercase">خدماتنا</h3>
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary/50" />
                {s}
              </li>
            ))}
          </ul>

          {/* Vision 2030 badge */}
          <div className="mt-8 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 text-center">
            <div className="text-xs text-slate-500">شريك استراتيجي لـ</div>
            <div className="mt-0.5 text-lg font-black text-secondary">رؤية 2030 🇸🇦</div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-600 md:flex-row">
          <p>© {new Date().getFullYear()} شركة أساس الإعمار. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-white/10" />
            <p>واجهة عربية RTL — قطاع الإسمنت السعودي</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
