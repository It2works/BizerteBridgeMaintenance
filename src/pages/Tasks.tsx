import { useState } from "react";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";
import { TaskList } from "@/components/tasks/TaskList";
import { useQueryClient } from "@tanstack/react-query";

export default function Tasks() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const isTechnician = window.location.pathname.includes('technician');

  const handleTasksUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks Management</h1>
        {!isTechnician && (
          <AddTaskDialog 
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onTaskAdded={handleTasksUpdate}
          />
        )}
      </div>

      <TaskList onTaskUpdate={handleTasksUpdate} />
    </div>
  );
}