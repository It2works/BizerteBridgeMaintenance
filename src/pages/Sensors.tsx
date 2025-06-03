import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SensorConfigCard } from "@/components/sensors/SensorConfigCard";
import { SensorMetrics } from "@/components/sensors/SensorMetrics";

export default function Sensors() {
  const { toast } = useToast();

  const { data: sensorConfigs, isLoading, refetch } = useQuery({
    queryKey: ["sensor-configs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sensor_configs")
        .select("*")
        .order("sensor_type");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sensors Management</h1>
      </div>

      <SensorMetrics />

      <Card>
        <CardHeader>
          <CardTitle>Sensor Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensorConfigs?.map((config) => (
              <SensorConfigCard
                key={config.id}
                sensorType={config.sensor_type}
                isActive={config.is_active}
                onStatusChange={refetch}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}