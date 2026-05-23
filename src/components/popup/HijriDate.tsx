import React from "react";
import { useHijriDate } from "../../hooks/useHijriDate";
import { cn } from "../../utils/cn";

/**
 * @param {Object} props
 * @param {string} [props.className] - Optional custom CSS class name.
 */
interface HijriDateProps {
  className?: string;
}

export default function HijriDate({ className = "" }: HijriDateProps) {
  const hijri = useHijriDate();

  return (
    <div className={cn("flex flex-col items-end text-right", className)}>
      <span className="font-amiri font-bold text-sm tracking-wide text-emerald-800 dark:text-emerald-400 leading-none">
        {hijri.arabicString}
      </span>
      <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-none">
        {hijri.englishString}
      </span>
    </div>
  );
}
