import { History, GitPullRequest, CheckCircle, XCircle, AlertTriangle, User, Clock } from 'lucide-react';
import { useAppStore } from '@/store';
import { formatDateTime, truncateText, formatDuration } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components';
import type { HistoryRecord, Review, RecordFilter } from '@/types';

const getActionIcon = (action: string) => {
  switch (action) {
    case '创建评审':
      return <GitPullRequest className="w-4 h-4 text-primary-400" />;
    case '评审通过':
      return <CheckCircle className="w-4 h-4 text-severity-info" />;
    case '评审驳回':
      return <XCircle className="w-4 h-4 text-severity-blocker" />;
    case '发现问题':
      return <AlertTriangle className="w-4 h-4 text-severity-critical" />;
    default:
      return <History className="w-4 h-4 text-dark-400" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case '创建评审':
      return 'bg-primary-500/20 border-primary-500/30 text-primary-400';
    case '评审通过':
      return 'bg-severity-info/20 border-severity-info/30 text-severity-info';
    case '评审驳回':
      return 'bg-severity-blocker/20 border-severity-blocker/30 text-severity-blocker';
    case '发现问题':
      return 'bg-severity-critical/20 border-severity-critical/30 text-severity-critical';
    default:
      return 'bg-dark-800/50 border-dark-700/50 text-dark-300';
  }
};

const isCompletedAction = (action: string): boolean => {
  return action === '评审通过' || action === '评审驳回' || action === '评审完成';
};

const getReviewDuration = (record: HistoryRecord, reviews: Review[]): string | null => {
  if (!isCompletedAction(record.action)) return null;
  
  const review = reviews.find((r) => r.id === record.reviewId);
  if (!review) return null;
  
  const startTime = new Date(review.createdAt).getTime();
  const endTime = new Date(record.createdAt).getTime();
  const durationMs = endTime - startTime;
  const durationMinutes = Math.round(durationMs / (1000 * 60));
  
  return formatDuration(durationMinutes);
};

interface HistoryListProps {
  filters?: RecordFilter;
}

export default function HistoryList({ filters = {} }: HistoryListProps) {
  const { getFilteredHistory, getFilteredReviews } = useAppStore();

  const historyRecords = getFilteredHistory(filters);
  const reviews = getFilteredReviews(filters);

  return (
    <Card className="glass-card glass-card-hover">
      <CardHeader className="border-b border-dark-700/50">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary-400" />
          <CardTitle className="text-dark-100">评审历史记录</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-dark-700/50" />
          <div className="space-y-6">
            {historyRecords.length === 0 ? (
              <div className="py-12 text-center text-dark-400">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无历史记录</p>
              </div>
            ) : (
              historyRecords.map((record: HistoryRecord, index: number) => {
                const duration = getReviewDuration(record, reviews);
                return (
                  <div key={record.id} className="relative pl-10 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-dark-800 border-2 border-dark-600 flex items-center justify-center">
                      {getActionIcon(record.action)}
                    </div>
                    <div className="bg-dark-800/30 rounded-lg p-4 hover:bg-dark-800/60 transition-colors border border-transparent hover:border-primary-500/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`border ${getActionColor(record.action)}`}
                          >
                            {record.action}
                          </Badge>
                          <span className="text-sm text-dark-400">
                            {formatDateTime(record.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-dark-400">
                          <User className="w-4 h-4" />
                          <span>{record.userName}</span>
                        </div>
                      </div>
                      <h4 className="font-medium text-dark-100 mb-1">{record.reviewTitle}</h4>
                      {record.details && (
                        <p className="text-sm text-dark-300 mb-2">
                          {truncateText(record.details, 100)}
                        </p>
                      )}
                      {duration && (
                        <div className="flex items-center gap-1 text-xs text-dark-400">
                          <Clock className="w-3 h-3" />
                          <span>评审耗时: {duration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
