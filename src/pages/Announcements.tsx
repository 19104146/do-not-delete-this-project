
import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, Filter, Search, Trash2, BellRing, CheckSquare, 
  SquareSlash, ArrowUpDown, SlidersHorizontal, Loader2, 
  Calendar, Clock, Users as UsersIcon, AlertTriangle, Edit, Calendar as CalendarIcon
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Extended types for the enhanced announcement system
type AnnouncementPriority = 'high' | 'medium' | 'low';
type AnnouncementStatus = 'active' | 'scheduled' | 'completed' | 'draft';

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  status: AnnouncementStatus;
  priority?: AnnouncementPriority;
  publishDate?: string;
  expirationDate?: string;
  targetAudience?: string[];
  template?: string;
}

// Mock announcements data with enhanced fields
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'System Maintenance',
    content: 'There will be a scheduled maintenance on all systems this weekend.',
    createdAt: '2023-06-10T10:00:00Z',
    status: 'scheduled',
    priority: 'high',
    publishDate: '2023-06-15T10:00:00Z',
    expirationDate: '2023-06-18T10:00:00Z',
    targetAudience: ['All Clients', 'Admin Users'],
    template: 'Maintenance Notice'
  },
  {
    id: '2',
    title: 'New Feature Release',
    content: 'We are excited to announce the release of our new dashboard features!',
    createdAt: '2023-05-20T14:30:00Z',
    status: 'active',
    priority: 'medium',
    publishDate: '2023-05-20T14:30:00Z',
    targetAudience: ['Premium Clients'],
    template: 'Feature Announcement'
  },
  {
    id: '3',
    title: 'Important Security Update',
    content: 'Please ensure all clients are updated to the latest security patch.',
    createdAt: '2023-05-15T08:45:00Z',
    status: 'active',
    priority: 'high',
    publishDate: '2023-05-15T08:45:00Z',
    targetAudience: ['All Clients'],
    template: 'Security Alert'
  },
  {
    id: '4',
    title: 'Holiday Schedule',
    content: 'Our offices will be closed during the upcoming holiday. Support will be limited.',
    createdAt: '2023-04-30T16:20:00Z',
    status: 'completed',
    priority: 'low',
    publishDate: '2023-04-30T16:20:00Z',
    expirationDate: '2023-05-02T09:00:00Z',
    targetAudience: ['All Clients', 'Admin Users', 'Support Team'],
    template: 'Office Notice'
  },
  {
    id: '5',
    title: 'Network Upgrades',
    content: 'We will be upgrading our network infrastructure to improve performance.',
    createdAt: '2023-04-25T11:30:00Z',
    status: 'draft',
    priority: 'medium',
    targetAudience: ['Technical Contacts'],
    template: 'Maintenance Notice'
  }
];

// Mock audience options for targeting
const audienceOptions = [
  'All Clients', 
  'Premium Clients', 
  'Technical Contacts', 
  'Admin Users', 
  'Support Team'
];

