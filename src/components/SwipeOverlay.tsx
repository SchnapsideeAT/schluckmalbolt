import { memo } from "react";

/**
 * SwipeOverlay Component
 * 
 * Full-screen overlay that shows edge glow effects during swipe gestures.
 * 
 * Features:
 * - Left edge (red) for "Trinken" (drink) action
 * - Right edge (green) for "Erledigt" (complete) action
 * - Proportional opacity based on swipe distance
 * - GPU-optimized with transform and will-change
 * - Smooth fade-out transition after swipe ends
 * - Responsive glow width based on screen size
 */

interface SwipeOverlayProps {
  horizontalDistance: number;
  swipeDirection: 'left' | 'right' | null;
  isSwiping: boolean;
}

export const SwipeOverlay = memo(({ 
  horizontalDistance, 
  swipeDirection, 
  isSwiping 
}: SwipeOverlayProps) => {
  const threshold = 150; // Distance for 100% opacity
  
  // Calculate opacity based on horizontal distance
  const leftOpacity = swipeDirection === 'left' ? 
    Math.min(Math.abs(horizontalDistance) / threshold, 1) : 0;
  const rightOpacity = swipeDirection === 'right' ? 
    Math.min(Math.abs(horizontalDistance) / threshold, 1) : 0;

  // Don't render if not swiping and no opacity
  if (!isSwiping && leftOpacity === 0 && rightOpacity === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[999]"
      style={{ 
        display: isSwiping || leftOpacity > 0 || rightOpacity > 0 ? 'block' : 'none' 
      }}
    >
      {/* Left Edge Glow (Red) - "Trinken" */}
      <div
        className="absolute left-0 top-0 h-full"
        style={{
          width: '120px',
          opacity: leftOpacity,
          background: 'linear-gradient(to right, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.3) 50%, transparent)',
          filter: 'blur(8px)',
          borderRadius: '0 20px 20px 0',
          transform: 'translateZ(0)',
          willChange: isSwiping ? 'opacity' : 'auto',
          transition: isSwiping ? 'none' : 'opacity 0.2s ease-out',
        }}
      />
      
      {/* Right Edge Glow (Green) - "Erledigt" */}
      <div
        className="absolute right-0 top-0 h-full"
        style={{
          width: '120px',
          opacity: rightOpacity,
          background: 'linear-gradient(to left, rgba(34, 197, 94, 0.6), rgba(34, 197, 94, 0.3) 50%, transparent)',
          filter: 'blur(8px)',
          borderRadius: '20px 0 0 20px',
          transform: 'translateZ(0)',
          willChange: isSwiping ? 'opacity' : 'auto',
          transition: isSwiping ? 'none' : 'opacity 0.2s ease-out',
        }}
      />
    </div>
  );
});

SwipeOverlay.displayName = "SwipeOverlay";
