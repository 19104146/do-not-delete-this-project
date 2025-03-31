
import React from 'react';
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
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  clientCount: number;
}

const Sidebar = ({ collapsed, setCollapsed, clientCount }: SidebarProps) => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Overview', path: '/', icon: Home },
    { name: 'Clients', path: '/clients', icon: Monitor, count: clientCount },
    { name: 'Users', path: '/users', icon: Users },
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
        {!collapsed && (
          <div className="font-bold text-xl text-primary">SignageUI</div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="p-2 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "hover:bg-gray-100",
              location.pathname === item.path 
                ? "bg-primary/10 text-primary" 
                : "text-gray-700"
            )}
          >
            <item.icon size={20} />
            {!collapsed && (
              <>
                <span>{item.name}</span>
                {item.count !== undefined && (
                  <Badge variant="outline" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
