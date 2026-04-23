import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80" data-testid="nav-main">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3" data-testid="link-home">
            <BrandLogo size={56} />
            <div className="hidden leading-tight sm:block">
              <span className="block text-xl font-black tracking-tight text-primary">شركة أساس الإعمار</span>
              <span className="block text-[11px] font-bold text-secondary">نبني الأساس ونقود الإنجاز</span>
            </div>
          </Link>
          <div className="mx-6 hidden items-center gap-1 lg:flex">
            <Link href="/" className="px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-primary">الرئيسية</Link>
            <Link href="/reports" className="px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-primary">التقارير والإحصاءات</Link>
            <Link href="/reports/full-report" className="px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-primary">الإحصاءات الشاملة</Link>
            <Link href="/contact" className="px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-primary">المقرات والتواصل</Link>
          </div>
        </div>
        <Button className="hidden bg-primary font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90 sm:flex" asChild>
          <Link href="/reports/full-report">بوابة التقارير</Link>
        </Button>
      </div>
    </nav>
  );
}
