
import { useState } from 'react';
import { 
  MoreHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Play,
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '../ui/StatusIndicator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface ClientType {
  id: string;
  name: string;
  status: 'connected' | 'warning' | 'error' | 'inactive';
  isSelected?: boolean;
}

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    clients: ClientType[];
    stats: {
      total: number;
      live: number;
      ready: number;
      connecting: number;
      down: number;
    };
  };
  onSelect?: (clientId: string) => void;
}

export function GroupCard({ group, onSelect }: GroupCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const toggleClientSelection = (id: string) => {
    setSelectedClients(prev => 
      prev.includes(id) 
        ? prev.filter(clientId => clientId !== id)
        : [...prev, id]
    );
    
    if (onSelect) {
      onSelect(id);
    }
  };

  const displayedClients = expanded 
    ? group.clients 
    : group.clients.slice(0, 3);
  
  const hasMoreClients = group.clients.length > 3;

  return (
    <Card className="shadow-sm border border-gray-200 rounded-xl">
      <CardHeader className="pb-4 pt-5 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{group.name}</CardTitle>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white shadow-md border border-gray-200 rounded-lg p-1">
                <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                  <Plus size={16} />
                  <span>Add Client</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                  <Edit size={16} />
                  <span>Edit Group</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 border-gray-200" />
                <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md">
                  <Trash2 size={16} />
                  <span>Delete Group</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-4 mt-4 px-2">
          <div className="text-center">
            <div className="text-sm font-medium">Total clients</div>
            <div className="text-sm mt-1.5">{group.stats.total}</div>
          </div>
          <div className="text-center">
            <StatusIndicator status="connected" label="Live" className="inline-flex justify-center" />
            <div className="text-sm mt-1.5">{group.stats.live}</div>
          </div>
          <div className="text-center">
            <StatusIndicator status="connected" label="Ready" className="inline-flex justify-center" />
            <div className="text-sm mt-1.5">{group.stats.ready}</div>
          </div>
          <div className="text-center">
            <StatusIndicator status="warning" label="Connecting" className="inline-flex justify-center" />
            <div className="text-sm mt-1.5">{group.stats.connecting}</div>
          </div>
          <div className="text-center">
            <StatusIndicator status="error" label="Down" className="inline-flex justify-center" />
            <div className="text-sm mt-1.5">{group.stats.down}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-4">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-[50px] py-3 px-4 text-left">
                <Checkbox 
                  id={`select-all-${group.id}`}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedClients(group.clients.map(c => c.id));
                    } else {
                      setSelectedClients([]);
                    }
                  }}
                  className="border-gray-300 rounded"
                />
              </TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
              <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</TableHead>
              <TableHead className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedClients.map(client => (
              <TableRow key={client.id} className="hover:bg-gray-50 border-b border-gray-100">
                <TableCell className="py-3 px-4">
                  <Checkbox 
                    id={`client-${client.id}`}
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => toggleClientSelection(client.id)}
                    className="border-gray-300 rounded"
                  />
                </TableCell>
                <TableCell className="py-3 px-4">
                  <StatusIndicator status={client.status} />
                </TableCell>
                <TableCell className="py-3 px-4 font-medium">{client.name}</TableCell>
                <TableCell className="py-3 px-4 text-gray-500 text-sm">{client.id}</TableCell>
                <TableCell className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary">
                      <Megaphone size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white shadow-md border border-gray-200 rounded-lg p-1">
                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                          <RefreshCw size={16} />
                          <span>Refresh content</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                          <Play size={16} />
                          <span>Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 border-gray-200" />
                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                          <AlertCircle size={16} />
                          <span>Check status</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {hasMoreClients && (
          <Button
            variant="ghost"
            className="w-full mt-4 text-primary hover:bg-gray-100 font-medium"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp size={16} className="mr-1.5" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1.5" />
                Show {group.clients.length - 3} more
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
