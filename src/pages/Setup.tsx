import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";
import { PlayerSetup } from "@/components/PlayerSetup";
import { CategorySelector } from "@/components/CategorySelector";
import { Player, CardCategory } from "@/types/card";
import { playSound } from "@/utils/sounds";
import { loadLastPlayers, loadLastCategories, hasShownInteractiveTutorial } from "@/utils/localStorage";
import { useSettings } from "@/hooks/useSettings";
import { ScrollableContainer } from "@/components/ScrollableContainer";

const Setup = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CardCategory[]>([
    "Wahrheit",
    "Aufgabe",
    "Gruppe",
    "Duell",
    "Wildcard"
  ]);

  // Load last players and categories on mount
  useEffect(() => {
    const lastPlayers = loadLastPlayers();
    const lastCategories = loadLastCategories();
    
    if (lastPlayers && lastPlayers.length > 0) {
      setPlayers(lastPlayers);
    }
    
    if (lastCategories && lastCategories.length > 0) {
      setSelectedCategories(lastCategories);
    }
  }, []);

  return (
    <ScrollableContainer className="max-w-lg mx-auto">
      <div className="space-y-8 text-center slide-up py-6">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border border-primary/50 mb-4">
              <Users className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Spielvorbereitung
            </h1>
          </div>


          {/* Category Selector */}
          <CategorySelector 
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />

          {/* Player Setup Component */}
          <PlayerSetup players={players} onPlayersChange={setPlayers} />

          {/* Start button */}
          <Button
            onClick={() => {
              if (players.length < 2) {
                playSound('error', settings.soundEnabled);
                return;
              }
              if (selectedCategories.length === 0) {
                playSound('error', settings.soundEnabled);
                return;
              }
              playSound('success', settings.soundEnabled);
              
              // Navigate to tutorial if not shown, otherwise go directly to game
              const targetRoute = hasShownInteractiveTutorial() ? "/game" : "/tutorial";
              navigate(targetRoute, { state: { players, selectedCategories } });
            }}
            size="lg"
            className="w-full h-16 text-lg bg-primary hover:shadow-[var(--shadow-button)] transition-all duration-300 hover:scale-105"
          >
            Los geht's!
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="w-full hover:text-primary hover:bg-transparent"
          >
            Zurück
          </Button>
      </div>
    </ScrollableContainer>
  );
};

export default Setup;
