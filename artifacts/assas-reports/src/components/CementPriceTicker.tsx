import { Activity, Minus } from "lucide-react";
import { useCementFactories } from "@/contexts/FactoriesContext";

const fmt = (value: number) => Number(value).toFixed(2);

export function CementPriceTicker() {
  const { factories } = useCementFactories();
  const averageBagPrice =
    factories.length > 0 ? factories.reduce((sum, factory) => sum + factory.bagPrice, 0) / factories.length : 0;

  return (
    <div className="sticky top-0 z-40 w-full border-b border-secondary/30 bg-slate-950 shadow-2xl shadow-black/40">
      <div className="flex items-stretch">
        <div className="flex shrink-0 items-center gap-2 border-l border-secondary/30 bg-secondary/10 px-4 py-2">
          <Activity className="h-3.5 w-3.5 text-secondary" />
          <span className="whitespace-nowrap text-[11px] font-black text-secondary">أسعار الإسمنت</span>
          <span className="ml-1 rounded-sm bg-amber-500 px-1 text-[9px] font-black text-slate-950">تقديري</span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="flex animate-[ticker_80s_linear_infinite] items-center gap-0 will-change-transform">
            {[...factories, ...factories].map((factory, index) => (
              <div key={`${factory.id}-${index}`} className="flex shrink-0 items-center gap-3 border-l border-white/5 px-4 py-2">
                <div className="text-right">
                  <p className="whitespace-nowrap text-[11px] font-bold text-white/80">{factory.shortName}</p>
                  <p className="text-[9px] text-white/40">{factory.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="whitespace-nowrap text-sm font-black text-white">{fmt(factory.bagPrice)}</p>
                  <div className="flex items-center gap-1">
                    <Minus className="h-2.5 w-2.5 text-white/40" />
                    <p className="whitespace-nowrap text-[10px] font-bold text-white/40">سعر الكيس من قاعدة البيانات</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4 border-r border-secondary/30 bg-slate-900 px-4 py-2">
          <div className="text-right">
            <p className="text-[9px] text-white/50">مصانع</p>
            <p className="font-black text-secondary">{factories.length}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-white/50">متوسط</p>
            <p className="font-black text-white">{fmt(averageBagPrice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
