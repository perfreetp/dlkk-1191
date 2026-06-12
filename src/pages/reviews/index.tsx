import { Plus, ListTodo } from 'lucide-react';
import { useAppStore, getStatusText } from '@/store';
import { Button } from '@/components';
import { filterReviews } from '@/utils';
import FilterBar from './FilterBar';
import ReviewList from './ReviewList';

export default function ReviewsPage() {
  const { reviews, reviewFilter } = useAppStore();

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const inProgressCount = reviews.filter((r) => r.status === 'in_progress').length;
  const filteredReviews = filterReviews(reviews, reviewFilter);

  return (
    <div className="min-h-screen bg-dark-900/80 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-slide-up">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ListTodo className="w-8 h-8 text-primary-400" />
              <h1 className="text-2xl font-bold text-dark-100">待评审列表</h1>
            </div>
            <p className="text-dark-400">
              共有 <span className="font-semibold text-dark-100">{reviews.length}</span> 个评审，
              <span className="text-severity-warning font-semibold">{pendingCount}</span> 个{getStatusText('pending')}，
              <span className="text-primary-400 font-semibold">{inProgressCount}</span> 个{getStatusText('in_progress')}
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新建评审
          </Button>
        </div>

        <FilterBar />

        <div className="mb-4">
          <p className="text-sm text-dark-500">
            当前筛选条件下共{' '}
            <span className="font-semibold text-dark-100">
              {filteredReviews.length}
            </span>{' '}
            条记录
          </p>
        </div>

        <ReviewList />
      </div>
    </div>
  );
}
