import { CardCategory } from "@/types/card";
import { getCategoryIcon } from "@/utils/categoryIconMapper";

interface CategoryIconProps {
  category: CardCategory;
  className?: string;
}

export const CategoryIcon = ({ category, className = "w-5 h-5" }: CategoryIconProps) => {
  const iconSrc = getCategoryIcon(category);
  
  return (
    <img 
      src={iconSrc}
      alt={category}
      className={className}
    />
  );
};
