import { forwardRef, HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/';
import { TagVariant } from '@/types/';

interface TagProps extends HTMLAttributes<HTMLDivElement> {
  variant?: TagVariant;
  closable?: boolean;
  onClose?: () => void;
}

const Tag = forwardRef<HTMLDivElement, TagProps>(
  ({ className, variant = 'default', closable = false, onClose, children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800 border-gray-200',
      primary: 'bg-blue-50 text-blue-700 border-blue-200',
      success: 'bg-green-50 text-green-700 border-green-200',
      warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      danger: 'bg-red-50 text-red-700 border-red-200',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium border',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
        {closable && (
          <button
            type="button"
            onClick={onClose}
            className="ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
);

Tag.displayName = 'Tag';

export { Tag };
