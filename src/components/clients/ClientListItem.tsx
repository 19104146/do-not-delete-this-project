
import React, { useState } from 'react';
import { Client } from '@/types/clientTypes';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Megaphone, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClients } from '@/contexts/ClientContext';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClientListItemProps {
  client: Client;
  onEdit: (client: Client) => void;
  onSendAnnouncement: (clientId: string) => void;
}

export const ClientListItem: React.FC<ClientListItemProps> = ({ 
  client, 
  onEdit,
  onSendAnnouncement 
}) => {
  const { selectClient, deleteClient } = useClients();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleSelectChange = (checked: boolean) => {
    selectClient(client.id, checked);
  };

  const handleDelete = () => {
    if (isConfirmingDelete) {
      deleteClient(client.id);
      setIsConfirmingDelete(false);
    } else {
      setIsConfirmingDelete(true);
    }
  };

  const handleCancel = () => {
    setIsConfirmingDelete(false);
  };

  const timeAgo = formatDistanceToNow(new Date(client.lastSeen), { addSuffix: true });

  return (
    <TooltipProvider>
      <Card className={cn(
        "border border-gray-200 transition-all duration-200 shadow-sm",
        client.selected ? "ring-2 ring-primary ring-offset-1" : ""
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Checkbox 
              checked={client.selected} 
              onCheckedChange={handleSelectChange}
              id={`client-${client.id}`}
              className="border-gray-300 rounded"
            />
            
            <StatusIndicator status={client.status} />
            
            <div className="flex-1">
              <div className="font-medium">{client.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">Last seen {timeAgo}</div>
            </div>
            
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-destructive font-medium">Confirm?</span>
                <Button size="sm" variant="destructive" onClick={handleDelete} className="h-8 px-3 font-medium">
                  Yes
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 px-3 font-medium">
                  No
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-primary"
                      onClick={() => onSendAnnouncement(client.id)}
                    >
                      <Megaphone size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send announcement</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-primary"
                      onClick={() => onEdit(client)}
                    >
                      <Edit size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit client</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-destructive"
                      onClick={handleDelete}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete client</p>
                  </TooltipContent>
                </Tooltip>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white shadow-md border border-gray-200 rounded-lg p-1">
                    <DropdownMenuItem onClick={() => onEdit(client)} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                      <Edit size={16} />
                      <span>Edit client</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => onSendAnnouncement(client.id)} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                      <Megaphone size={16} />
                      <span>Send announcement</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="my-1 border-gray-200" />
                    
                    <DropdownMenuItem 
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-gray-100 rounded-md"
                      onClick={handleDelete}
                    >
                      <Trash2 size={16} />
                      <span>Delete client</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
