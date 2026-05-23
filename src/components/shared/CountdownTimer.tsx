import React, { useEffect } from "react";
import { useCountdown } from "../../hooks/useCountdown";
import { cn } from "../../utils/cn";

/**
 * @param {Object} props
 * @param {Date | null | string} props.targetTime - The date/time to count down to.
 * @param {string} [props.className] - Optional container CSS class name.
 * @param {() => void} [props.onComplete] - Optional callback triggered when the countdown ends.
 */
interface CountdownTimerProps {
  targetTime: Date | null | string;
  className?: string;
  onComplete?: () => void;
}

export default function CountdownTimer({
  targetTime,
  className = "",
  onComplete,
}: CountdownTimerProps) {
  const countdown = useCountdown(targetTime);

  useEffect(() => {
    if (targetTime && countdown === null && onComplete) {
      onComplete();
    }
  }, [countdown, targetTime, onComplete]);

  if (!targetTime) return null;

  if (countdown === null) {
    return (
      <span className={cn("font-mono tracking-wider text-emerald-600 dark:text-emerald-400 font-bold", className)}>
        00:00:00
      </span>
    );
  }

  return (
    <span className={cn("font-mono tracking-wider font-bold tabular-nums", className)}>
      {countdown.formatted}
    </span>
  );
}
