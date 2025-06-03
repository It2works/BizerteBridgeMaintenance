import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useTheme } from "next-themes"

interface PredictionChartProps {
  predictionData: Array<{
    month: string;
    value: number;
  }>;
}

const chartConfig = {
  value: {
    label: "Health Score",
    theme: {
      light: "#3b82f6",
      dark: "#60a5fa",
    },
  },
};

export function PredictionChart({ predictionData }: PredictionChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bridge Health Score Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full sm:h-[400px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis 
                  dataKey="month"
                  stroke={isDark ? "#9ca3af" : "#6b7280"}
                  tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                />
                <YAxis 
                  domain={[60, 90]}
                  stroke={isDark ? "#9ca3af" : "#6b7280"}
                  tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
                />
                <ChartTooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isDark ? "#60a5fa" : "#3b82f6"}
                  fill={isDark ? "#60a5fa" : "#3b82f6"}
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Predicted health score trend over the next 6 months
        </p>
      </CardContent>
    </Card>
  )
}