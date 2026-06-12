import { useState, useEffect } from 'react';
import { ArrowLeft, GitBranch, Users, Clock, AlertTriangle, AlertCircle, Minus, FileText, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore, getStatusText } from '@/store';
import { useReviewStore } from '@/store/useReviewStore';
import { formatDateTime, cn } from '@/utils';
import { Card, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Empty, Button, Dialog, DialogHeader, DialogContent, DialogFooter } from '@/components';
import IssuesTab from './IssuesTab';
import RiskTab from './RiskTab';
import IssueDetail from './IssueDetail';
import type { Issue, IssueSeverity } from '@/types';

const severityToTheme: Record<IssueSeverity, string> = {
  critical: 'blocker',
  high: 'critical',
  medium: 'warning',
  low: 'info',
  info: 'info',
};

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reviews, issues, setCurrentReview, currentReview } = useAppStore();
  const { fetchReview, approveReview, rejectReview, requestInfo, loading } = useReviewStore();
  const [activeTab, setActiveTab] = useState('issues');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [actionModal, setActionModal] = useState<{ type: 'approve' | 'reject' | 'requestInfo'; open: boolean }>({ type: 'approve', open: false });
  const [actionComment, setActionComment] = useState('');

  const review = reviews.find((r) => r.id === id) || currentReview;
  const reviewIssues = issues.filter((issue) => issue.reviewId === (id || review?.id));

  useEffect(() => {
    if (id) {
      fetchReview(id);
    }
  }, [id, fetchReview]);

  useEffect(() => {
    if (review && !currentReview) {
      setCurrentReview(review);
    }
  }, [review, currentReview, setCurrentReview]);

  const handleAction = () => {
    if (!id) return;
    const comment = actionComment.trim() || undefined;
    switch (actionModal.type) {
      case 'approve':
        approveReview(id, comment);
        break;
      case 'reject':
        rejectReview(id, comment);
        break;
      case 'requestInfo':
        requestInfo(id, comment);
        break;
    }
    setActionModal({ ...actionModal, open: false });
    setActionComment('');
  };

  const openActionModal = (type: 'approve' | 'reject' | 'requestInfo') => {
    setActionModal({ type, open: true });
    setActionComment('');
  };

  if (!review && !loading) {
    return (
      <div className="min-h-screen bg-dark-950 p-6">
        <Card className="glass-card p-12">
          <Empty />
        </Card>
      </div>
    );
  }

  const currentIssue = selectedIssue || reviewIssues[0] || null;

  return (
    <div className="min-h-screen bg-dark-950 animate-fade-in">
      <div className="bg-dark-900/80 border-b border-dark-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-dark-400 hover:text-dark-100 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回评审列表
          </button>

          <div className="flex items-start justify-between animate-slide-up">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-dark-100">{review?.title}</h1>
                <Badge className="bg-primary-500/20 text-primary-400 border border-primary-500/30">
                  {getStatusText(review?.status || '')}
                </Badge>
              </div>
              {review?.description && (
                <p className="text-dark-300 mb-4">{review.description}</p>
              )}
              <div className="flex items-center gap-6 text-sm text-dark-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="font-mono text-xs bg-dark-800/50 px-2 py-1 rounded border border-dark-700/50">
                    {review?.repositoryName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  <span className="font-mono">{typeof review?.branch === 'string' ? review.branch : review?.branch?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{review?.reviewerCount} 位评审人</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>创建于 {review?.createdAt ? formatDateTime(review.createdAt) : ''}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => openActionModal('requestInfo')}
                className="border-dark-700/50 text-dark-300 hover:bg-dark-800/50 hover:text-dark-100"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                要求补充
              </Button>
              <Button
                variant="outline"
                onClick={() => openActionModal('reject')}
                className="border-severity-blocker/50 text-severity-blocker hover:bg-severity-blocker/20"
              >
                <XCircle className="w-4 h-4 mr-2" />
                驳回评审
              </Button>
              <Button
                onClick={() => openActionModal('approve')}
                className="bg-severity-info hover:bg-severity-info/80 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                通过评审
              </Button>
            </div>
          </div>

          {review && review.issueCount !== undefined && review.issueCount > 0 && (
            <div className="flex items-center gap-6 mt-6 p-4 glass-card rounded-lg animate-slide-up">
              {review.criticalIssueCount !== undefined && review.criticalIssueCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-severity-blocker" />
                  <span className="text-lg font-bold text-severity-blocker">
                    {review.criticalIssueCount}
                  </span>
                  <span className="text-sm text-dark-400">严重</span>
                </div>
              )}
              {review.highIssueCount !== undefined && review.highIssueCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-severity-critical" />
                  <span className="text-lg font-bold text-severity-critical">
                    {review.highIssueCount}
                  </span>
                  <span className="text-sm text-dark-400">高危</span>
                </div>
              )}
              {review.mediumIssueCount !== undefined && review.mediumIssueCount > 0 && (
                <div className="flex items-center gap-2">
                  <Minus className="w-5 h-5 text-severity-warning" />
                  <span className="text-lg font-bold text-severity-warning">
                    {review.mediumIssueCount}
                  </span>
                  <span className="text-sm text-dark-400">中等</span>
                </div>
              )}
              {review.lowIssueCount !== undefined && review.lowIssueCount > 0 && (
                <div className="flex items-center gap-2">
                  <Minus className="w-5 h-5 text-severity-info" />
                  <span className="text-lg font-bold text-severity-info">
                    {review.lowIssueCount}
                  </span>
                  <span className="text-sm text-dark-400">低</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass-card">
            <TabsTrigger value="issues">问题列表 ({reviewIssues.length})</TabsTrigger>
            <TabsTrigger value="risk">风险分析</TabsTrigger>
          </TabsList>

          <div className="flex gap-6 mt-6">
            <div className="flex-1">
              <TabsContent value="issues">
                <IssuesTab
                  reviewId={id || review?.id || ''}
                  onSelectIssue={setSelectedIssue}
                  selectedIssueId={selectedIssue?.id}
                />
              </TabsContent>
              <TabsContent value="risk">
                <RiskTab reviewId={id || review?.id || ''} />
              </TabsContent>
            </div>

            {activeTab === 'issues' && currentIssue && (
              <div className="w-[480px] flex-shrink-0">
                <div className="sticky top-6">
                  <Card className="glass-card h-[calc(100vh-240px)] overflow-hidden animate-fade-in">
                    <IssueDetail
                      issue={currentIssue}
                      onClose={() => setSelectedIssue(null)}
                    />
                  </Card>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </div>

      <Dialog open={actionModal.open} onClose={() => setActionModal({ ...actionModal, open: false })}>
        <DialogHeader
          title={
            actionModal.type === 'approve' ? '通过评审' :
            actionModal.type === 'reject' ? '驳回评审' : '要求补充说明'
          }
          onClose={() => setActionModal({ ...actionModal, open: false })}
        />
        <DialogContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                {actionModal.type === 'approve' ? '通过理由（可选）' :
                 actionModal.type === 'reject' ? '驳回理由' : '补充说明要求'}
              </label>
              <textarea
                placeholder={
                  actionModal.type === 'approve' ? '请输入通过理由...' :
                  actionModal.type === 'reject' ? '请输入驳回理由...' : '请输入需要补充的内容...'
                }
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                className="min-h-[120px] w-full rounded-md border border-dark-700/50 bg-dark-800/50 px-3 py-2 text-sm text-dark-100 placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
            {actionModal.type !== 'approve' && (
              <div className={cn(
                "rounded-lg p-3 border",
                actionModal.type === 'reject'
                  ? "bg-severity-blocker/10 border-severity-blocker/30"
                  : "bg-primary-500/10 border-primary-500/30"
              )}>
                <div className="flex items-start gap-2">
                  {actionModal.type === 'reject' ? (
                    <XCircle className="w-5 h-5 text-severity-blocker flex-shrink-0 mt-0.5" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      actionModal.type === 'reject' ? "text-severity-blocker" : "text-primary-400"
                    )}>提示</p>
                    <p className="text-sm text-dark-300 mt-1">
                      {actionModal.type === 'reject'
                        ? '驳回后，提交者需要根据理由修改后重新提交评审。'
                        : '要求补充后，提交者需要提供更多信息才能继续评审。'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setActionModal({ ...actionModal, open: false })}
            className="border-dark-700/50 text-dark-300 hover:bg-dark-800/50"
          >
            取消
          </Button>
          <Button
            onClick={handleAction}
            disabled={actionModal.type !== 'approve' && !actionComment.trim()}
            className={cn(
              actionModal.type === 'approve' && "bg-severity-info hover:bg-severity-info/80 text-white",
              actionModal.type === 'reject' && "bg-severity-blocker hover:bg-severity-blocker/80 text-white",
              actionModal.type === 'requestInfo' && "bg-primary-500 hover:bg-primary-600 text-white"
            )}
          >
            {actionModal.type === 'approve' ? '确认通过' :
             actionModal.type === 'reject' ? '确认驳回' : '确认发送'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
