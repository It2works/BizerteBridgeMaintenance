import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getUserRoleFromEmail } from '@/utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Clear any stale auth data on mount
    localStorage.removeItem('supabase.auth.token');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in Login:", event, session);
      
      if (session) {
        const role = getUserRoleFromEmail(session.user.email!);
        console.log("User role detected:", role);
        navigate(`/${role}/overview`);
      }
    });

    // Check session on mount
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Checking session in Login:", session);
      
      if (error) {
        console.error("Error checking session:", error);
        toast({
          title: "Error",
          description: "There was a problem checking your session. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      if (session) {
        const role = getUserRoleFromEmail(session.user.email!);
        console.log("Session found during initial check, redirecting to role-based route:", role);
        navigate(`/${role}/overview`);
      }
    };

    checkSession();

    return () => {
      console.log("Cleaning up auth subscription in Login");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleError = (error: Error) => {
    console.error("Authentication error:", error);
    
    // Show invalid credentials toast
    if (error.message.includes("Invalid login credentials")) {
      toast({
        title: "Authentication Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Get the current site URL for redirects
  const siteUrl = window.location.origin;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Bridge Maintenance System</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={siteUrl}
          view="sign_in"
          showLinks={false}
          {...{
            emailRedirectTo: siteUrl,
            onError: handleError,
          }}
        />
      </div>
    </div>
  );
}