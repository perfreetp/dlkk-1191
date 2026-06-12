import { useState } from 'react';
import { FileText } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/utils';
import { Card, CardContent, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components';
import HistoryList from './HistoryList';
import StatisticsPanel from './StatisticsPanel';
import UserStatsTable from './UserStatsTable';

export default function RecordsPage() {
  const { reviews, issues, userStats } = useAppStore();
  const [activeTab, setActiveTab] = useState('statistics');

  const completedReviews = reviews.filter((r) => r.status === 'completed').length;
  const resolvedIssues = issues.filter((i) => i.status === 'resolved').length;
  const totalReviewers = new Set(userStats.map((u) => u.userId)).size;
  const resolutionRate = issues.length > 0 ? Math.round((resolvedIssues / issues.length) * 100) : 0;

  const summaryCards = [
    {
      label: '总评审数',
      value: reviews.length,
      badge: { text: `${completedReviews} 已完成`, color: 'bg-primary-500/20 text-primary-400 border border-primary-500/30' },
    },
    {
      label: '问题总数',
      value: issues.length,
      badge: { text: `${resolvedIssues} 已修复`, color: 'bg-severity-info/20 text-severity-info border border-severity-info/30' },
    },
    {
      label: '参与评审',
      value: totalReviewers,
      badge: { text: '位成员', color: 'bg-severity-warning/20 text-severity-warning border border-severity-warning/30' },
    },
    {
      label: '平均修复率',
      value: `${resolutionRate}%`,
      badge: { text: resolutionRate >= 80 ? '优秀' : resolutionRate >= 60 ? '良好' : '待提升', color: resolutionRate >= 80 ? 'bg-severity-info/20 text-severity-info border border-severity-info/30' : resolutionRate >= 60 ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-severity-warning/20 text-severity-warning border border-severity-warning/30' },
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
              <StatisticsPanel />
            </TabsContent>

            <TabsContent value="history">
              <HistoryList />
            </TabsContent>

            <TabsContent value="users">
              <UserStatsTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
