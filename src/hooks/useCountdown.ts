import { useState, useEffect } from "react";

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

export function useCountdown(targetTime: Date | null | string): CountdownTime | null {
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(null);

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = (): CountdownTime | null => {
      const now = Date.now();
      const target = new Date(targetTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        return null;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (num: number) => String(num).padStart(2, "0");
      const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

      return { hours, minutes, seconds, formatted };
    };

    // Set initial state
    setTimeLeft(calculateTimeLeft());

    const intervalId = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      // Stop interval if countdown reaches 0 or past
      if (remaining === null) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  return timeLeft;
}
