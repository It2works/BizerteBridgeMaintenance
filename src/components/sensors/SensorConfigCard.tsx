import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SensorConfigCardProps {
  sensorType: string;
  isActive: boolean;
  onStatusChange: () => void;
}

export function SensorConfigCard({ sensorType, isActive, onStatusChange }: SensorConfigCardProps) {
  const { toast } = useToast();

  const toggleSensorStatus = async () => {
    try {
      const { error } = await supabase
        .from('sensor_configs')
        .update({ is_active: !isActive })
        .eq('sensor_type', sensorType);

      if (error) throw error;

      onStatusChange();
      toast({
        title: "Success",
        description: `Sensor ${isActive ? 'deactivated' : 'activated'} successfully`,
      });
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{sensorType}</h3>
          <Switch
            checked={isActive}
            onCheckedChange={toggleSensorStatus}
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Status: {isActive ? 'Active' : 'Inactive'}
        </p>
      </CardContent>
    </Card>
  );
}