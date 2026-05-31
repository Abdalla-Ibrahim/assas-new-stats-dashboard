import { useMemo, useState } from "react";
import { SAUDI_REGIONS } from "@/data/saudi-regions";

export type RegionValues = Record<string, number>;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Dark navy → teal → gold, matching the Assas reports visual identity.
const STOPS = [
  [15, 23, 42],
  [17, 45, 61],
  [19, 78, 74],
  [20, 118, 100],
  [24, 164, 132],
  [245, 184, 0],
];

const ACCENT = [245, 184, 0];

function colorFor(value: number, max: number): string {
  if (max <= 0 || value <= 0) return `rgb(${STOPS[0].join(",")})`;
  const t = Math.min(1, value / max);
  const scaled = t * (STOPS.length - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  const a = STOPS[i];
  const b = STOPS[Math.min(STOPS.length - 1, i + 1)];
  const r = Math.round(lerp(a[0], b[0], f));
  const g = Math.round(lerp(a[1], b[1], f));
  const bl = Math.round(lerp(a[2], b[2], f));
  return `rgb(${r},${g},${bl})`;
}

interface Props {
  values: RegionValues;
  unit?: string;
  selectedRegionId?: string | null;
  onRegionSelect?: (regionId: string) => void;
  showLegend?: boolean;
}

export function SaudiHeatmap({ values, unit = "مصنع", selectedRegionId, onRegionSelect, showLegend = true }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const max = useMemo(
    () => Math.max(1, ...Object.values(values)),
    [values],
  );
  const total = useMemo(
    () => Object.values(values).reduce((a, b) => a + b, 0),
    [values],
  );

  const active = hover ?? selectedRegionId ?? null;
  const activeRegion = active ? SAUDI_REGIONS.find((r) => r.id === active) : null;
  const activeVal = activeRegion ? values[activeRegion.id] ?? 0 : 0;
  const activePct = total > 0 && activeRegion ? Math.round((activeVal / total) * 100) : 0;

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 800 700"
        className="w-full h-auto"
        role="img"
        aria-label="خريطة حرارية للمناطق الإدارية في المملكة العربية السعودية"
        style={{ filter: "drop-shadow(0 30px 60px rgba(245, 184, 0, 0.14))" }}
      >
        <defs>
          {/* Subtle grain pattern for depth */}
          <pattern id="grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.3" fill="rgba(255,255,255,0.4)" />
          </pattern>

          {/* Gold accent gradient for top region */}
          <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`rgb(${ACCENT.join(",")})`} stopOpacity="0.0" />
            <stop offset="50%" stopColor={`rgb(${ACCENT.join(",")})`} stopOpacity="0.35" />
            <stop offset="100%" stopColor={`rgb(${ACCENT.join(",")})`} stopOpacity="0.0" />
            <animate attributeName="x1" values="-50%;100%" dur="3s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0%;150%" dur="3s" repeatCount="indefinite" />
          </linearGradient>

          {/* Glow filter for hover */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Soft shadow for depth */}
          <filter id="innerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="1" result="offsetblur" />
            <feFlood floodColor="rgba(0,0,0,0.15)" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Decorative compass rose */}
        <g transform="translate(720, 80)" opacity="0.25">
          <circle cx="0" cy="0" r="26" fill="none" stroke="rgba(245,184,0,0.75)" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(245,184,0,0.55)" strokeWidth="0.5" />
          <path d="M 0,-22 L 3,0 L 0,22 L -3,0 Z" fill="rgba(245,184,0,0.8)" />
          <path d="M -22,0 L 0,3 L 22,0 L 0,-3 Z" fill="rgba(255,255,255,0.45)" />
          <text x="0" y="-30" textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(245,184,0,0.8)" fontFamily="Tajawal">N</text>
        </g>

        {/* Regions */}
        {SAUDI_REGIONS.map((r) => {
          const v = values[r.id] ?? 0;
          const fill = colorFor(v, max);
          const isActive = active === r.id;
          const isSelected = selectedRegionId === r.id;
          const isTop = v === max && max > 0;
          return (
            <g key={r.id}>
              <path
                d={r.d}
                fill={fill}
                stroke={isActive || isSelected ? "rgb(245,184,0)" : "rgba(255,255,255,0.24)"}
                strokeWidth={isActive || isSelected ? 3 : 1.4}
                strokeLinejoin="round"
                style={{
                  cursor: "pointer",
                  transition: "all 280ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                  transformOrigin: `${r.cx}px ${r.cy}px`,
                  transform: isActive ? "scale(1.015)" : "scale(1)",
                  filter: isActive
                    ? "drop-shadow(0 8px 16px rgba(245,184,0,0.45)) brightness(1.08)"
                    : active && !isActive
                    ? "saturate(0.6) brightness(0.95)"
                    : "none",
                  opacity: active && !isActive && !isSelected ? 0.55 : 1,
                }}
                onMouseEnter={() => setHover(r.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onRegionSelect?.(r.id)}
              />
              {/* Grain overlay for subtle texture */}
              <path
                d={r.d}
                fill="url(#grain)"
                pointerEvents="none"
                opacity={0.5}
              />
              {/* Animated shine for top region */}
              {isTop && (
                <path
                  d={r.d}
                  fill="url(#goldShine)"
                  pointerEvents="none"
                />
              )}
            </g>
          );
        })}

        {/* Top-region star marker */}
        {SAUDI_REGIONS.filter((r) => (values[r.id] ?? 0) === max && max > 0).map((r) => (
          <g key={`star-${r.id}`} pointerEvents="none" transform={`translate(${r.cx + 28}, ${r.cy - 14})`}>
            <circle cx="0" cy="0" r="9" fill="rgb(201,168,76)" stroke="white" strokeWidth="1.5" />
            <path
              d="M 0,-5 L 1.5,-1.5 L 5,-1.5 L 2,1 L 3,4.5 L 0,2.5 L -3,4.5 L -2,1 L -5,-1.5 L -1.5,-1.5 Z"
              fill="white"
            />
          </g>
        ))}

        {/* Region labels */}
        {SAUDI_REGIONS.map((r) => {
          const intensity = (values[r.id] ?? 0) / max;
          return (
            <g key={`l-${r.id}`} pointerEvents="none">
              <text
                x={r.cx}
                y={r.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  fill: intensity > 0.5 ? "white" : "rgba(255,255,255,0.86)",
                  fontFamily: "Tajawal, sans-serif",
                  paintOrder: "stroke",
                  stroke: intensity > 0.5 ? "rgba(0,0,0,0.35)" : "rgba(15,23,42,0.85)",
                  strokeWidth: 2.5,
                  strokeLinejoin: "round",
                }}
              >
                {r.ar.replace("منطقة ", "")}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip card */}
      {activeRegion && (
        <div
          className="pointer-events-none absolute top-4 right-4 rounded-2xl border border-secondary/30 bg-slate-950/95 px-5 py-4 text-white shadow-2xl shadow-black/40 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ minWidth: 200 }}
        >
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-secondary animate-pulse" />
            <div className="text-[10px] uppercase tracking-widest text-secondary/80 font-bold">
              {active === selectedRegionId ? "مختارة" : "المنطقة"}
            </div>
          </div>
          <div className="mt-1 text-base font-black text-white">{activeRegion.ar}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-3xl font-black bg-gradient-to-br from-secondary to-amber-200 bg-clip-text text-transparent">
              {activeVal.toLocaleString("ar-SA")}
            </div>
            <span className="text-xs font-medium text-white/55">{unit}</span>
          </div>
          {total > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-white/50 mb-1">
                <span>من الإجمالي</span>
                <span className="font-bold text-white">{activePct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-secondary to-amber-200 transition-all duration-500"
                  style={{ width: `${activePct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Helper hint */}
      <div className="absolute bottom-2 left-2 text-[10px] text-white/40 pointer-events-none">
        انقر لاختيار المنطقة · مرّر للاستكشاف
      </div>

      {showLegend && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2 text-[11px]">
            <span className="font-bold text-white">مقياس الكثافة</span>
            <span className="text-white/50">الحد الأقصى: <span className="font-bold text-white">{max.toLocaleString("ar-SA")}</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/50 font-medium">منخفض</span>
            <div className="h-3 flex-1 rounded-full overflow-hidden flex shadow-inner ring-1 ring-white/10">
              {STOPS.map((s, i) => (
                <div
                  key={i}
                  className="flex-1 transition-transform hover:scale-y-150 cursor-help"
                  style={{ background: `rgb(${s.join(",")})` }}
                  title={`${Math.round((i / (STOPS.length - 1)) * max)}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-white/50 font-medium">مرتفع</span>
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-white/35">
            <span>0</span>
            <span>{Math.round(max / 2).toLocaleString("ar-SA")}</span>
            <span>{max.toLocaleString("ar-SA")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
