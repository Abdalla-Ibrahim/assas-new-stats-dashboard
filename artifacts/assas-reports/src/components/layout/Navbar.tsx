import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="nav-main">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xl">
              أ
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              أساس الإعمار
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1 mx-6">
            <Link href="/" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link href="/reports" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
              التقارير والإحصاءات
            </Link>
            <Link href="/contact" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
              اتصل بنا
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="default" className="hidden sm:flex">
            بوابة المستثمرين
          </Button>
          <Button variant="outline" className="md:hidden">
            القائمة
          </Button>
        </div>
      </div>
    </nav>
  );
}
