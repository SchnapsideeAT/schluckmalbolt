import { useState, useEffect } from 'react';
import { CapacitorStorage } from '@/utils/capacitorStorage';

interface Settings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  hasShownInteractiveTutorial: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  hapticEnabled: true,
  hasShownInteractiveTutorial: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const soundEnabled = await CapacitorStorage.get('soundEnabled', true);
      const hapticEnabled = await CapacitorStorage.get('hapticEnabled', true);
      const hasShownInteractiveTutorial = await CapacitorStorage.get('hasShownInteractiveTutorial', false);

      setSettings({
        soundEnabled,
        hapticEnabled,
        hasShownInteractiveTutorial,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): Promise<void> => {
    try {
      await CapacitorStorage.set(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  };

  const setSoundEnabled = (enabled: boolean) => updateSetting('soundEnabled', enabled);
  const setHapticEnabled = (enabled: boolean) => updateSetting('hapticEnabled', enabled);
  const setHasShownInteractiveTutorial = (shown: boolean) => updateSetting('hasShownInteractiveTutorial', shown);

  const resetTutorials = async () => {
    await updateSetting('hasShownInteractiveTutorial', false);
  };

  return {
    settings,
    isLoading,
    setSoundEnabled,
    setHapticEnabled,
    setHasShownInteractiveTutorial,
    resetTutorials,
  };
};
