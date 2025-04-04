
import { useState } from 'react';
import { 
  MoreHorizontal, 
  RefreshCw, 
  Play, 
  AlertCircle, 
  Trash2,
  Edit,
  Megaphone
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <Card 
        className={cn(
          "relative border border-gray-200 transition-all duration-200 cursor-pointer shadow-sm overflow-hidden",
          isHovering ? "border-primary/50" : "border-gray-200",
          client.isSelected && "ring-2 ring-primary ring-offset-1"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => onSelect?.(client.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <StatusIndicator status={client.status} size="sm" />
            
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-primary">
                    <Megaphone size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send announcement</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-primary">
                    <Edit size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit client</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-destructive">
                    <Trash2 size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete client</p>
                </TooltipContent>
              </Tooltip>
              
              <DropdownMenu>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500">
                      <MoreHorizontal size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white shadow-md border border-gray-200 rounded-lg p-1">
                  <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                    <RefreshCw size={14} />
                    <span>Refresh content</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                    <Play size={14} />
                    <span>Preview</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 border-gray-200" />
                  <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                    <AlertCircle size={14} />
                    <span>Check status</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="text-sm font-medium truncate mb-1">{client.name}</div>
          <div className="text-xs text-gray-500">ID: {client.id}</div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
