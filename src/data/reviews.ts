import type { Review, Repository, Branch, Issue, HighRiskFile, FunctionComplexity, ReviewHistory, RiskScore, Severity, IssueSeverity } from '../types';
import { mockUsers } from './users';
import { mockRules } from './rules';

const repositories: Repository[] = [
  {
    id: 'repo-1',
    name: 'frontend-app',
    fullName: 'company/frontend-app',
    url: 'https://github.com/company/frontend-app',
    language: 'TypeScript',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-06-10T00:00:00Z',
  },
  {
    id: 'repo-2',
    name: 'backend-api',
    fullName: 'company/backend-api',
    url: 'https://github.com/company/backend-api',
    language: 'TypeScript',
    createdAt: '2023-02-15T00:00:00Z',
    updatedAt: '2024-06-08T00:00:00Z',
  },
  {
    id: 'repo-3',
    name: 'mobile-app',
    fullName: 'company/mobile-app',
    url: 'https://github.com/company/mobile-app',
    language: 'TypeScript',
    createdAt: '2023-05-20T00:00:00Z',
    updatedAt: '2024-06-05T00:00:00Z',
  },
];

const branches: Branch[] = [
  { id: 'branch-1', name: 'feature/user-auth', commit: 'abc123def456', isProtected: false },
  { id: 'branch-2', name: 'feature/payment-integration', commit: 'def789ghi012', isProtected: false },
  { id: 'branch-3', name: 'feature/performance-optimization', commit: 'jkl345mno678', isProtected: false },
  { id: 'branch-4', name: 'feature/security-audit', commit: 'pqr901stu234', isProtected: false },
];

function createIssues(reviewId: string, count: number): Issue[] {
  const issues: Issue[] = [];
  const severities = ['critical', 'high', 'medium', 'low', 'info'] as const as IssueSeverity[];
  const statuses = ['open', 'fixed', 'ignored', 'in_progress'] as const;
  const files = [
    'src/auth/login.tsx',
    'src/utils/helpers.ts',
    'src/components/Form.tsx',
    'src/services/api.ts',
    'src/hooks/useData.ts',
    'src/lib/validation.ts',
    'src/pages/Dashboard.tsx',
    'src/store/index.ts',
  ];

  for (let i = 0; i < count; i++) {
    const severity = severities[i % severities.length];
    const rule = mockRules[i % mockRules.length];
    issues.push({
      id: `${reviewId}-issue-${i + 1}`,
      ruleId: rule.id,
      title: rule.name,
      description: rule.description,
      severity,
      status: statuses[i % statuses.length],
      file: files[i % files.length],
      line: Math.floor(Math.random() * 100) + 10,
      column: Math.floor(Math.random() * 80) + 1,
      code: `const data = fetch('/api/data')\n  .then(res => res.json())\n  .then(json => json.data)`,
      assigneeId: i % 2 === 0 ? mockUsers[i % mockUsers.length].id : undefined,
      comments: i % 3 === 0 ? [
        {
          id: `${reviewId}-comment-${i}-1`,
          userId: mockUsers[(i + 1) % mockUsers.length].id,
          content: '这个问题需要尽快修复，影响用户体验',
          createdAt: '2024-06-10T10:30:00Z',
        },
      ] : [],
      createdAt: '2024-06-09T14:00:00Z',
      updatedAt: '2024-06-10T16:00:00Z',
    });
  }
  return issues;
}

function createHighRiskFiles(reviewId: string, count: number): HighRiskFile[] {
  const paths = [
    'src/auth/LoginController.ts',
    'src/services/PaymentService.ts',
    'src/utils/SecurityUtils.ts',
    'src/components/DataTable.tsx',
    'src/hooks/useComplexData.ts',
    'src/lib/Calculator.ts',
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `${reviewId}-risk-file-${i + 1}`,
    path: paths[i % paths.length],
    riskScore: Math.floor(Math.random() * 40) + 60,
    issueCount: Math.floor(Math.random() * 5) + 2,
    criticalCount: Math.floor(Math.random() * 2),
    highCount: Math.floor(Math.random() * 3) + 1,
    lastModified: '2024-06-08T12:00:00Z',
  }));
}

function createFunctionComplexities(reviewId: string, count: number): FunctionComplexity[] {
  const severities = ['critical', 'high', 'medium', 'low', 'info'] as const as Severity[];
  const funcNames = [
    'validateUserInput',
    'processPayment',
    'generateReport',
    'calculateMetrics',
    'parseComplexData',
    'renderLargeList',
    'handleApiResponse',
    'transformDataStructure',
  ];
  const files = [
    'src/utils/validation.ts',
    'src/services/payment.ts',
    'src/utils/report.ts',
    'src/utils/metrics.ts',
    'src/utils/parser.ts',
    'src/components/List.tsx',
    'src/services/api.ts',
    'src/utils/transform.ts',
  ];
  return Array.from({ length: count }, (_, i) => {
    const prevComplexity = Math.floor(Math.random() * 10) + 5;
    const change = Math.floor(Math.random() * 10) - 3;
    return {
      id: `${reviewId}-complexity-${i + 1}`,
      functionName: funcNames[i % funcNames.length],
      file: files[i % files.length],
      complexity: Math.max(1, prevComplexity + change),
      previousComplexity: prevComplexity,
      change,
      riskLevel: severities[i % severities.length],
    };
  });
}

