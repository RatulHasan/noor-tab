import { useState, useEffect } from 'react';
import type { BreakpointId } from '~types';

export function useBreakpoint(): BreakpointId {
  const [breakpoint, setBreakpoint] = useState<BreakpointId>('xl');

  useEffect(() => {
    const calculate = () => {
      const w = window.innerWidth;
      if (w >= 1280) setBreakpoint('xl');
      else if (w >= 960) setBreakpoint('lg');
      else if (w >= 640) setBreakpoint('md');
      else setBreakpoint('sm');
    };

    calculate();
    
    // Use ResizeObserver for more accurate tracking than 'resize' event
    const observer = new ResizeObserver(() => {
        calculate();
    });
    
    observer.observe(document.documentElement);
    
    // Also listen to resize event as fallback
    window.addEventListener('resize', calculate);
    
    return () => {
        observer.disconnect();
        window.removeEventListener('resize', calculate);
    };
  }, []);

  return breakpoint;
}
