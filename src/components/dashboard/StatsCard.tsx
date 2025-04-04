
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
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="px-6 py-5">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 tracking-wide">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            
            {change && (
              <div className="flex items-center mt-2.5">
                <span className={cn(
                  "text-sm font-medium",
                  change.isPositive ? "text-success" : "text-error"
                )}>
                  {change.isPositive ? '+' : ''}{change.value}%
                </span>
                <span className="text-xs text-gray-500 ml-1.5">vs last week</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-primary/10 text-primary">
            <Icon size={28} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
