import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SensorMetric, metricLabels } from "./MetricSelect";
import { TimeRange } from "./TimeRangeSelect";
import { format } from "date-fns";
import { MetricCard } from "./MetricCard";
import { SensorChart } from "./SensorChart";

const TABLE_NAMES = {
  temperature: "temperature_readings",
  humidity: "humidity_readings",
  strain: "strain_readings",
  vibration: "vibration_readings",
  load: "load_readings",
  displacement: "displacement_readings",
  barometric_pressure: "barometric_pressure_readings",
  uv_radiation: "uv_radiation_readings",
  water_level: "water_level_readings",
  flow_speed: "flow_speed_readings",
  noise_level: "noise_level_readings"
} as const;

type TableNames = typeof TABLE_NAMES;
type TableNamesKeys = keyof TableNames;
type TableNamesValues = TableNames[TableNamesKeys];

interface Reading {
  value: number;
  timestamp: string;
}

const getReadings = async (metric: SensorMetric, timeRange: TimeRange): Promise<Reading[]> => {
  let hoursToSubtract = 24;
  
  switch (timeRange) {
    case "24h": hoursToSubtract = 24; break;
    case "7d": hoursToSubtract = 168; break;
    case "14d": hoursToSubtract = 336; break;
    case "1m": hoursToSubtract = 720; break;
    case "2m": hoursToSubtract = 1440; break;
    case "3m": hoursToSubtract = 2160; break;
    case "6m": hoursToSubtract = 4320; break;
    case "1y": hoursToSubtract = 8760; break;
    case "2y": hoursToSubtract = 17520; break;
    case "3y": hoursToSubtract = 26280; break;
    case "5y": hoursToSubtract = 43800; break;
    case "all": hoursToSubtract = 87600; break;
  }

  const tableName = TABLE_NAMES[metric] as TableNamesValues;
  
  const { data, error } = await supabase
    .from(tableName)
    .select('value, timestamp')
    .gte('timestamp', new Date(Date.now() - hoursToSubtract * 60 * 60 * 1000).toISOString())
    .order('timestamp', { ascending: true });

  if (error) throw error;
  
  return data?.map(reading => ({
    value: reading.value,
    timestamp: format(new Date(reading.timestamp), 'MM/dd/yyyy')
  })) || [];
};

const metricUnits: Record<SensorMetric, string> = {
  temperature: "°C",
  humidity: "%",
  strain: "με",
  vibration: "Hz",
  load: "kN",
  displacement: "mm",
  barometric_pressure: "hPa",
  uv_radiation: "W/m²",
  water_level: "m",
  flow_speed: "m/s",
  noise_level: "dB"
};

export function SensorMetrics() {
  const [selectedMetric, setSelectedMetric] = useState<SensorMetric>("temperature");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const { data: readings = [] } = useQuery({
    queryKey: ['readings', selectedMetric, timeRange],
    queryFn: () => getReadings(selectedMetric, timeRange),
  });

  const currentValue = readings[readings.length - 1]?.value || 0;
  const averageValue = readings.reduce((acc, curr) => acc + curr.value, 0) / (readings.length || 1);
  const minValue = readings.reduce((min, curr) => Math.min(min, curr.value), Infinity) || 0;
  const maxValue = readings.reduce((max, curr) => Math.max(max, curr.value), -Infinity) || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Current Value" 
          value={currentValue} 
          unit={metricUnits[selectedMetric]} 
        />
        <MetricCard 
          label="Average" 
          value={averageValue} 
          unit={metricUnits[selectedMetric]} 
        />
        <MetricCard 
          label="Minimum" 
          value={minValue} 
          unit={metricUnits[selectedMetric]} 
        />
        <MetricCard 
          label="Maximum" 
          value={maxValue} 
          unit={metricUnits[selectedMetric]} 
        />
      </div>

      <SensorChart
        selectedMetric={selectedMetric}
        timeRange={timeRange}
        readings={readings}
        onMetricChange={setSelectedMetric}
        onTimeRangeChange={setTimeRange}
      />
    </div>
  );
}