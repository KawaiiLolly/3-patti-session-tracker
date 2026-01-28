import { useGameStore } from '@/hooks/useGameStore';
import { PlayerManager } from '@/components/players/PlayerManager';
import { Users } from 'lucide-react';

export default function Players() {
  const { players, addPlayer, updatePlayer, deletePlayer } = useGameStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Players
        </h1>
        <p className="text-muted-foreground">Manage your player roster</p>
      </div>

      <PlayerManager
        players={players}
        onAdd={addPlayer}
        onUpdate={updatePlayer}
        onDelete={deletePlayer}
      />
    </div>
  );
}
