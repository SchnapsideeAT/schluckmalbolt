import { CardCategory } from "@/types/card";

// Lazy-loaded card image mapper with dynamic imports
// This reduces initial bundle size by loading cards on-demand

type CardImageModule = { default: string };

const cardLoaders: Record<CardCategory, Record<number, () => Promise<CardImageModule>>> = {
  Aufgabe: {
    1: () => import("@/assets/cards/Aufgabe-01.svg"),
    2: () => import("@/assets/cards/Aufgabe-02.svg"),
    3: () => import("@/assets/cards/Aufgabe-03.svg"),
    4: () => import("@/assets/cards/Aufgabe-04.svg"),
    5: () => import("@/assets/cards/Aufgabe-05.svg"),
    6: () => import("@/assets/cards/Aufgabe-06.svg"),
    7: () => import("@/assets/cards/Aufgabe-07.svg"),
    8: () => import("@/assets/cards/Aufgabe-08.svg"),
    9: () => import("@/assets/cards/Aufgabe-09.svg"),
    10: () => import("@/assets/cards/Aufgabe-10.svg"),
    11: () => import("@/assets/cards/Aufgabe-11.svg"),
    12: () => import("@/assets/cards/Aufgabe-12.svg"),
    13: () => import("@/assets/cards/Aufgabe-13.svg"),
    14: () => import("@/assets/cards/Aufgabe-14.svg"),
    15: () => import("@/assets/cards/Aufgabe-15.svg"),
    16: () => import("@/assets/cards/Aufgabe-16.svg"),
    17: () => import("@/assets/cards/Aufgabe-17.svg"),
    18: () => import("@/assets/cards/Aufgabe-18.svg"),
    19: () => import("@/assets/cards/Aufgabe-19.svg"),
    20: () => import("@/assets/cards/Aufgabe-20.svg"),
    21: () => import("@/assets/cards/Aufgabe-21.svg"),
    22: () => import("@/assets/cards/Aufgabe-22.svg"),
    23: () => import("@/assets/cards/Aufgabe-23.svg"),
    24: () => import("@/assets/cards/Aufgabe-24.svg"),
  },
  Duell: {
    1: () => import("@/assets/cards/Duell-01.svg"),
    2: () => import("@/assets/cards/Duell-02.svg"),
    3: () => import("@/assets/cards/Duell-03.svg"),
    4: () => import("@/assets/cards/Duell-04.svg"),
    5: () => import("@/assets/cards/Duell-05.svg"),
    6: () => import("@/assets/cards/Duell-06.svg"),
    7: () => import("@/assets/cards/Duell-07.svg"),
    8: () => import("@/assets/cards/Duell-08.svg"),
    9: () => import("@/assets/cards/Duell-09.svg"),
    10: () => import("@/assets/cards/Duell-10.svg"),
    11: () => import("@/assets/cards/Duell-11.svg"),
    12: () => import("@/assets/cards/Duell-12.svg"),
  },
  Gruppe: {
    1: () => import("@/assets/cards/Gruppe-01.svg"),
    2: () => import("@/assets/cards/Gruppe-02.svg"),
    3: () => import("@/assets/cards/Gruppe-03.svg"),
    4: () => import("@/assets/cards/Gruppe-04.svg"),
    5: () => import("@/assets/cards/Gruppe-05.svg"),
    6: () => import("@/assets/cards/Gruppe-06.svg"),
    7: () => import("@/assets/cards/Gruppe-07.svg"),
    8: () => import("@/assets/cards/Gruppe-08.svg"),
    9: () => import("@/assets/cards/Gruppe-09.svg"),
    10: () => import("@/assets/cards/Gruppe-10.svg"),
    11: () => import("@/assets/cards/Gruppe-11.svg"),
    12: () => import("@/assets/cards/Gruppe-12.svg"),
  },
  Wahrheit: {
    1: () => import("@/assets/cards/Warheit-01.svg"),
    2: () => import("@/assets/cards/Warheit-02.svg"),
    3: () => import("@/assets/cards/Warheit-03.svg"),
    4: () => import("@/assets/cards/Warheit-04.svg"),
    5: () => import("@/assets/cards/Warheit-05.svg"),
    6: () => import("@/assets/cards/Warheit-06.svg"),
    7: () => import("@/assets/cards/Warheit-07.svg"),
    8: () => import("@/assets/cards/Warheit-08.svg"),
    9: () => import("@/assets/cards/Warheit-09.svg"),
    10: () => import("@/assets/cards/Warheit-10.svg"),
    11: () => import("@/assets/cards/Warheit-11.svg"),
    12: () => import("@/assets/cards/Warheit-12.svg"),
    13: () => import("@/assets/cards/Warheit-13.svg"),
    14: () => import("@/assets/cards/Warheit-14.svg"),
    15: () => import("@/assets/cards/Warheit-15.svg"),
    16: () => import("@/assets/cards/Warheit-16.svg"),
    17: () => import("@/assets/cards/Warheit-17.svg"),
    18: () => import("@/assets/cards/Warheit-18.svg"),
    19: () => import("@/assets/cards/Warheit-19.svg"),
    20: () => import("@/assets/cards/Warheit-20.svg"),
    21: () => import("@/assets/cards/Warheit-21.svg"),
    22: () => import("@/assets/cards/Warheit-22.svg"),
    23: () => import("@/assets/cards/Warheit-23.svg"),
    24: () => import("@/assets/cards/Warheit-24.svg"),
    25: () => import("@/assets/cards/Warheit-25.svg"),
    26: () => import("@/assets/cards/Warheit-26.svg"),
    27: () => import("@/assets/cards/Warheit-27.svg"),
    28: () => import("@/assets/cards/Warheit-28.svg"),
    29: () => import("@/assets/cards/Warheit-29.svg"),
    30: () => import("@/assets/cards/Warheit-30.svg"),
    31: () => import("@/assets/cards/Warheit-31.svg"),
    32: () => import("@/assets/cards/Warheit-32.svg"),
  },
  Wildcard: {
    1: () => import("@/assets/cards/WildCard-01.svg"),
    2: () => import("@/assets/cards/WildCard-02.svg"),
    3: () => import("@/assets/cards/WildCard-03.svg"),
    4: () => import("@/assets/cards/WildCard-04.svg"),
    5: () => import("@/assets/cards/WildCard-05.svg"),
    6: () => import("@/assets/cards/WildCard-06.svg"),
    7: () => import("@/assets/cards/WildCard-07.svg"),
    8: () => import("@/assets/cards/WildCard-08.svg"),
    9: () => import("@/assets/cards/WildCard-09.svg"),
    10: () => import("@/assets/cards/WildCard-10.svg"),
    11: () => import("@/assets/cards/WildCard-11.svg"),
    12: () => import("@/assets/cards/WildCard-12.svg"),
    13: () => import("@/assets/cards/WildCard-13.svg"),
    14: () => import("@/assets/cards/WildCard-14.svg"),
    15: () => import("@/assets/cards/WildCard-15.svg"),
    16: () => import("@/assets/cards/WildCard-16.svg"),
    17: () => import("@/assets/cards/WildCard-17.svg"),
    18: () => import("@/assets/cards/WildCard-18.svg"),
    19: () => import("@/assets/cards/WildCard-19.svg"),
    20: () => import("@/assets/cards/WildCard-20.svg"),
  },
};

