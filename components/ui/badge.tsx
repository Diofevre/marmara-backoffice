import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning';
}

export const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          {
            'bg-blue-100 text-blue-800': variant === 'default',
            'bg-gray-100 text-gray-800': variant === 'secondary',
            'bg-green-100 text-green-800': variant === 'success',
            'bg-yellow-100 text-yellow-800': variant === 'warning',
          }
        )
      )}
    >
      {children}
    </span>
  );
};