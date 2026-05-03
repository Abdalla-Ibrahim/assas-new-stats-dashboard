import { useLang } from "@/contexts/LanguageContext";
import type { Locale } from "@/i18n/translations";

const LANGS: { code: Locale; flag: string; label: string }[] = [
  { code: "ar", flag: "🇸🇦", label: "عربي" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLang();

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 ${
            locale === l.code
              ? "bg-secondary text-slate-950 shadow-sm"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
          aria-label={l.label}
        >
          <span>{l.flag}</span>
          <span className="hidden sm:inline">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
