import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckSquare, ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { getUserRoleFromEmail } from "@/utils/auth";
import { useEffect, useState } from "react";

type Task = Database['public']['Tables']['tasks']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface TaskWithProfile extends Task {
  profiles: Pick<Profile, 'full_name'> | null;
}

interface TaskListProps {
  onTaskUpdate: () => void;
}

export function TaskList({ onTaskUpdate }: TaskListProps) {
  const [userRole, setUserRole] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TaskWithProfile | 'assignee_name';
    direction: 'asc' | 'desc';
  }>({ key: 'due_date', direction: 'asc' });

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserRole(getUserRoleFromEmail(session.user.email || ''));
        setUserId(session.user.id);
      }
    };
    getSession();
  }, []);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', sortConfig, userId],
    queryFn: async () => {
      console.log('Fetching tasks with sort:', sortConfig);
      let query = supabase
        .from('tasks')
        .select(`
          *,
          profiles (
            full_name
          )
        `);

      if (userRole === 'technician' && userId) {
        console.log('Filtering tasks for technician:', userId);
        query = query.eq('assignee_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      console.log('Tasks fetched successfully:', data);
      return data as TaskWithProfile[];
    },
    enabled: Boolean(userRole),
  });

  const toggleTaskCompletion = async (taskId: number, currentCompleted: boolean) => {
    try {
      if (currentCompleted && userRole === 'technician') {
        console.log('Technician cannot uncomplete tasks');
        return;
      }

      console.log('Toggling task completion:', { taskId, currentCompleted });
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !currentCompleted })
        .eq('id', taskId);

      if (error) throw error;
      console.log('Task completion toggled successfully');
      onTaskUpdate();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive";
      case "medium":
        return "bg-warning/20 text-warning";
      case "low":
        return "bg-success/20 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleSort = (key: keyof TaskWithProfile | 'assignee_name') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedTasks = tasks ? [...tasks].sort((a, b) => {
    if (sortConfig.key === 'assignee_name') {
      const aName = a.profiles?.full_name || '';
      const bName = b.profiles?.full_name || '';
      return sortConfig.direction === 'asc' 
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (!aValue && !bValue) return 0;
    if (!aValue) return sortConfig.direction === 'asc' ? 1 : -1;
    if (!bValue) return sortConfig.direction === 'asc' ? -1 : 1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortConfig.direction === 'asc' 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  }) : [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
            Task <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => handleSort('assignee_name')} className="cursor-pointer">
            Assigned To <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => handleSort('priority')} className="cursor-pointer">
            Priority <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
            Status <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => handleSort('due_date')} className="cursor-pointer">
            Due Date <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">Loading tasks...</TableCell>
          </TableRow>
        ) : (
          sortedTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.profiles?.full_name}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority || '')}`}>
                  {task.priority}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  task.completed ? "bg-success/20 text-success" :
                  task.status === "in-progress" ? "bg-warning/20 text-warning" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {task.completed ? "completed" : task.status}
                </span>
              </TableCell>
              <TableCell>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleTaskCompletion(task.id, task.completed || false)}
                  disabled={userRole === 'technician' && task.completed}
                >
                  <CheckSquare className={`h-4 w-4 ${task.completed ? "text-success" : ""}`} />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}