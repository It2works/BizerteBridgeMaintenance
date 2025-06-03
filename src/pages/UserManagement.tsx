import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { AddUserForm } from "@/components/users/AddUserForm";
import { UsersList } from "@/components/users/UsersList";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  user_id: string;
  is_pending_role_change: boolean;
  requested_role: "citizen" | "technician" | "engineer" | "superadmin" | "admin";
}

export default function UserManagement() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleUserAdded = () => {
    setIsAddUserOpen(false);
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <AddUserForm 
              onSuccess={handleUserAdded}
              onCancel={() => setIsAddUserOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersList onUserUpdated={() => queryClient.invalidateQueries({ queryKey: ['users'] })} />
        </CardContent>
      </Card>
    </div>
  );
}