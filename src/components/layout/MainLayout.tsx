
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Example client count - now retrieved from the ClientContext
  const clientCount = 18;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        clientCount={clientCount}
      />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-sidebar"
      )}>
        <Header sidebarCollapsed={sidebarCollapsed} />
        
        <main className="pt-24 px-6 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
