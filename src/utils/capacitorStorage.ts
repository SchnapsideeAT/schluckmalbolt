import { Preferences } from '@capacitor/preferences';

export class CapacitorStorage {
  static async set(key: string, value: any): Promise<void> {
    try {
      await Preferences.set({
        key,
        value: JSON.stringify(value),
      });
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      // Fallback to localStorage
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const { value } = await Preferences.get({ key });
      if (value !== null) {
        return JSON.parse(value);
      }
      
      // Check localStorage as fallback
      const localValue = localStorage.getItem(key);
      if (localValue !== null) {
        // Migrate to Capacitor Storage
        const parsed = JSON.parse(localValue);
        await this.set(key, parsed);
        return parsed;
      }
      
      return defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      // Fallback to localStorage
      const localValue = localStorage.getItem(key);
      return localValue ? JSON.parse(localValue) : defaultValue;
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
      // Also remove from localStorage
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await Preferences.clear();
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
