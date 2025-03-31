
import { Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { StatusIndicator } from '@/components/ui/StatusIndicator';

// Mock data
const logs = [
  { id: '1', timestamp: '2023-05-15 14:23:45', level: 'info', message: 'Client LB467 connected', source: 'System' },
  { id: '2', timestamp: '2023-05-15 14:22:30', level: 'warning', message: 'Template sync delayed for ComputerLab01', source: 'ContentManager' },
  { id: '3', timestamp: '2023-05-15 14:20:12', level: 'error', message: 'Failed to connect to client ABCDEFGHIJKL', source: 'ConnectionService' },
  { id: '4', timestamp: '2023-05-15 14:18:45', level: 'info', message: 'User john.doe@example.com logged in', source: 'AuthService' },
  { id: '5', timestamp: '2023-05-15 14:15:22', level: 'info', message: 'New template "Campus Tour" created', source: 'TemplateService' },
  { id: '6', timestamp: '2023-05-15 14:10:18', level: 'warning', message: 'Low storage on LB44X Monitors group', source: 'StorageMonitor' },
  { id: '7', timestamp: '2023-05-15 14:08:33', level: 'info', message: 'Scheduled content refresh started', source: 'Scheduler' },
  { id: '8', timestamp: '2023-05-15 14:05:11', level: 'error', message: 'Database connection timeout', source: 'DatabaseService' },
  { id: '9', timestamp: '2023-05-15 14:02:59', level: 'info', message: 'System backup completed successfully', source: 'BackupService' },
  { id: '10', timestamp: '2023-05-15 14:00:00', level: 'info', message: 'Daily maintenance started', source: 'System' },
];

const getLevelStatus = (level: string) => {
  switch (level) {
    case 'error': return 'error';
    case 'warning': return 'warning';
    case 'info': return 'connected';
    default: return 'inactive';
  }
};

const Logs = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <Button variant="outline" className="flex items-center">
          <Download size={16} className="mr-2" />
          Export Logs
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="search" 
            placeholder="Search logs..." 
            className="pl-10 w-full"
          />
        </div>
        
        <Button variant="outline" className="flex items-center">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="border rounded-lg shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[100px]">Level</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-[150px]">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(log => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                <TableCell>
                  <StatusIndicator 
                    status={getLevelStatus(log.level) as any}
                    label={log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                    size="sm"
                  />
                </TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell className="text-gray-500">{log.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing 10 of 1,024 logs
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Logs;
