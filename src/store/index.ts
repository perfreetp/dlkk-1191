import { create } from 'zustand';
import type {
  Review,
  Issue,
  Repository,
  Branch,
  Rule,
  RiskData,
  HighRiskFile,
  ComplexityData,
  UserStats,
  HistoryRecord,
  ReviewFilter,
  IssueTemplate,
  MandatoryCheck,
  IssueSeverity,
  ReviewStatus,
} from '@/types';

interface AppState {
  repositories: Repository[];
  branches: Branch[];
  reviews: Review[];
  currentReview: Review | null;
  issues: Issue[];
  currentIssue: Issue | null;
  rules: Rule[];
  riskData: RiskData[];
  highRiskFiles: HighRiskFile[];
  complexityTrend: ComplexityData[];
  userStats: UserStats[];
  historyRecords: HistoryRecord[];
  reviewFilter: ReviewFilter;
  issueTemplates: IssueTemplate[];
  mandatoryChecks: MandatoryCheck[];
  currentTab: string;
  loading: boolean;

  setRepositories: (repos: Repository[]) => void;
  setBranches: (branches: Branch[]) => void;
  setReviews: (reviews: Review[]) => void;
  setCurrentReview: (review: Review | null) => void;
  setIssues: (issues: Issue[]) => void;
  setCurrentIssue: (issue: Issue | null) => void;
  setRules: (rules: Rule[]) => void;
  setRiskData: (data: RiskData[]) => void;
  setHighRiskFiles: (files: HighRiskFile[]) => void;
  setComplexityTrend: (data: ComplexityData[]) => void;
  setUserStats: (stats: UserStats[]) => void;
  setHistoryRecords: (records: HistoryRecord[]) => void;
  setReviewFilter: (filter: Partial<ReviewFilter>) => void;
  setIssueTemplates: (templates: IssueTemplate[]) => void;
  setMandatoryChecks: (checks: MandatoryCheck[]) => void;
  setCurrentTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;

  toggleRule: (id: string) => void;
  reorderRules: (startIndex: number, endIndex: number) => void;
  toggleMandatoryCheck: (id: string) => void;
  addComment: (issueId: string, content: string, userId: string, userName: string) => void;
  assignIssue: (issueId: string, assignee: string) => void;
  updateIssueStatus: (issueId: string, status: string) => void;
  fetchReview: (id: string) => void;
  approveReview: (reviewId: string, comment: string) => void;
  rejectReview: (reviewId: string, comment: string) => void;
  requestInfo: (reviewId: string, comment: string) => void;
}

const mockRepositories: Repository[] = [
  { id: '1', name: 'frontend-app', url: 'https://github.com/org/frontend-app' },
  { id: '2', name: 'backend-service', url: 'https://github.com/org/backend-service' },
  { id: '3', name: 'mobile-app', url: 'https://github.com/org/mobile-app' },
];

const mockBranches: Branch[] = [
  { id: '1', name: 'main', repositoryId: '1' },
  { id: '2', name: 'develop', repositoryId: '1' },
  { id: '3', name: 'feature/login', repositoryId: '1' },
  { id: '4', name: 'main', repositoryId: '2' },
  { id: '5', name: 'develop', repositoryId: '2' },
];

const mockReviews: Review[] = [
  {
    id: '1',
    title: '用户模块重构代码评审',
    repositoryId: '1',
    repositoryName: 'frontend-app',
    branch: 'feature/user-refactor',
    status: 'in_progress',
    createdAt: '2026-06-10T10:00:00Z',
    updatedAt: '2026-06-11T14:30:00Z',
    reviewerCount: 3,
    issueCount: 12,
    criticalIssueCount: 2,
    highIssueCount: 4,
    mediumIssueCount: 5,
    lowIssueCount: 1,
    assignee: '张三',
    description: '重构用户认证和权限管理模块',
  },
  {
    id: '2',
    title: '支付接口升级评审',
    repositoryId: '2',
    repositoryName: 'backend-service',
    branch: 'feature/payment-v2',
    status: 'pending',
    createdAt: '2026-06-09T09:00:00Z',
    updatedAt: '2026-06-09T09:00:00Z',
    reviewerCount: 2,
    issueCount: 0,
    criticalIssueCount: 0,
    highIssueCount: 0,
    mediumIssueCount: 0,
    lowIssueCount: 0,
    description: '升级支付网关接口到 v2 版本',
  },
  {
    id: '3',
    title: '首页性能优化',
    repositoryId: '1',
    repositoryName: 'frontend-app',
    branch: 'feature/performance',
    status: 'completed',
    createdAt: '2026-06-05T11:00:00Z',
    updatedAt: '2026-06-08T16:00:00Z',
    reviewerCount: 2,
    issueCount: 8,
    criticalIssueCount: 0,
    highIssueCount: 2,
    mediumIssueCount: 4,
    lowIssueCount: 2,
    assignee: '李四',
    description: '优化首页加载速度和渲染性能',
  },
];

