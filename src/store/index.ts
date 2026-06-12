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
import { generateId, formatDuration } from '@/utils';

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
  addRule: (rule: Omit<Rule, 'id' | 'order'>) => void;
  updateRule: (id: string, updates: Partial<Rule>) => void;
  deleteRule: (id: string) => void;
  addIssueTemplate: (template: Omit<IssueTemplate, 'id'>) => void;
  updateIssueTemplate: (id: string, template: Partial<IssueTemplate>) => void;
  deleteIssueTemplate: (id: string) => void;
  toggleMandatoryCheck: (id: string) => void;
  addComment: (issueId: string, content: string, userId: string, userName: string) => void;
  assignIssue: (issueId: string, assignee: string) => void;
  updateIssueStatus: (issueId: string, status: string) => void;
  fetchReview: (id: string) => void;
  approveReview: (reviewId: string, comment: string) => void;
  rejectReview: (reviewId: string, comment: string) => void;
  requestInfo: (reviewId: string, comment: string) => void;
  getReviewById: (id: string) => Review | undefined;
  getIssuesByReviewId: (reviewId: string) => Issue[];
  getReviewIssueCounts: (reviewId: string) => { total: number; critical: number; high: number; medium: number; low: number };
  getAverageReviewDuration: () => number;
  getAverageReviewTime: () => number;
  getAverageReviewTimeText: () => string;
  getCompletedReviews: () => Review[];
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
    issueCount: 8,
    criticalIssueCount: 2,
    highIssueCount: 2,
    mediumIssueCount: 3,
    lowIssueCount: 1,
    assignee: '张三',
    description: '重构用户认证和权限管理模块',
    history: [
      { id: 'h1', reviewId: '1', action: 'created', userId: 'u1', comment: '提交评审申请', createdAt: '2026-06-10T10:00:00Z' },
      { id: 'h2', reviewId: '1', action: 'reviewing', userId: 'u2', comment: '开始评审', createdAt: '2026-06-10T10:30:00Z' },
      { id: 'h3', reviewId: '1', action: 'issue_found', userId: 'u2', comment: '发现 8 个问题', createdAt: '2026-06-10T14:00:00Z' },
      { id: 'h4', reviewId: '1', action: 'info_requested', userId: 'u2', comment: '需要补充登录流程的测试用例', createdAt: '2026-06-10T16:00:00Z' },
      { id: 'h5', reviewId: '1', action: 'info_provided', userId: 'u1', comment: '已补充测试用例', createdAt: '2026-06-11T09:00:00Z' },
    ],
  },
  {
    id: '2',
    title: '支付接口升级评审',
    repositoryId: '2',
    repositoryName: 'backend-service',
    branch: 'feature/payment-v2',
    status: 'approved',
    createdAt: '2026-06-09T09:00:00Z',
    updatedAt: '2026-06-10T15:00:00Z',
    completedAt: '2026-06-10T15:00:00Z',
    duration: 1800,
    reviewerCount: 2,
    issueCount: 3,
    criticalIssueCount: 0,
    highIssueCount: 1,
    mediumIssueCount: 1,
    lowIssueCount: 1,
    assignee: '赵开发',
    description: '升级支付网关接口到 v2 版本',
    history: [
      { id: 'h1', reviewId: '2', action: 'created', userId: 'u3', comment: '提交评审申请', createdAt: '2026-06-09T09:00:00Z' },
      { id: 'h2', reviewId: '2', action: 'reviewing', userId: 'u4', comment: '开始评审', createdAt: '2026-06-09T10:00:00Z' },
      { id: 'h3', reviewId: '2', action: 'issue_found', userId: 'u4', comment: '发现 3 个问题', createdAt: '2026-06-09T14:00:00Z' },
      { id: 'h4', reviewId: '2', action: 'issue_fixed', userId: 'u3', comment: '修复所有问题', createdAt: '2026-06-10T11:00:00Z' },
      { id: 'h5', reviewId: '2', action: 'approved', userId: 'u4', comment: '评审通过', createdAt: '2026-06-10T15:00:00Z' },
    ],
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
    completedAt: '2026-06-08T16:00:00Z',
    duration: 4620,
    reviewerCount: 2,
    issueCount: 5,
    criticalIssueCount: 0,
    highIssueCount: 1,
    mediumIssueCount: 2,
    lowIssueCount: 2,
    assignee: '李四',
    description: '优化首页加载速度和渲染性能',
    history: [
      { id: 'h1', reviewId: '3', action: 'created', userId: 'u2', comment: '提交评审申请', createdAt: '2026-06-05T11:00:00Z' },
      { id: 'h2', reviewId: '3', action: 'reviewing', userId: 'u1', comment: '开始评审', createdAt: '2026-06-05T14:00:00Z' },
      { id: 'h3', reviewId: '3', action: 'issue_found', userId: 'u1', comment: '发现 5 个问题', createdAt: '2026-06-05T17:00:00Z' },
      { id: 'h4', reviewId: '3', action: 'issue_fixed', userId: 'u2', comment: '修复性能问题', createdAt: '2026-06-07T10:00:00Z' },
      { id: 'h5', reviewId: '3', action: 'approved', userId: 'u1', comment: '评审通过', createdAt: '2026-06-08T16:00:00Z' },
    ],
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
    ruleId: '1',
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
    ruleId: '2',
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
    ruleId: '3',
    createdAt: '2026-06-10T12:00:00Z',
    updatedAt: '2026-06-10T12:00:00Z',
    comments: [],
  },
  {
    id: '4',
    reviewId: '1',
    title: '使用 any 类型',
    description: '用户数据使用了 any 类型，缺乏类型安全保障。',
    severity: 'high',
    status: 'open',
    file: 'src/types/user.ts',
    line: 23,
    code: `const user: any = response.data;`,
    ruleId: '4',
    assignee: '王五',
    createdAt: '2026-06-10T13:00:00Z',
    updatedAt: '2026-06-10T13:00:00Z',
    comments: [],
  },
  {
    id: '5',
    reviewId: '1',
    title: '函数复杂度过高',
    description: '登录验证函数圈复杂度达到 15，超过阈值。',
    severity: 'medium',
    status: 'in_progress',
    file: 'src/services/authService.ts',
    line: 89,
    code: `function validateLogin(username, password, token, rememberMe, deviceId) { ... }`,
    ruleId: '5',
    assignee: '张三',
    createdAt: '2026-06-10T13:30:00Z',
    updatedAt: '2026-06-10T15:00:00Z',
    comments: [
      {
        id: 'c2',
        issueId: '5',
        userId: 'u2',
        userName: '李审阅',
        content: '建议拆分成多个小函数。',
        createdAt: '2026-06-10T14:00:00Z',
      },
    ],
  },
  {
    id: '6',
    reviewId: '1',
    title: '重复代码',
    description: '用户信息格式化逻辑在多处重复出现。',
    severity: 'medium',
    status: 'open',
    file: 'src/utils/format.ts',
    line: 45,
    code: `// 重复的用户格式化逻辑`,
    ruleId: '4',
    createdAt: '2026-06-10T14:00:00Z',
    updatedAt: '2026-06-10T14:00:00Z',
    comments: [],
  },
  {
    id: '7',
    reviewId: '1',
    title: '缺少单元测试',
    description: '新增的权限校验逻辑缺少单元测试覆盖。',
    severity: 'medium',
    status: 'open',
    file: 'src/utils/permissions.ts',
    line: 12,
    code: `export function checkPermission(user, resource) { ... }`,
    createdAt: '2026-06-10T14:30:00Z',
    updatedAt: '2026-06-10T14:30:00Z',
    comments: [],
  },
  {
    id: '8',
    reviewId: '1',
    title: '命名不规范',
    description: '变量名 user_data 不符合驼峰命名规范。',
    severity: 'low',
    status: 'resolved',
    file: 'src/components/UserProfile.tsx',
    line: 28,
    code: `const user_data = useUser();`,
    ruleId: '4',
    assignee: '李四',
    createdAt: '2026-06-10T15:00:00Z',
    updatedAt: '2026-06-11T10:00:00Z',
    comments: [],
  },
  {
    id: '9',
    reviewId: '2',
    title: '支付回调缺少签名验证',
    description: '支付回调接口未验证请求签名，存在伪造回调风险。',
    severity: 'high',
    status: 'resolved',
    file: 'src/controllers/paymentController.ts',
    line: 56,
    code: `router.post('/callback', (req, res) => { ... })`,
    ruleId: '1',
    assignee: '赵开发',
    createdAt: '2026-06-09T11:00:00Z',
    updatedAt: '2026-06-10T12:00:00Z',
    comments: [
      {
        id: 'c3',
        issueId: '9',
        userId: 'u4',
        userName: '钱审查',
        content: '必须添加签名验证逻辑。',
        createdAt: '2026-06-09T11:30:00Z',
      },
      {
        id: 'c4',
        issueId: '9',
        userId: 'u3',
        userName: '赵开发',
        content: '已修复，添加了 HMAC 签名验证。',
        createdAt: '2026-06-10T12:00:00Z',
      },
    ],
  },
  {
    id: '10',
    reviewId: '2',
    title: '错误码不统一',
    description: '支付相关错误码与系统其他部分不一致。',
    severity: 'medium',
    status: 'resolved',
    file: 'src/constants/errorCodes.ts',
    line: 34,
    code: `PAYMENT_FAILED = 1001`,
    assignee: '赵开发',
    createdAt: '2026-06-09T13:00:00Z',
    updatedAt: '2026-06-10T10:00:00Z',
    comments: [],
  },
  {
    id: '11',
    reviewId: '2',
    title: '注释不完整',
    description: '新增的支付方法缺少 JSDoc 注释。',
    severity: 'low',
    status: 'resolved',
    file: 'src/services/paymentService.ts',
    line: 78,
    code: `function createPaymentOrder(params) { ... }`,
    assignee: '赵开发',
    createdAt: '2026-06-09T14:00:00Z',
    updatedAt: '2026-06-10T09:00:00Z',
    comments: [],
  },
  {
    id: '12',
    reviewId: '3',
    title: '图片未做懒加载',
    description: '首页大量图片未使用懒加载，影响首屏性能。',
    severity: 'high',
    status: 'resolved',
    file: 'src/pages/Home/index.tsx',
    line: 120,
    code: `<img src={bannerUrl} alt="banner" />`,
    ruleId: '3',
    assignee: '李四',
    createdAt: '2026-06-05T14:00:00Z',
    updatedAt: '2026-06-07T14:00:00Z',
    comments: [],
  },
  {
    id: '13',
    reviewId: '3',
    title: '列表缺少虚拟滚动',
    description: '推荐商品列表未使用虚拟滚动，长列表渲染卡顿。',
    severity: 'medium',
    status: 'resolved',
    file: 'src/components/ProductList.tsx',
    line: 45,
    code: `{products.map(p => <ProductCard key={p.id} product={p} />)}`,
    assignee: '李四',
    createdAt: '2026-06-05T15:00:00Z',
    updatedAt: '2026-06-07T16:00:00Z',
    comments: [],
  },
  {
    id: '14',
    reviewId: '3',
    title: '未使用 CDN 静态资源',
    description: '静态资源未通过 CDN 加载，增加了服务器压力。',
    severity: 'medium',
    status: 'resolved',
    file: 'vite.config.ts',
    line: 23,
    code: `// 缺少 CDN 配置`,
    assignee: '李四',
    createdAt: '2026-06-05T16:00:00Z',
    updatedAt: '2026-06-07T10:00:00Z',
    comments: [],
  },
  {
    id: '15',
    reviewId: '3',
    title: 'CSS 类名冗长',
    description: '部分样式类名过长且语义不清晰。',
    severity: 'low',
    status: 'resolved',
    file: 'src/pages/Home/Home.module.css',
    line: 78,
    code: `.home-page-main-content-banner-wrapper { ... }`,
    assignee: '李四',
    createdAt: '2026-06-05T17:00:00Z',
    updatedAt: '2026-06-06T15:00:00Z',
    comments: [],
  },
  {
    id: '16',
    reviewId: '3',
    title: 'console.log 未清理',
    description: '代码中遗留了调试用的 console.log 语句。',
    severity: 'low',
    status: 'resolved',
    file: 'src/utils/analytics.ts',
    line: 34,
    code: `console.log('track event:', eventName);`,
    assignee: '李四',
    createdAt: '2026-06-06T10:00:00Z',
    updatedAt: '2026-06-06T16:00:00Z',
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
  { id: '2', reviewId: '1', reviewTitle: '用户模块重构代码评审', action: '开始评审', userName: '李审阅', createdAt: '2026-06-10T10:30:00Z', details: '李审阅开始进行代码评审' },
  { id: '3', reviewId: '1', reviewTitle: '用户模块重构代码评审', action: '发现问题', userName: '李审阅', createdAt: '2026-06-10T14:00:00Z', details: '发现 8 个问题，其中 2 个严重，2 个高优先级' },
  { id: '4', reviewId: '1', reviewTitle: '用户模块重构代码评审', action: '要求补充', userName: '李审阅', createdAt: '2026-06-10T16:00:00Z', details: '需要补充登录流程的测试用例' },
  { id: '5', reviewId: '1', reviewTitle: '用户模块重构代码评审', action: '补充信息', userName: '王审查', createdAt: '2026-06-11T09:00:00Z', details: '已补充测试用例和相关文档' },
  { id: '6', reviewId: '1', reviewTitle: '用户模块重构代码评审', action: '添加评论', userName: '李审阅', createdAt: '2026-06-11T14:30:00Z', details: '在 SQL 注入问题下添加了评论' },
  { id: '7', reviewId: '2', reviewTitle: '支付接口升级评审', action: '创建评审', userName: '赵开发', createdAt: '2026-06-09T09:00:00Z', details: '提交了 8 个文件待评审' },
  { id: '8', reviewId: '2', reviewTitle: '支付接口升级评审', action: '开始评审', userName: '钱审查', createdAt: '2026-06-09T10:00:00Z', details: '钱审查开始进行代码评审' },
  { id: '9', reviewId: '2', reviewTitle: '支付接口升级评审', action: '发现问题', userName: '钱审查', createdAt: '2026-06-09T14:00:00Z', details: '发现 3 个问题，其中 1 个高优先级' },
  { id: '10', reviewId: '2', reviewTitle: '支付接口升级评审', action: '修复问题', userName: '赵开发', createdAt: '2026-06-10T11:00:00Z', details: '已修复所有问题' },
  { id: '11', reviewId: '2', reviewTitle: '支付接口升级评审', action: '评审通过', userName: '钱审查', createdAt: '2026-06-10T15:00:00Z', details: '所有问题已修复，评审通过' },
  { id: '12', reviewId: '3', reviewTitle: '首页性能优化', action: '创建评审', userName: '李四', createdAt: '2026-06-05T11:00:00Z', details: '提交了 12 个文件待评审' },
  { id: '13', reviewId: '3', reviewTitle: '首页性能优化', action: '开始评审', userName: '王审查', createdAt: '2026-06-05T14:00:00Z', details: '王审查开始进行代码评审' },
  { id: '14', reviewId: '3', reviewTitle: '首页性能优化', action: '发现问题', userName: '王审查', createdAt: '2026-06-05T17:00:00Z', details: '发现 5 个性能优化问题' },
  { id: '15', reviewId: '3', reviewTitle: '首页性能优化', action: '修复问题', userName: '李四', createdAt: '2026-06-07T10:00:00Z', details: '优化了图片加载和列表渲染' },
  { id: '16', reviewId: '3', reviewTitle: '首页性能优化', action: '评审通过', userName: '王审查', createdAt: '2026-06-08T16:00:00Z', details: '性能提升明显，评审通过' },
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

export const useAppStore = create<AppState>((set, get) => ({
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

  addRule: (rule) =>
    set((state) => {
      const newRule: Rule = {
        ...rule,
        id: `rule-${generateId()}`,
        order: state.rules.length + 1,
      };
      return { rules: [...state.rules, newRule] };
    }),

  updateRule: (id, updates) =>
    set((state) => ({
      rules: state.rules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),

  deleteRule: (id) =>
    set((state) => {
      const filtered = state.rules.filter((r) => r.id !== id);
      return { rules: filtered.map((r, i) => ({ ...r, order: i + 1 })) };
    }),

  addIssueTemplate: (template) =>
    set((state) => {
      const newTemplate: IssueTemplate = {
        ...template,
        id: `template-${generateId()}`,
      };
      return { issueTemplates: [...state.issueTemplates, newTemplate] };
    }),

  updateIssueTemplate: (id, template) =>
    set((state) => ({
      issueTemplates: state.issueTemplates.map((t) =>
        t.id === id ? { ...t, ...template } : t
      ),
    })),

  deleteIssueTemplate: (id) =>
    set((state) => ({
      issueTemplates: state.issueTemplates.filter((t) => t.id !== id),
    })),

  toggleMandatoryCheck: (id) =>
    set((state) => ({
      mandatoryChecks: state.mandatoryChecks.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    })),

  addComment: (issueId, content, userId, userName) =>
    set((state) => {
      const now = new Date().toISOString();
      const issue = state.issues.find((i) => i.id === issueId);
      const reviewId = issue?.reviewId;

      const updatedIssues = state.issues.map((iss) =>
        iss.id === issueId
          ? {
              ...iss,
              comments: [
                ...iss.comments,
                {
                  id: `c${Date.now()}`,
                  issueId,
                  userId,
                  userName,
                  content,
                  createdAt: now,
                },
              ],
              updatedAt: now,
            }
          : iss
      );

      const updatedReviews = reviewId
        ? state.reviews.map((r) => (r.id === reviewId ? { ...r, updatedAt: now } : r))
        : state.reviews;

      const updatedCurrentReview =
        state.currentReview?.id === reviewId
          ? { ...state.currentReview, updatedAt: now }
          : state.currentReview;

      return {
        issues: updatedIssues,
        reviews: updatedReviews,
        currentReview: updatedCurrentReview,
      };
    }),

  assignIssue: (issueId, assignee) =>
    set((state) => {
      const now = new Date().toISOString();
      const issue = state.issues.find((i) => i.id === issueId);
      const reviewId = issue?.reviewId;

      const updatedIssues = state.issues.map((iss) =>
        iss.id === issueId ? { ...iss, assignee, updatedAt: now } : iss
      );

      const updatedReviews = reviewId
        ? state.reviews.map((r) => (r.id === reviewId ? { ...r, updatedAt: now } : r))
        : state.reviews;

      const updatedCurrentReview =
        state.currentReview?.id === reviewId
          ? { ...state.currentReview, updatedAt: now }
          : state.currentReview;

      return {
        issues: updatedIssues,
        reviews: updatedReviews,
        currentReview: updatedCurrentReview,
      };
    }),

  updateIssueStatus: (issueId, status) =>
    set((state) => {
      const now = new Date().toISOString();
      const issue = state.issues.find((i) => i.id === issueId);
      const reviewId = issue?.reviewId;

      const updatedIssues = state.issues.map((iss) =>
        iss.id === issueId
          ? { ...iss, status: status as Issue['status'], updatedAt: now }
          : iss
      );

      const updatedReviews = reviewId
        ? state.reviews.map((r) => (r.id === reviewId ? { ...r, updatedAt: now } : r))
        : state.reviews;

      const updatedCurrentReview =
        state.currentReview?.id === reviewId
          ? { ...state.currentReview, updatedAt: now }
          : state.currentReview;

      return {
        issues: updatedIssues,
        reviews: updatedReviews,
        currentReview: updatedCurrentReview,
      };
    }),

  fetchReview: (id) =>
    set((state) => {
      const review = state.reviews.find((r) => r.id === id) || null;
      return { currentReview: review };
    }),

  approveReview: (reviewId, comment) =>
    set((state) => {
      const now = new Date().toISOString();
      const review = state.reviews.find((r) => r.id === reviewId);
      const duration = review
        ? Math.round((new Date(now).getTime() - new Date(review.createdAt).getTime()) / (1000 * 60))
        : undefined;

      const updateReviewData = (r: Review): Review => ({
        ...r,
        status: 'approved',
        updatedAt: now,
        completedAt: now,
        duration,
        history: [
          ...(r.history || []),
          {
            id: `h${Date.now()}`,
            reviewId,
            action: 'approved',
            userId: 'u1',
            comment,
            createdAt: now,
          },
        ],
      });

      return {
        reviews: state.reviews.map((r) => (r.id === reviewId ? updateReviewData(r) : r)),
        currentReview: state.currentReview?.id === reviewId
          ? updateReviewData(state.currentReview)
          : state.currentReview,
        historyRecords: [
          {
            id: `hr${Date.now()}`,
            reviewId,
            reviewTitle: review?.title || '',
            action: '评审通过',
            userName: '技术负责人',
            createdAt: now,
            details: comment,
          },
          ...state.historyRecords,
        ],
      };
    }),

  rejectReview: (reviewId, comment) =>
    set((state) => {
      const now = new Date().toISOString();
      const review = state.reviews.find((r) => r.id === reviewId);
      const duration = review
        ? Math.round((new Date(now).getTime() - new Date(review.createdAt).getTime()) / (1000 * 60))
        : undefined;

      const updateReviewData = (r: Review): Review => ({
        ...r,
        status: 'rejected',
        updatedAt: now,
        completedAt: now,
        duration,
        history: [
          ...(r.history || []),
          {
            id: `h${Date.now()}`,
            reviewId,
            action: 'rejected',
            userId: 'u1',
            comment,
            createdAt: now,
          },
        ],
      });

      return {
        reviews: state.reviews.map((r) => (r.id === reviewId ? updateReviewData(r) : r)),
        currentReview: state.currentReview?.id === reviewId
          ? updateReviewData(state.currentReview)
          : state.currentReview,
        historyRecords: [
          {
            id: `hr${Date.now()}`,
            reviewId,
            reviewTitle: review?.title || '',
            action: '评审驳回',
            userName: '技术负责人',
            createdAt: now,
            details: comment,
          },
          ...state.historyRecords,
        ],
      };
    }),

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

  getReviewById: (id) => {
    return get().reviews.find((r) => r.id === id);
  },

  getIssuesByReviewId: (reviewId) => {
    return get().issues.filter((i) => i.reviewId === reviewId);
  },

  getReviewIssueCounts: (reviewId) => {
    const issues = get().issues.filter((i) => i.reviewId === reviewId);
    const counts = {
      total: issues.length,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    issues.forEach((issue) => {
      if (issue.severity === 'critical') counts.critical++;
      else if (issue.severity === 'high') counts.high++;
      else if (issue.severity === 'medium') counts.medium++;
      else if (issue.severity === 'low') counts.low++;
    });
    return counts;
  },

  getAverageReviewDuration: () => {
    const state = get();
    const completedReviews = state.reviews.filter(
      (r) => r.status === 'completed' || r.status === 'approved' || r.status === 'rejected'
    );
    if (completedReviews.length === 0) return 0;

    const totalMinutes = completedReviews.reduce((sum, review) => {
      const startTime = new Date(review.createdAt).getTime();
      const endTime = review.completedAt
        ? new Date(review.completedAt).getTime()
        : new Date(review.updatedAt).getTime();
      const durationMs = endTime - startTime;
      const durationMinutes = durationMs / (1000 * 60);
      return sum + durationMinutes;
    }, 0);

    return Math.round(totalMinutes / completedReviews.length);
  },

  getAverageReviewTime: () => {
    const state = get();
    const completedReviews = state.reviews.filter(
      (r) => r.status === 'completed' || r.status === 'approved' || r.status === 'rejected'
    );
    if (completedReviews.length === 0) return 0;

    const totalMinutes = completedReviews.reduce((sum, review) => {
      const startTime = new Date(review.createdAt).getTime();
      const endTime = new Date(review.updatedAt).getTime();
      const durationMs = endTime - startTime;
      const durationMinutes = durationMs / (1000 * 60);
      return sum + durationMinutes;
    }, 0);

    return Math.round(totalMinutes / completedReviews.length);
  },

  getAverageReviewTimeText: () => {
    const minutes = get().getAverageReviewDuration();
    return formatDuration(minutes);
  },

  getCompletedReviews: () => {
    return get().reviews.filter(
      (r) => r.status === 'completed' || r.status === 'approved' || r.status === 'rejected'
    );
  },
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
