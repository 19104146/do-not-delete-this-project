
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIndicator } from '../ui/StatusIndicator';
import { Button } from '@/components/ui/button';

// Mock data
const alerts = [
  {
    id: 1, 
    message: 'LB467 client disconnected unexpectedly', 
    deviceId: 'LB467', 
    time: '15 minutes ago',
    status: 'error'
  },
  {
    id: 2, 
    message: 'Low storage space on MIDTERM 2025 group', 
    deviceId: 'MIDTERM', 
    time: '45 minutes ago',
    status: 'warning'
  },
  {
    id: 3, 
    message: 'Template sync failed on ComputerLab01', 
    deviceId: 'ComputerLab01', 
    time: '1 hour ago',
    status: 'warning'
  }
];

const ActiveAlerts = () => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Active Alerts</CardTitle>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="divide-y divide-gray-100">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
              <StatusIndicator 
                status={alert.status as any} 
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900">{alert.message}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">{alert.deviceId}</span>
                  <span className="mx-1 text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveAlerts;
