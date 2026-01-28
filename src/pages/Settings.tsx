import { useGameStore } from '@/hooks/useGameStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Coins, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { participationFee, setParticipationFee, playerStats, games } = useGameStore();

  const exportCSV = () => {
    if (playerStats.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Player', 'Games Played', 'Games Won', 'Win Rate %', 'Total Invested', 'Total Won', 'Net P/L'];
    const rows = playerStats.map(p => [
      p.playerName,
      p.gamesPlayed,
      p.gamesWon,
      p.winRate.toFixed(1),
      p.totalInvested,
      p.totalWon,
      p.netProfitLoss,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `3patti-stats-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">Configure your session</p>
      </div>

      <div className="max-w-xl space-y-6">
        {/* Default Fee */}
        <div className="card-gradient rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Coins className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Default Participation Fee</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">₹</span>
            <Input
              type="number"
              min={0}
              value={participationFee}
              onChange={(e) => setParticipationFee(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-32 bg-background border-border number-mono"
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            This fee is added to each player's investment per game
          </p>
        </div>

        {/* Export */}
        <div className="card-gradient rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Export Data</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Download your session statistics as a CSV file
          </p>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="card-gradient rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Session Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Games</span>
              <span className="font-medium number-mono">{games.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Players</span>
              <span className="font-medium number-mono">{playerStats.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Pot Value</span>
              <span className="font-medium number-mono text-primary">
                ₹{games.reduce((s, g) => s + g.potTotal, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
