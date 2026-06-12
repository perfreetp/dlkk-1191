import { useState, useMemo, useCallback } from 'react';
import { AlertTriangle, AlertCircle, Minus, Filter, ChevronDown, ChevronUp, Info, Lock, Users, MessageSquare, X } from 'lucide-react';
import { useAppStore, getSeverityText, getStatusText } from '@/store';
import { groupIssuesBySeverity, formatRelativeTime, truncateText, cn } from '@/utils';
import { Card, Badge, Select, Empty, Button, Dialog, DialogHeader, DialogContent, DialogFooter, Input } from '@/components';
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

const ASSIGNEES = ['张三', '李四', '王五', '赵六'];

export default function IssuesTab({ reviewId, onSelectIssueId, selectedIssueId, disabled = false }: IssuesTabProps) {
  const { issues, batchUpdateStatus, batchAssignIssue, batchAddComment } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<Record<IssueSeverity, boolean>>({
    critical: true,
    high: true,
    medium: true,
    low: true,
    info: true,
  });
  const [selectedIssueIds, setSelectedIssueIds] = useState<Set<string>>(new Set());
  const [batchStatus, setBatchStatus] = useState<string>('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [commentContent, setCommentContent] = useState<string>('');

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

  const handleSelectIssue = useCallback((issueId: string) => {
    if (disabled) return;
    setSelectedIssueIds((prev) => {
      const next = new Set(prev);
      if (next.has(issueId)) {
        next.delete(issueId);
      } else {
        next.add(issueId);
      }
      return next;
    });
  }, [disabled]);

  const handleSelectAll = useCallback(() => {
    if (disabled) return;
    if (selectedIssueIds.size === filteredIssues.length) {
      setSelectedIssueIds(new Set());
    } else {
      setSelectedIssueIds(new Set(filteredIssues.map((i) => i.id)));
    }
  }, [disabled, selectedIssueIds.size, filteredIssues]);

  const handleSelectGroup = useCallback((severity: IssueSeverity) => {
    if (disabled) return;
    const groupIssues = groupedIssues[severity];
    const groupIds = groupIssues.map((i) => i.id);
    const allSelected = groupIds.every((id) => selectedIssueIds.has(id));

    setSelectedIssueIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        groupIds.forEach((id) => next.delete(id));
      } else {
        groupIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [disabled, groupedIssues, selectedIssueIds]);

  const clearSelection = useCallback(() => {
    setSelectedIssueIds(new Set());
    setBatchStatus('');
  }, []);

  const handleBatchStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    if (!status || selectedIssueIds.size === 0) return;
    const ids = Array.from(selectedIssueIds);
    batchUpdateStatus(ids, status);
    clearSelection();
  }, [selectedIssueIds, batchUpdateStatus, clearSelection]);

  const handleBatchAssign = useCallback(() => {
    if (!selectedAssignee || selectedIssueIds.size === 0) return;
    const ids = Array.from(selectedIssueIds);
    batchAssignIssue(ids, selectedAssignee);
    clearSelection();
    setSelectedAssignee('');
    setAssignDialogOpen(false);
  }, [selectedAssignee, selectedIssueIds, batchAssignIssue, clearSelection]);

  const handleBatchComment = useCallback(() => {
    if (!commentContent.trim() || selectedIssueIds.size === 0) return;
    const ids = Array.from(selectedIssueIds);
    batchAddComment(ids, commentContent.trim(), '1', '技术负责人');
    clearSelection();
    setCommentContent('');
    setCommentDialogOpen(false);
  }, [commentContent, selectedIssueIds, batchAddComment, clearSelection]);

  const openAssignDialog = useCallback(() => {
    setSelectedAssignee('');
    setAssignDialogOpen(true);
  }, []);

  const openCommentDialog = useCallback(() => {
    setCommentContent('');
    setCommentDialogOpen(true);
  }, []);

  const isGroupAllSelected = useCallback((severity: IssueSeverity): boolean => {
    const groupIssues = groupedIssues[severity];
    if (groupIssues.length === 0) return false;
    return groupIssues.every((issue) => selectedIssueIds.has(issue.id));
  }, [groupedIssues, selectedIssueIds]);

  const isGroupIndeterminate = useCallback((severity: IssueSeverity): boolean => {
    const groupIssues = groupedIssues[severity];
    if (groupIssues.length === 0) return false;
    const selectedCount = groupIssues.filter((issue) => selectedIssueIds.has(issue.id)).length;
    return selectedCount > 0 && selectedCount < groupIssues.length;
  }, [groupedIssues, selectedIssueIds]);

  if (filteredIssues.length === 0) {
    return (
      <Card className="glass-card p-12 animate-fade-in">
        <Empty />
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {selectedIssueIds.size > 0 && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-primary-500/10 border border-primary-500/30 animate-fade-in">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary-400">
              已选择 {selectedIssueIds.size} 个问题
            </span>
            <Select
              value={batchStatus}
              onChange={handleBatchStatusChange}
              disabled={disabled}
              className="w-36 bg-dark-800/50 border-dark-700/50 text-dark-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">批量改状态</option>
              <option value="open">待处理</option>
              <option value="in_progress">处理中</option>
              <option value="resolved">已解决</option>
              <option value="closed">已关闭</option>
            </Select>
            <Button
              variant="secondary"
              size="sm"
              onClick={openAssignDialog}
              disabled={disabled}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              <span>批量指派</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={openCommentDialog}
              disabled={disabled}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>批量加备注</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            disabled={disabled}
            className="gap-2 text-dark-400 hover:text-dark-100"
          >
            <X className="w-4 h-4" />
            <span>取消选择</span>
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedIssueIds.size === filteredIssues.length && filteredIssues.length > 0}
            ref={(el) => {
              if (el) {
                el.indeterminate = selectedIssueIds.size > 0 && selectedIssueIds.size < filteredIssues.length;
              }
            }}
            onChange={handleSelectAll}
            disabled={disabled || filteredIssues.length === 0}
            className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          />
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
                <input
                  type="checkbox"
                  checked={isGroupAllSelected(severity)}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate = isGroupIndeterminate(severity);
                    }
                  }}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectGroup(severity);
                  }}
                  disabled={disabled}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                />
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
                      selectedIssueIds.has(issue.id)
                        ? 'border-primary-500/50 bg-primary-500/10'
                        : selectedIssueId === issue.id
                          ? 'border-primary-500/50 bg-primary-500/10'
                          : 'border-dark-700/50',
                      disabled
                        ? 'cursor-not-allowed opacity-60 hover:border-dark-700/50 hover:bg-dark-800/30'
                        : 'cursor-pointer'
                    )}
                    style={{ animationDelay: `${issueIndex * 30}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIssueIds.has(issue.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectIssue(issue.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        disabled={disabled}
                        className="w-4 h-4 mt-0.5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-dark-100 flex-1">
                            {issue.title}
                          </h4>
                          <Badge className="bg-dark-800/50 text-dark-300 border border-dark-700/50 flex-shrink-0 ml-2">
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogHeader title="批量指派" onClose={() => setAssignDialogOpen(false)} />
        <DialogContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              已选择 {selectedIssueIds.size} 个问题，选择整改人进行批量指派：
            </p>
            <Select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="w-full bg-dark-800/50 border-dark-700/50 text-dark-100"
            >
              <option value="">请选择整改人</option>
              {ASSIGNEES.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </Select>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setAssignDialogOpen(false)}
          >
            取消
          </Button>
          <Button
            onClick={handleBatchAssign}
            disabled={!selectedAssignee}
          >
            确认指派
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)}>
        <DialogHeader title="批量添加备注" onClose={() => setCommentDialogOpen(false)} />
        <DialogContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              已选择 {selectedIssueIds.size} 个问题，输入备注内容：
            </p>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="请输入备注内容..."
              rows={4}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 bg-dark-800/50 border-dark-700/50 text-dark-100"
            />
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setCommentDialogOpen(false)}
          >
            取消
          </Button>
          <Button
            onClick={handleBatchComment}
            disabled={!commentContent.trim()}
          >
            确认添加
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
