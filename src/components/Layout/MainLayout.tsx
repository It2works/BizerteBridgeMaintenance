import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserRoleFromEmail, type UserRole } from "@/utils/auth";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const isAuthPage = location.pathname.startsWith("/auth");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to check if user has access to current route
  const checkRouteAccess = (role: UserRole, pathname: string) => {
    console.log("Checking route access for role:", role, "pathname:", pathname);
    const rolePrefix = `/${role}`;
    if (!pathname.startsWith(rolePrefix)) {
      console.log("Access denied: route doesn't match user role");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in MainLayout:", event, session);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
        return;
      }

      if (!session || event === 'SIGNED_OUT') {
        console.log("No session or signed out, redirecting to login");
        localStorage.removeItem('supabase.auth.token');
        navigate("/auth/login");
        return;
      }

      if (session) {
        const role = getUserRoleFromEmail(session.user.email!);
        console.log("Setting user role:", role);
        setUserRole(role);
        
        if (isAuthPage || location.pathname === '/') {
          console.log("User is authenticated, redirecting to role-based home");
          navigate(`/${role}/overview`);
        } else if (!checkRouteAccess(role, location.pathname)) {
          console.log("Unauthorized access attempt, redirecting to proper route");
          toast({
            title: "Unauthorized Access",
            description: "You don't have permission to access this area.",
            variant: "destructive"
          });
          navigate(`/${role}/overview`);
        }
      }
    });

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Initial session check in MainLayout:", session);
        
        if (error) {
          console.error("Error checking session:", error);
          toast({
            title: "Session Error",
            description: "There was a problem with your session. Please log in again.",
            variant: "destructive"
          });
          localStorage.removeItem('supabase.auth.token');
          navigate("/auth/login");
          return;
        }
        
        if (!session) {
          console.log("No session found during initial check");
          if (!isAuthPage) {
            navigate("/auth/login");
          }
        } else {
          const role = getUserRoleFromEmail(session.user.email!);
          console.log("Setting initial user role:", role);
          setUserRole(role);
          
          if (isAuthPage || location.pathname === '/') {
            navigate(`/${role}/overview`);
          } else if (!checkRouteAccess(role, location.pathname)) {
            console.log("Initial unauthorized access attempt, redirecting to proper route");
            toast({
              title: "Unauthorized Access",
              description: "You don't have permission to access this area.",
              variant: "destructive"
            });
            navigate(`/${role}/overview`);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast({
          title: "Error",
          description: "There was a problem checking your session. Please try again.",
          variant: "destructive"
        });
        localStorage.removeItem('supabase.auth.token');
        navigate("/auth/login");
      }
    };

    checkSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, isAuthPage, location.pathname, toast]);

  if (isAuthPage) {
    return <Outlet />;
  }

  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar userRole={userRole} />
        <main className="flex-1 overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 h-full">
            <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
              <SidebarTrigger className={isMobile ? "block" : "hidden"} />
              <div className="flex-1" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="ml-auto hover:bg-accent transition-colors duration-200"
                  >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="p-1 sm:p-2 md:p-4 animate-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
