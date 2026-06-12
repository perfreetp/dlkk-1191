import {
  ResponsiveContainer,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { cn } from '@/utils/';
import { ChartDataPoint } from '@/types/';

interface RadarChartProps {
  data: ChartDataPoint[];
  dataKeys: string[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const RadarChart = ({
  data,
  dataKeys,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  height = 400,
  showLegend = true,
  showTooltip = true,
  className,
}: RadarChartProps) => {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#9ca3af', fontSize: 10 }} />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          {dataKeys.map((key, index) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { RadarChart };
