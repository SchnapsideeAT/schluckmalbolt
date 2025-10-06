import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ArrowUp, Check } from "lucide-react";
import { useSwing } from "@/hooks/useSwing";
import { SwipeOverlay } from "@/components/SwipeOverlay";
import { PlayerTransition } from "@/components/PlayerTransition";
import { triggerHaptic } from "@/utils/haptics";
import { playSound } from "@/utils/sounds";
import { markInteractiveTutorialAsShown } from "@/utils/localStorage";
import { useSettings } from "@/hooks/useSettings";
import { useWindowSize } from "@/hooks/useWindowSize";
import cardBackSvg from "@/assets/card-back.svg";

interface TutorialStep {
  title: string;
  description: string;
  requiredSwipe?: 'left' | 'right' | 'up';
  icon?: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Los geht's mit Schluck mal!",
    description: "Das einzige Trinkspiel das du brauchen wirst.",
    icon: <div className="text-6xl animate-wave">👋</div>,
  },
  {
    title: "Swipe nach rechts",
    description: "Wische die Karte nach rechts, um die Aufgabe zu erfüllen.",
    requiredSwipe: 'right',
    icon: <ArrowRight className="w-16 h-16 text-green-500" />,
  },
  {
    title: "Swipe nach links",
    description: "Wische die Karte nach links, wenn du die Aufgabe trinkst oder überspringst.",
    requiredSwipe: 'left',
    icon: <ArrowLeft className="w-16 h-16 text-red-500" />,
  },
];

