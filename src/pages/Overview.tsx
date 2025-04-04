
import { Monitor } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';

const Overview = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Overview Dashboard</h1>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="h-10 font-medium">
            Refresh Data
          </Button>
          <Button className="bg-primary hover:bg-primary/90 h-10 font-medium">
            Quick Deploy
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <StatsCard 
          title="Total Clients" 
          value="45" 
          icon={Monitor}
          change={{ value: 8, isPositive: true }}
          className="shadow-sm border border-gray-200"
        />
      </div>
      
      <div className="grid grid-cols-1">
        <RecentActivity />
      </div>
    </div>
  );
};

export default Overview;
