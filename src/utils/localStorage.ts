// LocalStorage utilities for game state persistence

export interface GameState {
  players: any[];
  deck: any[];
  currentIndex: number;
  currentPlayerIndex: number;
  cardAccepted: boolean;
  timestamp: number;
}

const GAME_STATE_KEY = 'schluck-mal-game-state';
const LAST_PLAYERS_KEY = 'schluck-mal-last-players';
const LAST_CATEGORIES_KEY = 'schluck-mal-last-categories';
const INTERACTIVE_TUTORIAL_SHOWN_KEY = 'schluck-mal-interactive-tutorial-shown';

// Game State
export const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify({
      ...state,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (!saved) return null;
    
    const state = JSON.parse(saved) as GameState;
    
    // Check if state is less than 24 hours old
    const hoursSinceLastSave = (Date.now() - state.timestamp) / (1000 * 60 * 60);
    if (hoursSinceLastSave > 24) {
      clearGameState();
      return null;
    }
    
    return state;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};

// Last Players
export const saveLastPlayers = (players: any[]): void => {
  try {
    localStorage.setItem(LAST_PLAYERS_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Failed to save last players:', error);
  }
};

export const loadLastPlayers = (): any[] | null => {
  try {
    const saved = localStorage.getItem(LAST_PLAYERS_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load last players:', error);
    return null;
  }
};

// Last Categories
export const saveLastCategories = (categories: any[]): void => {
  try {
    localStorage.setItem(LAST_CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save last categories:', error);
  }
};

export const loadLastCategories = (): any[] | null => {
  try {
    const saved = localStorage.getItem(LAST_CATEGORIES_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load last categories:', error);
    return null;
  }
};

// Interactive Tutorial
export const hasShownInteractiveTutorial = (): boolean => {
  try {
    return localStorage.getItem(INTERACTIVE_TUTORIAL_SHOWN_KEY) === 'true';
  } catch (error) {
    return false;
  }
};

export const markInteractiveTutorialAsShown = (): void => {
  try {
    localStorage.setItem(INTERACTIVE_TUTORIAL_SHOWN_KEY, 'true');
  } catch (error) {
    console.error('Failed to mark interactive tutorial as shown:', error);
  }
};

export const resetInteractiveTutorial = (): void => {
  try {
    localStorage.removeItem(INTERACTIVE_TUTORIAL_SHOWN_KEY);
  } catch (error) {
    console.error('Failed to reset interactive tutorial:', error);
  }
};
