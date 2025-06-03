import { Card } from "@/components/ui/card";
import { MetricSelect } from "./MetricSelect";
import { TimeRangeSelect } from "./TimeRangeSelect";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "next-themes";
import { SensorMetric } from "./MetricSelect";
import { TimeRange } from "./TimeRangeSelect";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThreeDChart } from "../3d/ThreeDChart";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SensorChartProps {
  selectedMetric: SensorMetric;
  timeRange: TimeRange;
  readings: Array<{ value: number; timestamp: string }>;
  onMetricChange: (metric: SensorMetric) => void;
  onTimeRangeChange: (range: TimeRange) => void;
}

export function SensorChart({ 
  selectedMetric, 
  timeRange, 
  readings,
  onMetricChange,
  onTimeRangeChange
}: SensorChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMobile = useIsMobile();
  const [showThreeD, setShowThreeD] = useState(false);

  return (
    <Card className="p-4 sm:p-6 glass-card hover:scale-[1.02] transition-all duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Sensor Metrics Trend
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
          <MetricSelect value={selectedMetric} onValueChange={onMetricChange} />
          <TimeRangeSelect value={timeRange} onValueChange={onTimeRangeChange} />
          <button
            onClick={() => setShowThreeD(prev => !prev)}
            className="px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
          >
            {showThreeD ? "2D View" : "3D View"}
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={showThreeD ? "3d" : "2d"}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="h-[300px] sm:h-[400px] w-full"
        >
          {showThreeD ? (
            <ThreeDChart data={readings} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={readings} 
                margin={{ 
                  top: 10, 
                  right: isMobile ? 0 : 10, 
                  left: isMobile ? -20 : 0, 
                  bottom: 0 
                }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? "#60a5fa" : "#3b82f6"} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={isDark ? "#60a5fa" : "#3b82f6"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis 
                  dataKey="timestamp"
                  stroke={isDark ? "#9ca3af" : "#6b7280"}
                  tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                  fontSize={12}
                  angle={isMobile ? 45 : 0}
                  textAnchor={isMobile ? "start" : "middle"}
                  height={isMobile ? 60 : 30}
                />
                <YAxis
                  stroke={isDark ? "#9ca3af" : "#6b7280"}
                  tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? "hsl(var(--background))" : "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isDark ? "#60a5fa" : "#3b82f6"}
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}