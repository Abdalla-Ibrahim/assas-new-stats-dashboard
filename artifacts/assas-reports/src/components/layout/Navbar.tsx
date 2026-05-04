import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLang } from "@/contexts/LanguageContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useLang();

  const NAV_LINKS = [
    { href: "/", label: t.nav.home },
    { href: "/reports", label: t.nav.reports },
    { href: "/reports/full-report", label: t.nav.fullReport },
    { href: "/contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/8 bg-slate-950/92 shadow-2xl shadow-black/40 backdrop-blur-2xl"
          : "bg-slate-950/95 backdrop-blur-sm"
      }`}
      data-testid="nav-main"
    >
      {/* Top gold accent line */}
      <div className="h-[2px] w-full bg-gradient-to-l from-transparent via-secondary to-transparent opacity-80" />

      <div className="container mx-auto flex h-[72px] items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3" data-testid="link-home">
          <div className="relative overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg ring-2 ring-secondary/30 transition-all duration-300 group-hover:ring-secondary/70">
            <BrandLogo size={44} />
            <div className="absolute inset-0 rounded-2xl bg-secondary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="hidden leading-tight sm:block">
            <span className="block text-lg font-black tracking-tight text-white drop-shadow">{t.idCard.name}</span>
            <span className="block text-[10px] font-bold tracking-widest text-secondary/90 uppercase">مؤشر سعر الاسمنت السعودي</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                  active ? "text-secondary" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-secondary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side: language switcher + CTA */}
        <div className="hidden items-center gap-3 sm:flex">
          <LanguageSwitcher />
          <Link
            href="/reports/full-report"
            className="group relative overflow-hidden rounded-full bg-secondary px-6 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-secondary/30 transition-all duration-300 hover:shadow-secondary/50 hover:-translate-y-px"
          >
            <span className="relative z-10">{t.nav.cta}</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-slate-950/98 backdrop-blur-2xl lg:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center rounded-xl px-4 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-white/8 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/reports/full-report"
                className="flex w-full items-center justify-center rounded-xl bg-secondary py-3 text-sm font-black text-slate-950"
                onClick={() => setOpen(false)}
              >
                {t.nav.cta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
