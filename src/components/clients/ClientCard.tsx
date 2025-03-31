
import { useState } from 'react';
import { 
  MoreHorizontal, 
  RefreshCw, 
  Play, 
  AlertCircle, 
  Trash2,
  Edit
} from 'lucide-react';
import { StatusIndicator } from '../ui/StatusIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: {
    id: string;
    name: string;
    status: 'connected' | 'warning' | 'error' | 'inactive';
    isSelected?: boolean;
  };
  onSelect?: (id: string) => void;
}

export function ClientCard({ client, onSelect }: ClientCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card 
      className={cn(
        "relative border transition-all duration-200 cursor-pointer shadow-card overflow-hidden",
        isHovering ? "border-primary/50" : "border-gray-200",
        client.isSelected && "ring-2 ring-primary ring-offset-1"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onSelect?.(client.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <StatusIndicator status={client.status} size="sm" />
          
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
              <DropdownMenuItem className="flex items-center gap-2 text-error">
                <Trash2 size={14} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="text-sm font-medium truncate mb-1">{client.name}</div>
        <div className="text-xs text-gray-500">ID: {client.id}</div>
      </CardContent>
    </Card>
  );
}
