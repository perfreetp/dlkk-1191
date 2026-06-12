import type { Severity, IssueStatus } from '../types';

export function getSeverityColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    critical: 'text-red-600',
    high: 'text-orange-500',
    medium: 'text-yellow-600',
    low: 'text-blue-500',
    info: 'text-gray-500',
  };
  return colors[severity];
}

export function getSeverityBgColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    critical: 'bg-red-100',
    high: 'bg-orange-100',
    medium: 'bg-yellow-100',
    low: 'bg-blue-100',
    info: 'bg-gray-100',
  };
  return colors[severity];
}

export function getSeverityLabel(severity: Severity): string {
  const labels: Record<Severity, string> = {
    critical: '严重',
    high: '高危',
    medium: '中危',
    low: '低危',
    info: '提示',
  };
  return labels[severity];
}

export function getStatusLabel(status: IssueStatus): string {
  const labels: Record<IssueStatus, string> = {
    open: '待处理',
    fixed: '已修复',
    ignored: '已忽略',
    in_progress: '处理中',
  };
  return labels[status];
}
