
import React, { useState } from 'react';
import { PlusCircle, Filter, Grid3X3, List, Search, BellRing, Trash2, CheckSquare, SquareSlash, UserPlus, ArrowUpDown, SlidersHorizontal, Loader2 } from 'lucide-react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from 'sonner';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIndicator } from '@/components/ui/StatusIndicator';

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
    deleteClient,
    deleteGroup,
    selectGroup,
    selectAllInGroup,
    selectClient // Make sure to include this function from the context
  } = useClients();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState('clients');
  const [sortField, setSortField] = useState<'name' | 'status' | 'lastSeen'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [announcementFormOpen, setAnnouncementFormOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleteGroupsDialogOpen, setBulkDeleteGroupsDialogOpen] = useState(false);
  
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [editingGroup, setEditingGroup] = useState<Group | undefined>();
  const [targetGroupId, setTargetGroupId] = useState<string | undefined>();
  const [targetClientId, setTargetClientId] = useState<string | undefined>();
  const [addToGroupId, setAddToGroupId] = useState<string | undefined>();
  
  const handleSort = (field: 'name' | 'status' | 'lastSeen') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedClients = [...clients].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === 'status') {
      return sortDirection === 'asc' 
        ? a.status.localeCompare(b.status) 
        : b.status.localeCompare(a.status);
    } else if (sortField === 'lastSeen') {
      const dateA = new Date(a.lastSeen).getTime();
      const dateB = new Date(b.lastSeen).getTime();
      return sortDirection === 'asc' 
        ? dateA - dateB 
        : dateB - dateA;
    }
    return 0;
  });
  
  const filteredClients = sortedClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.ip ? client.ip.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
    client.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUngroupedClients = getUngroupedClients().filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  
  const handleAddClientToGroup = (groupId: string) => {
    setAddToGroupId(groupId);
    setEditingClient(undefined);
    setClientFormOpen(true);
  };
  
  const handleSendAnnouncement = (groupId?: string, clientId?: string) => {
    setTargetGroupId(groupId);
    setTargetClientId(clientId);
    setAnnouncementFormOpen(true);
  };
  
  const handleBulkDeleteClients = () => {
    setBulkDeleteDialogOpen(true);
  };
  
  const confirmBulkDeleteClients = () => {
    setIsLoading(true);
    for (const clientId of selectedClients) {
      deleteClient(clientId);
    }
    
    setBulkDeleteDialogOpen(false);
    clearAllSelections();
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Deleted ${selectedClients.length} clients`);
    }, 500);
  };

  const handleBulkDeleteGroups = () => {
    setBulkDeleteGroupsDialogOpen(true);
  };
  
  const confirmBulkDeleteGroups = () => {
    setIsLoading(true);
    for (const groupId of selectedGroups) {
      deleteGroup(groupId);
    }
    
    setBulkDeleteGroupsDialogOpen(false);
    clearAllSelections();
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Deleted ${selectedGroups.length} groups`);
    }, 500);
  };
  
  const totalClients = clients.length;
  const totalGroups = groups.length;
  const selectedClientsCount = selectedClients.length;
  const selectedGroupsCount = selectedGroups.length;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clients Management</h1>
          <p className="text-muted-foreground">View and manage your digital signage clients</p>
        </div>
        
        <div className="flex items-center gap-2">
          {activeTab === 'clients' && selectedClientsCount > 0 && (
            <>
              <Button variant="outline" onClick={clearAllSelections} size="sm">
                <SquareSlash size={16} className="mr-2" />
                Clear ({selectedClientsCount})
              </Button>
              
              <Button variant="outline" onClick={() => handleSendAnnouncement()} size="sm">
                <BellRing size={16} className="mr-2" />
                Announce
              </Button>
              
              <Button variant="outline" className="text-destructive" onClick={handleBulkDeleteClients} size="sm">
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </>
          )}

          {activeTab === 'groups' && selectedGroupsCount > 0 && (
            <>
              <Button variant="outline" onClick={clearAllSelections} size="sm">
                <SquareSlash size={16} className="mr-2" />
                Clear ({selectedGroupsCount})
              </Button>
              
              <Button variant="outline" onClick={() => handleSendAnnouncement()} size="sm">
                <BellRing size={16} className="mr-2" />
                Announce
              </Button>
              
              <Button variant="outline" className="text-destructive" onClick={handleBulkDeleteGroups} size="sm">
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </>
          )}
          
          {activeTab === 'clients' && (
            <Button onClick={handleAddClient}>
              <PlusCircle size={16} className="mr-2" />
              Add Client
            </Button>
          )}

          {activeTab === 'groups' && (
            <Button onClick={handleAddGroup}>
              <UserPlus size={16} className="mr-2" />
              Add Group
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                    <SlidersHorizontal size={16} className="mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter Clients</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-gray-500">Status</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem checked>Connected</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Warning</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Error</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Inactive</DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-gray-500">Groups</DropdownMenuLabel>
                    {groups.map(group => (
                      <DropdownMenuCheckboxItem key={group.id} checked>{group.name}</DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuCheckboxItem checked>Ungrouped</DropdownMenuCheckboxItem>
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
        </CardHeader>
        
        <CardContent>
          <Tabs 
            defaultValue="clients" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="clients">All Clients ({totalClients})</TabsTrigger>
              <TabsTrigger value="groups">All Groups ({totalGroups})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clients" className="space-y-4">
              {selectedClientsCount === 0 && (
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
                    {selectedClientsCount} of {totalClients} clients selected
                  </div>
                </div>
              )}
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Select</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSort('name')} 
                          className="flex items-center p-0 h-auto font-medium"
                        >
                          Name
                          <ArrowUpDown size={14} className="ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSort('status')} 
                          className="flex items-center p-0 h-auto font-medium"
                        >
                          Status
                          <ArrowUpDown size={14} className="ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSort('lastSeen')} 
                          className="flex items-center p-0 h-auto font-medium"
                        >
                          Last Seen
                          <ArrowUpDown size={14} className="ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                            <p>Loading clients...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : paginatedClients.length > 0 ? (
                      paginatedClients.map((client) => (
                        <TableRow key={client.id} className="hover:bg-muted/30">
                          <TableCell>
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              checked={selectedClients.includes(client.id)}
                              onChange={(e) => selectClient(client.id, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-xs text-muted-foreground">{client.ip || 'No IP'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{client.location || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">{client.contact || 'No contact'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <StatusIndicator status={client.status} />
                              <span className="capitalize">{client.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {client.groupId ? (
                              <Badge variant="outline" className="capitalize">
                                {groups.find(g => g.id === client.groupId)?.name || 'Unknown'}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100">Ungrouped</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(client.lastSeen)}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)}>
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleSendAnnouncement(undefined, client.id)}>
                                Announce
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {searchQuery ? (
                            <>No clients found matching "{searchQuery}"</>
                          ) : (
                            <>No clients yet. Add a client to get started.</>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredClients.length > itemsPerPage && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <PaginationItem key={idx}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(totalPages)}
                            isActive={currentPage === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                <div>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredClients.length)} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} clients
                </div>
                <div className="flex items-center gap-2">
                  <span>Items per page:</span>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded px-2 py-1"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="groups" className="space-y-4">
              {selectedGroupsCount === 0 && groups.length > 0 && (
                <div className="flex gap-2 items-center mb-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary"
                    onClick={() => groups.forEach(group => selectGroup(group.id, true))}
                  >
                    <CheckSquare size={16} className="mr-1" />
                    Select all groups
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    {selectedGroupsCount} of {totalGroups} groups selected
                  </div>
                </div>
              )}
              
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
                <div className="text-center py-8 text-muted-foreground border rounded-md">
                  {searchQuery ? (
                    <>No groups found matching "{searchQuery}"</>
                  ) : (
                    <>No groups yet. Create a group to organize your clients.</>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
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
              You are about to delete {selectedClientsCount} clients. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDeleteClients} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteGroupsDialogOpen} onOpenChange={setBulkDeleteGroupsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected groups?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {selectedGroupsCount} groups. This action cannot be undone.
              Any clients in these groups will become ungrouped.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDeleteGroups} className="bg-destructive text-destructive-foreground">
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
