import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { PasswordChangeForm } from "@/components/users/PasswordChangeForm";
import { getUserRoleFromEmail } from "@/utils/auth";

export default function Profile() {
  const { toast } = useToast();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      console.log('Fetching profile data...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        throw new Error('No user found');
      }
      return { email: user.email };
    },
  });

  const getAccountName = (email: string) => {
    return email?.split('@')[0] || '';
  };

  const getRoleDisplay = (email: string) => {
    const role = getUserRoleFromEmail(email);
    switch (role) {
      case 'supadmin':
        return 'Superadmin';
      case 'admin':
        return 'Admin';
      case 'technician':
        return 'Technician';
      default:
        return 'User';
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Name</label>
            <p className="text-lg font-medium">{profile?.email ? getAccountName(profile.email) : ''}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <p className="text-lg font-medium">{profile?.email}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <p className="text-lg font-medium">{profile?.email ? getRoleDisplay(profile.email) : ''}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>
    </div>
  );
}