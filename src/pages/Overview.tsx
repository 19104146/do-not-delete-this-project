
import { Monitor } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';

const Overview = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Overview Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-9">
            Refresh Data
          </Button>
          <Button className="bg-primary hover:bg-primary/90 h-9">
            Quick Deploy
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 mb-6">
        <StatsCard 
          title="Total Clients" 
          value="45" 
          icon={Monitor}
          change={{ value: 8, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1">
        <RecentActivity />
      </div>
    </div>
  );
};

export default Overview;