const mockIssues: Issue[] = [
  {
    id: '1',
    reviewId: '1',
    title: 'SQL 注入风险',
    description: '用户输入未经过滤直接拼接 SQL 语句，存在 SQL 注入风险。',
    severity: 'critical',
    status: 'open',
    file: 'src/services/userService.ts',
    line: 128,
    code: `const query = \`SELECT * FROM users WHERE id = \${userId}\`;`,
    ruleId: 'SEC-001',
    assignee: '李四',
    createdAt: '2026-06-10T11:00:00Z',
    updatedAt: '2026-06-10T11:00:00Z',
    comments: [
      {
        id: 'c1',
        issueId: '1',
        userId: 'u1',
        userName: '王审查',
        content: '这里必须使用参数化查询，请尽快修复。',
        createdAt: '2026-06-10T11:30:00Z',
      },
    ],
  },
  {
    id: '2',
    reviewId: '1',
    title: '敏感信息日志泄露',
    description: '日志中打印了用户的密码哈希值，属于敏感信息泄露。',
    severity: 'critical',
    status: 'in_progress',
    file: 'src/middleware/auth.ts',
    line: 45,
    code: `console.log('Login attempt:', { email, passwordHash });`,
    ruleId: 'SEC-002',
    assignee: '张三',
    createdAt: '2026-06-10T11:30:00Z',
    updatedAt: '2026-06-11T09:00:00Z',
    comments: [],
  },
  {
    id: '3',
    reviewId: '1',
    title: '缺少错误处理',
    description: 'API 调用缺少 catch 错误处理，可能导致未处理的 Promise rejection。',
    severity: 'high',
    status: 'open',
    file: 'src/hooks/useUser.ts',
    line: 67,
    code: `const { data } = await axios.get('/api/users');`,
    ruleId: 'ERR-001',
    createdAt: '2026-06-10T12:00:00Z',
    updatedAt: '2026-06-10T12:00:00Z',
    comments: [],
  },
];

const mockRules: Rule[] = [
  { id: '1', name: '禁止 SQL 注入', description: '必须使用参数化查询，禁止字符串拼接 SQL', category: '安全', severity: 'critical', enabled: true, order: 1, isMandatory: true },
  { id: '2', name: '敏感信息保护', description: '禁止在日志中输出密码、token 等敏感信息', category: '安全', severity: 'critical', enabled: true, order: 2, isMandatory: true },
  { id: '3', name: '错误处理', description: '所有异步操作必须有错误处理', category: '可靠性', severity: 'high', enabled: true, order: 3, isMandatory: false },
  { id: '4', name: '类型安全', description: '禁止使用 any 类型，必须定义明确的类型', category: '代码质量', severity: 'medium', enabled: true, order: 4, isMandatory: false },
  { id: '5', name: '代码复杂度', description: '函数圈复杂度不超过 10', category: '代码质量', severity: 'medium', enabled: false, order: 5, isMandatory: false },
];

const mockRiskData: RiskData[] = [
  { category: '安全风险', score: 75, maxScore: 100 },
  { category: '代码质量', score: 60, maxScore: 100 },
  { category: '性能风险', score: 45, maxScore: 100 },
  { category: '可维护性', score: 55, maxScore: 100 },
  { category: '测试覆盖', score: 30, maxScore: 100 },
];

