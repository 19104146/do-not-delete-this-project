
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Monitor, 
  Layout, 
  List, 
  Key, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,  // Add this for Roles icon
  BellRing,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  clientCount: number;
}

const Sidebar = ({ collapsed, setCollapsed, clientCount }: SidebarProps) => {
  const location = useLocation();
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);

  const navigationItems = [
    { name: 'Overview', path: '/', icon: Home },
    { name: 'Clients', path: '/clients', icon: Monitor, count: clientCount },
    { 
      name: 'User Management', 
      path: '#', 
      icon: Users, 
      isDropdown: true,
      children: [
        { name: 'User List', path: '/users', icon: Users },
        { name: 'Roles', path: '/roles', icon: ShieldCheck },
      ]
    },
    { name: 'Announcements', path: '/announcements', icon: BellRing },
    { name: 'Templates', path: '/templates', icon: Layout },
    { name: 'Logs', path: '/logs', icon: List },
    { name: 'API Keys', path: '/api-keys', icon: Key },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-20",
        collapsed ? "w-16" : "w-sidebar"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed ? (
          <div className="font-bold text-xl text-primary">SignageUI</div>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white font-bold">S</div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="p-2 space-y-1 flex flex-col h-[calc(100%-4rem)]">
        <TooltipProvider delayDuration={0}>
          <div className="flex-1">
            {navigationItems.map((item) => (
              <React.Fragment key={item.name}>
                {item.isDropdown ? (
                  <div className="relative">
                    {collapsed ? (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors my-1.5 w-full",
                              "hover:bg-gray-100",
                              (location.pathname === '/users' || location.pathname === '/roles') 
                                ? "bg-primary/10 text-primary font-medium" 
                                : "text-gray-700"
                            )}
                            onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
                          >
                            <item.icon size={20} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <DropdownMenu open={usersDropdownOpen} onOpenChange={setUsersDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={cn(
                              "flex items-center justify-between gap-3 px-3 py-2.5 rounded-md transition-colors my-1.5 w-full",
                              "hover:bg-gray-100",
                              (location.pathname === '/users' || location.pathname === '/roles') 
                                ? "bg-primary/10 text-primary font-medium" 
                                : "text-gray-700"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon size={20} />
                              <span className="text-sm">{item.name}</span>
                            </div>
                            <ChevronDown size={16} className={usersDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          className="w-[calc(var(--w-sidebar)_-_24px)]" 
                          style={{ "--w-sidebar": "var(--w-sidebar, 240px)" } as React.CSSProperties}
                          align="start"
                          sideOffset={5}
                        >
                          {item.children.map((child) => (
                            <DropdownMenuItem key={child.name} asChild>
                              <Link
                                to={child.path}
                                className={cn(
                                  "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-sm",
                                  location.pathname === child.path 
                                    ? "bg-primary/10 text-primary font-medium" 
                                    : "text-gray-700 hover:bg-gray-100"
                                )}
                              >
                                {child.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ) : (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors my-1.5",
                          "hover:bg-gray-100",
                          location.pathname === item.path 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-gray-700"
                        )}
                      >
                        <item.icon size={20} />
                        {!collapsed && (
                          <>
                            <span className="text-sm">{item.name}</span>
                            {item.count !== undefined && (
                              <Badge variant="outline" className="ml-auto">
                                {item.count}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Account section */}
          <div className={cn(
            "mt-auto pt-4 border-t border-gray-200",
            collapsed ? "px-2" : "px-3"
          )}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  to="/profile" 
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                  </Avatar>
                  
                  {!collapsed && (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Admin User</span>
                      <span className="text-xs text-gray-500">admin@example.com</span>
                    </div>
                  )}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>Admin User</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default Sidebar;
