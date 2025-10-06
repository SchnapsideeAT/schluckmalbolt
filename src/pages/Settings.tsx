import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Volume2, VolumeX, Globe, RotateCcw, Smartphone, GraduationCap } from "lucide-react";
import { loadGameState, clearGameState } from "@/utils/localStorage";
import { shuffleDeck } from "@/utils/cardUtils";
import { useSettings } from "@/hooks/useSettings";
import { ScrollableContainer } from "@/components/ScrollableContainer";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [hasActiveGame, setHasActiveGame] = useState(false);
  
  const { 
    settings, 
    setSoundEnabled, 
    setHapticEnabled, 
    resetTutorials 
  } = useSettings();

  useEffect(() => {
    const gameState = loadGameState();
    setHasActiveGame(!!gameState);
  }, []);

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
  };

  const handleHapticToggle = (checked: boolean) => {
    setHapticEnabled(checked);
  };

  const handleRestart = () => {
    if (hasActiveGame) {
      setShowRestartDialog(true);
    }
  };

  const confirmRestart = () => {
    clearGameState();
    setShowRestartDialog(false);
    setHasActiveGame(false);
    // Navigate back to game with fresh state
    const shuffled = shuffleDeck();
    const gameState = loadGameState();
    if (gameState?.players) {
      const resetPlayers = gameState.players.map(p => ({ ...p, totalDrinks: 0 }));
      navigate("/game", { 
        state: { 
          players: resetPlayers,
          deck: shuffled,
          currentIndex: -1,
          currentPlayerIndex: 0,
          showCard: false,
          cardAccepted: false
        } 
      });
    }
  };

  const goBack = () => {
    if (location.state && 'players' in location.state) {
      // Coming from game, go back to game
      navigate("/game", { state: location.state });
    } else {
      // Go to home
      navigate("/");
    }
  };

  return (
    <>
      <ScrollableContainer className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <Button
              onClick={goBack}
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold">Einstellungen</h1>
          </div>

          <div className="space-y-4 sm:space-y-6 slide-up">
          {/* Game Control */}
          {hasActiveGame && (
            <section className="bg-card border border-border/50 rounded-2xl p-6 space-y-6">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                <RotateCcw className="w-7 h-7" />
                Spiel
              </h2>

              <div className="space-y-4">
                <Button
                  onClick={handleRestart}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Spiel neu starten
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Alle aktuellen Fortschritte gehen verloren
                </p>
              </div>
            </section>
          )}

          {/* Audio & Haptic settings */}
          <section className="bg-card border border-border/50 rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
              <Smartphone className="w-7 h-7" />
              Spieleinstellungen
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Soundeffekte</p>
                  <p className="text-sm text-muted-foreground">
                    Spielgeräusche bei Aktionen ein-/ausschalten
                  </p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={handleSoundToggle}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Haptisches Feedback</p>
                  <p className="text-sm text-muted-foreground">
                    Vibration bei Interaktionen
                  </p>
                </div>
                <Switch
                  checked={settings.hapticEnabled}
                  onCheckedChange={handleHapticToggle}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Tutorial wiederholen</p>
                  <p className="text-sm text-muted-foreground">
                    Swipe Gesten lernen
                  </p>
                </div>
                <Button
                  onClick={() => {
                    resetTutorials();
                    navigate("/tutorial", { state: { fromSettings: true } });
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Starten
                </Button>
              </div>
            </div>
          </section>

          {/* Language settings */}
          <section className="bg-card border border-border/50 rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
              <Globe className="w-7 h-7" />
              Sprache
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Deutsch</p>
                  <p className="text-sm text-muted-foreground">Aktuelle Sprache</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  Aktiv
                </span>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 opacity-50">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">English</p>
                  <p className="text-sm text-muted-foreground">Coming soon</p>
                </div>
              </div>
            </div>
          </section>

          {/* App info */}
          <section className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-primary">App-Information</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Version:</strong> 1.0.0</p>
              <p><strong className="text-foreground">Entwickelt für:</strong> Android & iOS</p>
              <p className="pt-2 text-xs">
                © 2025 Schnapsidee • Alle Rechte vorbehalten
              </p>
            </div>
          </section>
        </div>
      </ScrollableContainer>

      {/* Restart Confirmation Dialog */}
      <AlertDialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <AlertDialogContent className="bg-card border-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Spiel neu starten?</AlertDialogTitle>
            <AlertDialogDescription>
              Alle aktuellen Fortschritte und Statistiken gehen verloren. Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestart} className="bg-destructive hover:bg-destructive/90">
              Neu starten
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Settings;
