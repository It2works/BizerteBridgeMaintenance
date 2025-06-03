import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { User } from "@/pages/UserManagement";

interface UserCardProps {
  user: User;
  onRoleChange: (userId: string, newRole: string, currentEmail: string | null) => Promise<void>;
  onDeleteClick: (userId: string) => void;
}

const getRoleFromEmail = (email: string | null): string => {
  if (!email) return 'Unknown';
  if (email.includes('@supadmin.tn')) return 'Superadmin';
  if (email.includes('@admin.tn')) return 'Admin';
  if (email.includes('@technician.tn')) return 'Technician';
  return 'Unknown';
};

export function UserCard({ user, onRoleChange, onDeleteClick }: UserCardProps) {
  const roleFromEmail = getRoleFromEmail(user.email);

  return (
    <div className="flex justify-between items-center border-b pb-4">
      <div>
        <p className="font-medium">{user.full_name}</p>
        <p className="text-sm text-muted-foreground">{user.user_id}</p>
        {user.email && (
          <>
            <p className="text-xs text-muted-foreground">Email: {user.email}</p>
            <p className="text-xs text-muted-foreground">Role: {roleFromEmail}</p>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Select
          defaultValue={user.role}
          onValueChange={(value) => onRoleChange(user.id, value, user.email)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="technician">Technician</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDeleteClick(user.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}