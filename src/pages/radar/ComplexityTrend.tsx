import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { useAppStore } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components';

export default function ComplexityTrend() {
  const { complexityTrend } = useAppStore();

  const maxComplexity = Math.max(...complexityTrend.map((d) => d.complexity));
  const avgComplexity = Math.round(
    complexityTrend.reduce((sum, d) => sum + d.complexity, 0) / complexityTrend.length
  );
  const latestComplexity = complexityTrend[complexityTrend.length - 1]?.complexity || 0;
  const complexityChange =
    complexityTrend.length > 1
      ? latestComplexity - complexityTrend[complexityTrend.length - 2]?.complexity
      : 0;

  const totalLOC = complexityTrend[complexityTrend.length - 1]?.linesOfCode || 0;
  const locChange =
    complexityTrend.length > 1
      ? totalLOC - complexityTrend[complexityTrend.length - 2]?.linesOfCode
      : 0;

  const chartData = complexityTrend.map((item) => ({
    ...item,
    complexityNormalized: Math.round((item.complexity / maxComplexity) * 100),
    locNormalized: Math.round((item.linesOfCode / 20000) * 100),
  }));

  return (
    <Card className="glass-card glass-card-hover">
      <CardHeader className="border-b border-dark-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-400" />
            <CardTitle className="text-dark-100">复杂度趋势</CardTitle>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-dark-400">平均复杂度</p>
              <p className="text-lg font-bold text-dark-100">{avgComplexity}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-dark-400">代码行数</p>
              <p className="text-lg font-bold text-dark-100">{totalLOC.toLocaleString()}</p>
              {locChange !== 0 && (
                <p className={`text-xs ${locChange > 0 ? 'text-severity-blocker' : 'text-severity-info'}`}>
                  {locChange > 0 ? '+' : ''}
                  {locChange.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-dark-300">当前复杂度: {latestComplexity}</span>
            {complexityChange !== 0 && (
              <span className={`text-sm font-medium ${complexityChange > 0 ? 'text-severity-blocker' : 'text-severity-info'}`}>
                ({complexityChange > 0 ? '+' : ''}
                {complexityChange})
              </span>
            )}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorComplexity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3975e2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3975e2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLOC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#43a047" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#43a047" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334e68" />
              <XAxis dataKey="date" tick={{ fill: '#829ab1', fontSize: 12 }} />
              <YAxis tick={{ fill: '#829ab1', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e3a5f',
                  border: '1px solid #334e68',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                  color: '#d9e2ec',
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    complexity: '复杂度',
                    linesOfCode: '代码行数',
                  };
                  return [value.toLocaleString(), labels[name] || name];
                }}
              />
              <Legend wrapperStyle={{ color: '#9fb3c8' }} />
              <Area
                type="monotone"
                dataKey="complexity"
                stroke="#3975e2"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorComplexity)"
                name="复杂度"
              />
              <Area
                type="monotone"
                dataKey="linesOfCode"
                stroke="#43a047"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLOC)"
                name="代码行数"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
