import { Game, Player } from '@/types/game';
import { cn } from '@/lib/utils';
import { Clock, Trophy } from 'lucide-react';
import { format } from 'date-fns';

interface RecentGamesProps {
  games: Game[];
  players: Player[];
}

export function RecentGames({ games, players }: RecentGamesProps) {
  const getPlayerName = (id: string) => 
    players.find(p => p.id === id)?.name || 'Unknown';

  const recentGames = [...games]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="card-gradient rounded-xl border border-border overflow-hidden">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Recent Games
        </h3>
      </div>
      
      <div className="divide-y divide-border">
        {recentGames.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground">
            No games recorded yet
          </div>
        ) : (
          recentGames.map((game) => (
            <div 
              key={game.id}
              className="p-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {getPlayerName(game.winnerId)}
                    </span>
                    <span className="text-xs text-muted-foreground">won</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {game.players.length} players • Fee: ₹{game.participationFee}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-profit number-mono">
                    +₹{game.potTotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(game.date), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
