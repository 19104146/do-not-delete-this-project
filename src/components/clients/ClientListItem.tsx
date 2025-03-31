
import React, { useState } from 'react';
import { Client } from '@/types/clientTypes';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, BellRing, MoreHorizontal } from 'lucide-react';
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
    <Card className={cn(
      "border transition-all duration-200 shadow-sm",
      client.selected ? "ring-2 ring-primary ring-offset-1" : ""
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={client.selected} 
            onCheckedChange={handleSelectChange}
            id={`client-${client.id}`}
          />
          
          <StatusIndicator status={client.status} />
          
          <div className="flex-1">
            <div className="font-medium">{client.name}</div>
            <div className="text-xs text-muted-foreground">Last seen {timeAgo}</div>
          </div>
          
          {isConfirmingDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-destructive">Confirm?</span>
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                Yes
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                No
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(client)}>
                  <Edit size={16} className="mr-2" />
                  Edit client
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onSendAnnouncement(client.id)}>
                  <BellRing size={16} className="mr-2" />
                  Send announcement
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete client
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
