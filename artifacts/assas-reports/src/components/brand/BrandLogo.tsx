type BrandLogoProps = {
  size?: number;
  variant?: "light" | "dark";
  className?: string;
};

export function BrandLogo({ size = 56, variant = "light", className = "" }: BrandLogoProps) {
  const arabicColor = variant === "light" ? "#0a3a7a" : "#ffffff";
  const accent = "#f5a623";
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size} aria-label="شعار أساس الإعمار">
        <defs>
          <linearGradient id="assasBlue" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#0e4a96" />
            <stop offset="100%" stopColor="#0a2a5e" />
          </linearGradient>
        </defs>
        <path
          d="M60 12 C 30 12, 12 32, 12 60 C 12 88, 30 108, 60 108"
          fill="none"
          stroke="url(#assasBlue)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M60 12 C 90 12, 108 32, 108 60 C 108 88, 90 108, 60 108"
          fill="none"
          stroke={accent}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <text
          x="60"
          y="68"
          textAnchor="middle"
          fontSize="26"
          fontWeight="900"
          fill={arabicColor}
          fontFamily="Tajawal, sans-serif"
        >
          أساس
        </text>
        <text
          x="60"
          y="92"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fill={accent}
          fontFamily="Tajawal, sans-serif"
        >
          الإعمار
        </text>
      </svg>
    </div>
  );
}
