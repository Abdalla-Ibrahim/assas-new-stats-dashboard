import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { CEMENT_FACTORIES, type CementFactory } from "@/data/cementFactories";

type TickerItem = CementFactory & { currentPrice: number; currentChange: number; currentPct: number; direction: "up" | "down" | "flat" };

function getInitialItems(): TickerItem[] {
  return CEMENT_FACTORIES.map((f) => ({
    ...f,
    currentPrice: f.stockPrice,
    currentChange: f.change,
    currentPct: f.changePct,
    direction: f.change > 0 ? "up" : f.change < 0 ? "down" : "flat",
  }));
}

function simulatePrice(item: TickerItem): TickerItem {
  const delta = (Math.random() - 0.49) * 0.12;
  const newPrice = Math.max(5, parseFloat((item.currentPrice + delta).toFixed(2)));
  const newChange = parseFloat((newPrice - item.stockPrice).toFixed(2));
  const newPct = parseFloat(((newChange / item.stockPrice) * 100).toFixed(2));
  return {
    ...item,
    currentPrice: newPrice,
    currentChange: newChange,
    currentPct: newPct,
    direction: newChange > 0 ? "up" : newChange < 0 ? "down" : "flat",
  };
}

const fmt = (n: number) => n.toFixed(2);

export function CementPriceTicker() {
  const [items, setItems] = useState<TickerItem[]>(getInitialItems);
  const [flash, setFlash] = useState<Record<string, "up" | "down" | "flat" | null>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const idx = Math.floor(Math.random() * CEMENT_FACTORIES.length);
      setItems((prev) => {
        const next = [...prev];
        const old = next[idx];
        const updated = simulatePrice(old);
        next[idx] = updated;
        setFlash((f) => ({ ...f, [updated.id]: updated.direction }));
        setTimeout(() => setFlash((f) => ({ ...f, [updated.id]: null })), 700);
        return next;
      });
    }, 800);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="sticky top-0 z-40 w-full border-b border-secondary/30 bg-slate-950 shadow-2xl shadow-black/40">
      <div className="flex items-stretch">
        {/* Header badge */}
        <div className="flex shrink-0 items-center gap-2 border-l border-secondary/30 bg-secondary/10 px-4 py-2">
          <Activity className="h-3.5 w-3.5 animate-pulse text-secondary" />
          <span className="whitespace-nowrap text-[11px] font-black text-secondary">أسعار الإسمنت</span>
          <span className="ml-1 rounded-sm bg-green-500 px-1 text-[9px] font-black text-white">مباشر</span>
        </div>

        {/* Scrolling ticker */}
        <div className="relative flex-1 overflow-hidden">
          <div className="flex animate-[ticker_80s_linear_infinite] items-center gap-0 will-change-transform">
            {[...items, ...items].map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className={`flex shrink-0 items-center gap-3 border-l border-white/5 px-4 py-2 transition-colors duration-700 ${
                  flash[item.id] === "up"
                    ? "bg-green-500/10"
                    : flash[item.id] === "down"
                      ? "bg-red-500/10"
                      : ""
                }`}
              >
                <div className="text-right">
                  <p className="whitespace-nowrap text-[11px] font-bold text-white/80">{item.shortName}</p>
                  <p className="text-[9px] text-white/40">{item.symbol}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`whitespace-nowrap text-sm font-black transition-colors ${
                      item.direction === "up" ? "text-green-400" : item.direction === "down" ? "text-red-400" : "text-white"
                    }`}
                  >
                    {fmt(item.currentPrice)}
                  </p>
                  <div className="flex items-center gap-1">
                    {item.direction === "up" ? (
                      <TrendingUp className="h-2.5 w-2.5 text-green-400" />
                    ) : item.direction === "down" ? (
                      <TrendingDown className="h-2.5 w-2.5 text-red-400" />
                    ) : (
                      <Minus className="h-2.5 w-2.5 text-white/40" />
                    )}
                    <p
                      className={`whitespace-nowrap text-[10px] font-bold ${
                        item.direction === "up" ? "text-green-400" : item.direction === "down" ? "text-red-400" : "text-white/40"
                      }`}
                    >
                      {item.currentChange >= 0 ? "+" : ""}
                      {fmt(item.currentChange)} ({item.currentPct >= 0 ? "+" : ""}
                      {fmt(item.currentPct)}%)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market summary */}
        <div className="flex shrink-0 items-center gap-4 border-r border-secondary/30 bg-slate-900 px-4 py-2">
          <div className="text-right">
            <p className="text-[9px] text-white/50">ارتفع</p>
            <p className="font-black text-green-400">{items.filter((i) => i.direction === "up").length}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-white/50">انخفض</p>
            <p className="font-black text-red-400">{items.filter((i) => i.direction === "down").length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
