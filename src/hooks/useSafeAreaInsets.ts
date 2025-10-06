import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

interface SafeAreaInsets {
  top: string;
  bottom: string;
  left: string;
  right: string;
}

interface DebugInfo {
  cssEnvValues: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  hasCSSValues: boolean;
  isIOS: boolean;
  hasNotch: boolean;
  isPortrait: boolean;
  windowHeight: number;
  screenHeight: number;
  windowWidth: number;
  screenWidth: number;
  userAgent: string;
  calculatedInsets: SafeAreaInsets;
  isCapacitorNative: boolean;
  heightDiff: number;
  capacitorManagedBottom: boolean;
}

const DEFAULT_INSETS: SafeAreaInsets = {
  top: '1rem',
  bottom: '1rem',
  left: '1rem',
  right: '1rem',
};

export const useSafeAreaInsets = () => {
  const [insets, setInsets] = useState<SafeAreaInsets>(DEFAULT_INSETS);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    const calculateInsets = () => {
      // Try to get CSS env() values first
      const testDiv = document.createElement('div');
      testDiv.style.position = 'fixed';
      testDiv.style.top = '0';
      testDiv.style.left = '0';
      testDiv.style.width = '1px';
      testDiv.style.height = '1px';
      testDiv.style.paddingTop = 'env(safe-area-inset-top, 0px)';
      testDiv.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
      testDiv.style.paddingLeft = 'env(safe-area-inset-left, 0px)';
      testDiv.style.paddingRight = 'env(safe-area-inset-right, 0px)';
      testDiv.style.visibility = 'hidden';
      document.body.appendChild(testDiv);

      const computed = getComputedStyle(testDiv);
      const cssTop = computed.paddingTop;
      const cssBottom = computed.paddingBottom;
      const cssLeft = computed.paddingLeft;
      const cssRight = computed.paddingRight;

      document.body.removeChild(testDiv);

      // Device detection
      const windowHeight = window.innerHeight;
      const screenHeight = window.screen.height;
      const windowWidth = window.innerWidth;
      const screenWidth = window.screen.width;
      const userAgent = navigator.userAgent;
      const isIOS = /iPhone|iPad|iPod/.test(userAgent);
      const hasNotch = isIOS && (screenHeight >= 812 || screenWidth >= 812);
      const isPortrait = windowHeight > windowWidth;

      // Check if CSS env() values are valid (not '0px')
      const hasCSSValues = 
        cssTop !== '0px' && 
        cssBottom !== '0px' && 
        cssTop !== '' && 
        cssBottom !== '';

      // Check if running in Capacitor native app
      // In Capacitor native, ALWAYS use bottom=0 because the viewport is already adjusted
      // This applies whether keyboard is open or closed - the viewport automatically shrinks for keyboard
      const isCapacitorNative = Capacitor.isNativePlatform();
      const heightDiff = screenHeight - windowHeight;
      const capacitorManagedBottom = isCapacitorNative; // Always true in Capacitor, regardless of heightDiff

      let calculatedInsets: SafeAreaInsets;

      if (hasCSSValues) {
        // Use CSS values, but check if bottom is already managed by Capacitor
        calculatedInsets = {
          top: `max(1rem, ${cssTop})`,
          bottom: capacitorManagedBottom ? '0px' : `max(1rem, ${cssBottom})`,
          left: `max(1rem, ${cssLeft})`,
          right: `max(1rem, ${cssRight})`,
        };
      } else {
        // Fallback: Calculate based on viewport differences
        let topInset = '1rem';
        let bottomInset = '1rem';

        if (hasNotch) {
          // iPhone X and newer have notch/dynamic island and home indicator
          if (isPortrait) {
            topInset = 'max(1rem, 44px)';
            bottomInset = capacitorManagedBottom ? '0px' : 'max(1rem, 34px)';
          } else {
            topInset = 'max(1rem, 32px)';
            bottomInset = capacitorManagedBottom ? '0px' : 'max(1rem, 21px)';
          }
        } else if (isIOS) {
          // Older iPhones without notch
          topInset = 'max(1rem, 20px)';
          bottomInset = capacitorManagedBottom ? '0px' : '1rem';
        }

        calculatedInsets = {
          top: topInset,
          bottom: bottomInset,
          left: '1rem',
          right: '1rem',
        };
      }

      // Store debug info
      setDebugInfo({
        cssEnvValues: {
          top: cssTop,
          bottom: cssBottom,
          left: cssLeft,
          right: cssRight,
        },
        hasCSSValues,
        isIOS,
        hasNotch,
        isPortrait,
        windowHeight,
        screenHeight,
        windowWidth,
        screenWidth,
        userAgent,
        calculatedInsets,
        isCapacitorNative,
        heightDiff,
        capacitorManagedBottom,
      });

      setInsets(calculatedInsets);
    };

    // Initial calculation
    calculateInsets();

    // Recalculate on resize and orientation change
    window.addEventListener('resize', calculateInsets);
    window.addEventListener('orientationchange', calculateInsets);

    return () => {
      window.removeEventListener('resize', calculateInsets);
      window.removeEventListener('orientationchange', calculateInsets);
    };
  }, []);

  return { insets, debugInfo };
};
