import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Clock } from 'lucide-react';
import { useAppStore } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components';

const COLORS = ['#e53935', '#fb8c00', '#fdd835', '#3975e2', '#43a047'];

const chartTooltipStyle = {
  backgroundColor: '#1e3a5f',
  border: '1px solid #334e68',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
  color: '#d9e2ec',
};

const legendStyle = { color: '#9fb3c8' };

export default function StatisticsPanel() {
  const { reviews, issues, getAverageReviewTimeText, getCompletedReviews } = useAppStore();

  const completedReviews = getCompletedReviews();

  const statusDistribution = [
    { name: '待评审', value: reviews.filter((r) => r.status === 'pending').length },
    { name: '评审中', value: reviews.filter((r) => r.status === 'in_progress').length },
    { name: '已完成', value: reviews.filter((r) => r.status === 'completed').length },
    { name: '已通过', value: reviews.filter((r) => r.status === 'approved').length },
    { name: '已拒绝', value: reviews.filter((r) => r.status === 'rejected').length },
  ];

  const severityDistribution = [
    { name: '严重', value: issues.filter((i) => i.severity === 'critical').length },
    { name: '高', value: issues.filter((i) => i.severity === 'high').length },
    { name: '中', value: issues.filter((i) => i.severity === 'medium').length },
    { name: '低', value: issues.filter((i) => i.severity === 'low').length },
  ];

  const monthlyData = [
    { month: '1月', 评审数: 12, 问题数: 45, 修复数: 38 },
    { month: '2月', 评审数: 15, 问题数: 52, 修复数: 48 },
    { month: '3月', 评审数: 18, 问题数: 61, 修复数: 55 },
    { month: '4月', 评审数: 14, 问题数: 48, 修复数: 42 },
    { month: '5月', 评审数: 20, 问题数: 72, 修复数: 65 },
    { month: '6月', 评审数: 16, 问题数: 58, 修复数: 50 },
  ];

  const totalReviews = reviews.length;
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter((i) => i.status === 'resolved').length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;
  const averageReviewTime = getAverageReviewTimeText();

  const statCards = [
    {
      label: '总评审数',
      value: totalReviews,
      icon: <BarChart3 className="w-6 h-6 text-primary-400" />,
      bgColor: 'bg-primary-500/20',
    },
    {
      label: '已完成评审',
      value: completedReviews.length,
      icon: <TrendingUp className="w-6 h-6 text-severity-info" />,
      bgColor: 'bg-severity-info/20',
    },
    {
      label: '问题总数',
      value: totalIssues,
      icon: <PieChartIcon className="w-6 h-6 text-severity-blocker" />,
      bgColor: 'bg-severity-blocker/20',
    },
    {
      label: '平均评审耗时',
      value: averageReviewTime,
      icon: <Clock className="w-6 h-6 text-severity-warning" />,
      bgColor: 'bg-severity-warning/20',
    },
    {
      label: '已修复',
      value: resolvedIssues,
      icon: <TrendingUp className="w-6 h-6 text-severity-info" />,
      bgColor: 'bg-severity-info/20',
    },
    {
      label: '修复率',
      value: `${resolutionRate}%`,
      icon: <TrendingUp className="w-6 h-6 text-primary-400" />,
      bgColor: 'bg-primary-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <Card key={index} className="glass-card glass-card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${card.bgColor} rounded-lg`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm text-dark-400">{card.label}</p>
                  <p className="text-2xl font-bold text-dark-100">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card glass-card-hover animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="border-b border-dark-700/50">
            <CardTitle className="text-dark-100">月度趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334e68" />
                  <XAxis dataKey="month" tick={{ fill: '#829ab1', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#829ab1', fontSize: 12 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={legendStyle} />
                  <Line
                    type="monotone"
                    dataKey="评审数"
                    stroke="#3975e2"
                    strokeWidth={2}
                    dot={{ fill: '#3975e2' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="问题数"
                    stroke="#e53935"
                    strokeWidth={2}
                    dot={{ fill: '#e53935' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="修复数"
                    stroke="#43a047"
                    strokeWidth={2}
                    dot={{ fill: '#43a047' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card className="glass-card glass-card-hover animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader className="border-b border-dark-700/50">
              <CardTitle className="text-dark-100">评审状态分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend wrapperStyle={legendStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card glass-card-hover animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader className="border-b border-dark-700/50">
              <CardTitle className="text-dark-100">问题严重程度分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334e68" />
                    <XAxis type="number" tick={{ fill: '#829ab1', fontSize: 12 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: '#829ab1', fontSize: 12 }}
                      width={50}
                    />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="value" fill="#3975e2" radius={[0, 4, 4, 0]}>
                      {severityDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
