import { PlayerStats } from '@/types/game';
import { cn } from '@/lib/utils';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LeaderboardProps {
  stats: PlayerStats[];
}

export function Leaderboard({ stats }: LeaderboardProps) {
  const formatCurrency = (value: number) => {
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}₹${Math.abs(value).toLocaleString()}`;
  };

  return (
    <div className="card-gradient rounded-xl border border-border overflow-hidden">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          Leaderboard
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Player
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Games
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Won
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Invested
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Net P/L
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stats.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No games played yet
                </td>
              </tr>
            ) : (
              stats.map((player, index) => (
                <tr 
                  key={player.playerId}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                      index === 0 && "bg-primary/20 text-primary",
                      index === 1 && "bg-muted text-muted-foreground",
                      index === 2 && "bg-[hsl(25,70%,40%)]/20 text-[hsl(25,70%,50%)]",
                      index > 2 && "text-muted-foreground"
                    )}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{player.playerName}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-muted-foreground number-mono">
                      {player.gamesPlayed}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-muted-foreground number-mono">
                      {player.gamesWon}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-muted-foreground number-mono">
                      ₹{player.totalInvested.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {player.netProfitLoss > 0 && (
                        <TrendingUp className="h-4 w-4 text-profit" />
                      )}
                      {player.netProfitLoss < 0 && (
                        <TrendingDown className="h-4 w-4 text-loss" />
                      )}
                      {player.netProfitLoss === 0 && (
                        <Minus className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={cn(
                        "font-semibold number-mono",
                        player.netProfitLoss > 0 && "text-profit",
                        player.netProfitLoss < 0 && "text-loss",
                        player.netProfitLoss === 0 && "text-muted-foreground"
                      )}>
                        {formatCurrency(player.netProfitLoss)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
