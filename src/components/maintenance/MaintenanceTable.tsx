import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MaintenanceRecord {
  id: number;
  timestamp: string;
  maintenance_type: string;
  description: string;
  maintenance_time: number;
  status: string;
  technician: {
    full_name: string;
  } | null;
}

interface MaintenanceTableProps {
  data: MaintenanceRecord[] | null;
  isLoading: boolean;
}

export function MaintenanceTable({ data, isLoading }: MaintenanceTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isTechnician = window.location.pathname.includes('technician');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MaintenanceRecord | 'technician_name';
    direction: 'asc' | 'desc';
  } | null>(null);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/20 text-success";
      case "in-progress":
        return "bg-warning/20 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleStatusChange = async (recordId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('maintenance')
        .update({ status: newStatus })
        .eq('id', recordId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      toast({
        title: "Status Updated",
        description: `Maintenance record status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const sortData = (records: MaintenanceRecord[]) => {
    if (!sortConfig) return records;

    return [...records].sort((a, b) => {
      if (sortConfig.key === 'technician_name') {
        const aValue = a.technician?.full_name || '';
        const bValue = b.technician?.full_name || '';
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  };

  const handleSort = (key: keyof MaintenanceRecord | 'technician_name') => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = data ? sortData(data) : null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort('timestamp')} className="cursor-pointer">
            Date <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => handleSort('maintenance_type')} className="cursor-pointer">
            Type <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => handleSort('description')} className="cursor-pointer">
            Description <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => handleSort('maintenance_time')} className="cursor-pointer">
            Time (min) <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => handleSort('technician_name')} className="cursor-pointer">
            Technician <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
          <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
            Status <ArrowUpDown className="inline h-4 w-4" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">Loading...</TableCell>
          </TableRow>
        ) : (
          sortedData?.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{new Date(record.timestamp).toLocaleDateString()}</TableCell>
              <TableCell>{record.maintenance_type}</TableCell>
              <TableCell>{record.description}</TableCell>
              <TableCell>{record.maintenance_time}</TableCell>
              <TableCell>{record.technician?.full_name || 'Unassigned'}</TableCell>
              <TableCell>
                {isTechnician ? (
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(record.status)}`}>
                    {record.status}
                  </span>
                ) : (
                  <Menubar className="inline-flex">
                    <MenubarMenu>
                      <MenubarTrigger className={`px-2 py-1 rounded-full text-xs ${getStatusClass(record.status)}`}>
                        {record.status}
                      </MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem onClick={() => handleStatusChange(record.id, "pending")}>
                          Pending
                        </MenubarItem>
                        <MenubarItem onClick={() => handleStatusChange(record.id, "in-progress")}>
                          In Progress
                        </MenubarItem>
                        <MenubarItem onClick={() => handleStatusChange(record.id, "completed")}>
                          Completed
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}