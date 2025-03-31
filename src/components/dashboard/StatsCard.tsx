
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  className
}: StatsCardProps) {
  return (
    <Card className={cn("shadow-card", className)}>
      <CardContent className="px-6 py-5">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            
            {change && (
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-sm",
                  change.isPositive ? "text-success" : "text-error"
                )}>
                  {change.isPositive ? '+' : ''}{change.value}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last week</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary">
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
