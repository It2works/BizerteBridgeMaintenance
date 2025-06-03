import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("Loading predict-maintenance function...")

const BUCKET_NAME = 'ml_models';

async function downloadModel(supabaseClient: any, modelName: string) {
  try {
    const { data, error } = await supabaseClient
      .storage
      .from(BUCKET_NAME)
      .download(`${modelName}.pkl`);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error downloading model ${modelName}:`, error);
    throw error;
  }
}

function inputToMaintenanceTime(features: number[]) {
  // Remove features at index 4 and 10
  return features.filter((_, index) => index !== 4 && index !== 10);
}

function inputToMaintenanceName(features: number[]) {
  // Remove feature at index 7
  return features.filter((_, index) => index !== 7);
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { features } = await req.json()
    
    if (!features || !Array.isArray(features)) {
      throw new Error('Invalid input: features must be an array')
    }

    console.log("Received features:", features)

    // For now, we'll return mock predictions until the models are properly loaded
    // You'll need to upload your .pkl files to Supabase Storage
    const mockPredictions = {
      maintenance_type: features[4] > 0.2 ? "Corrective" : "Preventive",
      maintenance_name: features[7] > 0.15 ? "Bearing Replacement" : "Regular Inspection",
      maintenance_time: Math.round(features[0] * 0.5)
    };

    console.log("Sending predictions:", mockPredictions)

    return new Response(
      JSON.stringify(mockPredictions),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error("Error in predict-maintenance function:", error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})