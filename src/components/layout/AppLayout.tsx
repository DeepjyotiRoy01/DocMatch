
import React, { useState } from "react";
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
import { Upload, Search, CreditCard, Download, Settings, Home, FileText } from "lucide-react";
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
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <h1 className="text-lg font-bold text-primary">DocMatch</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={cn(
                        location.pathname + location.hash === item.path ? "bg-sidebar-accent" : ""
                      )}>
                        <Link to={item.path}>
                          <item.icon className="h-4 w-4 mr-2" />
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
        <div className="flex-1 overflow-auto">
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
