export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type IssueStatus = 'open' | 'fixed' | 'ignored' | 'in_progress';
export type ReviewStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'info_requested' | 'in_progress' | 'completed';
export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  createdAt: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName?: string;
  url: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Branch {
  id: string;
  name: string;
  repositoryId?: string;
  commit?: string;
  isProtected?: boolean;
}

export interface Comment {
  id: string;
  issueId?: string;
  userId: string;
  userName?: string;
  content: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  reviewId?: string;
  ruleId?: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | IssueStatus;
  file: string;
  line: number;
  column?: number;
  code: string;
  assignee?: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: IssueSeverity;
  enabled: boolean;
  order: number;
  isMandatory: boolean;
}

export interface RuleTemplate {
  id: string;
  category: string;
  name: string;
  description: string;
  severity: Severity;
  isEnabled: boolean;
  isMandatory: boolean;
  priority: number;
  language: string;
}

export interface HighRiskFile {
  id: string;
  path: string;
  riskScore: number;
  issueCount: number;
  criticalCount?: number;
  highCount?: number;
  lastModified: string;
}

export interface FunctionComplexity {
  id: string;
  functionName: string;
  file: string;
  complexity: number;
  previousComplexity: number;
  change: number;
  riskLevel: Severity;
}

export interface ReviewHistory {
  id: string;
  reviewId: string;
  action: string;
  userId: string;
  comment?: string;
  createdAt: string;
}

export interface RiskScore {
  overall: number;
  security: number;
  maintainability: number;
  performance: number;
  readability: number;
}

export interface Review {
  id: string;
  title: string;
  description?: string;
  repositoryId: string;
  repository?: Repository;
  repositoryName?: string;
  branchId?: string;
  branch?: Branch | string;
  authorId?: string;
  author?: User;
  reviewerIds?: string[];
  reviewers?: User[];
  status: ReviewStatus;
  issues?: Issue[];
  riskScore?: RiskScore;
  highRiskFiles?: HighRiskFile[];
  functionComplexities?: FunctionComplexity[];
  history?: ReviewHistory[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  reviewerCount?: number;
  issueCount?: number;
  criticalIssueCount?: number;
  highIssueCount?: number;
  mediumIssueCount?: number;
  lowIssueCount?: number;
  assignee?: string;
}

export interface RiskData {
  category: string;
  score: number;
  maxScore: number;
}

export interface ComplexityData {
  date: string;
  complexity: number;
  linesOfCode: number;
}

export interface UserStats {
  userId: string;
  userName: string;
  totalIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
  averageResolutionTime: number;
}

export interface HistoryRecord {
  id: string;
  reviewId: string;
  reviewTitle: string;
  action: string;
  userName: string;
  createdAt: string;
  details: string;
}

export interface ReviewFilter {
  repositoryId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  branch?: string;
  severity?: IssueSeverity;
  authorId?: string;
  search?: string;
}

export type ReviewFilters = ReviewFilter;

export interface IssueTemplate {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  category: string;
}

export interface MandatoryCheck {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
}
