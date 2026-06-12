import { useState, useMemo } from 'react';
import { AlertTriangle, AlertCircle, Minus, Filter, ChevronDown, ChevronUp, Info, Lock } from 'lucide-react';
import { useAppStore, getSeverityText, getStatusText } from '@/store';
import { groupIssuesBySeverity, formatRelativeTime, truncateText, cn } from '@/utils';
import { Card, Badge, Select, Empty } from '@/components';
import type { IssueSeverity } from '@/types';

interface IssuesTabProps {
  reviewId: string;
  onSelectIssueId: (issueId: string) => void;
  selectedIssueId?: string;
  disabled?: boolean;
}

const severityOrder: IssueSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];

const severityToTheme: Record<IssueSeverity, string> = {
  critical: 'blocker',
  high: 'critical',
  medium: 'warning',
  low: 'info',
  info: 'info',
};

const severityIcons: Record<IssueSeverity, typeof AlertTriangle> = {
  critical: AlertTriangle,
  high: AlertCircle,
  medium: Minus,
  low: Minus,
  info: Info,
};

export default function IssuesTab({ reviewId, onSelectIssueId, selectedIssueId, disabled = false }: IssuesTabProps) {
  const { issues } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<Record<IssueSeverity, boolean>>({
    critical: true,
    high: true,
    medium: true,
    low: true,
    info: true,
  });

  const reviewIssues = useMemo(
    () => issues.filter((issue) => issue.reviewId === reviewId),
    [issues, reviewId]
  );
  const filteredIssues = useMemo(
    () => reviewIssues.filter(
      (issue) => statusFilter === 'all' || issue.status === statusFilter
    ),
    [reviewIssues, statusFilter]
  );
  const groupedIssues = useMemo(
    () => groupIssuesBySeverity(filteredIssues),
    [filteredIssues]
  );

  const toggleGroup = (severity: IssueSeverity) => {
    setExpandedGroups((prev) => ({ ...prev, [severity]: !prev[severity] }));
  };

  const getSeverityClass = (severity: IssueSeverity): string => {
    const theme = severityToTheme[severity];
    return `text-severity-${theme}`;
  };

  const getSeverityBadgeClass = (severity: IssueSeverity): string => {
    const theme = severityToTheme[severity];
    return `text-severity-${theme} bg-severity-${theme}/20 border border-severity-${theme}/30`;
  };

  if (filteredIssues.length === 0) {
    return (
      <Card className="glass-card p-12 animate-fade-in">
        <Empty />
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-dark-400" />
          <span className="text-sm text-dark-300">共 {filteredIssues.length} 个问题</span>
          {disabled && (
            <div className="flex items-center gap-1 ml-2 text-xs text-dark-500">
              <Lock className="w-3 h-3" />
              <span>已锁定</span>
            </div>
          )}
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          disabled={disabled}
          className="w-40 bg-dark-800/50 border-dark-700/50 text-dark-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">全部状态</option>
          <option value="open">待处理</option>
          <option value="in_progress">处理中</option>
          <option value="resolved">已解决</option>
          <option value="closed">已关闭</option>
        </Select>
      </div>

      {severityOrder.map((severity, index) => {
        const groupIssues = groupedIssues[severity];
        if (groupIssues.length === 0) return null;

        const Icon = severityIcons[severity];
        const isExpanded = expandedGroups[severity];

        return (
          <div key={severity} className="space-y-3 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <button
              type="button"
              onClick={() => toggleGroup(severity)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                "bg-dark-800/50 hover:bg-dark-800/80 border border-dark-700/50",
                disabled && "opacity-60 cursor-not-allowed hover:bg-dark-800/50"
              )}
              disabled={disabled}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5", getSeverityClass(severity))} />
                <span className="font-medium text-dark-100">
                  {getSeverityText(severity)}
                </span>
                <Badge className={getSeverityBadgeClass(severity)}>
                  {groupIssues.length} 个
                </Badge>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-dark-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-dark-400" />
              )}
            </button>

            {isExpanded && (
              <div className="space-y-2 pl-4">
                {groupIssues.map((issue, issueIndex) => (
                  <div
                    key={issue.id}
                    onClick={() => !disabled && onSelectIssueId(issue.id)}
                    className={cn(
                      "p-4 rounded-lg border transition-all glass-card glass-card-hover animate-fade-in",
                      selectedIssueId === issue.id
                        ? 'border-primary-500/50 bg-primary-500/10'
                        : 'border-dark-700/50',
                      disabled
                        ? 'cursor-not-allowed opacity-60 hover:border-dark-700/50 hover:bg-dark-800/30'
                        : 'cursor-pointer'
                    )}
                    style={{ animationDelay: `${issueIndex * 30}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-dark-100 flex-1">
                        {issue.title}
                      </h4>
                      <Badge className="bg-dark-800/50 text-dark-300 border border-dark-700/50">
                        {getStatusText(issue.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-dark-400 mb-3">
                      {truncateText(issue.description, 100)}
                    </p>
                    <div className="flex items-center justify-between text-xs text-dark-500">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-dark-400">
                          {issue.file}:{issue.line}
                        </span>
                        {issue.assignee && (
                          <span>指派: <span className="text-dark-300">{issue.assignee}</span></span>
                        )}
                      </div>
                      <span>{formatRelativeTime(issue.updatedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
