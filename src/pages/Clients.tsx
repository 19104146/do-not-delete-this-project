
import React, { useState } from 'react';
import { PlusCircle, Filter, Grid3X3, List, Search, BellRing, Trash2, CheckSquare, SquareSlash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client, Group } from '@/types/clientTypes';
import { GroupSection } from '@/components/clients/GroupSection';
import { ClientListItem } from '@/components/clients/ClientListItem';
import { ClientForm } from '@/components/clients/ClientForm';
import { GroupForm } from '@/components/clients/GroupForm';
import { AnnouncementForm } from '@/components/clients/AnnouncementForm';
import { ClientProvider, useClients } from '@/contexts/ClientContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from 'sonner';

const ClientsContent = () => {
  const { 
    clients, 
    groups, 
    addClient, 
    updateClient, 
    addGroup, 
    updateGroup,
    getClientsInGroup,
    selectedClients,
    selectedGroups,
    clearAllSelections,
    selectAllClients,
    getUngroupedClients,
    deleteClient
  } = useClients();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Form states
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [announcementFormOpen, setAnnouncementFormOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
  // Edit states
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [editingGroup, setEditingGroup] = useState<Group | undefined>();
  const [targetGroupId, setTargetGroupId] = useState<string | undefined>();
  const [targetClientId, setTargetClientId] = useState<string | undefined>();
  const [addToGroupId, setAddToGroupId] = useState<string | undefined>();
  
  // Filter clients based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUngroupedClients = getUngroupedClients().filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding/editing clients
  const handleAddClient = () => {
    setEditingClient(undefined);
    setAddToGroupId(undefined);
    setClientFormOpen(true);
  };
  
  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setClientFormOpen(true);
  };
  
  const handleSaveClient = (clientData: Omit<Client, 'id' | 'lastSeen'>) => {
    if (editingClient) {
      updateClient(editingClient.id, clientData);
    } else {
      addClient(clientData);
    }
  };
  
  // Handle adding/editing groups
  const handleAddGroup = () => {
    setEditingGroup(undefined);
    setGroupFormOpen(true);
  };
  
  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setGroupFormOpen(true);
  };
  
  const handleSaveGroup = (groupData: Omit<Group, 'id' | 'clients'>) => {
    if (editingGroup) {
      updateGroup(editingGroup.id, groupData);
    } else {
      addGroup(groupData);
    }
  };
  
  // Handle adding client to specific group
  const handleAddClientToGroup = (groupId: string) => {
    setAddToGroupId(groupId);
    setEditingClient(undefined);
    setClientFormOpen(true);
  };
  
  // Handle sending announcements
  const handleSendAnnouncement = (groupId?: string, clientId?: string) => {
    setTargetGroupId(groupId);
    setTargetClientId(clientId);
    setAnnouncementFormOpen(true);
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };
  
  const confirmBulkDelete = () => {
    // Delete selected clients
    for (const clientId of selectedClients) {
      deleteClient(clientId);
    }
    
    setBulkDeleteDialogOpen(false);
    clearAllSelections();
    
    toast.success(`Deleted ${selectedClients.length} clients`);
  };
  
  // Get total counts
  const totalClients = clients.length;
  const selectedCount = selectedClients.length + selectedGroups.length;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex gap-2">
          {selectedCount > 0 && (
            <>
              <Button variant="outline" onClick={clearAllSelections}>
                <SquareSlash size={16} className="mr-2" />
                Clear selection ({selectedCount})
              </Button>
              
              <Button variant="outline" onClick={() => handleSendAnnouncement()}>
                <BellRing size={16} className="mr-2" />
                Announce
              </Button>
              
              {selectedClients.length > 0 && (
                <Button variant="outline" className="text-destructive" onClick={handleBulkDelete}>
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              )}
            </>
          )}
          
          <Button onClick={handleAddClient}>
            <PlusCircle size={16} className="mr-2" />
            Add Client
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="search" 
            placeholder="Search clients and groups..." 
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter size={16} className="mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Clients</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-gray-500">Status</DropdownMenuLabel>
                <DropdownMenuItem>Connected</DropdownMenuItem>
                <DropdownMenuItem>Warning</DropdownMenuItem>
                <DropdownMenuItem>Error</DropdownMenuItem>
                <DropdownMenuItem>Inactive</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-gray-500">Groups</DropdownMenuLabel>
                {groups.map(group => (
                  <DropdownMenuItem key={group.id}>{group.name}</DropdownMenuItem>
                ))}
                <DropdownMenuItem>Ungrouped</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex rounded-md border overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              className="rounded-none border-0 px-3"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={18} />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              className="rounded-none border-0 px-3"
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={selectAllClients}
        >
          <CheckSquare size={16} className="mr-1" />
          Select all
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {selectedClients.length} of {totalClients} clients selected
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Groups</h2>
          <Button variant="outline" size="sm" onClick={handleAddGroup}>
            <PlusCircle size={14} className="mr-1" />
            Add Group
          </Button>
        </div>
        
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => (
            <GroupSection
              key={group.id}
              group={group}
              clients={getClientsInGroup(group.id)}
              onEditGroup={handleEditGroup}
              onEditClient={handleEditClient}
              onSendAnnouncement={handleSendAnnouncement}
              onAddClient={handleAddClientToGroup}
            />
          ))
        ) : (
          searchQuery ? (
            <div className="text-center py-8 text-muted-foreground">
              No groups found matching "{searchQuery}"
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No groups yet. Create a group to organize your clients.
            </div>
          )
        )}
      </div>
      
      {filteredUngroupedClients.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Ungrouped Clients</h2>
          <div className="space-y-3">
            {filteredUngroupedClients.map(client => (
              <ClientListItem
                key={client.id}
                client={client}
                onEdit={handleEditClient}
                onSendAnnouncement={(clientId) => handleSendAnnouncement(undefined, clientId)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Dialogs */}
      <ClientForm 
        client={editingClient}
        groupId={addToGroupId}
        open={clientFormOpen}
        onOpenChange={setClientFormOpen}
        onSave={handleSaveClient}
      />
      
      <GroupForm
        group={editingGroup}
        open={groupFormOpen}
        onOpenChange={setGroupFormOpen}
        onSave={handleSaveGroup}
      />
      
      <AnnouncementForm
        open={announcementFormOpen}
        onOpenChange={setAnnouncementFormOpen}
        targetGroupId={targetGroupId}
        targetClientId={targetClientId}
      />
      
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected clients?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {selectedClients.length} clients. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const Clients = () => {
  return (
    <ClientProvider>
      <ClientsContent />
    </ClientProvider>
  );
};

export default Clients;
