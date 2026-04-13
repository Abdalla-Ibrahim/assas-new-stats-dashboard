import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70" data-testid="nav-main">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-xl font-black text-primary-foreground shadow-sm">
              أ
            </div>
            <div className="hidden leading-tight sm:block">
              <span className="block text-xl font-black tracking-tight">أساس الإعمار</span>
              <span className="block text-[11px] font-bold text-secondary">نبني الأساس ونقود الإنجاز</span>
            </div>
          </Link>
          <div className="mx-6 hidden items-center gap-1 md:flex">
            <Link href="/" className="px-4 py-2 text-sm font-bold transition-colors hover:text-primary">الرئيسية</Link>
            <Link href="/reports" className="px-4 py-2 text-sm font-bold transition-colors hover:text-primary">التقارير والإحصاءات</Link>
            <Link href="/reports/full-report" className="px-4 py-2 text-sm font-bold transition-colors hover:text-primary">الإحصاءات الشاملة</Link>
            <Link href="/contact" className="px-4 py-2 text-sm font-bold transition-colors hover:text-primary">المقرات والتواصل</Link>
          </div>
        </div>
        <Button className="hidden bg-primary font-bold sm:flex" asChild>
          <Link href="/reports/full-report">بوابة التقارير</Link>
        </Button>
      </div>
    </nav>
  );
}
