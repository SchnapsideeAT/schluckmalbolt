import { CardCategory } from "@/types/card";
import AufgabeIcon from "@/assets/icons/Aufgabe.svg";
import DuellIcon from "@/assets/icons/Duell.svg";
import GruppeIcon from "@/assets/icons/Gruppe.svg";
import WahrheitIcon from "@/assets/icons/Wahrheit.svg";
import WildcardIcon from "@/assets/icons/Wildcard.svg";

const categoryIcons: Record<CardCategory, string> = {
  Wahrheit: WahrheitIcon,
  Aufgabe: AufgabeIcon,
  Gruppe: GruppeIcon,
  Duell: DuellIcon,
  Wildcard: WildcardIcon,
};

export const getCategoryIcon = (category: CardCategory): string => {
  return categoryIcons[category];
};
