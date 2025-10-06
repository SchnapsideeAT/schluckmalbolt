import { useState, useEffect, RefObject } from 'react';

interface UseScrollDetectionProps {
  containerRef: RefObject<HTMLDivElement>;
  enabled?: boolean;
}

export const useScrollDetection = ({ containerRef, enabled = true }: UseScrollDetectionProps) => {
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const checkScrollNeeded = () => {
      if (!containerRef.current) return;
      const { scrollHeight, clientHeight } = containerRef.current;
      setNeedsScroll(scrollHeight > clientHeight);
    };

    const resizeObserver = new ResizeObserver(checkScrollNeeded);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    setTimeout(checkScrollNeeded, 50);

    window.addEventListener('resize', checkScrollNeeded);
    window.addEventListener('orientationchange', checkScrollNeeded);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkScrollNeeded);
      window.removeEventListener('orientationchange', checkScrollNeeded);
    };
  }, [containerRef, enabled]);

  return needsScroll;
};
