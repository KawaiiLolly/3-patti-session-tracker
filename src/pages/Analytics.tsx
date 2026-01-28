import { useGameStore } from '@/hooks/useGameStore';
import { ProfitChart } from '@/components/analytics/ProfitChart';
import { WinRateChart } from '@/components/analytics/WinRateChart';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  const { players, playerStats, profitTrendData, winRateData } = useGameStore();

  const playerNames = players.map(p => p.name);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground">Performance insights</p>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfitChart data={profitTrendData} playerNames={playerNames} />
        <WinRateChart data={winRateData} />
      </div>

      {/* Full Leaderboard */}
      <Leaderboard stats={playerStats} />
    </div>
  );
}
