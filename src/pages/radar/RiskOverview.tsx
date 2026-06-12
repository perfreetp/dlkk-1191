import { ShieldAlert, ShieldCheck, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAppStore } from '@/store';
import { Card, CardContent } from '@/components';

export default function RiskOverview() {
  const { riskData, issues } = useAppStore();

  const totalIssues = issues.length;
  const criticalIssues = issues.filter((i) => i.severity === 'critical').length;
  const highIssues = issues.filter((i) => i.severity === 'high').length;
  const resolvedIssues = issues.filter((i) => i.status === 'resolved').length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  const avgRiskScore =
    riskData.length > 0
      ? Math.round(riskData.reduce((sum, item) => sum + item.score, 0) / riskData.length)
      : 0;

  const getTrendIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="w-4 h-4 text-severity-blocker" />;
    if (score >= 40) return <Minus className="w-4 h-4 text-severity-warning" />;
    return <TrendingDown className="w-4 h-4 text-severity-info" />;
  };

  const getRiskIcon = (score: number) => {
    if (score >= 70) return <ShieldAlert className="w-8 h-8 text-severity-blocker" />;
    if (score >= 40) return <Shield className="w-8 h-8 text-severity-critical" />;
    return <ShieldCheck className="w-8 h-8 text-severity-info" />;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { text: '高风险', color: 'text-severity-blocker bg-severity-blocker/20 border border-severity-blocker/30' };
    if (score >= 40) return { text: '中风险', color: 'text-severity-critical bg-severity-critical/20 border border-severity-critical/30' };
    return { text: '低风险', color: 'text-severity-info bg-severity-info/20 border border-severity-info/30' };
  };

  const stats = [
    {
      label: '综合风险指数',
      value: `${avgRiskScore}`,
      unit: '分',
      icon: getRiskIcon(avgRiskScore),
      badge: getRiskLevel(avgRiskScore),
      trend: getTrendIcon(avgRiskScore),
      trendText: avgRiskScore >= 70 ? '风险上升' : avgRiskScore >= 40 ? '持平' : '风险下降',
    },
    {
      label: '严重问题',
      value: criticalIssues,
      unit: '个',
      icon: <ShieldAlert className="w-8 h-8 text-severity-blocker" />,
      badge: { text: '紧急', color: 'text-severity-blocker bg-severity-blocker/20 border border-severity-blocker/30' },
      trend: criticalIssues > 0 ? <TrendingUp className="w-4 h-4 text-severity-blocker" /> : <TrendingDown className="w-4 h-4 text-severity-info" />,
      trendText: criticalIssues > 0 ? '需立即处理' : '表现良好',
    },
    {
      label: '高危问题',
      value: highIssues,
      unit: '个',
      icon: <Shield className="w-8 h-8 text-severity-critical" />,
      badge: { text: '关注', color: 'text-severity-critical bg-severity-critical/20 border border-severity-critical/30' },
      trend: highIssues > 2 ? <TrendingUp className="w-4 h-4 text-severity-critical" /> : <Minus className="w-4 h-4 text-severity-warning" />,
      trendText: highIssues > 2 ? '数量较多' : '在控范围内',
    },
    {
      label: '修复完成率',
      value: `${resolutionRate}`,
      unit: '%',
      icon: <ShieldCheck className="w-8 h-8 text-primary-400" />,
      badge: {
        text: resolutionRate >= 80 ? '优秀' : resolutionRate >= 60 ? '良好' : '待提升',
        color: resolutionRate >= 80 ? 'text-severity-info bg-severity-info/20 border border-severity-info/30' : resolutionRate >= 60 ? 'text-primary-400 bg-primary-500/20 border border-primary-500/30' : 'text-severity-warning bg-severity-warning/20 border border-severity-warning/30',
      },
      trend: resolutionRate >= 80 ? <TrendingUp className="w-4 h-4 text-severity-info" /> : <TrendingDown className="w-4 h-4 text-severity-warning" />,
      trendText: resolutionRate >= 80 ? '持续提升' : '需要加快',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card glass-card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-dark-400 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-dark-100">{stat.value}</span>
                  <span className="text-sm text-dark-400">{stat.unit}</span>
                </div>
              </div>
              {stat.icon}
            </div>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stat.badge.color}`}>
                {stat.badge.text}
              </span>
              <div className="flex items-center gap-1 text-xs text-dark-400">
                {stat.trend}
                <span>{stat.trendText}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