const mockHighRiskFiles: HighRiskFile[] = [
  { id: '1', path: 'src/services/userService.ts', riskScore: 92, issueCount: 5, lastModified: '2026-06-11' },
  { id: '2', path: 'src/middleware/auth.ts', riskScore: 85, issueCount: 3, lastModified: '2026-06-10' },
  { id: '3', path: 'src/utils/encryption.ts', riskScore: 78, issueCount: 2, lastModified: '2026-06-08' },
  { id: '4', path: 'src/components/PaymentForm.tsx', riskScore: 72, issueCount: 4, lastModified: '2026-06-09' },
  { id: '5', path: 'src/hooks/usePayment.ts', riskScore: 68, issueCount: 2, lastModified: '2026-06-07' },
];

const mockComplexityTrend: ComplexityData[] = [
  { date: '06-01', complexity: 45, linesOfCode: 12000 },
  { date: '06-02', complexity: 48, linesOfCode: 12300 },
  { date: '06-03', complexity: 52, linesOfCode: 12800 },
  { date: '06-04', complexity: 50, linesOfCode: 13000 },
  { date: '06-05', complexity: 55, linesOfCode: 13500 },
  { date: '06-06', complexity: 58, linesOfCode: 14000 },
  { date: '06-07', complexity: 56, linesOfCode: 14200 },
  { date: '06-08', complexity: 60, linesOfCode: 14800 },
  { date: '06-09', complexity: 62, linesOfCode: 15200 },
  { date: '06-10', complexity: 59, linesOfCode: 15500 },
];

const mockUserStats: UserStats[] = [
  { userId: '1', userName: '张三', totalIssues: 28, resolvedIssues: 22, inProgressIssues: 4, averageResolutionTime: 24 },
  { userId: '2', userName: '李四', totalIssues: 35, resolvedIssues: 30, inProgressIssues: 3, averageResolutionTime: 18 },
  { userId: '3', userName: '王五', totalIssues: 15, resolvedIssues: 10, inProgressIssues: 5, averageResolutionTime: 36 },
  { userId: '4', userName: '赵六', totalIssues: 42, resolvedIssues: 38, inProgressIssues: 2, averageResolutionTime: 12 },
];

const mockHistoryRecords: HistoryRecord[] = [
  { id: '1', reviewId: '1', reviewTitle: '用户模块重构代码评审', action: '创建评审', userName: '王审查', createdAt: '2026-06-10T10:00:00Z', details: '提交了 15 个文件待评审' },
  { id: '2', reviewId: '1', reviewTitle: '用户模块重构代码评审', action: '发现问题', userName: '李审阅', createdAt: '2026-06-10T11:00:00Z', details: '发现 2 个严重问题' },
  { id: '3', reviewId: '3', reviewTitle: '首页性能优化', action: '评审通过', userName: '王审查', createdAt: '2026-06-08T16:00:00Z', details: '所有问题已修复' },
  { id: '4', reviewId: '2', reviewTitle: '支付接口升级评审', action: '创建评审', userName: '赵开发', createdAt: '2026-06-09T09:00:00Z', details: '提交了 8 个文件待评审' },
];

const mockIssueTemplates: IssueTemplate[] = [
  { id: '1', title: '代码重复', description: '检测到重复代码，建议提取公共函数或组件。', severity: 'medium', category: '代码质量' },
  { id: '2', title: '缺少单元测试', description: '新增代码缺少对应的单元测试，请补充测试用例。', severity: 'high', category: '测试' },
  { id: '3', title: '命名不规范', description: '变量/函数命名不符合项目规范，请参考命名指南。', severity: 'low', category: '代码规范' },
  { id: '4', title: '缺少类型定义', description: '使用了 any 类型或缺少类型定义，请添加明确的类型。', severity: 'medium', category: '类型安全' },
];

