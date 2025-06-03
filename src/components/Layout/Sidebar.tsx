import { Home, Activity, User, Database, Calendar, ClipboardList, LogOut, Users, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { type UserRole, getRoleBasedRoute } from "@/utils/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppSidebarProps {
  userRole: UserRole | null;
}

export const AppSidebar = ({ userRole }: AppSidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    getSession();
  }, []);

  // Query to get incomplete tasks count for technicians
  const { data: incompleteTasks = 0 } = useQuery({
    queryKey: ['incomplete-tasks', userId],
    queryFn: async () => {
      if (!userId || userRole !== 'technician') return 0;

      const { data, error } = await supabase
        .from('tasks')
        .select('id', { count: 'exact' })
        .eq('assignee_id', userId)
        .eq('completed', false);

      if (error) {
        console.error('Error fetching incomplete tasks:', error);
        return 0;
      }

      return data?.length || 0;
    },
    enabled: !!userId && userRole === 'technician',
  });

  // Define base menu items
  const baseMenuItems = [
    { icon: Home, label: "Overview", path: "/overview" },
    { icon: Database, label: "Sensors", path: "/sensors" },
    { icon: Calendar, label: "Maintenance", path: "/maintenance" },
    { icon: ClipboardList, label: "Tasks", path: "/tasks" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  // Add predictions for non-technician roles
  const predictionsItem = { icon: Activity, label: "Predictions", path: "/predictions" };
  
  // Add user management for superadmin
  const userManagementItem = { icon: Users, label: "Users", path: "/users" };

  // Get menu items based on user role
  const getMenuItems = () => {
    if (!userRole) return baseMenuItems;

    let items = [...baseMenuItems];

    // Add predictions for admin and supadmin
    if (userRole !== 'technician') {
      items.splice(3, 0, predictionsItem); // Insert predictions before Tasks
    }

    // Add user management for superadmin
    if (userRole === 'supadmin') {
      items.push(userManagementItem);
    }

    return items;
  };

  const handleLogout = async () => {
    try {
      console.log("Performing hard logout");
      
      const { error: signOutError } = await supabase.auth.signOut({ scope: 'global' });
      
      if (signOutError) {
        console.error("Error during global sign out:", signOutError);
      }
      
      localStorage.removeItem('supabase.auth.token');
      localStorage.clear();
      
      console.log("Redirecting to login page");
      navigate("/auth/login");
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      
      localStorage.clear();
      navigate("/auth/login");
      
      toast({
        title: "Logged Out",
        description: "Session cleared. You have been logged out.",
      });
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar className={`${isMobile ? "w-[85vw] max-w-[300px]" : "w-[280px]"} bg-sidebar-background border-r border-sidebar-border/50 backdrop-blur-lg`}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xl font-bold bg-gradient-to-r from-primary to-ring bg-clip-text text-transparent">
            Bridge Maintenance
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    onClick={() => navigate(userRole ? getRoleBasedRoute(userRole, item.path) : '/auth/login')}
                    className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition-all duration-200 hover:bg-sidebar-accent group"
                    style={{
                      animation: `slide-in-from-right ${0.2 + index * 0.1}s ease-out`
                    }}
                  >
                    <item.icon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="truncate font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {userRole === 'technician' && (
                <SidebarMenuItem>
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Bell className="h-5 w-5 shrink-0" />
                      <span className="truncate">Incomplete Tasks: {incompleteTasks}</span>
                    </div>
                  </div>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition-all duration-200 hover:bg-destructive/10 group"
                >
                  <LogOut className="h-5 w-5 shrink-0 text-destructive" />
                  <span className="truncate font-medium text-destructive">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};