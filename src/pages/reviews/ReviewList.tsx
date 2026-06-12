import { useNavigate } from 'react-router-dom';
import { GitBranch, Users, Clock, AlertTriangle, AlertCircle, Minus, ChevronRight } from 'lucide-react';
import { useAppStore, getSeverityText, getStatusText } from '@/store';
import { filterReviews, formatRelativeTime, truncateText, getFileIcon } from '@/utils';
import { Card, Badge, Empty } from '@/components';
import type { Branch } from '@/types';

const getBranchName = (branch: string | Branch | undefined): string => {
  if (!branch) return '';
  return typeof branch === 'string' ? branch : branch.name;
};

const getStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'text-dark-300 bg-dark-800/50 border-dark-700/50',
    in_progress: 'text-primary-400 bg-primary-500/20 border-primary-500/30',
    completed: 'text-severity-info bg-severity-info/20 border-severity-info/30',
    rejected: 'text-severity-blocker bg-severity-blocker/20 border-severity-blocker/30',
  };
  return classes[status] || classes.pending;
};

export default function ReviewList() {
  const navigate = useNavigate();
  const { reviews, reviewFilter } = useAppStore();

  const filteredReviews = filterReviews(reviews, reviewFilter);

  if (filteredReviews.length === 0) {
    return (
      <Card className="p-12 glass-card animate-fade-in">
        <Empty />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredReviews.map((review, index) => (
        <Card
          key={review.id}
          className="glass-card glass-card-hover cursor-pointer animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
          onClick={() => navigate(`/reviews/${review.id}`)}
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-dark-100 truncate">{review.title}</h3>
                  <ChevronRight className="w-4 h-4 text-dark-400 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-400">
                  <span className="font-mono text-xs bg-dark-800/50 px-2 py-0.5 rounded border border-dark-700/50">
                    {getFileIcon(review.repositoryName)} {review.repositoryName}
                  </span>
                </div>
              </div>
              <Badge className={getStatusBadgeClass(review.status)} variant="default">
                {getStatusText(review.status)}
              </Badge>
            </div>

            {review.description && (
              <p className="text-sm text-dark-300 mb-4 line-clamp-2">
                {truncateText(review.description, 80)}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-dark-400 mb-4">
              <div className="flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                <span className="font-mono text-xs">{getBranchName(review.branch)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{review.reviewerCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatRelativeTime(review.updatedAt)}</span>
              </div>
            </div>

            {review.issueCount > 0 && (
              <div className="flex items-center gap-2 pt-4 border-t border-dark-700/50">
                <span className="text-sm text-dark-400">{getSeverityText('info')}:</span>
                {review.criticalIssueCount > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-severity-blocker" />
                    <span className="text-sm font-medium text-severity-blocker bg-severity-blocker/20 px-1.5 py-0.5 rounded">
                      {getSeverityText('critical')} {review.criticalIssueCount}
                    </span>
                  </div>
                )}
                {review.highIssueCount > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-severity-critical" />
                    <span className="text-sm font-medium text-severity-critical bg-severity-critical/20 px-1.5 py-0.5 rounded">
                      {getSeverityText('high')} {review.highIssueCount}
                    </span>
                  </div>
                )}
                {review.mediumIssueCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Minus className="w-4 h-4 text-severity-warning" />
                    <span className="text-sm font-medium text-severity-warning bg-severity-warning/20 px-1.5 py-0.5 rounded">
                      {getSeverityText('medium')} {review.mediumIssueCount}
                    </span>
                  </div>
                )}
                {review.lowIssueCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Minus className="w-4 h-4 text-severity-info" />
                    <span className="text-sm font-medium text-severity-info bg-severity-info/20 px-1.5 py-0.5 rounded">
                      {getSeverityText('low')} {review.lowIssueCount}
                    </span>
                  </div>
                )}
              </div>
            )}

            {review.assignee && (
              <div className="mt-4 pt-4 border-t border-dark-700/50">
                <span className="text-sm text-dark-400">指派给: </span>
                <span className="text-sm font-medium text-dark-300">{review.assignee}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
