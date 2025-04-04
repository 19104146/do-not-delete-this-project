
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Layout, RefreshCw, FilePlus, Upload, User } from 'lucide-react';

// Mock data
const activities = [
  {
    id: 1,
    action: 'Client connected',
    subject: 'LB467',
    user: 'System',
    time: '5 minutes ago',
    icon: Monitor,
    iconColor: 'text-success bg-success/10'
  },
  {
    id: 2,
    action: 'Template updated',
    subject: 'Holiday Promotion',
    user: 'John Doe',
    time: '27 minutes ago',
    icon: Layout,
    iconColor: 'text-primary bg-primary/10'
  },
  {
    id: 3,
    action: 'Content refreshed',
    subject: 'MIDTERM 2025 group',
    user: 'System',
    time: '1 hour ago',
    icon: RefreshCw,
    iconColor: 'text-primary bg-primary/10'
  },
  {
    id: 4,
    action: 'New client added',
    subject: 'ComputerLab01',
    user: 'Sarah Kim',
    time: '3 hours ago',
    icon: FilePlus,
    iconColor: 'text-success bg-success/10'
  },
  {
    id: 5,
    action: 'Media uploaded',
    subject: 'campus-tour-video.mp4',
    user: 'Mike Chen',
    time: '5 hours ago',
    icon: Upload,
    iconColor: 'text-primary bg-primary/10'
  }
];

const RecentActivity = () => {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="pb-2 pt-5 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <Button variant="outline" size="sm" className="h-9 text-sm font-medium">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-1">
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${activity.iconColor}`}>
                <activity.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600 mt-0.5">{activity.subject}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <User size={12} />
                    <span>{activity.user}</span>
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
