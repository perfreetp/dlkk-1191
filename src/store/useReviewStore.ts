import { create } from 'zustand';
import type { Review, ReviewFilters, Comment, ReviewHistory } from '../types';
import { mockReviews } from '../data/reviews';
import { useUserStore } from './useUserStore';

interface ReviewState {
  reviews: Review[];
  currentReview: Review | null;
  filters: ReviewFilters;
  loading: boolean;
  fetchReviews: () => Promise<void>;
  fetchReview: (reviewId: string) => Promise<void>;
  updateFilter: (filters: Partial<ReviewFilters>) => void;
  addComment: (reviewId: string, issueId: string, content: string) => void;
  assignIssue: (reviewId: string, issueId: string, userId: string) => void;
  approveReview: (reviewId: string, comment?: string) => void;
  rejectReview: (reviewId: string, comment?: string) => void;
  requestInfo: (reviewId: string, comment?: string) => void;
  getFilteredReviews: () => Review[];
  getReviewsByStatus: (status: string) => Review[];
  getIssueById: (reviewId: string, issueId: string) => ReturnType<typeof getIssue>;
}

function getIssue(review: Review, issueId: string) {
  return review.issues.find(i => i.id === issueId);
}

function addHistory(review: Review, action: string, comment?: string): Review {
  const currentUser = useUserStore.getState().getCurrentUser();
  const history: ReviewHistory = {
    id: `history-${Date.now()}`,
    reviewId: review.id,
    action,
    userId: currentUser?.id || 'unknown',
    comment,
    createdAt: new Date().toISOString(),
  };
  return {
    ...review,
    history: [...review.history, history],
    updatedAt: new Date().toISOString(),
  };
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  currentReview: null,
  filters: {},
  loading: false,
  fetchReviews: async () => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ reviews: mockReviews, loading: false });
  },
  fetchReview: async (reviewId: string) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    const review = get().reviews.find(r => r.id === reviewId) || mockReviews.find(r => r.id === reviewId);
    set({ currentReview: review || null, loading: false });
  },
  updateFilter: (filters: Partial<ReviewFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
    }));
  },
  addComment: (reviewId: string, issueId: string, content: string) => {
    const currentUser = useUserStore.getState().getCurrentUser();
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUser?.id || 'unknown',
      content,
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      reviews: state.reviews.map(review => {
        if (review.id !== reviewId) return review;
        return {
          ...review,
          issues: review.issues.map(issue => {
            if (issue.id !== issueId) return issue;
            return {
              ...issue,
              comments: [...issue.comments, newComment],
              updatedAt: new Date().toISOString(),
            };
          }),
          updatedAt: new Date().toISOString(),
        };
      }),
      currentReview: state.currentReview?.id === reviewId
        ? {
            ...state.currentReview,
            issues: state.currentReview.issues.map(issue => {
              if (issue.id !== issueId) return issue;
              return {
                ...issue,
                comments: [...issue.comments, newComment],
                updatedAt: new Date().toISOString(),
              };
            }),
            updatedAt: new Date().toISOString(),
          }
        : state.currentReview,
    }));
  },
  assignIssue: (reviewId: string, issueId: string, userId: string) => {
    set(state => ({
      reviews: state.reviews.map(review => {
        if (review.id !== reviewId) return review;
        return {
          ...review,
          issues: review.issues.map(issue => {
            if (issue.id !== issueId) return issue;
            return {
              ...issue,
              assigneeId: userId,
              status: 'in_progress',
              updatedAt: new Date().toISOString(),
            };
          }),
          updatedAt: new Date().toISOString(),
        };
      }),
      currentReview: state.currentReview?.id === reviewId
        ? {
            ...state.currentReview,
            issues: state.currentReview.issues.map(issue => {
              if (issue.id !== issueId) return issue;
              return {
                ...issue,
                assigneeId: userId,
                status: 'in_progress',
                updatedAt: new Date().toISOString(),
              };
            }),
            updatedAt: new Date().toISOString(),
          }
        : state.currentReview,
    }));
  },
  approveReview: (reviewId: string, comment?: string) => {
    set(state => {
      const updateReview = (review: Review): Review => {
        if (review.id !== reviewId) return review;
        const updated = addHistory(review, 'approved', comment);
        return {
          ...updated,
          status: 'approved',
          completedAt: new Date().toISOString(),
        };
      };
      return {
        reviews: state.reviews.map(updateReview),
        currentReview: state.currentReview?.id === reviewId
          ? updateReview(state.currentReview)
          : state.currentReview,
      };
    });
  },
  rejectReview: (reviewId: string, comment?: string) => {
    set(state => {
      const updateReview = (review: Review): Review => {
        if (review.id !== reviewId) return review;
        const updated = addHistory(review, 'rejected', comment);
        return {
          ...updated,
          status: 'rejected',
          completedAt: new Date().toISOString(),
        };
      };
      return {
        reviews: state.reviews.map(updateReview),
        currentReview: state.currentReview?.id === reviewId
          ? updateReview(state.currentReview)
          : state.currentReview,
      };
    });
  },
  requestInfo: (reviewId: string, comment?: string) => {
    set(state => {
      const updateReview = (review: Review): Review => {
        if (review.id !== reviewId) return review;
        const updated = addHistory(review, 'requested_info', comment);
        return {
          ...updated,
          status: 'info_requested',
        };
      };
      return {
        reviews: state.reviews.map(updateReview),
        currentReview: state.currentReview?.id === reviewId
          ? updateReview(state.currentReview)
          : state.currentReview,
      };
    });
  },
  getFilteredReviews: () => {
    const { reviews, filters } = get();
    return reviews.filter(review => {
      if (filters.status && review.status !== filters.status) return false;
      if (filters.severity && !review.issues.some(i => i.severity === filters.severity)) return false;
      if (filters.authorId && review.authorId !== filters.authorId) return false;
      if (filters.repositoryId && review.repositoryId !== filters.repositoryId) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchTitle = review.title.toLowerCase().includes(searchLower);
        const matchDesc = review.description.toLowerCase().includes(searchLower);
        const matchRepo = review.repository.name.toLowerCase().includes(searchLower);
        return matchTitle || matchDesc || matchRepo;
      }
      return true;
    });
  },
  getReviewsByStatus: (status: string) => {
    return get().reviews.filter(r => r.status === status);
  },
  getIssueById: (reviewId: string, issueId: string) => {
    const review = get().reviews.find(r => r.id === reviewId);
    if (!review) return undefined;
    return getIssue(review, issueId);
  },
}));
