
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { time: '00:00', uptime: 98, connections: 15, cpu: 22 },
  { time: '03:00', uptime: 99, connections: 16, cpu: 24 },
  { time: '06:00', uptime: 99, connections: 18, cpu: 28 },
  { time: '09:00', uptime: 100, connections: 20, cpu: 32 },
  { time: '12:00', uptime: 100, connections: 22, cpu: 38 },
  { time: '15:00', uptime: 100, connections: 21, cpu: 35 },
  { time: '18:00', uptime: 98, connections: 18, cpu: 30 },
  { time: '21:00', uptime: 99, connections: 16, cpu: 25 },
  { time: 'Now', uptime: 99, connections: 18, cpu: 27 },
];

const SystemHealthChart = () => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">System Health (Last 24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid #E5E7EB', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                }}
              />
              <Line
                type="monotone"
                dataKey="uptime"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="connections"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#FBBF24"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-8 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-sm">Uptime %</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-sm">Connections</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span className="text-sm">CPU Usage %</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthChart;
