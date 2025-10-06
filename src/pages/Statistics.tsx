import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Player, Card, CardCategory } from "@/types/card";
import { ArrowLeft, Trophy, Beer, Crown, Medal, RotateCcw } from "lucide-react";
import { Confetti } from "@/components/Confetti";
import { saveLastPlayers, saveLastCategories, clearGameState } from "@/utils/localStorage";
import { useSafeAreaInsets } from "@/hooks/useSafeAreaInsets";

const Statistics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { insets } = useSafeAreaInsets();
  const state = location.state as { 
    players?: Player[];
    deck?: Card[];
    currentIndex?: number;
    currentPlayerIndex?: number;
    showCard?: boolean;
    cardAccepted?: boolean;
    gameFinished?: boolean;
    selectedCategories?: CardCategory[];
  } | null;
  
  const players = state?.players || [];
  const gameFinished = state?.gameFinished || false;

  // Trigger confetti on mount if there are players
  useEffect(() => {
    // Small delay for page transition
    const timer = setTimeout(() => {
      if (players.length > 0) {
        // Confetti will auto-trigger via component
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Sort players by total drinks (descending)
  const sortedPlayers = [...players].sort((a, b) => b.totalDrinks - a.totalDrinks);

  // Calculate total drinks
  const totalDrinks = players.reduce((sum, p) => sum + p.totalDrinks, 0);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBgColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-500/10 border-yellow-500/30";
      case 1:
        return "bg-gray-400/10 border-gray-400/30";
      case 2:
        return "bg-amber-600/10 border-amber-600/30";
      default:
        return "bg-muted/50 border-border/30";
    }
  };

  const handleNewGame = () => {
    // Save players and categories for the next round
    if (state?.players) {
      saveLastPlayers(state.players);
    }
    if (state?.selectedCategories) {
      saveLastCategories(state.selectedCategories);
    }
    
    // Clear the game state
    clearGameState();
    
    // Navigate to setup
    navigate("/setup");
  };

  return (
    <div 
      className="h-screen flex flex-col overflow-y-auto"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        boxSizing: 'border-box',
      }}
    >
      {/* Confetti Effect */}
      <Confetti trigger={sortedPlayers.length > 0 && sortedPlayers[0].totalDrinks > 0} />
      
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Statistiken</h1>
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-6 slide-up">
        {/* Trophy Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border border-primary/50 pulse-glow">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Spielergebnisse</h2>
            <p className="text-muted-foreground">
              Gesamt: {totalDrinks} Schlück{totalDrinks !== 1 ? "e" : ""}
            </p>
          </div>
        </div>

        {/* Rankings */}
        {sortedPlayers.length > 0 ? (
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => {
              const percentage = totalDrinks > 0 ? (player.totalDrinks / totalDrinks) * 100 : 0;
              
              return (
                <div
                  key={player.id}
                  className={`border rounded-2xl p-5 transition-all hover:scale-[1.02] ${getRankBgColor(index)}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12 shrink-0">
                      {getRankIcon(index) || (
                        <span className="text-2xl font-bold text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{player.avatar}</span>
                        <span className="text-xl font-semibold text-foreground">
                          {player.name}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Drinks Count */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                        <Beer className="w-6 h-6" />
                        {player.totalDrinks}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Keine Spielerdaten verfügbar</p>
          </div>
        )}

        {/* Winner Message */}
        {sortedPlayers.length > 0 && sortedPlayers[0].totalDrinks > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/10 via-primary/10 to-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">🎉 Verlierer des Abends 🎉</p>
            <p className="text-2xl font-bold">
              {sortedPlayers[0].avatar} {sortedPlayers[0].name}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              mit {sortedPlayers[0].totalDrinks} Schlück{sortedPlayers[0].totalDrinks !== 1 ? "en" : ""}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {gameFinished && (
            <Button
              onClick={handleNewGame}
              size="lg"
              className="w-full h-14 text-lg bg-primary hover:shadow-[var(--shadow-button)] transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Neues Spiel starten
            </Button>
          )}
          
          {!gameFinished && (
            <Button
              onClick={() => navigate("/game", { state })}
              size="lg"
              className="w-full h-14 text-lg bg-primary hover:shadow-[var(--shadow-button)] transition-all duration-300"
            >
              Zurück zum Spiel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
