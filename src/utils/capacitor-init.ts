import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export const initializeCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await StatusBar.setOverlaysWebView({ overlay: true });
      
      await StatusBar.setStyle({ style: Style.Dark });
      
      await StatusBar.setBackgroundColor({ color: '#1a1a1a' });
    } catch (error) {
      console.error('Error initializing Capacitor:', error);
    }
  }
};
