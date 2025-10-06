import { useState } from "react";
import { Player } from "@/types/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { playSound } from "@/utils/sounds";
import { useSettings } from "@/hooks/useSettings";

interface PlayerSetupProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
}

const AVATAR_OPTIONS = ["🍺", "🍻", "🍷", "🥂", "🍾", "🍹", "🤡", "😈", "🥳", "😎"];

export const PlayerSetup = ({
  players,
  onPlayersChange
}: PlayerSetupProps) => {
  const { settings } = useSettings();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      return;
    }
    if (players.length >= 10) {
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim().toUpperCase(),
      avatar: selectedAvatar,
      totalDrinks: 0
    };

    onPlayersChange([...players, newPlayer]);
    setNewPlayerName("");
    setSelectedAvatar(AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)]);
    
    playSound('success', settings.soundEnabled);
  };

  const removePlayer = (playerId: string) => {
    const updatedPlayers = players.filter(p => p.id !== playerId);
    onPlayersChange(updatedPlayers);
  };

  return <div className="space-y-8">
      {/* Add Player Section */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Spieler hinzufügen</h3>
        
        {/* Avatar Selection */}
        <div>
          
          <div className="grid grid-cols-5 gap-2">
            {AVATAR_OPTIONS.map(avatar => <button key={avatar} onClick={() => setSelectedAvatar(avatar)} className={`text-2xl p-3 rounded-lg transition-all flex items-center justify-center ${selectedAvatar === avatar ? "bg-primary/20 border-2 border-primary scale-110" : "bg-muted/50 border border-border/30 hover:bg-muted hover:scale-105"}`}>
                {avatar}
              </button>)}
          </div>
        </div>

        {/* Name Input */}
        <form onSubmit={(e) => { e.preventDefault(); addPlayer(); }} action="#" className="flex gap-2">
          <Input 
            placeholder="Spielername..." 
            value={newPlayerName} 
            onChange={e => setNewPlayerName(e.target.value.toUpperCase())} 
            maxLength={8} 
            className="flex-1"
            enterKeyHint="done"
            disabled={players.length >= 10}
            data-testid="input-player-name"
          />
          <Button 
            onClick={addPlayer} 
            size="icon" 
            className="shrink-0" 
            type="button" 
            disabled={players.length >= 10}
            data-testid="button-add-player"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </form>
      </div>

      {/* Players List */}
      {players.length > 0 && <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Spieler ({players.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {players.map(player => <div key={player.id} onClick={() => removePlayer(player.id)} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 hover:bg-destructive/20 hover:border-destructive/50 border border-transparent transition-all cursor-pointer w-full">
                <span className="text-2xl shrink-0">{player.avatar}</span>
                <span className="font-medium text-foreground truncate uppercase">{player.name}</span>
              </div>)}
          </div>
        </div>}

      {/* Minimum Players Warning */}
      {players.length < 2 && <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Mindestens 2 Spieler
          </p>
        </div>}
    </div>;
};
