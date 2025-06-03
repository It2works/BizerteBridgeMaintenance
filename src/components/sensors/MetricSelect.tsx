import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SensorMetric = 
  | "temperature"
  | "humidity"
  | "strain"
  | "vibration"
  | "load"
  | "displacement"
  | "barometric_pressure"
  | "uv_radiation"
  | "water_level"
  | "flow_speed"
  | "noise_level";

interface MetricSelectProps {
  value: SensorMetric;
  onValueChange: (value: SensorMetric) => void;
}

const metricLabels: Record<SensorMetric, string> = {
  temperature: "Temperature (°C)",
  humidity: "Humidity (%)",
  strain: "Strain",
  vibration: "Vibration",
  load: "Load",
  displacement: "Displacement",
  barometric_pressure: "Barometric Pressure",
  uv_radiation: "UV Radiation",
  water_level: "Water Level",
  flow_speed: "Flow Speed",
  noise_level: "Noise Level"
};

export function MetricSelect({ value, onValueChange }: MetricSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Select metric" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(metricLabels).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { metricLabels };