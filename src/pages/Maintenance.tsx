import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MaintenanceForm } from "@/components/maintenance/MaintenanceForm";
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable";

export default function Maintenance() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isTechnician = window.location.pathname.includes('technician');

  const { data: maintenanceData, isLoading } = useQuery({
    queryKey: ["maintenance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance")
        .select(`
          id,
          timestamp,
          maintenance_type,
          description,
          maintenance_time,
          status,
          technician_id,
          technician:profiles!maintenance_technician_id_fkey(
            full_name
          )
        `)
        .order("timestamp", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  const monthlyRecords = maintenanceData?.filter(record => 
    new Date(record.timestamp).getMonth() === thisMonth
  ).length || 0;
  
  const yearlyRecords = maintenanceData?.filter(record => 
    new Date(record.timestamp).getFullYear() === thisYear
  ).length || 0;

  const handleAddRecord = async (formData: FormData) => {
    try {
      const maintenanceRecord = {
        timestamp: selectedDate?.toISOString(),
        maintenance_type: String(formData.get("type")),
        description: String(formData.get("description")),
        maintenance_time: Number(formData.get("time")),
        technician_id: String(formData.get("technician")),
        status: "pending" as const
      };

      const { error } = await supabase
        .from("maintenance")
        .insert(maintenanceRecord);

      if (error) throw error;

      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      toast({
        title: "Success",
        description: "Maintenance record added successfully",
      });
    } catch (error) {
      console.error("Error adding maintenance record:", error);
      toast({
        title: "Error",
        description: "Failed to add maintenance record",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'maintenance' },
        (payload) => {
          console.log('New maintenance record:', payload);
          queryClient.invalidateQueries({ queryKey: ["maintenance"] });
          toast({
            title: "New Record",
            description: "New maintenance record added",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Maintenance History</h1>
        {!isTechnician && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Maintenance Record</DialogTitle>
              </DialogHeader>
              <MaintenanceForm 
                onSubmit={handleAddRecord}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceData?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records This Month</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyRecords}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records This Year</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {yearlyRecords}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <MaintenanceTable data={maintenanceData} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
