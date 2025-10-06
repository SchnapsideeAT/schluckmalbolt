import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFullscreen } from "@/hooks/useFullscreen";

interface GameSettingsProps {
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
  hapticEnabled: boolean;
  onHapticToggle: (enabled: boolean) => void;
}

export const GameSettings = ({
  soundEnabled,
  onSoundToggle,
  hapticEnabled,
  onHapticToggle,
}: GameSettingsProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted/50"
        >
          <Settings className="w-7 h-7" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto max-h-[90vh]">
        <SheetHeader>
          <SheetTitle>Spieleinstellungen</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <Label htmlFor="sound" className="text-base">
                Soundeffekte
              </Label>
            </div>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={onSoundToggle}
            />
          </div>

          {/* Haptic Feedback Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📳</span>
              <Label htmlFor="haptic" className="text-base">
                Haptisches Feedback
              </Label>
            </div>
            <Switch
              id="haptic"
              checked={hapticEnabled}
              onCheckedChange={onHapticToggle}
            />
          </div>

          {/* Fullscreen Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-primary" />
              ) : (
                <Maximize className="w-5 h-5 text-muted-foreground" />
              )}
              <Label htmlFor="fullscreen" className="text-base">
                Vollbildmodus
              </Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? "Beenden" : "Aktivieren"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
