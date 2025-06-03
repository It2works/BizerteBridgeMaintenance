import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import type { User } from "@/pages/UserManagement";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCard } from "./UserCard";
import { DeleteUserDialog } from "./DeleteUserDialog";

interface UsersListProps {
  onUserUpdated: () => void;
}

export function UsersList({ onUserUpdated }: UsersListProps) {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      const { data: usersData, error: usersError } = await supabase.functions.invoke('manage-users', {
        body: {
          method: 'GET',
          userData: {
            userIds: profiles?.map(profile => profile.user_id).filter(Boolean) || []
          }
        }
      });

      if (usersError) {
        console.error('Error fetching user emails:', usersError);
        throw usersError;
      }

      const enrichedProfiles = profiles?.map(profile => ({
        ...profile,
        email: usersData?.users?.find(u => u.id === profile.user_id)?.email || null
      })) as User[];

      // Filter out specific users
      const excludedUsers = [
        'mootaz@supadmin.tn',
        'mootaz@technician.tn',
        'mootaz@admin.tn'
      ];
      
      const excludedIds = [
        '6202051a-08ce-43a5-9b20-34fd851ade02',
        '15ab7730-8e7a-4fa4-bc79-0b644b59cc7e'
      ];

      const filteredProfiles = enrichedProfiles.filter(profile => 
        !excludedUsers.includes(profile.email || '') &&
        !excludedIds.includes(profile.id)
      );

      console.log('Fetched and filtered profiles:', filteredProfiles);
      return filteredProfiles;
    },
  });

  const handleUpdateRole = async (userId: string, newRole: string, currentEmail: string | null) => {
    try {
      console.log('Updating user role:', userId, newRole);
      
      // If the email contains @technician.tn or @admin.tn, update it
      if (currentEmail && (currentEmail.includes('@technician.tn') || currentEmail.includes('@admin.tn'))) {
        const username = currentEmail.split('@')[0];
        const newEmail = `${username}@${newRole}.tn`;

        console.log('Updating user email to:', newEmail);
        
        // Update email in auth.users through the edge function
        const { error } = await supabase.functions.invoke('manage-users', {
          body: {
            method: 'PATCH',
            userData: {
              userId,
              updates: {
                email: newEmail,
                role: newRole
              }
            }
          },
        });

        if (error) {
          console.error('Email update error:', error);
          throw error;
        }
      }

      // Optimistically update the cache
      queryClient.setQueryData(['users'], (oldData: User[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              role: newRole,
              email: currentEmail && (currentEmail.includes('@technician.tn') || currentEmail.includes('@admin.tn'))
                ? `${currentEmail.split('@')[0]}@${newRole}.tn`
                : currentEmail
            };
          }
          return user;
        });
      });

      // Show success toast
      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      // Invalidate queries to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      onUserUpdated();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      console.log('Deleting user:', userToDelete);
      const { error } = await supabase.functions.invoke('manage-users', {
        body: {
          method: 'DELETE',
          userData: {
            userId: userToDelete,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User removed successfully",
      });

      setUserToDelete(null);
      onUserUpdated();
    } catch (error) {
      console.error('Error removing user:', error);
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users?.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onRoleChange={handleUpdateRole}
          onDeleteClick={setUserToDelete}
        />
      ))}

      <DeleteUserDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}