const mockMandatoryChecks: MandatoryCheck[] = [
  { id: '1', name: '代码风格检查', description: 'ESLint/Prettier 检查必须通过', enabled: true },
  { id: '2', name: '单元测试覆盖率', description: '新增代码测试覆盖率不低于 80%', enabled: true },
  { id: '3', name: '构建检查', description: '代码必须能够正常构建', enabled: true },
  { id: '4', name: '安全扫描', description: '必须通过安全漏洞扫描', enabled: false },
  { id: '5', name: '性能基准测试', description: '性能不得低于当前基准的 90%', enabled: false },
];

export const useAppStore = create<AppState>((set) => ({
  repositories: mockRepositories,
  branches: mockBranches,
  reviews: mockReviews,
  currentReview: null,
  issues: mockIssues,
  currentIssue: null,
  rules: mockRules,
  riskData: mockRiskData,
  highRiskFiles: mockHighRiskFiles,
  complexityTrend: mockComplexityTrend,
  userStats: mockUserStats,
  historyRecords: mockHistoryRecords,
  reviewFilter: {},
  issueTemplates: mockIssueTemplates,
  mandatoryChecks: mockMandatoryChecks,
  currentTab: 'issues',
  loading: false,

  setRepositories: (repos) => set({ repositories: repos }),
  setBranches: (branches) => set({ branches }),
  setReviews: (reviews) => set({ reviews }),
  setCurrentReview: (review) => set({ currentReview: review }),
  setIssues: (issues) => set({ issues }),
  setCurrentIssue: (issue) => set({ currentIssue: issue }),
  setRules: (rules) => set({ rules }),
  setRiskData: (data) => set({ riskData: data }),
  setHighRiskFiles: (files) => set({ highRiskFiles: files }),
  setComplexityTrend: (data) => set({ complexityTrend: data }),
  setUserStats: (stats) => set({ userStats: stats }),
  setHistoryRecords: (records) => set({ historyRecords: records }),
  setReviewFilter: (filter) => set((state) => ({ reviewFilter: { ...state.reviewFilter, ...filter } })),
  setIssueTemplates: (templates) => set({ issueTemplates: templates }),
  setMandatoryChecks: (checks) => set({ mandatoryChecks: checks }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setLoading: (loading) => set({ loading }),

  toggleRule: (id) =>
    set((state) => ({
      rules: state.rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    })),

  reorderRules: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.rules);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { rules: result.map((r, i) => ({ ...r, order: i + 1 })) };
    }),

  toggleMandatoryCheck: (id) =>
    set((state) => ({
      mandatoryChecks: state.mandatoryChecks.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    })),

  addComment: (issueId, content, userId, userName) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              comments: [
                ...issue.comments,
                {
                  id: `c${Date.now()}`,
                  issueId,
                  userId,
                  userName,
                  content,
                  createdAt: new Date().toISOString(),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : issue
      ),
    })),

  assignIssue: (issueId, assignee) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === issueId ? { ...issue, assignee, updatedAt: new Date().toISOString() } : issue
      ),
    })),

  updateIssueStatus: (issueId, status) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === issueId
          ? { ...issue, status: status as Issue['status'], updatedAt: new Date().toISOString() }
          : issue
      ),
    })),

  fetchReview: (id) =>
    set((state) => {
      const review = state.reviews.find((r) => r.id === id) || null;
      return { currentReview: review };
    }),

  approveReview: (reviewId, comment) =>
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              status: 'approved',
              updatedAt: new Date().toISOString(),
              history: [
                ...(r.history || []),
                {
                  id: `h${Date.now()}`,
                  reviewId,
                  action: 'approved',
                  userId: 'u1',
                  comment,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : r
      ),
      currentReview: state.currentReview?.id === reviewId
        ? {
            ...state.currentReview,
            status: 'approved',
            updatedAt: new Date().toISOString(),
            history: [
              ...(state.currentReview.history || []),
              {
                id: `h${Date.now()}`,
                reviewId,
                action: 'approved',
                userId: 'u1',
                comment,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : state.currentReview,
      historyRecords: [
        {
          id: `hr${Date.now()}`,
          reviewId,
          reviewTitle: state.reviews.find((r) => r.id === reviewId)?.title || '',
          action: '评审通过',
          userName: '技术负责人',
          createdAt: new Date().toISOString(),
          details: comment,
        },
        ...state.historyRecords,
      ],
    })),

  rejectReview: (reviewId, comment) =>
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              status: 'rejected',
              updatedAt: new Date().toISOString(),
              history: [
                ...(r.history || []),
                {
                  id: `h${Date.now()}`,
                  reviewId,
                  action: 'rejected',
                  userId: 'u1',
                  comment,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : r
      ),
      currentReview: state.currentReview?.id === reviewId
        ? {
            ...state.currentReview,
            status: 'rejected',
            updatedAt: new Date().toISOString(),
            history: [
              ...(state.currentReview.history || []),
              {
                id: `h${Date.now()}`,
                reviewId,
                action: 'rejected',
                userId: 'u1',
                comment,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : state.currentReview,
      historyRecords: [
        {
          id: `hr${Date.now()}`,
          reviewId,
          reviewTitle: state.reviews.find((r) => r.id === reviewId)?.title || '',
          action: '评审驳回',
          userName: '技术负责人',
          createdAt: new Date().toISOString(),
          details: comment,
        },
        ...state.historyRecords,
      ],
    })),

  requestInfo: (reviewId, comment) =>
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              status: 'info_requested',
              updatedAt: new Date().toISOString(),
              history: [
                ...(r.history || []),
                {
                  id: `h${Date.now()}`,
                  reviewId,
                  action: 'info_requested',
                  userId: 'u1',
                  comment,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : r
      ),
      currentReview: state.currentReview?.id === reviewId
        ? {
            ...state.currentReview,
            status: 'info_requested',
            updatedAt: new Date().toISOString(),
            history: [
              ...(state.currentReview.history || []),
              {
                id: `h${Date.now()}`,
                reviewId,
                action: 'info_requested',
                userId: 'u1',
                comment,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : state.currentReview,
      historyRecords: [
        {
          id: `hr${Date.now()}`,
          reviewId,
          reviewTitle: state.reviews.find((r) => r.id === reviewId)?.title || '',
          action: '要求补充',
          userName: '技术负责人',
          createdAt: new Date().toISOString(),
          details: comment,
        },
        ...state.historyRecords,
      ],
    })),
}));

