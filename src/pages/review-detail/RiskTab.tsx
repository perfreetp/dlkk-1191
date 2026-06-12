import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAppStore } from '@/store';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components';
import { cn } from '@/utils';
import type { HighRiskFile, IssueSeverity } from '@/types';

interface RiskTabProps {
  reviewId: string;
}

const severityToTheme: Record<IssueSeverity, string> = {
  critical: 'blocker',
  high: 'critical',
  medium: 'warning',
  low: 'info',
  info: 'info',
};

export default function RiskTab({ reviewId }: RiskTabProps) {
  const { riskData, highRiskFiles, issues } = useAppStore();

  const chartData = riskData.map((item) => ({
    ...item,
    fullMark: item.maxScore,
  }));

  const reviewIssues = issues.filter((issue) => issue.reviewId === reviewId);
  const criticalCount = reviewIssues.filter((i) => i.severity === 'critical').length;
  const highCount = reviewIssues.filter((i) => i.severity === 'high').length;
  const mediumCount = reviewIssues.filter((i) => i.severity === 'medium').length;
  const lowCount = reviewIssues.filter((i) => i.severity === 'low').length;

  const overallRisk = criticalCount > 0 ? '高' : highCount > 0 ? '中' : mediumCount > 0 ? '低' : '无';
  const riskColor: 'blocker' | 'critical' | 'warning' | 'info' = criticalCount > 0 ? 'blocker' : highCount > 0 ? 'critical' : mediumCount > 0 ? 'warning' : 'info';

  const getRiskScoreColor = (score: number): string => {
    if (score >= 80) return 'text-severity-blocker';
    if (score >= 60) return 'text-severity-critical';
    return 'text-severity-warning';
  };

  const getRiskScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-severity-blocker';
    if (score >= 60) return 'bg-severity-critical';
    return 'bg-severity-warning';
  };

  const getSeverityBadgeClass = (severity: IssueSeverity): string => {
    const theme = severityToTheme[severity];
    return `text-severity-${theme} bg-severity-${theme}/20 border border-severity-${theme}/30`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card glass-card-hover animate-slide-up" style={{ animationDelay: '0ms' }}>
          <CardContent className="p-4">
            <p className="text-sm text-dark-400 mb-1">整体风险等级</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-dark-100">{overallRisk}</span>
              <Badge className={`text-severity-${riskColor} bg-severity-${riskColor}/20 border border-severity-${riskColor}/30`}>
                {riskColor === 'blocker' ? '严重' : riskColor === 'critical' ? '高' : riskColor === 'warning' ? '中' : '低'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card glass-card-hover animate-slide-up" style={{ animationDelay: '50ms' }}>
          <CardContent className="p-4">
            <p className="text-sm text-dark-400 mb-1">严重问题</p>
            <span className="text-3xl font-bold text-severity-blocker">{criticalCount}</span>
          </CardContent>
        </Card>
        <Card className="glass-card glass-card-hover animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <p className="text-sm text-dark-400 mb-1">高危问题</p>
            <span className="text-3xl font-bold text-severity-critical">{highCount}</span>
          </CardContent>
        </Card>
        <Card className="glass-card glass-card-hover animate-slide-up" style={{ animationDelay: '150ms' }}>
          <CardContent className="p-4">
            <p className="text-sm text-dark-400 mb-1">问题总数</p>
            <span className="text-3xl font-bold text-dark-100">{reviewIssues.length}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="text-dark-100">风险雷达</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid stroke="#334e68" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#829ab1', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#627d98', fontSize: 10 }} />
                  <Radar
                    name="风险值"
                    dataKey="score"
                    stroke="#3975e2"
                    fill="#3975e2"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e3a5f',
                      border: '1px solid #334e68',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                      color: '#d9e2ec',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#9fb3c8' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-slide-up" style={{ animationDelay: '250ms' }}>
          <CardHeader>
            <CardTitle className="text-dark-100">高风险文件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highRiskFiles.slice(0, 5).map((file: HighRiskFile, index) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-700/50 hover:bg-dark-800/80 hover:border-primary-500/30 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-100 truncate">
                      {file.path}
                    </p>
                    <p className="text-xs text-dark-400 mt-1">
                      {file.issueCount} 个问题 · 更新于 {file.lastModified}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={cn('text-lg font-bold', getRiskScoreColor(file.riskScore))}>
                        {file.riskScore}
                      </p>
                      <p className="text-xs text-dark-500">风险分</p>
                    </div>
                    <div className="w-2 h-16 rounded-full bg-dark-700/50 overflow-hidden">
                      <div
                        className={cn('w-full', getRiskScoreBgColor(file.riskScore))}
                        style={{ height: `${file.riskScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card animate-slide-up" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="text-dark-100">风险分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '安全风险', count: criticalCount, severity: 'critical' as IssueSeverity },
              { label: '代码质量', count: highCount, severity: 'high' as IssueSeverity },
              { label: '可维护性', count: mediumCount, severity: 'medium' as IssueSeverity },
              { label: '性能问题', count: lowCount, severity: 'low' as IssueSeverity },
            ].map((item, index) => (
              <div
                key={item.label}
                className="text-center p-4 bg-dark-800/50 rounded-lg border border-dark-700/50 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "inline-flex items-center justify-center w-12 h-12 rounded-full mb-3",
                  getSeverityBadgeClass(item.severity)
                )}>
                  <span className="text-xl font-bold">{item.count}</span>
                </div>
                <p className="text-sm font-medium text-dark-100">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
