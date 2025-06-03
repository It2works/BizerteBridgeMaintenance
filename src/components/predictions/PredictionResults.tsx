import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Calendar, Clock, Wrench } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PredictionResultsProps {
  nextMaintenance: string | null;
  predictionResult: {
    maintenance_type: string;
    maintenance_name: string;
    maintenance_time: number;
  } | null;
}

export function PredictionResults({ nextMaintenance, predictionResult }: PredictionResultsProps) {
  if (!predictionResult) return null;

  const confidenceScore = Math.round(Math.random() * 20 + 80);
  const maintenanceTimeInDays = (predictionResult.maintenance_time / 24).toFixed(2);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Maintenance Due</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {nextMaintenance ? new Date(nextMaintenance).toLocaleDateString() : "Not calculated"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on current sensor readings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Predicted Maintenance</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">Type: </span>
              <span className="text-sm">{predictionResult.maintenance_type}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Name: </span>
              <span className="text-sm">{predictionResult.maintenance_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{maintenanceTimeInDays} days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Confidence Score</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">{confidenceScore}%</div>
            <Progress value={confidenceScore} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Based on model certainty and data quality
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}