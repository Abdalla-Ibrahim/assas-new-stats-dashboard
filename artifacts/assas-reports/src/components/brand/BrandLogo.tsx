import logoSrc from "@assets/Screenshot_2026-01-10_184652_1776940763765.png";

type BrandLogoProps = {
  size?: number;
  className?: string;
};

export function BrandLogo({ size = 56, className = "" }: BrandLogoProps) {
  return (
    <img
      src={logoSrc}
      alt="شعار شركة أساس الإعمار"
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