// Cache for loaded images
const imageCache = new Map<string, string>();

/**
 * Get the SVG image path for a card with lazy loading
 * @param category - The card category
 * @param cardId - The card ID from cards.json
 * @returns Promise that resolves to the imported SVG path
 */
export const getCardImageAsync = async (
  category: CardCategory,
  cardId: number
): Promise<string> => {
  const cacheKey = `${category}-${cardId}`;
  
  // Return cached image if available
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  const categoryLoaders = cardLoaders[category];
  if (!categoryLoaders) {
    console.warn(`No loaders found for category: ${category}`);
    return "";
  }

  const loader = categoryLoaders[cardId];
  if (!loader) {
    console.warn(`No loader found for card: ${category}-${cardId}`);
    return "";
  }

  try {
    const module = await loader();
    const imagePath = module.default;
    imageCache.set(cacheKey, imagePath);
    return imagePath;
  } catch (error) {
    console.error(`Failed to load card image: ${category}-${cardId}`, error);
    return "";
  }
};

/**
 * Preload multiple card images
 * @param cards - Array of cards to preload
 */
export const preloadCardImages = async (
  cards: Array<{ category: CardCategory; id: number }>
): Promise<void> => {
  const promises = cards.map(card => getCardImageAsync(card.category, card.id));
  await Promise.all(promises);
};

/**
 * Clear the image cache (useful for memory management)
 */
export const clearImageCache = (): void => {
  imageCache.clear();
};
