import { useState } from 'react';
import { FileText, Filter, X, RefreshCw } from 'lucide-react';
import { useAppStore, getStatusText } from '@/store';
import { cn, formatDuration } from '@/utils';
import { Card, CardContent, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Input, Select, Button } from '@/components';
import HistoryList from './HistoryList';
import StatisticsPanel from './StatisticsPanel';
import UserStatsTable from './UserStatsTable';
import type { RecordFilter } from '@/types';

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'in_progress', label: getStatusText('in_progress') },
  { value: 'completed', label: getStatusText('completed') },
  { value: 'approved', label: getStatusText('approved') },
  { value: 'rejected', label: getStatusText('rejected') },
];

export default function RecordsPage() {
  const {
    repositories,
    userStats,
    recordFilter,
    setRecordFilter,
    getFilteredReviews,
    getFilteredIssues,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState('statistics');

  const filteredReviews = getFilteredReviews(recordFilter);
  const filteredIssues = getFilteredIssues(recordFilter);

  const completedReviews = filteredReviews.filter(
    (r) => r.status === 'completed' || r.status === 'approved' || r.status === 'rejected'
  ).length;
  const resolvedIssues = filteredIssues.filter((i) => i.status === 'resolved').length;
  const totalReviewers = new Set(userStats.map((u) => u.userId)).size;
  const resolutionRate = filteredIssues.length > 0 ? Math.round((resolvedIssues / filteredIssues.length) * 100) : 0;

  const getAverageReviewDuration = () => {
    const completed = filteredReviews.filter(
      (r) => r.status === 'completed' || r.status === 'approved' || r.status === 'rejected'
    );
    if (completed.length === 0) return 0;
    const totalMinutes = completed.reduce((sum, review) => {
      const startTime = new Date(review.createdAt).getTime();
      const endTime = review.completedAt
        ? new Date(review.completedAt).getTime()
        : new Date(review.updatedAt).getTime();
      const durationMs = endTime - startTime;
      const durationMinutes = durationMs / (1000 * 60);
      return sum + durationMinutes;
    }, 0);
    return Math.round(totalMinutes / completed.length);
  };

  const averageReviewTime = formatDuration(getAverageReviewDuration());

  const summaryCards = [
    {
      label: '总评审数',
      value: filteredReviews.length,
      badge: { text: `${completedReviews} 已完成`, color: 'bg-primary-500/20 text-primary-400 border border-primary-500/30' },
    },
    {
      label: '问题总数',
      value: filteredIssues.length,
      badge: { text: `${resolvedIssues} 已修复`, color: 'bg-severity-info/20 text-severity-info border border-severity-info/30' },
    },
    {
      label: '参与评审',
      value: totalReviewers,
      badge: { text: '位成员', color: 'bg-severity-warning/20 text-severity-warning border border-severity-warning/30' },
    },
    {
      label: '平均评审耗时',
      value: averageReviewTime,
      badge: { text: completedReviews > 0 ? '基于已完成' : '暂无数据', color: 'bg-severity-info/20 text-severity-info border border-severity-info/30' },
    },
    {
      label: '问题修复率',
      value: `${resolutionRate}%`,
      badge: { text: resolutionRate >= 80 ? '优秀' : resolutionRate >= 60 ? '良好' : '待提升', color: resolutionRate >= 80 ? 'bg-severity-info/20 text-severity-info border border-severity-info/30' : resolutionRate >= 60 ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-severity-warning/20 text-severity-warning border border-severity-warning/30' },
    },
  ];

  const handleReset = () => {
    setRecordFilter({
      repositoryId: undefined,
      reviewerId: undefined,
      startDate: undefined,
      endDate: undefined,
      status: undefined,
    });
  };

  const hasActiveFilters =
    recordFilter.repositoryId ||
    recordFilter.reviewerId ||
    recordFilter.startDate ||
    recordFilter.endDate ||
    recordFilter.status;

  const handleFilterChange = (key: keyof RecordFilter, value: string | undefined) => {
    setRecordFilter({ [key]: value } as Partial<RecordFilter>);
  };

  return (
    <div className="min-h-screen bg-dark-950 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary-400" />
            <h1 className="text-2xl font-bold text-dark-100">评审记录</h1>
          </div>
          <p className="text-dark-400">查看评审历史记录、统计数据和个人绩效</p>
        </div>

        <div className="glass-card rounded-lg p-4 mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-dark-400" />
            <span className="font-medium text-dark-100">筛选条件</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="ml-auto">
                <RefreshCw className="w-4 h-4 mr-1" />
                重置
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-300">仓库</label>
              <Select
                value={recordFilter.repositoryId || ''}
                onChange={(e) => handleFilterChange('repositoryId', e.target.value || undefined)}
                className="bg-dark-800 border-dark-600 text-dark-100 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">全部仓库</option>
                {repositories.map((repo) => (
                  <option key={repo.id} value={repo.id}>
                    {repo.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-300">评审人</label>
              <Select
                value={recordFilter.reviewerId || ''}
                onChange={(e) => handleFilterChange('reviewerId', e.target.value || undefined)}
                className="bg-dark-800 border-dark-600 text-dark-100 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">全部评审人</option>
                {userStats.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.userName}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-300">状态</label>
              <Select
                value={recordFilter.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? undefined : e.target.value)}
                className="bg-dark-800 border-dark-600 text-dark-100 focus:ring-primary-500 focus:border-primary-500"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-300">开始日期</label>
              <Input
                type="date"
                value={recordFilter.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                className="bg-dark-800 border-dark-600 text-dark-100 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-300">结束日期</label>
              <Input
                type="date"
                value={recordFilter.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                className="bg-dark-800 border-dark-600 text-dark-100 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2 text-sm text-dark-400">
              <span>当前筛选条件下共</span>
              <span className="font-semibold text-dark-100">{filteredReviews.length}</span>
              <span>条评审记录</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {summaryCards.map((card, index) => (
            <Card key={index} className="glass-card glass-card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-400 mb-1">{card.label}</p>
                    <p className="text-2xl font-bold text-dark-100">{card.value}</p>
                  </div>
                  <Badge className={card.badge.color}>{card.badge.text}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-dark-800/50 text-dark-300">
              <TabsTrigger
                value="statistics"
                className={cn(
                  'data-[state=active]:bg-dark-700/80 data-[state=active]:text-dark-100',
                  'hover:text-dark-100'
                )}
              >
                统计概览
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className={cn(
                  'data-[state=active]:bg-dark-700/80 data-[state=active]:text-dark-100',
                  'hover:text-dark-100'
                )}
              >
                历史记录
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className={cn(
                  'data-[state=active]:bg-dark-700/80 data-[state=active]:text-dark-100',
                  'hover:text-dark-100'
                )}
              >
                个人排行
              </TabsTrigger>
            </TabsList>

            <TabsContent value="statistics">
              <StatisticsPanel filters={recordFilter} />
            </TabsContent>

            <TabsContent value="history">
              <HistoryList filters={recordFilter} />
            </TabsContent>

            <TabsContent value="users">
              <UserStatsTable filters={recordFilter} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
