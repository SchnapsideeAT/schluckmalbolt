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
 * - Defensive initialization with extensive logging
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
    console.log('useSwing: Init attempt', { stackElement: !!stackElement, initialized: initialized.current });

    if (!stackElement) {
      console.warn('useSwing: stackElement is null, waiting for DOM mount');
      return;
    }

    if (initialized.current) {
      console.log('useSwing: Already initialized, skipping re-init');
      return;
    }

    // Find card elements - defensive check with delay for React render
    const cards = stackElement.querySelectorAll('.swing-card');

    console.log('useSwing: Found cards', { count: cards.length, stackElement });

    if (!cards.length) {
      console.warn('useSwing: No .swing-card elements found - React may not have rendered yet');
      return;
    }

    // Swing Config
    const config = {
      allowedDirections: [Swing.Direction.LEFT, Swing.Direction.RIGHT],
      throwOutConfidence: (xOffset: number, yOffset: number, element: HTMLElement) => {
        const limit = element.offsetWidth * 0.6;
        return Math.min(Math.abs(xOffset) / limit, 1);
      },
    };

    // Create Stack
    let stack: any = null;
    try {
      stack = Swing.Stack(config);
      swingStack.current = stack;
      console.log('useSwing: Swing.Stack created successfully');
    } catch (err) {
      console.error('useSwing: Failed to create Swing stack', err);
      return;
    }

    // Create card (only first one for now)
    const cardEl = cards[0] as HTMLElement;
    let card: any = null;

    try {
      card = stack.createCard(cardEl);
      cardElement.current = card;
      console.log('useSwing: Card created successfully', { cardEl });
    } catch (err) {
      console.error('useSwing: Failed to create card', err);
      stack?.destroy();
      return;
    }

    // dragmove Event - calculate horizontalDistance
    const handleDragMove = (e: any) => {
      if (!e || typeof e.throwOutConfidence === 'undefined') {
        console.warn('useSwing: Invalid dragmove event', e);
        return;
      }

      const distance = e.throwOutConfidence * window.innerWidth * (e.throwDirection?.x < 0 ? -1 : 1);

      console.log('useSwing: dragmove', { distance, throwOutConfidence: e.throwOutConfidence });

      setSwingState({
        horizontalDistance: distance,
        swipeDirection: distance < 0 ? 'left' : distance > 0 ? 'right' : null,
        isSwiping: true,
      });
    };

    // throwout Event - card thrown out
    const handleThrowOut = (e: any) => {
      console.log('useSwing: throwout', { direction: e.throwDirection });

      triggerHaptic('medium');

      setSwingState({
        horizontalDistance: 0,
        swipeDirection: null,
        isSwiping: false,
      });

      // Direction check - e.throwDirection has x property
      if (e.throwDirection && e.throwDirection.x < 0) {
        console.log('useSwing: Swipe LEFT detected');
        handlersRef.current.onSwipeLeft?.();
      } else if (e.throwDirection && e.throwDirection.x > 0) {
        console.log('useSwing: Swipe RIGHT detected');
        handlersRef.current.onSwipeRight?.();
      }
    };

    // throwin Event - card snapped back
    const handleThrowIn = () => {
      console.log('useSwing: throwin - card snapped back');
      setSwingState({
        horizontalDistance: 0,
        swipeDirection: null,
        isSwiping: false,
      });
    };

    stack.on('dragmove', handleDragMove);
    stack.on('throwout', handleThrowOut);
    stack.on('throwin', handleThrowIn);

    initialized.current = true;
    console.log('useSwing: Initialization complete, events bound');

    // Cleanup
    return () => {
      console.log('useSwing: Cleanup started');
      try {
        if (stack) {
          stack.off('dragmove', handleDragMove);
          stack.off('throwout', handleThrowOut);
          stack.off('throwin', handleThrowIn);
        }

        if (cardElement.current && typeof cardElement.current.destroy === 'function') {
          cardElement.current.destroy();
        }
        if (swingStack.current && typeof swingStack.current.destroy === 'function') {
          swingStack.current.destroy();
        }
      } catch (err) {
        console.warn('useSwing: Cleanup error (expected if DOM removed)', err);
      } finally {
        swingStack.current = null;
        cardElement.current = null;
        initialized.current = false;
        console.log('useSwing: Cleanup complete');
      }
    };
  }, [stackElement]);

  // Reset function for manual reset
  const resetSwingState = useCallback(() => {
    console.log('useSwing: Manual reset');
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
