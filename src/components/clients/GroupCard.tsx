
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
  AlertCircle
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
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{group.name}</CardTitle>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Plus size={14} />
                  <span>Add Client</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit size={14} />
                  <span>Edit Group</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-error">
                  <Trash2 size={14} />
                  <span>Delete Group</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-4 mt-3 px-2">
          <div className="text-center">
            <div className="text-sm font-medium">Total clients</div>
            <div className="text-sm mt-1">{group.stats.total}</div>
          </div>
          <div className="text-center">
            <StatusIndicator status="connected" label="Live" className="inline-flex justify-center" />
            <div className="text-sm mt-1">{group.stats.live}</div>
          </div>
          <div className="text-center">
            <StatusIndicator status="connected" label="Ready" className="inline-flex justify-center" />
            <div className="text-sm mt-1">{group.stats.ready}</div>
          </div>
          <div className="text-center">
            <StatusIndicator status="warning" label="Connecting" className="inline-flex justify-center" />
            <div className="text-sm mt-1">{group.stats.connecting}</div>
          </div>
          <div className="text-center">
            <StatusIndicator status="error" label="Down" className="inline-flex justify-center" />
            <div className="text-sm mt-1">{group.stats.down}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  id={`select-all-${group.id}`}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedClients(group.clients.map(c => c.id));
                    } else {
                      setSelectedClients([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedClients.map(client => (
              <TableRow key={client.id} className="hover:bg-muted/30">
                <TableCell>
                  <Checkbox 
                    id={`client-${client.id}`}
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => toggleClientSelection(client.id)}
                  />
                </TableCell>
                <TableCell>
                  <StatusIndicator status={client.status} />
                </TableCell>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{client.id}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <RefreshCw size={14} />
                          <span>Refresh content</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Play size={14} />
                          <span>Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit size={14} />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2">
                          <AlertCircle size={14} />
                          <span>Check status</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                          <Trash2 size={14} />
                          <span>Delete</span>
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
            className="w-full mt-4 text-primary"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Show {group.clients.length - 3} more
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
