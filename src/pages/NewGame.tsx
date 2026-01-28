import { useGameStore } from '@/hooks/useGameStore';
import { NewGameForm } from '@/components/game/NewGameForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins } from 'lucide-react';

export default function NewGame() {
  const { players, participationFee, setParticipationFee, addGame } = useGameStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Game</h1>
        <p className="text-muted-foreground">Record a new round</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Participation Fee */}
        <div className="card-gradient rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <Coins className="h-5 w-5 text-primary" />
            <Label className="text-foreground font-medium">Participation Fee</Label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">₹</span>
            <Input
              type="number"
              min={0}
              value={participationFee}
              onChange={(e) => setParticipationFee(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-24 bg-background border-border number-mono"
            />
            <span className="text-sm text-muted-foreground">per player</span>
          </div>
        </div>

        {/* Game Form */}
        <div className="card-gradient rounded-xl border border-border p-6">
          <NewGameForm
            players={players}
            participationFee={participationFee}
            onSubmit={addGame}
          />
        </div>
      </div>
    </div>
  );
}
