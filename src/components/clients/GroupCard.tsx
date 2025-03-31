
import { useState } from 'react';
import { 
  MoreHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '../ui/StatusIndicator';
import { ClientCard } from './ClientCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}

export function GroupCard({ group }: GroupCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const toggleClientSelection = (id: string) => {
    setSelectedClients(prev => 
      prev.includes(id) 
        ? prev.filter(clientId => clientId !== id)
        : [...prev, id]
    );
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {displayedClients.map(client => (
            <ClientCard 
              key={client.id} 
              client={{
                ...client,
                isSelected: selectedClients.includes(client.id)
              }}
              onSelect={toggleClientSelection}
            />
          ))}
        </div>
        
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
