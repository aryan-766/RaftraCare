import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  subtitle?: string;
  href?: string;
  variant?: "transparent" | "badge" | "inverted";
}

export function Logo({
  className,
  size = "md",
  showWordmark = true,
  subtitle,
  href,
  variant = "transparent",
}: LogoProps) {
  const sizeMap = {
    xs: { img: 20, text: "text-sm", sub: "text-[9px]" },
    sm: { img: 26, text: "text-base", sub: "text-[10px]" },
    md: { img: 32, text: "text-lg", sub: "text-[11px]" },
    lg: { img: 40, text: "text-xl", sub: "text-xs" },
    xl: { img: 52, text: "text-2xl", sub: "text-sm" },
  };

  const currentSize = sizeMap[size];

  const logoElement = (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center shrink-0 transition-transform hover:scale-105 duration-200",
          variant === "badge" &&
            "bg-white dark:bg-slate-900 border border-border/80 dark:border-border-dark rounded-xl shadow-xs p-1",
          variant === "inverted" &&
            "bg-white/10 backdrop-blur-xs rounded-xl p-1 border border-white/15 shadow-sm"
        )}
        style={{
          width: variant === "transparent" ? currentSize.img : currentSize.img + 8,
          height: variant === "transparent" ? currentSize.img : currentSize.img + 8,
        }}
      >
        <img
          src="/logo.png"
          alt="RaftraCare Logo"
          width={currentSize.img}
          height={currentSize.img}
          className="object-contain w-full h-full drop-shadow-xs"
        />
      </div>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className={cn("font-extrabold tracking-tight font-heading flex items-center", currentSize.text)}>
            <span className="text-foreground dark:text-white">Raftra</span>
            <span className="text-primary ml-0.5">Care</span>
          </div>
          {subtitle && (
            <span
              className={cn(
                "text-foreground-muted dark:text-foreground-mutedDark font-medium tracking-normal mt-0.5",
                currentSize.sub
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-hidden">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
