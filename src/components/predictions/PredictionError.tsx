import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PredictionErrorProps {
  error: string | null;
}

export function PredictionError({ error }: PredictionErrorProps) {
  if (!error) return null;

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Prediction Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{error}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please ensure the ML model is properly loaded
        </p>
      </CardContent>
    </Card>
  )
}