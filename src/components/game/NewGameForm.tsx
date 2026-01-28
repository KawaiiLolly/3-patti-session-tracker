import { useState } from 'react';
import { Player, PlayerBet } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Trophy, Plus, X, Coins } from 'lucide-react';
import { toast } from 'sonner';

interface NewGameFormProps {
  players: Player[];
  participationFee: number;
  onSubmit: (playerBets: PlayerBet[], winnerId: string) => void;
}

interface PlayerInput {
  playerId: string;
  selected: boolean;
  betsInput: string;
}

export function NewGameForm({ players, participationFee, onSubmit }: NewGameFormProps) {
  const [playerInputs, setPlayerInputs] = useState<PlayerInput[]>(
    players.map(p => ({ playerId: p.id, selected: false, betsInput: '' }))
  );
  const [winnerId, setWinnerId] = useState<string>('');

  const selectedPlayers = playerInputs.filter(pi => pi.selected);

  const parseBets = (input: string): number[] => {
    if (!input.trim()) return [];
    return input
      .split(',')
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n) && n > 0);
  };

  const calculateTotal = (betsInput: string): number => {
    const bets = parseBets(betsInput);
    return participationFee + bets.reduce((sum, b) => sum + b, 0);
  };

  const calculatePot = (): number => {
    return selectedPlayers.reduce((sum, pi) => sum + calculateTotal(pi.betsInput), 0);
  };

  const togglePlayer = (playerId: string) => {
    setPlayerInputs(prev => prev.map(pi => 
      pi.playerId === playerId ? { ...pi, selected: !pi.selected } : pi
    ));
    if (winnerId === playerId) setWinnerId('');
  };

  const updateBets = (playerId: string, betsInput: string) => {
    setPlayerInputs(prev => prev.map(pi => 
      pi.playerId === playerId ? { ...pi, betsInput } : pi
    ));
  };

  const handleSubmit = () => {
    if (selectedPlayers.length < 2) {
      toast.error('Select at least 2 players');
      return;
    }
    if (!winnerId) {
      toast.error('Select a winner');
      return;
    }

    const playerBets: PlayerBet[] = selectedPlayers.map(pi => ({
      playerId: pi.playerId,
      bets: parseBets(pi.betsInput),
      totalBet: parseBets(pi.betsInput).reduce((sum, b) => sum + b, 0),
    }));

    onSubmit(playerBets, winnerId);
    
    // Reset form
    setPlayerInputs(prev => prev.map(pi => ({ ...pi, selected: false, betsInput: '' })));
    setWinnerId('');
    toast.success('Game recorded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Players Selection */}
      <div className="space-y-4">
        <Label className="text-foreground">Select Players & Enter Bets</Label>
        <div className="grid gap-3">
          {players.map(player => {
            const input = playerInputs.find(pi => pi.playerId === player.id)!;
            const isSelected = input.selected;
            const total = calculateTotal(input.betsInput);
            
            return (
              <div
                key={player.id}
                className={cn(
                  "rounded-lg border transition-all duration-200",
                  isSelected 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border bg-card hover:border-muted-foreground/30"
                )}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => togglePlayer(player.id)}
                      className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className={cn(
                      "font-medium flex-1",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {player.name}
                    </span>
                    {isSelected && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setWinnerId(player.id)}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
                            winnerId === player.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          <Trophy className="h-3 w-3" />
                          Winner
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isSelected && (
                    <div className="mt-3 pl-7 space-y-2 animate-fade-in">
                      <Input
                        placeholder="Enter bets: 1, 4, 8, 20"
                        value={input.betsInput}
                        onChange={(e) => updateBets(player.id, e.target.value)}
                        className="bg-background border-border"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Fee: ₹{participationFee} + Bets: ₹{parseBets(input.betsInput).reduce((s, b) => s + b, 0)}
                        </span>
                        <span className="font-semibold text-foreground number-mono">
                          Total: ₹{total}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pot Summary */}
      {selectedPlayers.length > 0 && (
        <div className="card-gradient rounded-xl border border-primary/30 p-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Total Pot</span>
            </div>
            <span className="text-2xl font-bold text-primary number-mono">
              ₹{calculatePot().toLocaleString()}
            </span>
          </div>
          {winnerId && (
            <div className="mt-2 text-sm text-muted-foreground">
              Winner takes: ₹{calculatePot().toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <Button 
        variant="gold" 
        size="lg" 
        className="w-full"
        onClick={handleSubmit}
        disabled={selectedPlayers.length < 2 || !winnerId}
      >
        <Plus className="h-4 w-4" />
        Record Game
      </Button>
    </div>
  );
}
