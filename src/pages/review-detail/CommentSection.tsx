import { useState } from 'react';
import { Send } from 'lucide-react';
import { useAppStore } from '@/store';
import { formatDateTime } from '@/utils';
import { Button, Input, Avatar } from '@/components';
import type { Comment } from '@/types';

interface CommentSectionProps {
  comments: Comment[];
  issueId: string;
}

export default function CommentSection({ comments, issueId }: CommentSectionProps) {
  const { addComment } = useAppStore();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(issueId, newComment.trim(), 'current-user', '当前用户');
    setNewComment('');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h4 className="font-medium text-dark-100">评论 ({comments.length})</h4>

      <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin">
        {comments.length === 0 ? (
          <p className="text-sm text-dark-500 text-center py-8">暂无评论</p>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id} className="flex gap-3 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <Avatar alt={comment.userName} size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-dark-100">
                    {comment.userName}
                  </span>
                  <span className="text-xs text-dark-500">
                    {formatDateTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-dark-300 bg-dark-800/50 rounded-lg p-3 border border-dark-700/50">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="添加评论..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-dark-800/50 border-dark-700/50 text-dark-100 placeholder:text-dark-500"
        />
        <Button
          type="submit"
          disabled={!newComment.trim()}
          className="bg-primary-500 hover:bg-primary-600 text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          发送
        </Button>
      </form>
    </div>
  );
}
