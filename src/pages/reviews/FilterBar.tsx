import { Search, Filter, X } from 'lucide-react';
import { useAppStore, getStatusText } from '@/store';
import { Button, Input, Select } from '@/components';
import type { ReviewStatus } from '@/types';

const statusOptions: { value: ReviewStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'pending', label: getStatusText('pending') },
  { value: 'in_progress', label: getStatusText('in_progress') },
  { value: 'completed', label: getStatusText('completed') },
  { value: 'rejected', label: getStatusText('rejected') },
];

export default function FilterBar() {
  const { repositories, branches, reviewFilter, setReviewFilter } = useAppStore();

  const filteredBranches = branches.filter(
    (b) => !reviewFilter.repositoryId || b.repositoryId === reviewFilter.repositoryId
  );

  const handleReset = () => {
    setReviewFilter({
      repositoryId: undefined,
      branch: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      keyword: undefined,
    });
  };

  const hasActiveFilters =
    reviewFilter.repositoryId ||
    reviewFilter.branch ||
    reviewFilter.status ||
    reviewFilter.startDate ||
    reviewFilter.endDate ||
    reviewFilter.keyword;

  return (
    <div className="glass-card rounded-lg p-4 mb-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-dark-400" />
        <span className="font-medium text-dark-100">筛选条件</span>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="ml-auto">
            <X className="w-4 h-4 mr-1" />
            重置
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark-300">仓库</label>
          <Select
            value={reviewFilter.repositoryId || ''}
            onChange={(e) => setReviewFilter({ repositoryId: e.target.value || undefined })}
          >
            <option value="">全部仓库</option>
            {repositories.map((repo) => (
              <option key={repo.id} value={repo.id}>
                {repo.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark-300">分支</label>
          <Select
            value={reviewFilter.branch || ''}
            onChange={(e) => setReviewFilter({ branch: e.target.value || undefined })}
            disabled={!reviewFilter.repositoryId}
          >
            <option value="">全部分支</option>
            {filteredBranches.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark-300">状态</label>
          <Select
            value={reviewFilter.status || 'all'}
            onChange={(e) =>
              setReviewFilter({
                status: (e.target.value === 'all' ? undefined : e.target.value) as ReviewStatus | undefined,
              })
            }
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark-300">开始日期</label>
          <Input
            type="date"
            value={reviewFilter.startDate || ''}
            onChange={(e) => setReviewFilter({ startDate: e.target.value || undefined })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark-300">结束日期</label>
          <Input
            type="date"
            value={reviewFilter.endDate || ''}
            onChange={(e) => setReviewFilter({ endDate: e.target.value || undefined })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark-300">搜索</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <Input
              placeholder="标题、仓库、分支..."
              value={reviewFilter.keyword || ''}
              onChange={(e) => setReviewFilter({ keyword: e.target.value || undefined })}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
