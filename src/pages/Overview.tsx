
import { Monitor, LayoutTemplate, AlertTriangle, ShieldCheck } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import SystemHealthChart from '@/components/dashboard/SystemHealthChart';
import ActiveAlerts from '@/components/dashboard/ActiveAlerts';
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
          <Button variant="outline" className="h-9">
            Export Report
          </Button>
          <Button className="bg-primary hover:bg-primary/90 h-9">
            Quick Deploy
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Total Clients" 
          value="45" 
          icon={Monitor}
          change={{ value: 8, isPositive: true }}
        />
        <StatsCard 
          title="Active Templates" 
          value="12" 
          icon={LayoutTemplate}
          change={{ value: 2, isPositive: true }}
        />
        <StatsCard 
          title="Active Alerts" 
          value="3" 
          icon={AlertTriangle}
          change={{ value: 1, isPositive: false }}
        />
        <StatsCard 
          title="System Uptime" 
          value="99.8%" 
          icon={ShieldCheck}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SystemHealthChart />
        </div>
        <div>
          <ActiveAlerts />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-full shadow-card">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-primary hover:bg-primary/90">
                Deploy to All Clients
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Check System Status
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Update Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Reboot Problem Clients
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Run Diagnostics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
