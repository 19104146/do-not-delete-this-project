
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Overview from "./pages/Overview";
import Clients from "./pages/Clients";
import Templates from "./pages/Templates";
import Logs from "./pages/Logs";
import ApiKeys from "./pages/ApiKeys";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ClientProvider } from "./contexts/ClientContext";
import { useState, useEffect } from "react";
import Users from "./pages/Users";
import Announcements from "./pages/Announcements";
import Roles from "./pages/Roles";

const App = () => {
  // Move queryClient instantiation inside the component
  const [queryClient] = useState(() => new QueryClient());

  // Initialize Preline UI
  useEffect(() => {
    import('preline');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ClientProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout><Overview /></MainLayout>} />
              <Route path="/clients" element={<MainLayout><Clients /></MainLayout>} />
              <Route path="/users" element={<MainLayout><Users /></MainLayout>} />
              <Route path="/roles" element={<MainLayout><Roles /></MainLayout>} />
              <Route path="/announcements" element={<MainLayout><Announcements /></MainLayout>} />
              <Route path="/templates" element={<MainLayout><Templates /></MainLayout>} />
              <Route path="/logs" element={<MainLayout><Logs /></MainLayout>} />
              <Route path="/api-keys" element={<MainLayout><ApiKeys /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ClientProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
