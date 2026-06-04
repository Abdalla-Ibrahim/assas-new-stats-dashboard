import { Link } from "wouter";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ArrowLeft, Globe, Mail, Phone, MapPin } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import {
  CONTACT_ADDRESS_HAFR_AL_BATIN,
  CONTACT_ADDRESS_RIYADH,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "@/data/contactInfo";

export function Footer() {
  const { t } = useLang();

  const quickLinks = [
    { href: "/", label: t.nav.home },
    { href: "/reports", label: t.nav.reports },
    { href: "/reports/full-report", label: t.nav.fullReport },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="bg-[#060c1a] text-slate-400" data-testid="footer-main">
      {/* Top gold line */}
      <div className="h-px w-full bg-gradient-to-l from-transparent via-secondary/60 to-transparent" />

      {/* CTA band */}
      <div className="border-b border-white/5 bg-gradient-to-l from-primary/10 via-transparent to-secondary/5 py-12">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-right">
          <div>
            <h3 className="mb-1 text-2xl font-black text-white">{t.footer.ctaTitle}</h3>
            <p className="text-sm text-slate-400">{t.footer.ctaSub}</p>
          </div>
          <Link
            href="/contact"
            className="group flex shrink-0 items-center gap-2 rounded-2xl bg-secondary px-8 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-secondary/20 transition-all hover:shadow-secondary/40 hover:-translate-y-0.5"
          >
            {t.footer.ctaBtn}
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
              <span className="block text-xl font-black text-white">{t.idCard.name}</span>
              <span className="text-xs font-bold tracking-widest text-secondary/80">{t.footer.tagline}</span>
            </div>
          </Link>
          <p className="mb-8 max-w-sm text-sm leading-loose text-slate-500">{t.footer.desc}</p>

          {/* Contact pills */}
          <div className="space-y-3">
            {[
              { icon: MapPin, text: CONTACT_ADDRESS_RIYADH },
              { icon: MapPin, text: CONTACT_ADDRESS_HAFR_AL_BATIN },
              { icon: Phone, text: CONTACT_PHONE },
              { icon: Mail, text: CONTACT_EMAIL },
              { icon: Globe, text: t.footer.coverage },
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
          <h3 className="mb-5 text-xs font-black tracking-widest text-white uppercase">{t.footer.quickLinks}</h3>
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
          <h3 className="mb-5 text-xs font-black tracking-widest text-white uppercase">{t.footer.services}</h3>
          <ul className="space-y-3">
            {t.footer.servicesList.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary/50" />
                {s}
              </li>
            ))}
          </ul>

          {/* Vision 2030 badge */}
          <div className="mt-8 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 text-center">
            <div className="text-xs text-slate-500">{t.footer.visionPartner}</div>
            <div className="mt-0.5 text-lg font-black text-secondary">Vision 2030 🇸🇦</div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-600 md:flex-row">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-white/10" />
            <p>{t.footer.rtlNote}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
