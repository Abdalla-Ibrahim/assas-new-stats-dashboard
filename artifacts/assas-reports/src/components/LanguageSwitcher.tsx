import { useLang } from "@/contexts/LanguageContext";
import type { Locale } from "@/i18n/translations";

const LANGS: { code: Locale; label: string }[] = [
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
  { code: "zh", label: "中" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLang();

  return (
    <div
      className="flex items-center rounded-lg overflow-hidden border border-white/25 bg-slate-800/70 backdrop-blur-sm"
      style={{ height: 28 }}
    >
      {LANGS.map((l, i) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`h-full px-2.5 text-[11px] font-bold tracking-wider transition-all duration-150 ${
            i > 0 ? "border-l border-white/15" : ""
          } ${
            locale === l.code
              ? "bg-secondary text-slate-950"
              : "text-white/80 hover:text-white hover:bg-white/12"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
