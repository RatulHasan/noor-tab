import React from "react";
import { cn } from "~utils/cn";

/**
 * @param {Object} props
 * @param {string} [props.className] - Optional custom CSS class name.
 * @param {number} [props.opacity] - Opacity from 0 to 1. Default is 0.08.
 * @param {boolean} [props.showMedallion] - If true, displays a central 8-point star medallion. Default is false.
 */
interface IslamicPatternProps {
  className?: string;
  opacity?: number;
  showMedallion?: boolean;
}

export default function IslamicPattern({
  className = "",
  opacity = 0.08,
  showMedallion = false,
}: IslamicPatternProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none select-none overflow-hidden", className)}
      style={{ opacity }}
    >
      {/* Tiled Geometric Grid Background */}
      <div className="absolute inset-0 bg-islamic-pattern" />

      {/* Decorative Corner Ornaments */}
      <svg
        className="absolute top-0 left-0 h-16 w-16 text-emerald-700 dark:text-emerald-400"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M 0 0 L 100 0 L 100 10 L 10 10 L 10 100 L 0 100 Z" fill="currentColor" fillOpacity="0.05" />
        <path d="M 15 15 L 80 15 M 15 15 L 15 80" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="20" y="20" width="10" height="10" transform="rotate(45 25 25)" strokeWidth="1" />
      </svg>

      <svg
        className="absolute top-0 right-0 h-16 w-16 rotate-90 text-emerald-700 dark:text-emerald-400"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M 0 0 L 100 0 L 100 10 L 10 10 L 10 100 L 0 100 Z" fill="currentColor" fillOpacity="0.05" />
        <path d="M 15 15 L 80 15 M 15 15 L 15 80" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="20" y="20" width="10" height="10" transform="rotate(45 25 25)" strokeWidth="1" />
      </svg>

      {/* Central Medallion if requested */}
      {showMedallion && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-48 w-48 text-emerald-700/30 dark:text-emerald-400/20"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            {/* Outer Star */}
            <rect x="25" y="25" width="50" height="50" transform="rotate(0 50 50)" />
            <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
            
            {/* Mid Star */}
            <rect x="30" y="30" width="40" height="40" transform="rotate(15 50 50)" />
            <rect x="30" y="30" width="40" height="40" transform="rotate(60 50 50)" />
            
            {/* Rings & Concentrics */}
            <circle cx="50" cy="50" r="15" />
            <circle cx="50" cy="50" r="8" />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}
