import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { SwipeOverlay } from "@/components/SwipeOverlay";
import { CardBack } from "@/components/CardBack";
import { PlayerTransition } from "@/components/PlayerTransition";
import { shuffleDeck } from "@/utils/cardUtils";
import { Card, Player, CardCategory } from "@/types/card";
import { ArrowRight, Beer, Check, Home, Settings } from "lucide-react";
import { useSwing } from "@/hooks/useSwing";
import { saveGameState, loadGameState, clearGameState } from "@/utils/localStorage";
import { triggerHaptic } from "@/utils/haptics";
import { playSound, soundManager } from "@/utils/sounds";
import { useSettings } from "@/hooks/useSettings";
import { useSafeAreaInsets } from "@/hooks/useSafeAreaInsets";
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

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    players?: Player[];
    selectedCategories?: CardCategory[];
    deck?: Card[];
    currentIndex?: number;
    currentPlayerIndex?: number;
    showCard?: boolean;
    cardAccepted?: boolean;
  } | null;
  
  const { settings } = useSettings();
  const { insets } = useSafeAreaInsets();
  const soundEnabled = settings.soundEnabled;
  const hapticEnabled = settings.hapticEnabled;
  
  const [deck, setDeck] = useState<Card[]>(state?.deck || []);
  const [currentIndex, setCurrentIndex] = useState(state?.currentIndex ?? -1);
  const [cardAccepted, setCardAccepted] = useState(state?.cardAccepted ?? false);
  const [players, setPlayers] = useState<Player[]>(state?.players || []);
  const [selectedCategories, setSelectedCategories] = useState<CardCategory[]>(state?.selectedCategories || []);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(state?.currentPlayerIndex ?? 0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showPlayerTransition, setShowPlayerTransition] = useState(false);
  const [nextPlayerIndex, setNextPlayerIndex] = useState(0);
  const [showCard, setShowCard] = useState(true);
  const [showInitialTransition, setShowInitialTransition] = useState(false);

  // Use refs to avoid unnecessary re-renders in auto-save
  const playersRef = useRef(players);
  const deckRef = useRef(deck);
  const currentIndexRef = useRef(currentIndex);
  const currentPlayerIndexRef = useRef(currentPlayerIndex);
  const cardAcceptedRef = useRef(cardAccepted);
  const stackRef = useRef<HTMLDivElement>(null); // Swing stack ref for DOM binding

  // Update refs when values change
  useEffect(() => {
    playersRef.current = players;
    deckRef.current = deck;
    currentIndexRef.current = currentIndex;
    currentPlayerIndexRef.current = currentPlayerIndex;
    cardAcceptedRef.current = cardAccepted;
  }, [players, deck, currentIndex, currentPlayerIndex, cardAccepted]);

  // Auto-save game state every 10 seconds - optimized with refs
  useEffect(() => {
    const interval = setInterval(() => {
      if (playersRef.current.length > 0 && deckRef.current.length > 0 && currentIndexRef.current >= 0) {
        saveGameState({
          players: playersRef.current,
          deck: deckRef.current,
          currentIndex: currentIndexRef.current,
          currentPlayerIndex: currentPlayerIndexRef.current,
          cardAccepted: cardAcceptedRef.current,
          timestamp: Date.now()
        });
      }
    }, 10000); // Save every 10 seconds

    return () => clearInterval(interval);
  }, []); // No dependencies - uses refs instead

  // Preload audio system on mount
  useEffect(() => {
    soundManager.preload().catch(err => {
      console.warn('Failed to preload audio:', err);
    });
  }, []);

  // Load saved game state on mount (after navigation back)
  useEffect(() => {
    // If no state from navigation, try to load from localStorage
    if (!state?.players || state.players.length === 0) {
      const savedState = loadGameState();
      if (savedState) {
        setPlayers(savedState.players);
        setDeck(savedState.deck);
        setCurrentIndex(savedState.currentIndex);
        setCurrentPlayerIndex(savedState.currentPlayerIndex);
        setCardAccepted(savedState.cardAccepted);
        setShowCard(false);
        setShowInitialTransition(true);
        return;
      }
      
      // No saved state, redirect to setup
      navigate("/setup");
      return;
    }
    
    // Initialize deck if not provided
    if (!state?.deck || state.deck.length === 0) {
      const shuffled = shuffleDeck(state?.selectedCategories);
      setDeck(shuffled);
    }
    
    // Show initial transition when loading a saved game
    if (state?.currentIndex !== undefined && state.currentIndex >= 0) {
      setShowCard(false);
      setShowInitialTransition(true);
    }
  }, []);

  // Check if game is finished
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex >= deck.length - 1) {
      // Game is finished, navigate to statistics
      const timer = setTimeout(() => {
        navigate("/statistics", { 
          state: { 
            players,
            deck,
            currentIndex,
            currentPlayerIndex,
            cardAccepted,
            gameFinished: true,
            selectedCategories
          } 
        });
      }, 1000); // Small delay to show the last card
      return () => clearTimeout(timer);
    }
  }, [currentIndex, deck.length, navigate, players, currentPlayerIndex, cardAccepted, selectedCategories]);

  // Draw next card (increments index)
  const drawCard = useCallback(() => {
    if (currentIndex >= deck.length - 1) {
      return;
    }
    
    setCardAccepted(false);
    setCurrentIndex(currentIndex + 1);
    playSound('cardDraw', soundEnabled);
  }, [currentIndex, deck, soundEnabled]);

  // Show current card without incrementing (for restore)
  const showCurrentCard = useCallback(() => {
    setCardAccepted(false);
    // Force animation by updating currentCard reference
    const card = deck[currentIndex];
    if (card) {
      // Create new reference to trigger useEffect in GameCard
      setDeck([...deck]);
    }
    playSound('cardDraw', soundEnabled);
  }, [currentIndex, deck, soundEnabled]);

  const getCategoryColor = useCallback((category: string) => {
    const colors: Record<string, string> = {
      Wahrheit: "bg-category-truth",
      Aufgabe: "bg-category-task",
      Gruppe: "bg-category-group",
      Duell: "bg-category-duel",
      Wildcard: "bg-category-wildcard",
    };
    return colors[category] || "bg-primary";
  }, []);

  const handleAccept = useCallback(() => {
    setCardAccepted(true);
    // Haptic feedback
    triggerHaptic('light', hapticEnabled);
  }, [hapticEnabled]);

  const handleComplete = useCallback(() => {
    const currentPlayer = players[currentPlayerIndex];
    
    // Update player stats
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].totalDrinks = (updatedPlayers[currentPlayerIndex].totalDrinks || 0);
    setPlayers(updatedPlayers);
    
    // Sound effect
    playSound('swipeRight', soundEnabled);
    
    // Hide card before showing transition
    setShowCard(false);
    
    // Show transition to next player
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setNextPlayerIndex(nextIndex);
    setShowPlayerTransition(true);
    playSound('playerChange', soundEnabled);
  }, [currentPlayerIndex, players, soundEnabled]);

  const handleDrink = useCallback(() => {
    const drinks = deck[currentIndex]?.drinks || 0;
    const currentPlayer = players[currentPlayerIndex];
    
    // Update player's drink count
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].totalDrinks += drinks;
    setPlayers(updatedPlayers);
    
    // Sound effects
    playSound('swipeLeft', soundEnabled);
    playSound('drink', soundEnabled);
    
    // Hide card before showing transition
    setShowCard(false);
    
    // Show transition to next player
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setNextPlayerIndex(nextIndex);
    setShowPlayerTransition(true);
  }, [currentIndex, deck, currentPlayerIndex, players, soundEnabled]);

  const showStatistics = useCallback(() => {
    navigate("/statistics", { 
      state: { 
        players,
        deck,
        currentIndex,
        currentPlayerIndex,
        cardAccepted,
        selectedCategories
      } 
    });
  }, [navigate, players, deck, currentIndex, currentPlayerIndex, cardAccepted, selectedCategories]);

  const navigateToSettings = () => {
    // Save before navigating
    saveGameState({
      players,
      deck,
      currentIndex,
      currentPlayerIndex,
      cardAccepted,
      timestamp: Date.now()
    });
    navigate("/settings", {
      state: {
        players,
        deck,
        currentIndex,
        currentPlayerIndex,
        cardAccepted
      }
    });
  };

  // Swing gesture handlers (replaces useSwipe) - MEMOIZED to prevent re-creation
  const swingHandlers = useMemo(() => ({
    onSwipeLeft: () => {
      // Swipe left = drink (skip task)
      if (currentIndex >= 0) {
        handleDrink();
      }
    },
    onSwipeRight: () => {
      // Swipe right = complete task
      if (currentIndex >= 0) {
        handleComplete();
      }
    },
  }), [currentIndex, handleDrink, handleComplete]);

  const { swingState, resetSwingState } = useSwing(stackRef.current, swingHandlers);

  const handlePlayerTransitionTap = useCallback(() => {
    setShowPlayerTransition(false);
    setCurrentPlayerIndex(nextPlayerIndex);
    resetSwingState(); // Reset swing state BEFORE drawing card
    setShowCard(true);
    drawCard();
  }, [nextPlayerIndex, drawCard, resetSwingState]);

  const handleInitialTransitionTap = useCallback(() => {
    setShowInitialTransition(false);
    resetSwingState(); // Reset swing state BEFORE showing card
    setShowCard(true);
    
    // If we're loading a saved game (currentIndex >= 0), show current card
    // Otherwise, draw the first card
    if (currentIndex >= 0) {
      showCurrentCard();
    } else {
      drawCard();
    }
  }, [currentIndex, drawCard, showCurrentCard, resetSwingState]);

  const currentCard = useMemo(() => deck[currentIndex], [deck, currentIndex]);
  const cardsRemaining = useMemo(() => deck.length - currentIndex - 1, [deck.length, currentIndex]);

  // Prefetch next card image
  useEffect(() => {
    if (currentIndex < deck.length - 1) {
      const nextCard = deck[currentIndex + 1];
      if (nextCard) {
        const img = new Image();
        img.src = getCardImage(nextCard.category, nextCard.id);
      }
    }
  }, [currentIndex, deck]);

  const handleExitGame = () => {
    triggerHaptic('light', hapticEnabled);
    playSound('buttonClick', soundEnabled);
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    // Save before leaving
    saveGameState({
      players,
      deck,
      currentIndex,
      currentPlayerIndex,
      cardAccepted,
      timestamp: Date.now()
    });
    navigate("/");
  };

  // Import helper
  const getCardImage = (category: string, id: number) => {
    try {
      return new URL(`../assets/cards/${category}-${String(id).padStart(2, '0')}.svg`, import.meta.url).href;
    } catch {
      return '';
    }
  };

  return (
    <div 
      className="no-scroll h-screen flex flex-col relative"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6" style={{ paddingTop: '0.5rem' }}>
        <Button
          onClick={handleExitGame}
          variant="ghost"
          className="group hover:bg-muted/50 h-10 w-10 p-0 transition-transform active:scale-95"
        >
          <Home className="!w-5 !h-5 group-hover:text-primary transition-colors" />
        </Button>
        
        <Button
          onClick={() => {
            triggerHaptic('light', hapticEnabled);
            playSound('buttonClick', soundEnabled);
            navigateToSettings();
          }}
          variant="ghost"
          className="group hover:bg-muted/50 h-10 w-10 p-0 transition-transform active:scale-95"
        >
          <Settings className="!w-5 !h-5 group-hover:text-primary transition-colors" />
        </Button>
      </div>

      {/* Card display area */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        {currentIndex === -1 ? (
          <div 
            className="text-center space-y-6 slide-up cursor-pointer pointer-events-auto"
            onClick={() => setShowInitialTransition(true)}
            onTouchStart={() => setShowInitialTransition(true)}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border border-primary/50 pulse-glow">
              <Beer className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Bereit?</h2>
              <p className="text-muted-foreground">Ziehe die erste Karte!</p>
            </div>
          </div>
        ) : currentCard && showCard ? (
          <>
            {/* Swing Stack Container */}
            <div ref={stackRef} className="swing-stack">
              <div className="swing-card">
                <GameCard 
                  card={currentCard}
                  horizontalDistance={swingState.horizontalDistance}
                />
              </div>
            </div>
            <SwipeOverlay 
              horizontalDistance={swingState.horizontalDistance}
              swipeDirection={swingState.swipeDirection}
              isSwiping={swingState.isSwiping}
            />
          </>
        ) : null}
      </div>

      {/* Player Transition Screen */}
      {showPlayerTransition && players.length > 0 && currentCard && (
        <PlayerTransition
          player={players[nextPlayerIndex]}
          categoryColor={getCategoryColor(currentCard.category)}
          onTap={handlePlayerTransitionTap}
        />
      )}

      {/* Initial Player Transition Screen */}
      {showInitialTransition && players.length > 0 && (
        <PlayerTransition
          player={players[currentPlayerIndex]}
          categoryColor="bg-primary"
          onTap={handleInitialTransitionTap}
        />
      )}

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-card border-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Spiel verlassen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dein Fortschritt wird automatisch gespeichert und du kannst später weiterspielen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-primary">
              Speichern & Verlassen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default Game;
