import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { metricLabels } from "./MetricSelect";
import { Gauge, Thermometer, Droplet, Signal, Wifi, Battery, Bolt } from "lucide-react";

interface SensorTableProps {
  data: any[];
  isLoading: boolean;
  refetch: () => void;
}

const metricUnits: Record<string, { unit: string; icon: JSX.Element }> = {
  temperature: { unit: "°C", icon: <Thermometer className="h-4 w-4" /> },
  humidity: { unit: "%", icon: <Droplet className="h-4 w-4" /> },
  strain: { unit: "με", icon: <Gauge className="h-4 w-4" /> },
  cumulative_strain: { unit: "με", icon: <Gauge className="h-4 w-4" /> },
  vibration_frequency: { unit: "Hz", icon: <Signal className="h-4 w-4" /> },
  vibration_amplitude: { unit: "mm", icon: <Signal className="h-4 w-4" /> },
  load: { unit: "kN", icon: <Gauge className="h-4 w-4" /> },
  displacement: { unit: "mm", icon: <Signal className="h-4 w-4" /> },
  barometric_pressure: { unit: "hPa", icon: <Gauge className="h-4 w-4" /> },
  uv_radiation: { unit: "W/m²", icon: <Bolt className="h-4 w-4" /> },
  water_level: { unit: "m", icon: <Droplet className="h-4 w-4" /> },
  flow_speed: { unit: "m/s", icon: <Signal className="h-4 w-4" /> },
  noise_level: { unit: "dB", icon: <Signal className="h-4 w-4" /> }
};

export function SensorTable({ data, isLoading, refetch }: SensorTableProps) {
  const { toast } = useToast();

  const toggleSensorStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('sensors')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Sensor ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });
      
      refetch();
    } catch (error) {
      console.error('Error toggling sensor status:', error);
      toast({
        title: "Error",
        description: "Failed to update sensor status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            {Object.entries(metricLabels).map(([key, label]) => (
              <TableHead key={key} className="whitespace-nowrap">
                <div className="flex items-center gap-1">
                  {metricUnits[key]?.icon}
                  {label} ({metricUnits[key]?.unit})
                </div>
              </TableHead>
            ))}
            <TableHead>Maintenance Type</TableHead>
            <TableHead>Maintenance Name</TableHead>
            <TableHead>Maintenance Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={Object.keys(metricLabels).length + 7} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            data?.map((sensor) => (
              <TableRow key={sensor.id}>
                <TableCell>{sensor.id}</TableCell>
                <TableCell>{sensor.sensor_type}</TableCell>
                <TableCell>
                  {sensor.location_section} ({sensor.location_x?.toFixed(2)}, {sensor.location_y?.toFixed(2)}, {sensor.location_z?.toFixed(2)})
                </TableCell>
                {Object.keys(metricLabels).map((key) => (
                  <TableCell key={key}>
                    {sensor[key] !== null ? `${sensor[key]?.toFixed(2)} ${metricUnits[key]?.unit}` : '-'}
                  </TableCell>
                ))}
                <TableCell>{sensor.maintenance_type}</TableCell>
                <TableCell>{sensor.maintenance_name}</TableCell>
                <TableCell>{sensor.maintenance_time}</TableCell>
                <TableCell>
                  <Switch
                    checked={sensor.is_active}
                    onCheckedChange={() => toggleSensorStatus(sensor.id, sensor.is_active)}
                  />
                </TableCell>
                <TableCell>{new Date(sensor.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}