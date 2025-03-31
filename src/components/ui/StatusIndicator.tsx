
import { cn } from '@/lib/utils';

type StatusType = 'connected' | 'warning' | 'error' | 'inactive';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusIndicator({ 
  status, 
  label, 
  size = 'md',
  className 
}: StatusIndicatorProps) {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'connected': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      case 'inactive': return 'bg-inactive';
      default: return 'bg-inactive';
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span 
        className={cn(
          "rounded-full",
          getStatusColor(status),
          size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
        )}
        aria-hidden="true"
      />
      {label && (
        <span className={cn(
          "text-gray-700",
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          {label}
        </span>
      )}
    </div>
  );
}
