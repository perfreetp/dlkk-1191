import { useState } from 'react';
import { X, UserPlus, Clock, FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore, getSeverityText } from '@/store';
import { formatDateTime, getFileIcon } from '@/utils';
import { Badge, Button, CodeBlock, Select } from '@/components';
import CommentSection from './CommentSection';
import AssignDialog from './AssignDialog';
import type { Issue, IssueSeverity } from '@/types';

interface IssueDetailProps {
  issue: Issue;
  onClose: () => void;
}

const severityToTheme: Record<IssueSeverity, string> = {
  critical: 'blocker',
  high: 'critical',
  medium: 'warning',
  low: 'info',
  info: 'info',
};

export default function IssueDetail({ issue, onClose }: IssueDetailProps) {
  const { updateIssueStatus } = useAppStore();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateIssueStatus(issue.id, e.target.value);
  };

  const getSeverityBadgeClass = (severity: IssueSeverity): string => {
    const theme = severityToTheme[severity];
    return `text-severity-${theme} bg-severity-${theme}/20 border border-severity-${theme}/30`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-severity-info" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-dark-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-severity-blocker" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between p-4 border-b border-dark-700/50">
        <h3 className="font-semibold text-dark-100">问题详情</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-dark-800/50 rounded-md transition-colors"
        >
          <X className="w-5 h-5 text-dark-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin animate-fade-in">
        <div>
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-lg font-semibold text-dark-100">{issue.title}</h4>
            <Badge className={getSeverityBadgeClass(issue.severity)}>
              {getSeverityText(issue.severity)}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-dark-400 mb-4">
            <div className="flex items-center gap-1">
              {getStatusIcon(issue.status)}
              <Select
                value={issue.status}
                onChange={handleStatusChange}
                className="w-32 h-8 text-sm bg-dark-800/50 border-dark-700/50 text-dark-100"
              >
                <option value="open">待处理</option>
                <option value="in_progress">处理中</option>
                <option value="resolved">已解决</option>
                <option value="closed">已关闭</option>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>更新于 {formatDateTime(issue.updatedAt)}</span>
            </div>
          </div>

          <p className="text-dark-300 mb-4">{issue.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-dark-500" />
              <span className="text-dark-400">文件:</span>
              <span className="font-mono text-dark-200">{getFileIcon(issue.file)} {issue.file}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dark-400">行号:</span>
              <span className="font-mono text-dark-200">{issue.line}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dark-400">规则:</span>
              <span className="font-mono text-primary-400">{issue.ruleId || '-'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dark-400">创建时间:</span>
              <span className="text-dark-200">{formatDateTime(issue.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-dark-400">整改人:</span>
            {issue.assignee ? (
              <Badge className="bg-primary-500/20 text-primary-400 border border-primary-500/30">
                {issue.assignee}
              </Badge>
            ) : (
              <span className="text-sm text-dark-500">未指派</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignDialogOpen(true)}
              className="border-dark-700/50 text-dark-300 hover:bg-dark-800/50 hover:text-dark-100"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              {issue.assignee ? '重新指派' : '指派'}
            </Button>
          </div>
        </div>

        <div>
          <h5 className="font-medium text-dark-100 mb-3">问题代码</h5>
          <CodeBlock code={issue.code} language="typescript" lineNumber={issue.line} />
        </div>

        <div>
          <CommentSection comments={issue.comments} issueId={issue.id} />
        </div>
      </div>

      <AssignDialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        issueId={issue.id}
        currentAssignee={issue.assignee}
      />
    </div>
  );
}