// Mock template options
const templateOptions = [
  'Feature Announcement', 
  'Maintenance Notice', 
  'Security Alert', 
  'Office Notice', 
  'General Update'
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<AnnouncementStatus[]>(['active', 'scheduled', 'completed', 'draft']);
  const [selectedPriorities, setSelectedPriorities] = useState<AnnouncementPriority[]>(['high', 'medium', 'low']);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'title' | 'createdAt' | 'status' | 'priority' | 'publishDate'>('publishDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  
  // Form state for new/editing announcement
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formPublishDate, setFormPublishDate] = useState<Date | undefined>(new Date());
  const [formExpirationDate, setFormExpirationDate] = useState<Date | undefined>(undefined);
  const [formPriority, setFormPriority] = useState<AnnouncementPriority>('medium');
  const [formTargetAudience, setFormTargetAudience] = useState<string[]>([]);
  const [formTemplate, setFormTemplate] = useState<string>('');
  const [formStatus, setFormStatus] = useState<AnnouncementStatus>('draft');
  
  // Filter announcements based on search query, selected statuses, priorities, and audiences
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      const matchesQuery = 
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatuses.includes(announcement.status);
      const matchesPriority = !announcement.priority || selectedPriorities.includes(announcement.priority);
      
      const matchesAudience = 
        selectedAudiences.length === 0 || 
        (announcement.targetAudience && 
         announcement.targetAudience.some(audience => selectedAudiences.includes(audience)));
      
      return matchesQuery && matchesStatus && matchesPriority && matchesAudience;
    });
  }, [announcements, searchQuery, selectedStatuses, selectedPriorities, selectedAudiences]);
  
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
      } else if (sortField === 'priority') {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const aValue = a.priority ? priorityOrder[a.priority] : 4;
        const bValue = b.priority ? priorityOrder[b.priority] : 4;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (sortField === 'publishDate') {
        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : new Date(b.createdAt).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
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
  
  const handleSort = (field: 'title' | 'createdAt' | 'status' | 'priority' | 'publishDate') => {
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
  
  const handlePriorityToggle = (priority: AnnouncementPriority) => {
    setSelectedPriorities(prev => {
      if (prev.includes(priority)) {
        return prev.filter(p => p !== priority);
      } else {
        return [...prev, priority];
      }
    });
  };
  
  const handleAudienceToggle = (audience: string) => {
    setSelectedAudiences(prev => {
      if (prev.includes(audience)) {
        return prev.filter(a => a !== audience);
      } else {
        return [...prev, audience];
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
  
  const openNewAnnouncementDialog = () => {
    // Reset form fields for new announcement
    setFormTitle('');
    setFormContent('');
    setFormPublishDate(new Date());
    setFormExpirationDate(undefined);
    setFormPriority('medium');
    setFormTargetAudience([]);
    setFormTemplate('');
    setFormStatus('draft');
    setEditingAnnouncement(null);
    setAnnouncementDialogOpen(true);
  };
  
  const openEditAnnouncementDialog = (announcement: Announcement) => {
    setFormTitle(announcement.title);
    setFormContent(announcement.content);
    setFormPublishDate(announcement.publishDate ? new Date(announcement.publishDate) : new Date());
    setFormExpirationDate(announcement.expirationDate ? new Date(announcement.expirationDate) : undefined);
    setFormPriority(announcement.priority || 'medium');
    setFormTargetAudience(announcement.targetAudience || []);
    setFormTemplate(announcement.template || '');
    setFormStatus(announcement.status);
    setEditingAnnouncement(announcement);
    setAnnouncementDialogOpen(true);
  };
  
  const handleSaveAnnouncement = () => {
    if (!formTitle.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formContent.trim()) {
      toast.error('Content is required');
      return;
    }
    
    if (!formPublishDate) {
      toast.error('Publication date is required');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newAnnouncement: Announcement = {
        id: editingAnnouncement ? editingAnnouncement.id : Date.now().toString(),
        title: formTitle,
        content: formContent,
        createdAt: editingAnnouncement ? editingAnnouncement.createdAt : new Date().toISOString(),
        status: formStatus,
        priority: formPriority,
        publishDate: formPublishDate.toISOString(),
        expirationDate: formExpirationDate ? formExpirationDate.toISOString() : undefined,
        targetAudience: formTargetAudience,
        template: formTemplate || undefined
      };
      
      if (editingAnnouncement) {
        // Update existing announcement
        setAnnouncements(prev => 
          prev.map(a => a.id === editingAnnouncement.id ? newAnnouncement : a)
        );
        toast.success('Announcement updated successfully');
      } else {
        // Add new announcement
        setAnnouncements(prev => [...prev, newAnnouncement]);
        toast.success('Announcement created successfully');
      }
      
      setAnnouncementDialogOpen(false);
      setIsLoading(false);
    }, 500);
  };
  
  const handleTargetAudienceChange = (audience: string) => {
    setFormTargetAudience(prev => {
      if (prev.includes(audience)) {
        return prev.filter(a => a !== audience);
      } else {
        return [...prev, audience];
      }
    });
  };
  
  const getPriorityBadge = (priority?: AnnouncementPriority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
      default:
        return null;
    }
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
            <Button onClick={openNewAnnouncementDialog}>
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
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-gray-500">Priority</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem 
                      checked={selectedPriorities.includes('high')}
                      onCheckedChange={() => handlePriorityToggle('high')}
                    >
                      High
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={selectedPriorities.includes('medium')}
                      onCheckedChange={() => handlePriorityToggle('medium')}
                    >
                      Medium
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={selectedPriorities.includes('low')}
                      onCheckedChange={() => handlePriorityToggle('low')}
                    >
                      Low
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-gray-500">Target Audience</DropdownMenuLabel>
                    {audienceOptions.map(audience => (
                      <DropdownMenuCheckboxItem 
                        key={audience}
                        checked={selectedAudiences.includes(audience)}
                        onCheckedChange={() => handleAudienceToggle(audience)}
                      >
                        {audience}
                      </DropdownMenuCheckboxItem>
                    ))}
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
                      onClick={() => handleSort('publishDate')} 
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Publish Date
                      <ArrowUpDown size={14} className="ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('priority')} 
                      className="flex items-center p-0 h-auto font-medium"
                    >
                      Priority
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
                  <TableHead>Target Audience</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
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
                        {announcement.template && (
                          <div className="text-xs text-gray-500 mt-1">
                            Template: {announcement.template}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-md">{announcement.content}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {announcement.publishDate ? formatDate(announcement.publishDate) : formatDate(announcement.createdAt)}
                        </div>
                        {announcement.expirationDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Expires: {formatDate(announcement.expirationDate)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(announcement.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(announcement.status)}
                      </TableCell>
                      <TableCell>
                        {announcement.targetAudience && announcement.targetAudience.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {announcement.targetAudience.length > 1 ? (
                              <Badge variant="outline" className="whitespace-nowrap">
                                {announcement.targetAudience[0]} +{announcement.targetAudience.length - 1}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="whitespace-nowrap">
                                {announcement.targetAudience[0]}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditAnnouncementDialog(announcement)}
                            className="h-8 w-8"
                          >
                            <Edit size={16} />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              setSelectedAnnouncements([announcement.id]);
                              setBulkDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 size={16} />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchQuery || selectedStatuses.length < 4 || selectedPriorities.length < 3 || selectedAudiences.length > 0 ? (
                        <>No announcements found matching your filters</>
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
      
      {/* Delete Confirmation Dialog */}
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
      
      {/* Create/Edit Announcement Dialog */}
      <AlertDialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {editingAnnouncement 
                ? 'Update the announcement details below.' 
                : 'Fill in the details to create a new announcement.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                maxLength={200}
                placeholder="Enter announcement title"
              />
              <div className="text-xs text-gray-500 flex justify-end">
                {formTitle.length}/200
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="publishDate" className="text-sm font-medium">
                  Publication Date <span className="text-destructive">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formPublishDate ? (
                        format(formPublishDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formPublishDate}
                      onSelect={(date) => setFormPublishDate(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="expirationDate" className="text-sm font-medium">
                  Expiration Date (Optional)
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formExpirationDate ? (
                        format(formExpirationDate, "PPP")
                      ) : (
                        <span>Set an expiration date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formExpirationDate}
                      onSelect={(date) => setFormExpirationDate(date)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority <span className="text-destructive">*</span>
                </label>
                <Select 
                  value={formPriority} 
                  onValueChange={(value) => setFormPriority(value as AnnouncementPriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="template" className="text-sm font-medium">
                  Template
                </label>
                <Select 
                  value={formTemplate} 
                  onValueChange={setFormTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {templateOptions.map(template => (
                      <SelectItem key={template} value={template}>{template}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Target Audience
              </label>
              <div className="flex flex-wrap gap-2">
                {audienceOptions.map(audience => (
                  <Button
                    key={audience}
                    type="button"
                    variant={formTargetAudience.includes(audience) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTargetAudienceChange(audience)}
                  >
                    {audience}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={5}
                placeholder="Enter announcement content"
                className="resize-y min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select 
                value={formStatus} 
                onValueChange={(value) => setFormStatus(value as AnnouncementStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSaveAnnouncement}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingAnnouncement ? 'Update' : 'Create'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Announcements;
