
import { useState } from 'react';
import { PlusCircle, Filter, Grid3X3, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GroupCard } from '@/components/clients/GroupCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockGroups = [
  {
    id: '1',
    name: 'MIDTERM 2025',
    stats: {
      total: 15,
      live: 10,
      ready: 4,
      connecting: 1,
      down: 0
    },
    clients: [
      { id: 'LB467-1', name: 'LB467', status: 'connected' as const },
      { id: 'LB467-2', name: 'LB467', status: 'connected' as const },
      { id: 'LB467-3', name: 'LB467', status: 'error' as const },
      { id: 'LB467-4', name: 'LB467', status: 'connected' as const },
      { id: 'LB467-5', name: 'LB467', status: 'warning' as const }
    ]
  },
  {
    id: '2',
    name: 'LB44X Monitors',
    stats: {
      total: 15,
      live: 8,
      ready: 6,
      connecting: 1,
      down: 0
    },
    clients: [
      { id: 'LB467-6', name: 'LB467', status: 'connected' as const },
      { id: 'LB467-7', name: 'LB467', status: 'connected' as const },
      { id: 'LB467-8', name: 'LB467', status: 'warning' as const },
      { id: 'LB467-9', name: 'LB467', status: 'connected' as const },
      { id: 'LB467-10', name: 'LB467', status: 'connected' as const }
    ]
  },
  {
    id: '3',
    name: 'LB46X Monitors',
    stats: {
      total: 15,
      live: 12,
      ready: 3,
      connecting: 0,
      down: 0
    },
    clients: [
      { id: 'LB467-11', name: 'LB467', status: 'connected' as const },
      { id: 'LB467-12', name: 'LB467', status: 'connected' as const },
      { id: 'LB467-13', name: 'ComputerLab01', status: 'inactive' as const },
      { id: 'LB467-14', name: 'LB467', status: 'connected' as const },
      { id: 'LB467-15', name: 'LB467', status: 'connected' as const }
    ]
  }
];

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle size={16} className="mr-2" />
          Add Client
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="search" 
            placeholder="Search clients..." 
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
                <DropdownMenuItem>MIDTERM 2025</DropdownMenuItem>
                <DropdownMenuItem>LB44X Monitors</DropdownMenuItem>
                <DropdownMenuItem>LB46X Monitors</DropdownMenuItem>
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
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <h2 className="flex items-center text-xl font-semibold">
          Groups
          <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
            <PlusCircle size={16} />
          </Button>
        </h2>
        
        {mockGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default Clients;
