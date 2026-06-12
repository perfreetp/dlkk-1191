import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import { cn } from '@/utils/';
import { ChartDataPoint } from '@/types/';

interface BarChartProps {
  data: ChartDataPoint[];
  dataKeys: string[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

const BarChart = ({
  data,
  dataKeys,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  height = 400,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  layout = 'horizontal',
  className,
}: BarChartProps) => {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis
            type={layout === 'horizontal' ? 'category' : 'number'}
            dataKey={layout === 'horizontal' ? 'name' : undefined}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis
            type={layout === 'horizontal' ? 'number' : 'category'}
            dataKey={layout === 'vertical' ? 'name' : undefined}
            stroke="#6b7280"
            fontSize={12}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
          )}
          {showLegend && <Legend />}
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { BarChart };
