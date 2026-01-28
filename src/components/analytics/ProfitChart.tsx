import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProfitChartProps {
  data: { game: number; [key: string]: number }[];
  playerNames: string[];
}

const COLORS = [
  'hsl(43, 96%, 56%)',   // Gold
  'hsl(142, 71%, 45%)',  // Green
  'hsl(0, 84%, 60%)',    // Red
  'hsl(199, 89%, 48%)',  // Blue
  'hsl(280, 67%, 55%)',  // Purple
  'hsl(25, 95%, 53%)',   // Orange
];

export function ProfitChart({ data, playerNames }: ProfitChartProps) {
  if (data.length === 0) {
    return (
      <div className="card-gradient rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Profit/Loss Trend</h3>
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          No data to display yet
        </div>
      </div>
    );
  }

  return (
    <div className="card-gradient rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Profit/Loss Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
            <XAxis 
              dataKey="game" 
              stroke="hsl(220, 15%, 55%)"
              tick={{ fill: 'hsl(220, 15%, 55%)', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(222, 30%, 18%)' }}
            />
            <YAxis 
              stroke="hsl(220, 15%, 55%)"
              tick={{ fill: 'hsl(220, 15%, 55%)', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(222, 30%, 18%)' }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(222, 40%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(45, 20%, 95%)',
              }}
              formatter={(value: number) => [`₹${value}`, '']}
              labelFormatter={(label) => `Game ${label}`}
            />
            <Legend />
            {playerNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
