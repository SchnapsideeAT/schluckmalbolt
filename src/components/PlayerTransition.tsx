import { Player } from "@/types/card";
import { triggerHaptic } from "@/utils/haptics";
import { useSettings } from "@/hooks/useSettings";

/**
 * PlayerTransition Component
 * 
 * Displays a fullscreen transition when switching between players.
 * Features:
 * - Smooth fade-in animation
 * - Player avatar and name display
 * - Tap or swipe to continue
 * - Haptic feedback on interaction
 */

interface PlayerTransitionProps {
  player: Player;
  categoryColor: string;
  onTap: () => void;
}

export const PlayerTransition = ({ 
  player, 
  categoryColor, 
  onTap
}: PlayerTransitionProps) => {
  const { settings } = useSettings();
  
  const handleInteraction = () => {
    triggerHaptic('medium', settings.hapticEnabled);
    onTap();
  };

  return (
    <div 
      className={`fixed inset-0 ${categoryColor} z-50 flex items-center justify-center cursor-pointer animate-fade-in-smooth`}
      onClick={handleInteraction}
      onTouchEnd={handleInteraction}
    >
      <div className="text-center space-y-8 px-8 animate-scale-in-smooth">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 shadow-2xl">
          <span className="text-7xl drop-shadow-2xl">{player.avatar}</span>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-5xl font-bold text-white drop-shadow-2xl">
            {player.name}
          </h2>
          <p className="text-2xl text-white/90 drop-shadow-lg font-medium">
            Du bist dran!
          </p>
        </div>
        
        <p className="text-white/70 text-lg drop-shadow-md">
          Tippe überall, um fortzufahren
        </p>
      </div>
    </div>
  );
};
