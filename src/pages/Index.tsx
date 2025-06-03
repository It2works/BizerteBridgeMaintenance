import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { Activity, Gauge, ThermometerSun, Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface SensorData {
  timestamp: string;
  temperature: number;
  humidity: number;
  load: number; // Updated from traffic_load
  flow_speed: number; // Using flow_speed instead of wind_speed
}

interface MaintenanceData {
  id: string;
  maintenance_type: string;
  status: string;
  timestamp: string;
  description: string;
}

const fetchSensorData = async () => {
  const { data, error } = await supabase
    .from("sensors")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(7);
  
  if (error) throw error;
  return data;
};

const fetchMaintenanceData = async () => {
  const { data, error } = await supabase
    .from("maintenance")
    .select("*")
    .order("timestamp", { ascending: true });
  
  if (error) throw error;
  return data;
};

const Index = () => {
  const { data: sensorData, isLoading: isLoadingSensors } = useQuery({
    queryKey: ["sensors"],
    queryFn: fetchSensorData,
    refetchInterval: 30000,
  });

  const { data: maintenanceData, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["maintenance"],
    queryFn: fetchMaintenanceData,
  });

  const latestSensor = sensorData?.[0];
  const lastMaintenance = maintenanceData?.filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  
  const nextMaintenance = maintenanceData?.filter(m => 
    m.status === 'pending' && new Date(m.timestamp) > new Date()
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];

  return (
    <div className="space-y-8 animate-in">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-ring bg-clip-text text-transparent">
        Bizerte Bridge Monitoring Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <ThermometerSun className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Temperature</h3>
              <p className="text-3xl font-bold mt-1">
                {latestSensor?.temperature?.toFixed(1)}°C
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Humidity</h3>
              <p className="text-3xl font-bold mt-1">
                {latestSensor?.humidity?.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Load</h3>
              <p className="text-3xl font-bold mt-1">
                {latestSensor?.load?.toFixed(0)} units
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Wind className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Flow Speed</h3>
              <p className="text-3xl font-bold mt-1">
                {latestSensor?.flow_speed?.toFixed(1)} m/s
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-6">Temperature Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensorData}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  className="text-muted-foreground"
                />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="hsl(var(--primary))"
                  fill="url(#temperatureGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-6">Load History</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensorData}>
                <defs>
                  <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--ring))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--ring))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  className="text-muted-foreground"
                />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="load" 
                  stroke="hsl(var(--ring))"
                  fill="url(#loadGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
          <h3 className="text-xl font-semibold mb-4">Next Scheduled Maintenance</h3>
          {nextMaintenance ? (
            <div className="space-y-3">
              <p><span className="font-medium">Type:</span> {nextMaintenance.maintenance_type}</p>
              <p><span className="font-medium">Date:</span> {new Date(nextMaintenance.timestamp).toLocaleString()}</p>
              <p><span className="font-medium">Description:</span> {nextMaintenance.description}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming maintenance scheduled</p>
          )}
        </Card>

        <Card className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
          <h3 className="text-xl font-semibold mb-4">Last Completed Maintenance</h3>
          {lastMaintenance ? (
            <div className="space-y-3">
              <p><span className="font-medium">Type:</span> {lastMaintenance.maintenance_type}</p>
              <p><span className="font-medium">Date:</span> {new Date(lastMaintenance.timestamp).toLocaleString()}</p>
              <p><span className="font-medium">Description:</span> {lastMaintenance.description}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No maintenance records found</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;