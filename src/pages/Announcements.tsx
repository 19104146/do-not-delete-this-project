
import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, Filter, Search, Trash2, BellRing, CheckSquare, 
  SquareSlash, ArrowUpDown, SlidersHorizontal, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, 
  DropdownMenuCheckboxItem 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from '@/components/ui/pagination';
import { toast } from 'sonner';
import { Announcement, AnnouncementStatus } from '@/types/clientTypes';

// Mock announcements data
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'System Maintenance',
    content: 'There will be a scheduled maintenance on all systems this weekend.',
    createdAt: '2023-06-10T10:00:00Z',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'New Feature Release',
    content: 'We are excited to announce the release of our new dashboard features!',
    createdAt: '2023-05-20T14:30:00Z',
    status: 'active'
  },
  {
    id: '3',
    title: 'Important Security Update',
    content: 'Please ensure all clients are updated to the latest security patch.',
    createdAt: '2023-05-15T08:45:00Z',
    status: 'active'
  },
  {
    id: '4',
    title: 'Holiday Schedule',
    content: 'Our offices will be closed during the upcoming holiday. Support will be limited.',
    createdAt: '2023-04-30T16:20:00Z',
    status: 'completed'
  },
  {
    id: '5',
    title: 'Network Upgrades',
    content: 'We will be upgrading our network infrastructure to improve performance.',
    createdAt: '2023-04-25T11:30:00Z',
    status: 'draft'
  }
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<AnnouncementStatus[]>(['active', 'scheduled', 'completed', 'draft']);
  const [sortField, setSortField] = useState<'title' | 'createdAt' | 'status'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
  // Filter announcements based on search query and selected statuses
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      const matchesQuery = 
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatuses.includes(announcement.status);
      
      return matchesQuery && matchesStatus;
    });
  }, [announcements, searchQuery, selectedStatuses]);
  
  // Sort announcements
  const sortedAnnouncements = useMemo(() => {
    return [...filteredAnnouncements].sort((a, b) => {
      if (sortField === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortField === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else {
        // Sort by createdAt date
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
  }, [filteredAnnouncements, sortField, sortDirection]);
  
  // Paginate announcements
  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAnnouncements.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAnnouncements, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(sortedAnnouncements.length / itemsPerPage);
  
  const handleSort = (field: 'title' | 'createdAt' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleSelectAnnouncement = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedAnnouncements(prev => [...prev, id]);
    } else {
      setSelectedAnnouncements(prev => prev.filter(announcementId => announcementId !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectedAnnouncements.length === paginatedAnnouncements.length) {
      setSelectedAnnouncements([]);
    } else {
      setSelectedAnnouncements(paginatedAnnouncements.map(a => a.id));
    }
  };
  
  const clearSelection = () => {
    setSelectedAnnouncements([]);
  };
  
  const handleStatusToggle = (status: AnnouncementStatus) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };
  
  const handleDeleteAnnouncements = () => {
    setBulkDeleteDialogOpen(true);
  };
  
  const confirmDeleteAnnouncements = () => {
    setIsLoading(true);
    setAnnouncements(prev => prev.filter(a => !selectedAnnouncements.includes(a.id)));
    setBulkDeleteDialogOpen(false);
    setSelectedAnnouncements([]);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Deleted ${selectedAnnouncements.length} announcements`);
    }, 500);
  };
  
  const handleSendAnnouncement = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Sent ${selectedAnnouncements.length} announcements`);
      setSelectedAnnouncements([]);
    }, 500);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getStatusBadge = (status: AnnouncementStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Completed</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Draft</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Manage and send announcements to clients</p>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedAnnouncements.length > 0 ? (
            <>
              <Button variant="outline" onClick={clearSelection} size="sm">
                <SquareSlash size={16} className="mr-2" />
                Clear ({selectedAnnouncements.length})
              </Button>
              
              <Button variant="outline" onClick={handleSendAnnouncement} size="sm">
                <BellRing size={16} className="mr-2" />
                Send
              </Button>
              
              <Button variant="outline" className="text-destructive" onClick={handleDeleteAnnouncements} size="sm">
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <Button onClick={() => toast.info("Create announcement functionality not implemented yet")}>
              <PlusCircle size={16} className="mr-2" />
              New Announcement
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
                placeholder="Search announcements..." 
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
                  <DropdownMenuLabel>Filter Announcements</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-gray-500">Status</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem 
                      checked={selectedStatuses.includes('active')}
                      onCheckedChange={() => handleStatusToggle('active')}
                    >
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={selectedStatuses.includes('scheduled')}
                      onCheckedChange={() => handleStatusToggle('scheduled')}
                    >
                      Scheduled
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={selectedStatuses.includes('completed')}
                      onCheckedChange={() => handleStatusToggle('completed')}
                    >
                      Completed
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={selectedStatuses.includes('draft')}
                      onCheckedChange={() => handleStatusToggle('draft')}
                    >
                      Draft
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={paginatedAnnouncements.length > 0 && selectedAnnouncements.length === paginatedAnnouncements.length}
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('title')} 
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Title
                      <ArrowUpDown size={14} className="ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('createdAt')} 
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Date
                      <ArrowUpDown size={14} className="ml-1" />
                    </Button>
                  </TableHead>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                        <p>Loading announcements...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedAnnouncements.length > 0 ? (
                  paginatedAnnouncements.map((announcement) => (
                    <TableRow key={announcement.id} className="hover:bg-muted/30">
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={selectedAnnouncements.includes(announcement.id)}
                          onChange={(e) => handleSelectAnnouncement(announcement.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{announcement.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-md">{announcement.content}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(announcement.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(announcement.status)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? (
                        <>No announcements found matching "{searchQuery}"</>
                      ) : (
                        <>No announcements yet. Create an announcement to get started.</>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredAnnouncements.length > itemsPerPage && (
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
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAnnouncements.length)} to {Math.min(currentPage * itemsPerPage, filteredAnnouncements.length)} of {filteredAnnouncements.length} announcements
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
        </CardContent>
      </Card>
      
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected announcements?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {selectedAnnouncements.length} announcements. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAnnouncements} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Announcements;
