import { memo, useState, useEffect, useRef } from "react";
import { Card, CardCategory } from "@/types/card";
import { getCardImage } from "@/utils/cardImageMapper";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useFeatureFlags } from "@/utils/featureFlags";

/**
 * GameCard Component
 * 
 * Optimized card display with:
 * - GPU-accelerated animations (transform, opacity)
 * - Feature flag support for low-end devices
 * - Lazy-loaded card images
 * - Swipe gesture feedback
 * - Responsive scaling
 * 
 * Performance optimizations:
 * - Uses `memo` to prevent unnecessary re-renders
 * - `will-change` for GPU acceleration
 * - RAF-throttled swipe updates via parent
 * - Cached window size via custom hook
 */

interface GameCardProps {
  card: Card;
  horizontalDistance?: number;
}

const categoryColorMap: Record<CardCategory, string> = {
  Wahrheit: "199 91% 42%",
  Aufgabe: "265 27% 57%", 
  Gruppe: "101 55% 44%",
  Duell: "38 91% 59%",
  Wildcard: "352 78% 58%",
};

export const GameCard = memo(({ 
  card, 
  horizontalDistance = 0,
}: GameCardProps) => {
  const cardImageSrc = getCardImage(card.category, card.id);
  const categoryColor = categoryColorMap[card.category];
  const { width, height } = useWindowSize();
  const { flags } = useFeatureFlags();
  
  const shouldAnimateComplex = flags.enableComplexAnimations;
  
  // Animation state: 'entering' | 'visible'
  const [animationState, setAnimationState] = useState<'entering' | 'visible'>('entering');
  
  // Handle card changes with animation - ALWAYS animate
  useEffect(() => {
    setAnimationState('entering');
    
    const timer = setTimeout(() => {
      setAnimationState('visible');
    }, 600); // Match CSS animation duration
    
    return () => clearTimeout(timer);
  }, [card.id]);

  // Calculate rotation and opacity based on horizontal swipe
  const rotation = horizontalDistance * 0.1;
  const opacity = horizontalDistance !== 0 ? Math.max(0.5, 1 - Math.abs(horizontalDistance) / 300) : 1;

  // Responsive card sizing - optimized for all devices
  let cardMaxHeight: number;
  let cardMaxWidth: number;
  
  if (width < 375) {
    // Compact phones (iPhone SE, small Android)
    cardMaxHeight = height * 0.58;
    cardMaxWidth = width * 0.75;
  } else if (width < 430) {
    // Standard phones (iPhone 13/14/15, Galaxy S23/24, Pixel 7/8)
    cardMaxHeight = height * 0.60;
    cardMaxWidth = width * 0.78;
  } else if (width < 768) {
    // Large phones & phablets (iPhone Pro Max, Galaxy Ultra, Pixel Pro)
    cardMaxHeight = height * 0.62;
    cardMaxWidth = width * 0.80;
  } else {
    // Tablets & Desktop
    cardMaxHeight = height * 0.65;
    cardMaxWidth = Math.min(width * 0.50, 400); // Max 400px on large screens
  }

  return (
    <div
      className={`relative inline-block pointer-events-auto ${
        animationState === 'entering' ? 'animate-enter' : ''
      }`}
      style={{
        width: `${cardMaxWidth}px`,
        maxHeight: `${cardMaxHeight}px`,
        transform: horizontalDistance !== 0
          ? `translateX(${horizontalDistance}px) rotate(${rotation}deg) translateZ(0)`
          : 'translateZ(0)',
        opacity: horizontalDistance !== 0 ? opacity : undefined,
        backfaceVisibility: 'hidden',
        willChange: horizontalDistance !== 0 ? 'transform, opacity' : 'auto',
      }}
    >
      {/* Pulsating Glow Layer - positioned behind card */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: `0 0 20px hsl(${categoryColor} / 1), 0 0 40px hsl(${categoryColor} / 0.8)`,
          animation: 'cardGlowPulse 3s linear infinite',
          willChange: 'opacity',
        }}
      />

      {/* SVG Card Image */}
      <img
        src={cardImageSrc}
        alt={`${card.category} Card ${card.id}`}
        className="w-full h-auto object-contain rounded-2xl block pointer-events-auto relative"
        draggable={false}
        style={{
          cursor: horizontalDistance !== 0 ? 'grabbing' : 'grab',
        }}
        onContextMenu={(e) => e.preventDefault()}
        onError={(e) => {
          console.error(`Failed to load ${card.category} card ${card.id}:`, cardImageSrc);
          console.error('Image element:', e.currentTarget);
        }}
      />
    </div>
  );
});
