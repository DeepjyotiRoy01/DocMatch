
import React, { useState, useEffect } from "react";
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
import { 
  Upload, 
  Search, 
  CreditCard, 
  Settings, 
  Home, 
  FileText, 
  BarChart3, 
  LogIn, 
  Sun, 
  Moon, 
  Book, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Users,
  LogOut,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AuthDialog from "@/components/auth/AuthDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { 
    currentUser, 
    isAuthenticated, 
    logout, 
    deleteAccount,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  } = useApp();
  const isMobile = useIsMobile();
  
  // Check if user is on landing page
  const isLandingPage = location.pathname === "/landing";
  
  // Force navigate to landing if not authenticated
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/landing" && !location.pathname.includes("/verify")) {
      navigate("/landing");
    }
  }, [isAuthenticated, location, navigate]);
  
  const menuItems = [
    { 
      title: "Home", 
      path: "/", 
      icon: Home,
      requiresAuth: true
    },
    { 
      title: "Upload Documents", 
      path: "/#upload", 
      icon: Upload,
      requiresAuth: true
    },
    { 
      title: "Match Documents", 
      path: "/#match", 
      icon: Search,
      requiresAuth: true
    },
    { 
      title: "My Documents", 
      path: "/documents", 
      icon: FileText,
      requiresAuth: true
    },
    { 
      title: "Credits", 
      path: "/#credits", 
      icon: CreditCard,
      requiresAuth: true
    },
    { 
      title: "Dashboard", 
      path: "/dashboard", 
      icon: UserCircle,
      requiresAuth: true
    },
    { 
      title: "Admin Dashboard", 
      path: "/admin", 
      icon: Settings,
      requiresAuth: true,
      adminOnly: true
    }
  ];

  // Filter menu items based on authentication and admin status
  const filteredMenuItems = menuItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false;
    if (item.adminOnly && (!currentUser || !currentUser.isAdmin)) return false;
    return true;
  });

  const handleThemeToggle = () => {
    toggleTheme();
    toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} mode`);
  };

  const handleNavigation = (path: string) => {
    if (!isAuthenticated && path !== "/landing") {
      setAuthOpen(true);
      return;
    }
    
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
    
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/landing");
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      deleteAccount();
      navigate("/landing");
    }
  };

  // If on landing page, don't show the sidebar
  if (isLandingPage || location.pathname.includes("/verify")) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className={cn(
          "border-r border-white/10",
          isSidebarCollapsed ? "w-[60px]" : "w-[240px]",
          "transition-all duration-300 ease-in-out"
        )}>
          <SidebarHeader className="flex items-center px-4 py-3 bg-sidebar-accent justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center">
                <BarChart3 className="w-6 h-6 text-primary mr-2" />
                <h1 className="text-xl font-bold text-gradient tracking-tight">DocMatch</h1>
              </div>
            )}
            {isSidebarCollapsed && (
              <div className="flex items-center justify-center w-full">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            )}
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                className="ml-auto"
              >
                {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            )}
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className={cn(
                "text-xs font-bold uppercase tracking-wider",
                isSidebarCollapsed && "sr-only"
              )}>
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        className={cn(
                          "font-medium transition-all duration-200 hover:bg-primary/20",
                          (location.pathname === item.path || 
                           (location.pathname === "/" && item.path.includes("/#")) || 
                           (location.pathname + location.hash === item.path)) 
                            ? "bg-primary/20 border-l-2 border-primary" 
                            : "",
                          isSidebarCollapsed && "justify-center px-0"
                        )}
                        onClick={() => handleNavigation(item.path)}
                      >
                        <item.icon className={cn(
                          "h-5 w-5", 
                          !isSidebarCollapsed && "mr-3"
                        )} />
                        {!isSidebarCollapsed && (
                          <span>{item.title}</span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
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
                <SidebarTrigger className="mr-4 md:hidden" />
                {isMobile && !isSidebarCollapsed && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSidebarCollapsed(true)} 
                    className="mr-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
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
                
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-primary/10 hover:bg-primary/20 border-primary/20 rounded-full"
                        title={`Logged in as ${currentUser?.name}`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {currentUser?.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{currentUser?.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer flex items-center">
                          <UserCircle className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-orange-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDeleteAccount} className="cursor-pointer text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete account</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-primary/10 hover:bg-primary/20 border-primary/20"
                        title="Login / Sign Up"
                      >
                        <LogIn className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <AuthDialog onClose={() => setAuthOpen(false)} />
                    </DialogContent>
                  </Dialog>
                )}
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
