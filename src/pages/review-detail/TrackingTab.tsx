import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Minus,
  Info,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Users,
  Signal,
} from 'lucide-react';
import { useAppStore, getSeverityText, getStatusText } from '@/store';
import { cn, formatRelativeTime } from '@/utils';
import { Card, Badge, Empty } from '@/components';
import type { IssueSeverity, Issue } from '@/types';

interface TrackingTabProps {
  reviewId: string;
  onSelectIssueId: (issueId: string) => void;
}

type GroupByType = 'status' | 'assignee' | 'severity';

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

const statusOrder = ['open', 'in_progress', 'resolved', 'closed'];

const statusIcons: Record<string, typeof Clock> = {
  open: Clock,
  in_progress: Loader2,
  resolved: CheckCircle,
  closed: XCircle,
};

export default function TrackingTab({ reviewId, onSelectIssueId }: TrackingTabProps) {
  const { issues } = useAppStore();
  const [groupBy, setGroupBy] = useState<GroupByType>('status');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const reviewIssues = useMemo(
    () => issues.filter((issue) => issue.reviewId === reviewId),
    [issues, reviewId]
  );

  const statusGroups = useMemo(() => {
    const groups: Record<string, Issue[]> = {};
    statusOrder.forEach((status) => {
      groups[status] = reviewIssues.filter((issue) => issue.status === status);
    });
    return groups;
  }, [reviewIssues]);

  const assigneeGroups = useMemo(() => {
    const groups: Record<string, Issue[]> = {};
    const unassigned: Issue[] = [];

    reviewIssues.forEach((issue) => {
      if (issue.assignee) {
        if (!groups[issue.assignee]) {
          groups[issue.assignee] = [];
        }
        groups[issue.assignee].push(issue);
      } else {
        unassigned.push(issue);
      }
    });

    if (unassigned.length > 0) {
      groups['未指派'] = unassigned;
    }

    return groups;
  }, [reviewIssues]);

  const severityGroups = useMemo(() => {
    const groups: Record<IssueSeverity, Issue[]> = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      info: [],
    };
    reviewIssues.forEach((issue) => {
      groups[issue.severity].push(issue);
    });
    return groups;
  }, [reviewIssues]);

  const getAssigneeStats = (assignee: string) => {
    const groupIssues = assigneeGroups[assignee] || [];
    const unresolved = groupIssues.filter(
      (i) => i.status === 'open' || i.status === 'in_progress'
    ).length;
    const resolved = groupIssues.filter((i) => i.status === 'resolved').length;
    return { total: groupIssues.length, unresolved, resolved };
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const getSeverityBadgeClass = (severity: IssueSeverity): string => {
    const theme = severityToTheme[severity];
    return `text-severity-${theme} bg-severity-${theme}/20 border border-severity-${theme}/30`;
  };

  const getSeverityClass = (severity: IssueSeverity): string => {
    const theme = severityToTheme[severity];
    return `text-severity-${theme}`;
  };

  if (reviewIssues.length === 0) {
    return (
      <Card className="glass-card p-12 animate-fade-in">
        <Empty />
      </Card>
    );
  }

  const renderStatusGroups = () => (
    <div className="space-y-4">
      {statusOrder.map((status, index) => {
        const groupIssues = statusGroups[status];
        if (groupIssues.length === 0) return null;

        const isExpanded = expandedGroups[status] ?? false;
        const Icon = statusIcons[status] || Clock;
        const progress = (groupIssues.length / reviewIssues.length) * 100;

        return (
          <div
            key={status}
            className="glass-card rounded-lg border border-dark-700/50 overflow-hidden animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <button
              type="button"
              onClick={() => toggleGroup(status)}
              className="w-full p-4 hover:bg-dark-800/50 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-dark-300" />
                  <span className="font-medium text-dark-100">
                    {getStatusText(status)}
                  </span>
                  <Badge className="bg-dark-800/50 text-dark-300 border border-dark-700/50">
                    {groupIssues.length} 个
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-dark-400">
                    {progress.toFixed(1)}%
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-dark-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-dark-400" />
                  )}
                </div>
              </div>
              <div className="w-full h-2 bg-dark-800/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    status === 'open' && 'bg-severity-blocker',
                    status === 'in_progress' && 'bg-severity-critical',
                    status === 'resolved' && 'bg-severity-info',
                    status === 'closed' && 'bg-dark-500'
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-dark-700/50 p-3 space-y-2 bg-dark-900/30">
                {groupIssues.map((issue, issueIndex) => (
                  <div
                    key={issue.id}
                    onClick={() => onSelectIssueId(issue.id)}
                    className="p-3 rounded-lg border border-dark-700/50 cursor-pointer transition-all hover:bg-dark-800/50 hover:border-primary-500/30 animate-fade-in"
                    style={{ animationDelay: `${issueIndex * 30}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-dark-100 flex-1">
                        {issue.title}
                      </h4>
                      <Badge className={getSeverityBadgeClass(issue.severity)}>
                        {getSeverityText(issue.severity)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-dark-500">
                      <span className="font-mono text-dark-400">
                        {issue.file}:{issue.line}
                      </span>
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

  const renderAssigneeGroups = () => {
    const assignees = Object.keys(assigneeGroups).sort((a, b) => {
      if (a === '未指派') return 1;
      if (b === '未指派') return -1;
      return a.localeCompare(b);
    });

    return (
      <div className="space-y-4">
        {assignees.map((assignee, index) => {
          const stats = getAssigneeStats(assignee);
          const isExpanded = expandedGroups[assignee] ?? false;
          const groupIssues = assigneeGroups[assignee];

          return (
            <div
              key={assignee}
              className="glass-card rounded-lg border border-dark-700/50 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                type="button"
                onClick={() => toggleGroup(assignee)}
                className="w-full p-4 hover:bg-dark-800/50 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <span className="font-medium text-dark-100 block">
                        {assignee}
                      </span>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="text-dark-400">
                          共 <span className="text-dark-200">{stats.total}</span> 个
                        </span>
                        <span className="text-severity-blocker">
                          未处理 {stats.unresolved}
                        </span>
                        <span className="text-severity-info">
                          已解决 {stats.resolved}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-dark-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-dark-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-dark-700/50 p-3 space-y-2 bg-dark-900/30">
                  {groupIssues.map((issue, issueIndex) => (
                    <div
                      key={issue.id}
                      onClick={() => onSelectIssueId(issue.id)}
                      className="p-3 rounded-lg border border-dark-700/50 cursor-pointer transition-all hover:bg-dark-800/50 hover:border-primary-500/30 animate-fade-in"
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
                      <div className="flex items-center justify-between text-xs text-dark-500">
                        <span className="font-mono text-dark-400">
                          {issue.file}:{issue.line}
                        </span>
                        <Badge className={getSeverityBadgeClass(issue.severity)}>
                          {getSeverityText(issue.severity)}
                        </Badge>
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
  };

  const renderSeverityGroups = () => (
    <div className="space-y-4">
      {severityOrder.map((severity, index) => {
        const groupIssues = severityGroups[severity];
        if (groupIssues.length === 0) return null;

        const isExpanded = expandedGroups[severity] ?? false;
        const Icon = severityIcons[severity];
        const progress = (groupIssues.length / reviewIssues.length) * 100;

        return (
          <div
            key={severity}
            className="glass-card rounded-lg border border-dark-700/50 overflow-hidden animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <button
              type="button"
              onClick={() => toggleGroup(severity)}
              className="w-full p-4 hover:bg-dark-800/50 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-5 h-5', getSeverityClass(severity))} />
                  <span className="font-medium text-dark-100">
                    {getSeverityText(severity)}
                  </span>
                  <Badge className={getSeverityBadgeClass(severity)}>
                    {groupIssues.length} 个
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-dark-400">
                    {progress.toFixed(1)}%
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-dark-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-dark-400" />
                  )}
                </div>
              </div>
              <div className="w-full h-2 bg-dark-800/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    severity === 'critical' && 'bg-severity-blocker',
                    severity === 'high' && 'bg-severity-critical',
                    severity === 'medium' && 'bg-severity-warning',
                    (severity === 'low' || severity === 'info') && 'bg-severity-info'
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-dark-700/50 p-3 space-y-2 bg-dark-900/30">
                {groupIssues.map((issue, issueIndex) => (
                  <div
                    key={issue.id}
                    onClick={() => onSelectIssueId(issue.id)}
                    className="p-3 rounded-lg border border-dark-700/50 cursor-pointer transition-all hover:bg-dark-800/50 hover:border-primary-500/30 animate-fade-in"
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
                    <div className="flex items-center justify-between text-xs text-dark-500">
                      <span className="font-mono text-dark-400">
                        {issue.file}:{issue.line}
                      </span>
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-dark-400" />
          <span className="text-sm text-dark-300">
            共 {reviewIssues.length} 个问题
          </span>
        </div>
        <div className="flex items-center gap-1 p-1 bg-dark-800/50 rounded-lg border border-dark-700/50">
          <button
            type="button"
            onClick={() => setGroupBy('status')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
              groupBy === 'status'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400 hover:text-dark-200'
            )}
          >
            <Clock className="w-4 h-4" />
            按状态
          </button>
          <button
            type="button"
            onClick={() => setGroupBy('assignee')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
              groupBy === 'assignee'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400 hover:text-dark-200'
            )}
          >
            <Users className="w-4 h-4" />
            按整改人
          </button>
          <button
            type="button"
            onClick={() => setGroupBy('severity')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
              groupBy === 'severity'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-400 hover:text-dark-200'
            )}
          >
            <Signal className="w-4 h-4" />
            按严重程度
          </button>
        </div>
      </div>

      {groupBy === 'status' && renderStatusGroups()}
      {groupBy === 'assignee' && renderAssigneeGroups()}
      {groupBy === 'severity' && renderSeverityGroups()}
    </div>
  );
}
