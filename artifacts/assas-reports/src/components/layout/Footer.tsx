import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 py-12 mt-auto" data-testid="footer-main">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
              أ
            </div>
            <span className="font-bold text-xl text-white">أساس الإعمار</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
            نبني الأساس… ونقود الإنجاز. شريكك الموثوق في قطاع المقاولات، توريد الإسمنت، النقل اللوجستي، وقطع الغيار في المملكة العربية السعودية.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">روابط سريعة</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
            <li><Link href="/reports" className="hover:text-white transition-colors">التقارير</Link></li>
            <li><Link href="/reports/full-report" className="hover:text-white transition-colors">الإحصاءات الشاملة</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">خدماتنا</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>خدمات الاسمنتية</li>
            <li>خدمات النقل اللوجستي</li>
            <li>خدمات قطع الغيار</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} شركة أساس الإعمار. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}