const severityToTheme: Record<IssueSeverity, string> = {
  critical: 'blocker',
  high: 'critical',
  medium: 'warning',
  low: 'info',
  info: 'info',
};

export const getSeverityColor = (severity: IssueSeverity): string => {
  const theme = severityToTheme[severity];
  return `text-severity-${theme} bg-severity-${theme}/20 border border-severity-${theme}/30`;
};

export const getStatusColor = (status: ReviewStatus | string): string => {
  const colors: Record<string, string> = {
    pending: 'text-dark-400 bg-dark-800/50 border border-dark-700/50',
    reviewing: 'text-primary-400 bg-primary-500/20 border border-primary-500/30',
    completed: 'text-severity-info bg-severity-info/20 border border-severity-info/30',
    approved: 'text-severity-info bg-severity-info/20 border border-severity-info/30',
    rejected: 'text-severity-blocker bg-severity-blocker/20 border border-severity-blocker/30',
    info_requested: 'text-primary-400 bg-primary-500/20 border border-primary-500/30',
    open: 'text-severity-blocker bg-severity-blocker/20 border border-severity-blocker/30',
    resolved: 'text-severity-info bg-severity-info/20 border border-severity-info/30',
    closed: 'text-dark-400 bg-dark-800/50 border border-dark-700/50',
    in_progress: 'text-severity-critical bg-severity-critical/20 border border-severity-critical/30',
  };
  return colors[status] || colors.pending;
};

export const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: '待评审',
    reviewing: '评审中',
    in_progress: '处理中',
    completed: '已完成',
    approved: '已通过',
    rejected: '已拒绝',
    info_requested: '需补充',
    open: '待处理',
    resolved: '已解决',
    closed: '已关闭',
  };
  return texts[status] || status;
};

export const getSeverityText = (severity: IssueSeverity): string => {
  const texts: Record<IssueSeverity, string> = {
    critical: '严重',
    high: '高',
    medium: '中',
    low: '低',
    info: '提示',
  };
  return texts[severity];
};
