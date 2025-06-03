import { Card } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: number | null | undefined;
  unit: string;
}

export function MetricCard({ label, value, unit }: MetricCardProps) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="text-2xl sm:text-3xl font-bold truncate">
          {typeof value === 'number' ? value.toFixed(1) : '0'} {unit}
        </div>
      </div>
    </Card>
  );
}