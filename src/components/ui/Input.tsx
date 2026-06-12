import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/';

type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

interface BaseInputProps {
  label?: string;
  error?: string;
  multiline?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface InputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: InputType;
  multiline?: false;
}

interface TextareaProps extends BaseInputProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  multiline: true;
}

type InputComponentProps = InputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputComponentProps>(
  ({ className, label, error, leftIcon, rightIcon, multiline = false, ...props }, ref) => {
    const baseStyles = cn(
      'w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      'transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed',
      'placeholder:text-gray-400',
      error ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-400',
      leftIcon ? 'pl-10' : '',
      rightIcon ? 'pr-10' : ''
    );

    const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}
          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={id}
              className={cn(baseStyles, 'resize-y min-h-[100px]', className)}
              {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={id}
              className={cn(baseStyles, className)}
              {...(props as InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
