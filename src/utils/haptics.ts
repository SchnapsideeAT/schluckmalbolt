import { Haptics, ImpactStyle } from '@capacitor/haptics';

export type HapticType = 'light' | 'medium' | 'heavy';

export const triggerHaptic = async (type: HapticType = 'medium', enabled: boolean = true) => {
  if (!enabled) return;
  
  try {
    // Try native Capacitor Haptics first
    const impactStyle = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    }[type];

    await Haptics.impact({ style: impactStyle });
  } catch (error) {
    // Fallback to Web Vibration API
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
      };
      navigator.vibrate(patterns[type]);
    }
  }
};
