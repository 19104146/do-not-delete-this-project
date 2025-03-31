
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Group, ClientStatus } from '@/types/clientTypes';
import { toast } from 'sonner';

interface ClientContextType {
  clients: Client[];
  groups: Group[];
  selectedClients: string[];
  selectedGroups: string[];
  
  // Client operations
  addClient: (client: Omit<Client, 'id' | 'lastSeen'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  selectClient: (id: string, selected: boolean) => void;
  
  // Group operations
  addGroup: (group: Omit<Group, 'id' | 'clients'>) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  selectGroup: (id: string, selected: boolean) => void;
  addClientToGroup: (clientId: string, groupId: string) => void;
  removeClientFromGroup: (clientId: string, groupId: string) => void;
  
  // Selection operations
  clearAllSelections: () => void;
  selectAllClients: () => void;
  selectAllInGroup: (groupId: string) => void;
  
  // Filtering
  filterClients: (query: string) => Client[];
  filterGroups: (query: string) => Group[];
  
  // Get operations
  getClient: (id: string) => Client | undefined;
  getGroup: (id: string) => Group | undefined;
  getClientsInGroup: (groupId: string) => Client[];
  getGroupedClients: () => { [groupId: string]: Client[] };
  getUngroupedClients: () => Client[];
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Mock data
const initialClients: Client[] = [
  { id: '1', name: 'LB467-1', status: 'connected', lastSeen: new Date(), groupId: '1' },
  { id: '2', name: 'LB467-2', status: 'connected', lastSeen: new Date(), groupId: '1' },
  { id: '3', name: 'LB467-3', status: 'error', lastSeen: new Date(Date.now() - 600000), groupId: '1' },
  { id: '4', name: 'LB467-4', status: 'connected', lastSeen: new Date(), groupId: '1' },
  { id: '5', name: 'LB467-5', status: 'warning', lastSeen: new Date(), groupId: '1' },
  { id: '6', name: 'LB467-6', status: 'connected', lastSeen: new Date(), groupId: '2' },
  { id: '7', name: 'LB467-7', status: 'connected', lastSeen: new Date(), groupId: '2' },
  { id: '8', name: 'LB467-8', status: 'warning', lastSeen: new Date(Date.now() - 300000), groupId: '2' },
  { id: '9', name: 'LB467-9', status: 'connected', lastSeen: new Date(), groupId: '2' },
  { id: '10', name: 'LB467-10', status: 'connected', lastSeen: new Date(), groupId: '2' },
  { id: '11', name: 'LB467-11', status: 'connected', lastSeen: new Date(), groupId: '3' },
  { id: '12', name: 'LB467-12', status: 'connected', lastSeen: new Date(), groupId: '3' },
  { id: '13', name: 'ComputerLab01', status: 'inactive', lastSeen: new Date(Date.now() - 86400000), groupId: '3' },
  { id: '14', name: 'LB467-14', status: 'connected', lastSeen: new Date(), groupId: '3' },
  { id: '15', name: 'LB467-15', status: 'connected', lastSeen: new Date(), groupId: '3' },
  { id: '16', name: '12345678901', status: 'connected', lastSeen: new Date() },
  { id: '17', name: 'ABCDEF', status: 'warning', lastSeen: new Date(Date.now() - 3600000) },
  { id: '18', name: 'GHIJKL', status: 'error', lastSeen: new Date(Date.now() - 7200000) },
];

const initialGroups: Group[] = [
  { id: '1', name: 'MIDTERM 2025', clients: [] },
  { id: '2', name: 'LB44X Monitors', clients: [] },
  { id: '3', name: 'LB46X Monitors', clients: [] },
];

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // Initialize group clients
  useEffect(() => {
    const updatedGroups = groups.map(group => {
      return {
        ...group,
        clients: clients.filter(client => client.groupId === group.id)
      };
    });
    setGroups(updatedGroups);
  }, []);

  // Client operations
  const addClient = (client: Omit<Client, 'id' | 'lastSeen'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      lastSeen: new Date(),
    };

    setClients(prev => [...prev, newClient]);
    toast.success(`Client "${newClient.name}" added successfully`);
    
    // Add to group if groupId is specified
    if (newClient.groupId) {
      setGroups(prev => prev.map(group => 
        group.id === newClient.groupId 
          ? { ...group, clients: [...group.clients, newClient] } 
          : group
      ));
    }
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => 
      prev.map(client => 
        client.id === id ? { ...client, ...updates } : client
      )
    );
    
    // Update in groups too
    setGroups(prev => 
      prev.map(group => ({
        ...group,
        clients: group.clients.map(client => 
          client.id === id ? { ...client, ...updates } : client
        )
      }))
    );
    
