import { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  renders: number;
  timestamp: number;
}

export const DevOverlay = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    renders: 0,
    timestamp: Date.now(),
  });
  const [isVisible, setIsVisible] = useState(true);
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderCountRef = useRef(0);

  // FPS Counter
  useEffect(() => {
    let rafId: number;

    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);
        
        // Memory usage (if available)
        const memory = (performance as any).memory
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
          : 0;

        setMetrics({
          fps,
          memory,
          renders: renderCountRef.current,
          timestamp: Date.now(),
        });

        frameCountRef.current = 0;
        lastTimeRef.current = now;
        renderCountRef.current = 0;
      }

      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);

    return () => cancelAnimationFrame(rafId);
  }, []);

  // Track renders
  useEffect(() => {
    renderCountRef.current++;
  });

  // Toggle visibility with keyboard shortcut (Shift + D)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!import.meta.env.DEV || !isVisible) return null;

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'text-green-400';
    if (memory < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div 
      className="fixed top-4 left-4 z-[9999] bg-black/80 backdrop-blur-sm rounded-lg p-3 font-mono text-xs text-white shadow-lg border border-white/10"
      onClick={() => setIsVisible(false)}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">FPS:</span>
          <span className={`font-bold ${getFPSColor(metrics.fps)}`}>
            {metrics.fps}
          </span>
        </div>
        
        {metrics.memory > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">MEM:</span>
            <span className={`font-bold ${getMemoryColor(metrics.memory)}`}>
              {metrics.memory} MB
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Renders/s:</span>
          <span className="font-bold text-blue-400">
            {metrics.renders}
          </span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-gray-500">
        Press Shift+D to toggle
      </div>
    </div>
  );
};
