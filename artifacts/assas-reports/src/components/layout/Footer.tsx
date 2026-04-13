import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 py-12 text-slate-200" data-testid="footer-main">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="mb-4 flex items-center gap-2">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-primary text-xl font-black text-white shadow-sm">
              <span className="relative z-10">أ</span>
              <span className="absolute bottom-2 h-1 w-7 rounded-full bg-secondary" />
              <span className="absolute left-1 top-1 h-2 w-2 rounded-full bg-secondary" />
            </div>
            <div>
              <span className="block text-xl font-black text-white">أساس الإعمار</span>
              <span className="text-xs font-bold text-secondary">خبرة تُبنى بثقة</span>
            </div>
          </Link>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-400">
            نبني الأساس… ونقود الإنجاز. حلول متكاملة في توريد الإسمنت، النقل اللوجستي، وقطع الغيار داخل المملكة، مع تغطية تشمل الرياض والدمام وحفر الباطن وجميع مناطق المملكة.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">روابط سريعة</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/" className="transition-colors hover:text-white">الرئيسية</Link></li>
            <li><Link href="/reports" className="transition-colors hover:text-white">مركز التقارير</Link></li>
            <li><Link href="/reports/full-report" className="transition-colors hover:text-white">الإحصاءات الشاملة</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-white">المقرات والتواصل</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">خدمات أساس</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>الخدمات الإسمنتية</li>
            <li>النقل اللوجستي</li>
            <li>قطع الغيار</li>
            <li>تقارير وإحصاءات تشغيلية</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-12 flex flex-col items-center justify-between border-t border-slate-800 px-4 pt-8 text-sm text-slate-500 md:flex-row">
        <p>© {new Date().getFullYear()} شركة أساس الإعمار. جميع الحقوق محفوظة.</p>
        <p className="mt-2 md:mt-0">واجهة عربية لهوية أساس وتقارير قطاع الإسمنت.</p>
      </div>
    </footer>
  );
}
