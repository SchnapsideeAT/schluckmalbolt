import { useRef, useState, useEffect, useCallback } from "react";
import * as Swing from "swing";
import { triggerHaptic } from "@/utils/haptics";

/**
 * useSwing Hook
 * 
 * Swing-based swipe system using Hammer.js for physics-based card animations.
 * Replaces the custom useSwipe hook with battle-tested Tinder/Jelly swipe logic.
 * 
 * Features:
 * - Robust touch handling via Hammer.js
 * - Physics-based animations
 * - Proper cleanup to prevent memory leaks
 * - Re-init protection with flags
 * - iOS/Android compatible
 * 
 * @param handlers - Callbacks for swipe events
 * @returns Swing state and stack ref for DOM binding
 */

interface SwingHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface SwingState {
  horizontalDistance: number;
  swipeDirection: 'left' | 'right' | null;
  isSwiping: boolean;
}

export const useSwing = (
  stackElement: HTMLElement | null,
  handlers: SwingHandlers
) => {
  const [swingState, setSwingState] = useState<SwingState>({
    horizontalDistance: 0,
    swipeDirection: null,
    isSwiping: false,
  });

  const swingStack = useRef<any>(null);
  const initialized = useRef(false);
  const cardElement = useRef<any>(null);
  
  // Store handlers in ref to avoid re-init when handlers change
  const handlersRef = useRef(handlers);
  
  // Update handlers ref on every render (but don't trigger re-init)
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Initialize Swing Stack
  useEffect(() => {
    if (!stackElement) return;
    if (initialized.current) return; // Prevent double init

    // Swing Config
    const config = {
      allowedDirections: [Swing.Direction.LEFT, Swing.Direction.RIGHT],
      throwOutConfidence: (xOffset: number, yOffset: number, element: HTMLElement) => {
        // Responsive: 60% of card width
        const limit = element.offsetWidth * 0.6;
        return Math.min(Math.abs(xOffset) / limit, 1);
      },
    };

    // Create Stack
    let stack: any = null;
    try {
      stack = Swing.Stack(config);
      swingStack.current = stack;
    } catch (err) {
      console.error('useSwing: Failed to create Swing stack', err);
      return;
    }

    // Find card element
    const cards = stackElement.querySelectorAll('.swing-card');
    
    // Defensive check
    if (!cards.length) {
      console.warn('useSwing: No .swing-card elements found');
      stack?.destroy();
      return;
    }

    // Create card (only first one for now)
    const cardEl = cards[0] as HTMLElement;
    let card: any = null;
    
    try {
      card = stack.createCard(cardEl);
      cardElement.current = card;
    } catch (err) {
      console.error('useSwing: Failed to create card', err);
      stack?.destroy();
      return;
    }

    // dragmove Event - calculate horizontalDistance
    stack.on('dragmove', (e: any) => {
      if (!e.target) return;

      // Use raw Hammer.js deltaX for actual pixel offset (smooth glow)
      const distance = e.deltaX || 0;
      
      setSwingState({
        horizontalDistance: distance,
        swipeDirection: distance < 0 ? 'left' : distance > 0 ? 'right' : null,
        isSwiping: true,
      });
    });

    // throwout Event - card thrown out
    stack.on('throwout', (e: any) => {
      triggerHaptic('medium');
      
      // Reset distance
      setSwingState({
        horizontalDistance: 0,
        swipeDirection: null,
        isSwiping: false,
      });

      // Direction check with Swing.Direction enum (from README: e.direction, NOT e.throwDirection!)
      // Use handlersRef.current to avoid re-init when handlers change
      if (e.direction === Swing.Direction.LEFT) {
        handlersRef.current.onSwipeLeft?.();
      } else if (e.direction === Swing.Direction.RIGHT) {
        handlersRef.current.onSwipeRight?.();
      }
    });

    // throwin Event - card snapped back
    stack.on('throwin', () => {
      setSwingState({
        horizontalDistance: 0,
        swipeDirection: null,
        isSwiping: false,
      });
    });

    initialized.current = true;

    // Cleanup
    return () => {
      try {
        // Defensive cleanup - Swing may throw if element is already removed
        if (cardElement.current && typeof cardElement.current.destroy === 'function') {
          cardElement.current.destroy();
        }
        if (swingStack.current && typeof swingStack.current.destroy === 'function') {
          swingStack.current.destroy();
        }
      } catch (err) {
        // Silent catch - Swing throws when DOM element is already removed (expected behavior)
      } finally {
        swingStack.current = null;
        cardElement.current = null;
        initialized.current = false;
      }
    };
  }, [stackElement]); // Only stackElement - handlers are tracked via ref

  // Reset function for manual reset
  const resetSwingState = useCallback(() => {
    setSwingState({
      horizontalDistance: 0,
      swipeDirection: null,
      isSwiping: false,
    });
  }, []);

  return {
    swingState,
    resetSwingState,
  };
};