function createHistory(reviewId: string, count: number): ReviewHistory[] {
  const actions = ['created', 'started_review', 'commented', 'approved', 'rejected', 'requested_info'];
  return Array.from({ length: count }, (_, i) => ({
    id: `${reviewId}-history-${i + 1}`,
    reviewId,
    action: actions[i % actions.length],
    userId: mockUsers[i % mockUsers.length].id,
    comment: i % 2 === 0 ? '开始评审代码变更' : undefined,
    createdAt: `2024-06-${10 - i}T${10 + i}:00:00Z`,
  }));
}

function createRiskScore(): RiskScore {
  return {
    overall: Math.floor(Math.random() * 50) + 50,
    security: Math.floor(Math.random() * 50) + 50,
    maintainability: Math.floor(Math.random() * 50) + 50,
    performance: Math.floor(Math.random() * 50) + 50,
    readability: Math.floor(Math.random() * 50) + 50,
  };
}

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    title: '用户认证模块重构',
    description: '重构用户认证流程，支持OAuth2.0和多因素认证',
    repositoryId: 'repo-1',
    repository: repositories[0],
    branchId: 'branch-1',
    branch: branches[0],
    authorId: 'user-2',
    author: mockUsers[1],
    reviewerIds: ['user-1', 'user-6'],
    reviewers: [mockUsers[0], mockUsers[5]],
    status: 'reviewing',
    issues: createIssues('review-1', 8),
    riskScore: createRiskScore(),
    highRiskFiles: createHighRiskFiles('review-1', 4),
    functionComplexities: createFunctionComplexities('review-1', 6),
    history: createHistory('review-1', 3),
    createdAt: '2024-06-08T09:00:00Z',
    updatedAt: '2024-06-10T15:00:00Z',
  },
  {
    id: 'review-2',
    title: '支付系统集成',
    description: '集成第三方支付网关，支持微信、支付宝等多种支付方式',
    repositoryId: 'repo-2',
    repository: repositories[1],
    branchId: 'branch-2',
    branch: branches[1],
    authorId: 'user-3',
    author: mockUsers[2],
    reviewerIds: ['user-1', 'user-6'],
    reviewers: [mockUsers[0], mockUsers[5]],
    status: 'pending',
    issues: createIssues('review-2', 10),
    riskScore: createRiskScore(),
    highRiskFiles: createHighRiskFiles('review-2', 5),
    functionComplexities: createFunctionComplexities('review-2', 8),
    history: createHistory('review-2', 2),
    createdAt: '2024-06-09T10:00:00Z',
    updatedAt: '2024-06-09T10:00:00Z',
  },
  {
    id: 'review-3',
    title: '性能优化专项',
    description: '优化首页加载速度，减少包体积，提升用户体验',
    repositoryId: 'repo-1',
    repository: repositories[0],
    branchId: 'branch-3',
    branch: branches[2],
    authorId: 'user-4',
    author: mockUsers[3],
    reviewerIds: ['user-1', 'user-2'],
    reviewers: [mockUsers[0], mockUsers[1]],
    status: 'approved',
    issues: createIssues('review-3', 5),
    riskScore: createRiskScore(),
    highRiskFiles: createHighRiskFiles('review-3', 3),
    functionComplexities: createFunctionComplexities('review-3', 5),
    history: createHistory('review-3', 4),
    createdAt: '2024-06-05T14:00:00Z',
    updatedAt: '2024-06-08T17:00:00Z',
    completedAt: '2024-06-08T17:00:00Z',
  },
  {
    id: 'review-4',
    title: '安全审计修复',
    description: '修复安全审计中发现的漏洞，包括XSS、CSRF等问题',
    repositoryId: 'repo-3',
    repository: repositories[2],
    branchId: 'branch-4',
    branch: branches[3],
    authorId: 'user-5',
    author: mockUsers[4],
    reviewerIds: ['user-6', 'user-1'],
    reviewers: [mockUsers[5], mockUsers[0]],
    status: 'info_requested',
    issues: createIssues('review-4', 7),
    riskScore: createRiskScore(),
    highRiskFiles: createHighRiskFiles('review-4', 4),
    functionComplexities: createFunctionComplexities('review-4', 7),
    history: createHistory('review-4', 3),
    createdAt: '2024-06-07T11:00:00Z',
    updatedAt: '2024-06-10T09:00:00Z',
  },
];