    toast.success(`Client updated successfully`);
  };

  const deleteClient = (id: string) => {
    const clientToDelete = clients.find(c => c.id === id);
    if (!clientToDelete) return;
    
    setClients(prev => prev.filter(client => client.id !== id));
    
    // Remove from groups
    setGroups(prev => 
      prev.map(group => ({
        ...group,
        clients: group.clients.filter(client => client.id !== id)
      }))
    );
    
    // Remove from selections
    setSelectedClients(prev => prev.filter(clientId => clientId !== id));
    
    toast.success(`Client "${clientToDelete.name}" deleted successfully`);
  };

  const selectClient = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedClients(prev => [...prev, id]);
    } else {
      setSelectedClients(prev => prev.filter(clientId => clientId !== id));
    }
    
    setClients(prev => 
      prev.map(client => 
        client.id === id ? { ...client, selected } : client
      )
    );
  };

  // Group operations
  const addGroup = (group: Omit<Group, 'id' | 'clients'>) => {
    const newGroup: Group = {
      ...group,
      id: Date.now().toString(),
      clients: [],
    };
    
    setGroups(prev => [...prev, newGroup]);
    toast.success(`Group "${newGroup.name}" created successfully`);
  };

  const updateGroup = (id: string, updates: Partial<Group>) => {
    setGroups(prev => 
      prev.map(group => 
        group.id === id ? { ...group, ...updates } : group
      )
    );
    
    toast.success(`Group updated successfully`);
  };

  const deleteGroup = (id: string) => {
    const groupToDelete = groups.find(g => g.id === id);
    if (!groupToDelete) return;
    
    // Unassign clients from this group
    setClients(prev => 
      prev.map(client => 
        client.groupId === id ? { ...client, groupId: undefined } : client
      )
    );
    
    // Remove group
    setGroups(prev => prev.filter(group => group.id !== id));
    
    // Remove from selections
    setSelectedGroups(prev => prev.filter(groupId => groupId !== id));
    
    toast.success(`Group "${groupToDelete.name}" deleted successfully`);
  };

  const selectGroup = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedGroups(prev => [...prev, id]);
    } else {
      setSelectedGroups(prev => prev.filter(groupId => groupId !== id));
    }
    
    setGroups(prev => 
      prev.map(group => 
        group.id === id ? { ...group, selected } : group
      )
    );
  };

  const addClientToGroup = (clientId: string, groupId: string) => {
    // Update client's groupId
    setClients(prev => 
      prev.map(client => 
        client.id === clientId ? { ...client, groupId } : client
      )
    );
    
    // Add client to group's clients array
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    setGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, clients: [...group.clients, client] } 
          : group
      )
    );
    
    toast.success(`Client added to group successfully`);
  };

  const removeClientFromGroup = (clientId: string, groupId: string) => {
    // Remove groupId from client
    setClients(prev => 
      prev.map(client => 
        client.id === clientId ? { ...client, groupId: undefined } : client
      )
    );
    
    // Remove client from group's clients array
    setGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, clients: group.clients.filter(client => client.id !== clientId) } 
          : group
      )
    );
    
    toast.success(`Client removed from group successfully`);
  };

  // Selection operations
  const clearAllSelections = () => {
    setSelectedClients([]);
    setSelectedGroups([]);
    
    setClients(prev => prev.map(client => ({ ...client, selected: false })));
    setGroups(prev => prev.map(group => ({ ...group, selected: false })));
  };

  const selectAllClients = () => {
    const allClientIds = clients.map(client => client.id);
    setSelectedClients(allClientIds);
    
    setClients(prev => prev.map(client => ({ ...client, selected: true })));
  };

  const selectAllInGroup = (groupId: string) => {
    const groupClients = clients.filter(client => client.groupId === groupId);
    const groupClientIds = groupClients.map(client => client.id);
    
    setSelectedClients(prev => {
      const currentSelected = [...prev];
      groupClientIds.forEach(id => {
        if (!currentSelected.includes(id)) {
          currentSelected.push(id);
        }
      });
      return currentSelected;
    });
    
    setClients(prev => 
      prev.map(client => 
        client.groupId === groupId ? { ...client, selected: true } : client
      )
    );
  };

  // Filtering
  const filterClients = (query: string) => {
    if (!query) return clients;
    
    const lowerQuery = query.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(lowerQuery) || 
      client.id.toLowerCase().includes(lowerQuery)
    );
  };

  const filterGroups = (query: string) => {
    if (!query) return groups;
    
    const lowerQuery = query.toLowerCase();
    return groups.filter(group => 
      group.name.toLowerCase().includes(lowerQuery)
    );
  };

  // Get operations
  const getClient = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const getGroup = (id: string) => {
    return groups.find(group => group.id === id);
  };

  const getClientsInGroup = (groupId: string) => {
    return clients.filter(client => client.groupId === groupId);
  };

  const getGroupedClients = () => {
    const result: { [groupId: string]: Client[] } = {};
    
    groups.forEach(group => {
      result[group.id] = clients.filter(client => client.groupId === group.id);
    });
    
    return result;
  };

  const getUngroupedClients = () => {
    return clients.filter(client => !client.groupId);
  };

  const value = {
    clients,
    groups,
    selectedClients,
    selectedGroups,
    addClient,
    updateClient,
    deleteClient,
    selectClient,
    addGroup,
    updateGroup,
    deleteGroup,
    selectGroup,
    addClientToGroup,
    removeClientFromGroup,
    clearAllSelections,
    selectAllClients,
    selectAllInGroup,
    filterClients,
    filterGroups,
    getClient,
    getGroup,
    getClientsInGroup,
    getGroupedClients,
    getUngroupedClients,
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};
