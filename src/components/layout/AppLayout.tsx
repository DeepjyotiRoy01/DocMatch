
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader
} from "@/components/ui/sidebar";
import { Upload, Search, CreditCard, Settings, Home, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export const AppLayout = () => {
  const location = useLocation();
  
  const menuItems = [
    { 
      title: "Home", 
      path: "/", 
      icon: Home 
    },
    { 
      title: "Upload Documents", 
      path: "/#upload", 
      icon: Upload 
    },
    { 
      title: "Match Documents", 
      path: "/#match", 
      icon: Search 
    },
    { 
      title: "My Documents", 
      path: "/#documents", 
      icon: FileText 
    },
    { 
      title: "Credits", 
      path: "/#credits", 
      icon: CreditCard 
    },
    { 
      title: "Admin Dashboard", 
      path: "/admin", 
      icon: Settings 
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-white/10">
          <SidebarHeader className="flex items-center px-4 py-3 bg-sidebar-accent">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 text-primary mr-2" />
              <h1 className="text-xl font-bold text-gradient tracking-tight">DocMatch</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={cn(
                        "font-medium transition-all duration-200 hover:bg-primary/20",
                        location.pathname + location.hash === item.path 
                          ? "bg-primary/20 border-l-2 border-primary" 
                          : ""
                      )}>
                        <Link to={item.path} className="flex items-center">
                          <item.icon className="h-5 w-5 mr-3" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto bg-gradient-to-br from-background to-secondary/30">
          <div className="p-4 sm:p-6 lg:p-8">
            <SidebarTrigger className="mb-4" />
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
