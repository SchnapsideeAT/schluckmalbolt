import { useState, useEffect, useCallback } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// IndexedDB Schema
interface GameDB extends DBSchema {
  gameState: {
    key: string;
    value: {
      players: any[];
      deck: any[];
      currentIndex: number;
      currentPlayerIndex: number;
      cardAccepted: boolean;
      timestamp: number;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'schluck-mal-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<GameDB> | null = null;

// Initialize IndexedDB
const initDB = async (): Promise<IDBPDatabase<GameDB>> => {
  if (dbInstance) return dbInstance;

  try {
    dbInstance = await openDB<GameDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create object stores
        if (!db.objectStoreNames.contains('gameState')) {
          db.createObjectStore('gameState');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    // Fallback to localStorage if IndexedDB fails
    throw error;
  }
};

// Game Storage Hook
export const useGameStorage = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initDB()
      .then(() => setIsReady(true))
      .catch((error) => {
        console.error('Failed to init DB:', error);
        setIsReady(true); // Still set ready to allow fallback
      });
  }, []);

  const saveGameState = useCallback(async (state: any): Promise<void> => {
    try {
      const db = await initDB();
      await db.put('gameState', { ...state, timestamp: Date.now() }, 'current');
    } catch (error) {
      console.error('Failed to save game state:', error);
      // Fallback to localStorage
      try {
        localStorage.setItem('schluck-mal-game-state', JSON.stringify({
          ...state,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error('Fallback to localStorage failed:', e);
      }
    }
  }, []);

  const loadGameState = useCallback(async (): Promise<any | null> => {
    try {
      const db = await initDB();
      const state = await db.get('gameState', 'current');
      
      if (!state) return null;

      // Check if state is less than 24 hours old
      const hoursSinceLastSave = (Date.now() - state.timestamp) / (1000 * 60 * 60);
      if (hoursSinceLastSave > 24) {
        await clearGameState();
        return null;
      }

      return state;
    } catch (error) {
      console.error('Failed to load game state:', error);
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('schluck-mal-game-state');
        if (!saved) return null;
        const state = JSON.parse(saved);
        
        const hoursSinceLastSave = (Date.now() - state.timestamp) / (1000 * 60 * 60);
        if (hoursSinceLastSave > 24) {
          localStorage.removeItem('schluck-mal-game-state');
          return null;
        }
        
        return state;
      } catch (e) {
        console.error('Fallback to localStorage failed:', e);
        return null;
      }
    }
  }, []);

  const clearGameState = useCallback(async (): Promise<void> => {
    try {
      const db = await initDB();
      await db.delete('gameState', 'current');
    } catch (error) {
      console.error('Failed to clear game state:', error);
      // Fallback to localStorage
      try {
        localStorage.removeItem('schluck-mal-game-state');
      } catch (e) {
        console.error('Fallback to localStorage failed:', e);
      }
    }
  }, []);

  const saveSetting = useCallback(async (key: string, value: any): Promise<void> => {
    try {
      const db = await initDB();
      await db.put('settings', value, key);
    } catch (error) {
      console.error(`Failed to save setting ${key}:`, error);
      // Fallback to localStorage
      try {
        localStorage.setItem(`schluck-mal-${key}`, JSON.stringify(value));
      } catch (e) {
        console.error('Fallback to localStorage failed:', e);
      }
    }
  }, []);

  const loadSetting = useCallback(async (key: string): Promise<any | null> => {
    try {
      const db = await initDB();
      return await db.get('settings', key);
    } catch (error) {
      console.error(`Failed to load setting ${key}:`, error);
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem(`schluck-mal-${key}`);
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        console.error('Fallback to localStorage failed:', e);
        return null;
      }
    }
  }, []);

  return {
    isReady,
    saveGameState,
    loadGameState,
    clearGameState,
    saveSetting,
    loadSetting,
  };
};
