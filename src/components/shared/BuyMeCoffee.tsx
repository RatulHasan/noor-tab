import React from "react";
import { cn } from "../../utils/cn";

interface BuyMeCoffeeProps {
  variant?: "badge" | "floating" | "text-link";
  className?: string;
}

export default function BuyMeCoffee({ variant = "badge", className = "" }: BuyMeCoffeeProps) {
  const url = "https://buymeacoffee.com/ratulhasan";

  const coffeeIcon = (
    <svg
      className="h-4 w-4 fill-current"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.2 6.4c-.6-.7-1.4-1.2-2.3-1.4V4.5C17.9 2 15.9 0 13.4 0H4.6C2.1 0 .1 2 .1 4.5v11.8c0 2.2 1.6 4.1 3.8 4.4 1 .2 2.1.3 3.1.3.9 0 1.9 0 2.8-.1.7.5 1.5.8 2.4.8h4c3.2 0 5.8-2.6 5.8-5.8v-7.1c0-1-.3-1.9-.8-2.4zm-2.4 9.1c0 1.9-1.5 3.4-3.4 3.4h-4c-.7 0-1.4-.2-2-.6.7-.4 1.3-.9 1.7-1.5.9-.1 1.9-.3 2.8-.5 1-.2 1.9-.6 2.7-1.1.2-.1.4-.3.5-.5.8-.8 1.4-1.9 1.6-3 .1.6.1 1.2.1 1.8v2zm2-2.5c0 1.5-.7 2.8-1.8 3.6.1-.8.2-1.6.2-2.4V7.9c.7.2 1.2.6 1.5 1.2.1.4.1.8.1 1.3v2z" />
    </svg>
  );

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
          {coffeeIcon}
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
      {coffeeIcon}
      <span>Buy me a coffee</span>
    </a>
  );
}
