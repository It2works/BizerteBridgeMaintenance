import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Brain, Wrench } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { PredictionChart } from "@/components/predictions/PredictionChart"
import { PredictionResults } from "@/components/predictions/PredictionResults"
import { PredictionError } from "@/components/predictions/PredictionError"

interface PredictionResult {
  maintenance_type: string;
  maintenance_name: string;
  maintenance_time: number;
}

const getRandomId = () => {
  // Generate random number between 10 and 760 (inclusive)
  return Math.floor(Math.random() * (760 - 10 + 1)) + 10;
};

const fetchRandomSensorReading = async () => {
  console.log("Fetching random sensor reading...");
  try {
    const randomId = getRandomId();
    console.log("Generated random ID:", randomId);

    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('id', randomId)
      .single();
    
    if (error) {
      console.error("Error fetching sensor reading:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No data found for ID:", randomId, "- trying another random ID");
      return fetchRandomSensorReading(); // Recursively try another random ID
    }
    
    console.log("Fetched sensor reading:", data);
    return data;
  } catch (error) {
    console.error("Error fetching sensor reading:", error);
    throw error;
  }
};

const formatSensorReadingForPrediction = (reading: any) => {
  if (!reading) return null;
  
  return [
    reading.traffic_load,
    reading.wind_speed,
    reading.temperature,
    reading.humidity,
    reading.strain,
    reading.cumulative_strain,
    reading.vibration_frequency,
    reading.vibration_amplitude,
    reading.barometric_pressure,
    reading.uv_radiation,
    reading.flow_speed,
    reading.noise_level,
    reading.year,
    reading.month,
    reading.day,
    reading.hour,
    reading.minute
  ];
};

const generatePredictionData = (sensorData: any) => {
  const baseScore = 75;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map((month, index) => ({
    month,
    value: Math.max(60, Math.min(90, baseScore + Math.sin(index) * 5 + Math.random() * 2))
  }));
};

export default function Predictions() {
  const [isLoading, setIsLoading] = useState(false);
  const [nextMaintenance, setNextMaintenance] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: sensorData, refetch } = useQuery({
    queryKey: ["sensors"],
    queryFn: fetchRandomSensorReading,
    enabled: false, // Don't fetch on component mount
  });

  const predictionData = generatePredictionData(sensorData);

  const handleTriggerPrediction = async () => {
    console.log("Triggering prediction...");
    setIsLoading(true);
    setPredictionError(null);
    
    try {
      // Fetch a new random reading for each prediction
      const { data: randomReading } = await refetch();
      const features = formatSensorReadingForPrediction(randomReading);
      
      if (!features) {
        throw new Error("No sensor reading available");
      }

      console.log("Sending prediction request with features:", features);

      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ features }),
      });

      console.log("Received response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from ML API:", errorText);
        throw new Error(`Failed to get prediction from ML API: ${errorText}`);
      }

      const result = await response.json();
      console.log("Received prediction response:", result);

      setPredictionResult({
        maintenance_type: result.maintenance_type,
        maintenance_name: result.maintenance_name,
        maintenance_time: result.maintenance_time
      });
      
      const nextDate = new Date();
      nextDate.setHours(nextDate.getHours() + result.maintenance_time);
      setNextMaintenance(nextDate.toISOString());
      
      toast({
        title: "Prediction Complete",
        description: "Maintenance prediction has been calculated",
      });
    } catch (error) {
      console.error("Prediction error:", error);
      setPredictionError("Failed to get prediction. Please ensure the ML service is running on port 5000.");
      toast({
        title: "Prediction Failed",
        description: "Could not complete maintenance prediction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Maintenance Predictions</h1>
        <Button 
          onClick={handleTriggerPrediction} 
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <Brain className="mr-2 h-4 w-4" />
          {isLoading ? "Calculating..." : "Update Prediction"}
        </Button>
      </div>

      <PredictionResults 
        nextMaintenance={nextMaintenance}
        predictionResult={predictionResult}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <PredictionChart predictionData={predictionData} />
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary/20 rounded-full">
              <Wrench className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">ML Model Predictions</h4>
              <p className="text-sm text-muted-foreground">
                Predictions are calculated using machine learning models based on current sensor data
              </p>
            </div>
          </div>
          {predictionResult && (
            <div className="space-y-2">
              <p><strong>Type:</strong> {predictionResult.maintenance_type}</p>
              <p><strong>Name:</strong> {predictionResult.maintenance_name}</p>
              <p><strong>Estimated Time:</strong> {predictionResult.maintenance_time} hours</p>
            </div>
          )}
        </div>
      </div>
      
      <PredictionError error={predictionError} />
    </div>
  );
}