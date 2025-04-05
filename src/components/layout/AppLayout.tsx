
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
import { Upload, Search, CreditCard, Settings, Home, FileText, BarChart3, LogIn, Sun, Moon, Book, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import AuthDialog from "@/components/auth/AuthDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";

export const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useApp();
  
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
      path: "/documents", 
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

  const handleThemeToggle = () => {
    toggleTheme();
    toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} mode`);
  };

  const handleNavigation = (path: string) => {
    if (path.includes("#")) {
      navigate("/");
      setTimeout(() => {
        const id = path.split("#")[1];
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigate(path);
    }
  };

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
                      <SidebarMenuButton 
                        tooltip={item.title}
                        className={cn(
                          "font-medium transition-all duration-200 hover:bg-primary/20",
                          (location.pathname === item.path || 
                           (location.pathname === "/" && item.path.includes("/#")) || 
                           (location.pathname + location.hash === item.path)) 
                            ? "bg-primary/20 border-l-2 border-primary" 
                            : ""
                        )}
                        onClick={() => handleNavigation(item.path)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider">
                Theme
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip="Toggle Theme"
                      onClick={handleThemeToggle}
                    >
                      {theme === "dark" ? (
                        <Sun className="h-5 w-5 mr-3" />
                      ) : (
                        <Moon className="h-5 w-5 mr-3" />
                      )}
                      <span>Toggle Theme</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto bg-gradient-to-br from-background to-secondary/30 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute top-1/4 -left-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
            
            {/* Decorative book and document icons */}
            <BookOpen className="absolute top-20 left-[15%] w-16 h-16 text-primary/5 rotate-12" />
            <Book className="absolute bottom-32 right-[20%] w-20 h-20 text-primary/5 -rotate-6" />
            <FileText className="absolute top-[40%] right-[10%] w-24 h-24 text-primary/5 rotate-12" />
            <FileText className="absolute bottom-[15%] left-[25%] w-16 h-16 text-primary/5 -rotate-12" />
            
            {/* Decorative lines */}
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute left-1/3 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute left-2/3 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8 relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <SidebarTrigger className="mr-4" />
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleThemeToggle} 
                  className="bg-primary/10 hover:bg-primary/20 border-primary/20"
                  title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                
                <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-primary/10 hover:bg-primary/20 border-primary/20">
                      <LogIn className="h-4 w-4" />
                      <span>{currentUser ? currentUser.name : "Login / Sign Up"}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <AuthDialog onClose={() => setAuthOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
