export type CardCategory = "Wahrheit" | "Aufgabe" | "Gruppe" | "Duell" | "Wildcard";

export interface Card {
  id: number;
  category: CardCategory;
  text: string;
  drinks: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  totalDrinks: number;
}

export interface GameState {
  isPlaying: boolean;
  currentCardIndex: number;
  deck: Card[];
  players: Player[];
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  categories: CardCategory[];
  isPurchased: boolean;
  price?: number;
  cardCount: number;
}

export interface CategoryCount {
  category: CardCategory;
  count: number;
}
