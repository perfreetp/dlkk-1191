import { Trophy, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Avatar } from '@/components';
import type { RecordFilter } from '@/types';

interface UserStatsTableProps {
  filters?: RecordFilter;
}

export default function UserStatsTable({ filters = {} }: UserStatsTableProps) {
  const { getFilteredUserStats } = useAppStore();
  const userStats = getFilteredUserStats(filters);

  const sortedStats = [...userStats].sort((a, b) => b.resolvedIssues - a.resolvedIssues);

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-severity-warning fill-severity-warning" />;
      case 1:
        return <Trophy className="w-5 h-5 text-dark-300 fill-dark-300" />;
      case 2:
        return <Trophy className="w-5 h-5 text-severity-critical fill-severity-critical" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-dark-400">{index + 1}</span>;
    }
  };

  const getResolutionRateColor = (rate: number) => {
    if (rate >= 90) return 'text-severity-info';
    if (rate >= 70) return 'text-primary-400';
    if (rate >= 50) return 'text-severity-warning';
    return 'text-severity-blocker';
  };

  const getResolutionRateBg = (rate: number) => {
    if (rate >= 90) return 'bg-severity-info';
    if (rate >= 70) return 'bg-primary-500';
    if (rate >= 50) return 'bg-severity-warning';
    return 'bg-severity-blocker';
  };

  const getStatusBadge = (rate: number) => {
    if (rate >= 80) {
      return { text: '表现优秀', color: 'bg-severity-info/20 text-severity-info border border-severity-info/30' };
    }
    if (rate >= 60) {
      return { text: '正常', color: 'bg-primary-500/20 text-primary-400 border border-primary-500/30' };
    }
    return { text: '需关注', color: 'bg-severity-warning/20 text-severity-warning border border-severity-warning/30' };
  };

  return (
    <Card className="glass-card glass-card-hover">
      <CardHeader className="border-b border-dark-700/50">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-severity-info" />
          <CardTitle className="text-dark-100">个人修复情况统计</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="[&_tr]:border-b-dark-700/50 bg-dark-800/30">
            <TableRow className="border-b-dark-700/50 hover:bg-transparent">
              <TableHead className="w-16 text-dark-300">排名</TableHead>
              <TableHead className="text-dark-300">用户</TableHead>
              <TableHead className="text-center text-dark-300">总问题数</TableHead>
              <TableHead className="text-center text-dark-300">已修复</TableHead>
              <TableHead className="text-center text-dark-300">进行中</TableHead>
              <TableHead className="text-center text-dark-300">修复率</TableHead>
              <TableHead className="text-center text-dark-300">平均修复时间</TableHead>
              <TableHead className="text-center text-dark-300">状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStats.map((stat, index) => {
              const resolutionRate = stat.totalIssues > 0 ? Math.round((stat.resolvedIssues / stat.totalIssues) * 100) : 0;
              const statusBadge = getStatusBadge(resolutionRate);
              return (
                <TableRow
                  key={stat.userId}
                  className={cn(
                    'border-b-dark-700/50 hover:bg-dark-800/30 transition-colors animate-fade-in'
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {getRankBadge(index)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar alt={stat.userName} size="sm" />
                      <span className="font-medium text-dark-100">{stat.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-dark-100">{stat.totalIssues}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4 text-severity-info" />
                      <span className="font-semibold text-severity-info">{stat.resolvedIssues}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <AlertCircle className="w-4 h-4 text-severity-warning" />
                      <span className="font-semibold text-severity-warning">{stat.inProgressIssues}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`font-bold ${getResolutionRateColor(resolutionRate)}`}>
                        {resolutionRate}%
                      </span>
                      <div className="w-16 h-1.5 bg-dark-800/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getResolutionRateBg(resolutionRate)} rounded-full`}
                          style={{ width: `${resolutionRate}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4 text-dark-400" />
                      <span className="text-dark-300">{stat.averageResolutionTime} 小时</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusBadge.color}>{statusBadge.text}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
