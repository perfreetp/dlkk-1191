import { HTMLAttributes } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/utils';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export function Avatar({ src, alt = '', size = 'md', className, ...props }: AvatarProps) {
  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium overflow-hidden',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User className="w-5 h-5" />
      )}
    </div>
  );
}
