import { cn } from '@/lib/utils';
import type { Review, Issue, IssueSeverity, Branch } from '@/types';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}秒前`;
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return formatDate(dateString);
};

export const getFileIcon = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const iconMap: Record<string, string> = {
    ts: '📘',
    tsx: '📘',
    js: '📒',
    jsx: '📒',
    py: '🐍',
    java: '☕',
    go: '🔵',
    rs: '🦀',
    css: '🎨',
    scss: '🎨',
    html: '🌐',
    json: '📋',
    md: '📝',
  };
  return iconMap[ext] || '📄';
};

export const getSeverityScore = (severity: IssueSeverity): number => {
  const scores: Record<IssueSeverity, number> = {
    critical: 10,
    high: 7,
    medium: 4,
    low: 1,
    info: 0,
  };
  return scores[severity];
};

export const calculateRiskScore = (issues: Issue[]): number => {
  if (issues.length === 0) return 0;
  const totalScore = issues.reduce((sum, issue) => sum + getSeverityScore(issue.severity), 0);
  return Math.min(100, Math.round((totalScore / (issues.length * 10)) * 100));
};

const getBranchName = (branch: string | Branch | undefined): string => {
  if (!branch) return '';
  return typeof branch === 'string' ? branch : branch.name;
};

export const filterReviews = (reviews: Review[], filters: {
  repositoryId?: string;
  branch?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}): Review[] => {
  return reviews.filter((review) => {
    if (filters.repositoryId && review.repositoryId !== filters.repositoryId) return false;
    if (filters.branch && !getBranchName(review.branch).toLowerCase().includes(filters.branch.toLowerCase())) return false;
    if (filters.status && review.status !== filters.status) return false;
    if (filters.startDate && new Date(review.createdAt) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(review.createdAt) > new Date(filters.endDate)) return false;
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const matchesTitle = review.title.toLowerCase().includes(keyword);
      const matchesRepo = (review.repositoryName || '').toLowerCase().includes(keyword);
      const matchesBranch = getBranchName(review.branch).toLowerCase().includes(keyword);
      if (!matchesTitle && !matchesRepo && !matchesBranch) return false;
    }
    return true;
  });
};

export const groupIssuesBySeverity = (issues: Issue[]): Record<IssueSeverity, Issue[]> => {
  const groups: Record<IssueSeverity, Issue[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
    info: [],
  };
  issues.forEach((issue) => {
    groups[issue.severity].push(issue);
  });
  return groups;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getLinesOfCode = (code: string): number => {
  return code.split('\n').length;
};

export { cn };
