// Feature Flag System for Progressive Enhancement
// Automatically detects device capabilities and adjusts features

interface DeviceCapabilities {
  isLowEndDevice: boolean;
  supportsAdvancedAnimations: boolean;
  supportsWebGL: boolean;
  hasGoodNetwork: boolean;
}

interface FeatureFlags {
  enableGlowEffects: boolean;
  enableComplexAnimations: boolean;
  enableParticleEffects: boolean;
  enableSounds: boolean;
  enableHaptics: boolean;
  reducedMotion: boolean;
  lazyLoadImages: boolean;
}

class FeatureFlagManager {
  private capabilities: DeviceCapabilities;
  private flags: FeatureFlags;

  constructor() {
    this.capabilities = this.detectCapabilities();
    this.flags = this.initializeFlags();
  }

  private detectCapabilities(): DeviceCapabilities {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect low-end device (heuristic)
    const isLowEndDevice = this.detectLowEndDevice();

    // Check WebGL support
    const supportsWebGL = this.detectWebGL();

    // Check network quality
    const hasGoodNetwork = this.detectNetworkQuality();

    return {
      isLowEndDevice,
      supportsAdvancedAnimations: !isLowEndDevice && !prefersReducedMotion,
      supportsWebGL,
      hasGoodNetwork,
    };
  }

  private detectLowEndDevice(): boolean {
    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 4;
    
    // Check device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory || 4;

    // Check screen resolution (high-res screens = modern devices)
    const highResScreen = window.screen.width * window.devicePixelRatio >= 1080;
    const isModernMobile = isMobile && highResScreen && cores >= 4;

    // Check connection type
    const connection = (navigator as any).connection;
    const slowConnection = connection && (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData === true
    );

    // Modern mobile devices (iPhone 11+, Android 2020+) are NOT low-end
    if (isModernMobile) {
      return false;
    }

    // Consider low-end if:
    // - Less than 2 cores (very old devices)
    // - Less than 2GB RAM
    // - Slow connection AND low specs
    return cores < 2 || deviceMemory < 2 || (slowConnection && cores < 4);
  }

  private detectWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      );
    } catch {
      return false;
    }
  }

  private detectNetworkQuality(): boolean {
    const connection = (navigator as any).connection;
    if (!connection) return true; // Assume good by default

    // Check effective connection type
    const effectiveType = connection.effectiveType;
    return effectiveType === '4g' || effectiveType === '3g';
  }

  private initializeFlags(): FeatureFlags {
    const { isLowEndDevice, supportsAdvancedAnimations } = this.capabilities;

    return {
      // Disable expensive effects on low-end devices
      enableGlowEffects: !isLowEndDevice,
      enableComplexAnimations: supportsAdvancedAnimations,
      enableParticleEffects: !isLowEndDevice,
      
      // Keep sounds and haptics enabled by default
      enableSounds: true,
      enableHaptics: true,
      
      // Enable reduced motion if preferred
      reducedMotion: !supportsAdvancedAnimations,
      
      // Lazy load on low-end devices or slow networks
      lazyLoadImages: isLowEndDevice || !this.capabilities.hasGoodNetwork,
    };
  }

  getFlags(): FeatureFlags {
    return { ...this.flags };
  }

  getCapabilities(): DeviceCapabilities {
    return { ...this.capabilities };
  }

  // Override a specific flag (user preference)
  setFlag(key: keyof FeatureFlags, value: boolean): void {
    this.flags[key] = value;
    
    // Persist user preferences
    try {
      const userPrefs = this.getUserPreferences();
      userPrefs[key] = value;
      localStorage.setItem('schluck-mal-feature-flags', JSON.stringify(userPrefs));
    } catch (error) {
      console.error('Failed to save feature flag preference:', error);
    }
  }

  // Load user preferences
  private getUserPreferences(): Partial<FeatureFlags> {
    try {
      const saved = localStorage.getItem('schluck-mal-feature-flags');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  // Apply user preferences over defaults
  applyUserPreferences(): void {
    const userPrefs = this.getUserPreferences();
    this.flags = { ...this.flags, ...userPrefs };
  }

  // Log diagnostics (dev only)
  logDiagnostics(): void {
    if (import.meta.env.DEV) {
      console.group('🎮 Feature Flags');
      console.log('Capabilities:', this.capabilities);
      console.log('Flags:', this.flags);
      console.log('Navigator:', {
        cores: navigator.hardwareConcurrency,
        memory: (navigator as any).deviceMemory,
        connection: (navigator as any).connection?.effectiveType,
      });
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const featureFlagManager = new FeatureFlagManager();

// Apply user preferences on init
featureFlagManager.applyUserPreferences();

// Log diagnostics in dev mode
if (import.meta.env.DEV) {
  featureFlagManager.logDiagnostics();
}

// Export flags as hook
import { useState, useEffect } from 'react';

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState(featureFlagManager.getFlags());

  useEffect(() => {
    // Listen for changes (if needed in the future)
    const handleStorageChange = () => {
      featureFlagManager.applyUserPreferences();
      setFlags(featureFlagManager.getFlags());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateFlag = (key: keyof FeatureFlags, value: boolean) => {
    featureFlagManager.setFlag(key, value);
    setFlags(featureFlagManager.getFlags());
  };

  return {
    flags,
    updateFlag,
    capabilities: featureFlagManager.getCapabilities(),
  };
};
