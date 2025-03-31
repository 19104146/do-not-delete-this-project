
import React, { useState } from 'react';
import { Group, Client } from '@/types/clientTypes';
import { ClientListItem } from './ClientListItem';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  BellRing,
  Check
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClients } from '@/contexts/ClientContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GroupSectionProps {
  group: Group;
  clients: Client[];
  onEditGroup: (group: Group) => void;
  onEditClient: (client: Client) => void;
  onSendAnnouncement: (groupId: string, clientId?: string) => void;
  onAddClient: (groupId: string) => void;
}

export const GroupSection: React.FC<GroupSectionProps> = ({
  group,
  clients,
  onEditGroup,
  onEditClient,
  onSendAnnouncement,
  onAddClient
}) => {
  const { selectGroup, selectAllInGroup, deleteGroup } = useClients();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSelectGroup = (checked: boolean) => {
    if (checked) {
      selectGroup(group.id, checked);
      selectAllInGroup(group.id);
    } else {
      selectGroup(group.id, checked);
    }
  };

  const handleDeleteGroup = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteGroup(group.id);
    setShowDeleteConfirm(false);
  };

  const statusCounts = {
    connected: clients.filter(c => c.status === 'connected').length,
    warning: clients.filter(c => c.status === 'warning').length,
    error: clients.filter(c => c.status === 'error').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
  };

  return (
    <Card className="shadow-sm mb-4">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center">
          <Checkbox 
            checked={group.selected} 
            onCheckedChange={handleSelectGroup}
            id={`group-${group.id}`}
            className="mr-3"
          />
          
          <Button 
            variant="ghost" 
            className="p-1 mr-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
          
          <CardTitle className="text-base font-medium flex-1">{group.name}</CardTitle>
          
          <div className="flex items-center text-sm text-muted-foreground mr-2">
            {clients.length} clients
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onAddClient(group.id)}>
                <Plus size={16} className="mr-2" />
                Add client
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onEditGroup(group)}>
                <Edit size={16} className="mr-2" />
                Edit group
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onSendAnnouncement(group.id)}>
                <BellRing size={16} className="mr-2" />
                Send announcement
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleDeleteGroup}
              >
                <Trash2 size={16} className="mr-2" />
                Delete group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center mt-3 space-x-3 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-success mr-1"></div>
            <span>{statusCounts.connected} online</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-warning mr-1"></div>
            <span>{statusCounts.warning} warning</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-destructive mr-1"></div>
            <span>{statusCounts.error} error</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
            <span>{statusCounts.inactive} inactive</span>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-4 pt-0">
          <div className="space-y-3 mt-3">
            {clients.length > 0 ? (
              clients.map(client => (
                <ClientListItem 
                  key={client.id} 
                  client={client} 
                  onEdit={onEditClient}
                  onSendAnnouncement={(clientId) => onSendAnnouncement(group.id, clientId)}
                />
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No clients in this group.
              </div>
            )}
          </div>
        </CardContent>
      )}
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the group "{group.name}" and ungroup all its clients. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
