import { useGameStore } from '@/hooks/useGameStore';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import { RecentGames } from '@/components/dashboard/RecentGames';
import { Gamepad2, Trophy, Coins, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { players, games, playerStats, deleteGame } = useGameStore();

  const totalGames = games.length;
  const totalPot = games.reduce((sum, g) => sum + g.potTotal, 0);
  const topPlayer = playerStats[0];
  const biggestWin = Math.max(...playerStats.map(p => p.netProfitLoss), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Track your 3-Patti sessions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Games"
          value={totalGames}
          subtitle="Games recorded"
          icon={<Gamepad2 className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Pot"
          value={`₹${totalPot.toLocaleString()}`}
          subtitle="Money in play"
          icon={<Coins className="h-5 w-5" />}
        />
        <StatsCard
          title="Top Player"
          value={topPlayer?.playerName || '-'}
          subtitle={topPlayer ? `${topPlayer.gamesWon} wins` : 'No games yet'}
          icon={<Trophy className="h-5 w-5" />}
        />
        <StatsCard
          title="Biggest Profit"
          value={`₹${biggestWin.toLocaleString()}`}
          subtitle="Best performer"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={biggestWin > 0 ? 'up' : 'neutral'}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Leaderboard stats={playerStats} />
        </div>
        <div>
          <RecentGames games={games} players={players} onDeleteGame={deleteGame} />
        </div>
      </div>
    </div>
  );
}
