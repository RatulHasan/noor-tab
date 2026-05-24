import React from "react";
import { cn } from "../../utils/cn";
import { Coffee } from "lucide-react"

interface BuyMeCoffeeProps {
  variant?: "badge" | "floating" | "text-link";
  className?: string;
}

export default function BuyMeCoffee({ variant = "badge", className = "" }: BuyMeCoffeeProps) {
  const url = "https://buymeacoffee.com/ratulhasan";

  if (variant === "floating") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-6 right-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFDD00] text-black shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group hover:shadow-xl",
          className
        )}
        title="Buy me a coffee"
      >
        <span className="group-hover:rotate-12 transition-transform duration-300">
          <Coffee/>
        </span>
      </a>
    );
  }

  if (variant === "text-link") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "text-xs font-semibold text-stone-500 hover:text-emerald-700 dark:text-stone-400 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 justify-center py-2",
          className
        )}
      >
        <span>☕</span>
        <span>Buy me a coffee</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl bg-[#FFDD00] px-4 py-2 text-xs font-black text-black shadow-sm border border-black/5 hover:bg-[#ffe633] hover:scale-[1.02] active:scale-95 transition-all duration-300 font-sans tracking-wide",
        className
      )}
    >
      <Coffee/>
      <span>Buy me a coffee</span>
    </a>
  );
}
