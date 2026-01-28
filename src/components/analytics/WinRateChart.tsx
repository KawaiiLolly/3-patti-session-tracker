import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface WinRateChartProps {
  data: { name: string; value: number; winRate: number }[];
}

const COLORS = [
  'hsl(43, 96%, 56%)',   // Gold
  'hsl(142, 71%, 45%)',  // Green
  'hsl(199, 89%, 48%)',  // Blue
  'hsl(280, 67%, 55%)',  // Purple
  'hsl(25, 95%, 53%)',   // Orange
  'hsl(0, 84%, 60%)',    // Red
];

export function WinRateChart({ data }: WinRateChartProps) {
  if (data.length === 0) {
    return (
      <div className="card-gradient rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Win Distribution</h3>
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          No data to display yet
        </div>
      </div>
    );
  }

  return (
    <div className="card-gradient rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Win Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, winRate }) => `${name}: ${winRate.toFixed(0)}%`}
              labelLine={{ stroke: 'hsl(220, 15%, 55%)' }}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(222, 40%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(45, 20%, 95%)',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} wins (${props.payload.winRate.toFixed(1)}%)`,
                name
              ]}
            />
            <Legend 
              formatter={(value) => <span style={{ color: 'hsl(45, 20%, 95%)' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