export const InteractiveTutorial = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const { width, height } = useWindowSize();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPlayerTransition, setShowPlayerTransition] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  // Ref for Swing stack
  const stackRef = useRef<HTMLDivElement>(null);

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  
  // Responsive card sizing - EXACT COPY from GameCard
  let cardMaxHeight: number;
  let cardMaxWidth: number;
  
  if (width < 375) {
    // Compact phones (iPhone SE, small Android)
    cardMaxHeight = height * 0.58;
    cardMaxWidth = width * 0.75;
  } else if (width < 430) {
    // Standard phones (iPhone 13/14/15, Galaxy S23/24, Pixel 7/8)
    cardMaxHeight = height * 0.60;
    cardMaxWidth = width * 0.78;
  } else if (width < 768) {
    // Large phones & phablets (iPhone Pro Max, Galaxy Ultra, Pixel Pro)
    cardMaxHeight = height * 0.62;
    cardMaxWidth = width * 0.80;
  } else {
    // Tablets & Desktop
    cardMaxHeight = height * 0.65;
    cardMaxWidth = Math.min(width * 0.50, 400); // Max 400px on large screens
  }

  // Swipe handling for tutorial - MEMOIZED with useCallback
  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    if (currentStep === 0) {
      // First step: accept any swipe to proceed
      triggerHaptic('light', settings.hapticEnabled);
      playSound('success', settings.soundEnabled);
      setCanProceed(true);
      return;
    }

    if (step.requiredSwipe === direction) {
      // Correct swipe
      triggerHaptic('medium', settings.hapticEnabled);
      playSound('success', settings.soundEnabled);
      setCanProceed(true);
    } else if (step.requiredSwipe) {
      // Wrong swipe
      triggerHaptic('light', settings.hapticEnabled);
      playSound('buttonClick', settings.soundEnabled);
    }
  }, [currentStep, step, settings.hapticEnabled, settings.soundEnabled]);

  // Swing gesture handlers - MEMOIZED to prevent re-creation
  const swingHandlers = useMemo(() => ({
    onSwipeLeft: () => handleSwipe('left'),
    onSwipeRight: () => handleSwipe('right'),
  }), [handleSwipe]);

  const { swingState, resetSwingState } = useSwing(stackRef.current, swingHandlers);

  const handleNext = () => {
    if (!canProceed && currentStep > 0) return;

    if (isLastStep) {
      completeTutorial();
    } else {
      setCurrentStep(prev => prev + 1);
      setCanProceed(false);
    }
  };

  const completeTutorial = () => {
    markInteractiveTutorialAsShown();
    
    // Check if coming from Settings
    if (location.state?.fromSettings) {
      navigate('/settings');
    } else {
      // Normal game flow: Setup -> Tutorial -> Game
      const state = location.state as { players?: any[]; selectedCategories?: any[] };
      navigate('/game', { state });
    }
  };

  const handleSkip = () => {
    if (location.state?.fromSettings) {
      navigate('/settings');
    } else {
      markInteractiveTutorialAsShown();
      const state = location.state as { players?: any[]; selectedCategories?: any[] };
      navigate('/game', { state });
    }
  };

  // Reset swing state when tutorial step changes
  useEffect(() => {
    resetSwingState();
  }, [currentStep, resetSwingState]);

  // Auto-proceed after correct swipe
  useEffect(() => {
    if (canProceed && currentStep > 0 && currentStep < tutorialSteps.length) {
      const timer = setTimeout(() => {
        handleNext();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [canProceed, currentStep]);


  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">

      {/* Progress indicator */}
      <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {tutorialSteps.map((_, index) => (
          <div
            key={index}
            className={`h-3 rounded-full transition-all ${
              index === currentStep
                ? "w-10 bg-primary"
                : index < currentStep
                ? "w-3 bg-primary/50"
                : "w-3 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-8 w-full px-2">
        {/* Icon/Visual */}
        {step.icon && !step.requiredSwipe && (
          <div className="flex justify-center animate-scale-in mt-4">
            {step.icon}
          </div>
        )}

        {/* Tutorial card for left/right swipe steps - Swing-based structure */}
        {step.requiredSwipe && (
          <div className="w-full flex flex-col items-center gap-4 sm:gap-6">
            {/* Card with Swing */}
            <div className="w-full flex items-center justify-center">
              <div 
                ref={stackRef}
                className="swing-stack relative"
                style={{
                  width: `${cardMaxWidth}px`,
                  maxHeight: `${cardMaxHeight}px`,
                }}
              >
                <div className="swing-card">
                  <img 
                    src={cardBackSvg} 
                    alt="Tutorial Card" 
                    className="w-full h-auto object-contain rounded-2xl block"
                    draggable={false}
                    style={{
                      transform: `translateX(${swingState.horizontalDistance}px) rotate(${swingState.horizontalDistance * 0.1}deg)`,
                      transition: swingState.isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  />
                  
                  {/* Success checkmark */}
                  {canProceed && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-green-500 rounded-full p-4 animate-scale-in">
                        <Check className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Direction icon hint below card with text */}
            <div className={`flex flex-col items-center gap-4 ${canProceed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
              {step.requiredSwipe === 'right' && (
                <>
                  <ArrowRight className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 animate-bounce-right" />
                  <div className="text-center space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md">{step.description}</p>
                  </div>
                </>
              )}
              {step.requiredSwipe === 'left' && (
                <>
                  <ArrowLeft className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 animate-bounce-left" />
                  <div className="text-center space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md">{step.description}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Swipe overlay for visual feedback - only for horizontal swipes */}
        {step.requiredSwipe && step.requiredSwipe !== 'up' && swingState.isSwiping && Math.abs(swingState.horizontalDistance) > 20 && (
          <SwipeOverlay
            horizontalDistance={swingState.horizontalDistance}
            swipeDirection={swingState.swipeDirection}
            isSwiping={swingState.isSwiping}
          />
        )}

        {/* Text content - only for non-swipe steps */}
        {!step.requiredSwipe && (
          <div className="text-center space-y-2 sm:space-y-4 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{step.title}</h2>
            <p className="text-base sm:text-lg text-muted-foreground">{step.description}</p>
          </div>
        )}

        {/* Action buttons for non-swipe steps */}
        {!step.requiredSwipe && (
          <Button
            onClick={handleNext}
            className="w-full bg-primary hover:bg-primary/90 mt-2 sm:mt-4"
            size="lg"
          >
            {isLastStep ? (
              <>
                Los geht's!
                <Check className="w-5 h-5 ml-2" />
              </>
            ) : (
              "Weiter"
            )}
          </Button>
        )}
      </div>

      {/* Skip button at bottom center */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-30">
        <Button
          onClick={handleSkip}
          variant="ghost"
          className="text-sm sm:text-base hover:bg-transparent hover:text-primary text-muted-foreground"
        >
          Überspringen
        </Button>
      </div>
    </div>
  );
};
