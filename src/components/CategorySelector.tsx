import { CardCategory } from "@/types/card";
import { CategoryIcon } from "./CategoryIcon";
import { getCategoryCount } from "@/utils/cardUtils";

interface CategorySelectorProps {
  selectedCategories: CardCategory[];
  onCategoriesChange: (categories: CardCategory[]) => void;
}

const categories: CardCategory[] = ["Wahrheit", "Aufgabe", "Gruppe", "Duell", "Wildcard"];

const categoryColors: Record<CardCategory, string> = {
  Wahrheit: "text-category-truth",
  Aufgabe: "text-category-task",
  Gruppe: "text-category-group",
  Duell: "text-category-duel",
  Wildcard: "text-category-wildcard",
};

export const CategorySelector = ({ selectedCategories, onCategoriesChange }: CategorySelectorProps) => {
  const toggleCategory = (category: CardCategory) => {
    if (selectedCategories.includes(category)) {
      // Don't allow deselecting if it's the last one
      if (selectedCategories.length === 1) return;
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Wähle deine Kategorien:
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category, index) => {
          const isSelected = selectedCategories.includes(category);
          const isLastOdd = categories.length % 2 !== 0 && index === categories.length - 1;
          
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`flex flex-col items-center gap-2 rounded-lg p-4 transition-all border-2 ${
                isSelected 
                  ? 'border-primary' 
                  : 'bg-muted/50 border-transparent hover:bg-muted'
              } ${isLastOdd ? 'col-span-2' : ''}`}
            >
              <CategoryIcon category={category} />
              <span className={`text-sm font-medium ${categoryColors[category]} text-center`}>
                {category}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        {selectedCategories.length} von {categories.length} Kategorien ausgewählt
      </p>
    </div>
  );
};
