import { Card, CardCategory, CategoryCount } from "@/types/card";
import cardsData from "@/data/cards.json";

export const shuffleDeck = (selectedCategories?: CardCategory[]): Card[] => {
  let deck = [...cardsData] as Card[];
  
  // Filter by selected categories if provided
  if (selectedCategories && selectedCategories.length > 0) {
    deck = deck.filter(card => selectedCategories.includes(card.category));
  }
  
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  // Ensure no two Wildcards are consecutive
  for (let i = 0; i < deck.length - 1; i++) {
    if (deck[i].category === "Wildcard" && deck[i + 1].category === "Wildcard") {
      // Find the next non-Wildcard card after position i+1
      let swapIndex = i + 2;
      while (swapIndex < deck.length && deck[swapIndex].category === "Wildcard") {
        swapIndex++;
      }
      
      // If we found a non-Wildcard, swap it with the consecutive Wildcard
      if (swapIndex < deck.length) {
        [deck[i + 1], deck[swapIndex]] = [deck[swapIndex], deck[i + 1]];
      }
    }
  }
  
  return deck;
};

export const loadCards = (): Card[] => {
  return cardsData as Card[];
};

export const getCategoryCount = (category: CardCategory): number => {
  const cards = cardsData as Card[];
  return cards.filter(card => card.category === category).length;
};

export const getAllCategoryCounts = (): CategoryCount[] => {
  const categories: CardCategory[] = ["Wahrheit", "Aufgabe", "Gruppe", "Duell", "Wildcard"];
  return categories.map(category => ({
    category,
    count: getCategoryCount(category)
  }));
};
