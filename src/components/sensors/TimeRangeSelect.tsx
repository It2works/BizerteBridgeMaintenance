import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type TimeRange = "24h" | "7d" | "14d" | "1m" | "2m" | "3m" | "6m" | "1y" | "2y" | "3y" | "5y" | "all";

interface TimeRangeSelectProps {
  value: TimeRange;
  onValueChange: (value: TimeRange) => void;
}

export function TimeRangeSelect({ value, onValueChange }: TimeRangeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="24h">Last 24 Hours</SelectItem>
        <SelectItem value="7d">Last 7 Days</SelectItem>
        <SelectItem value="14d">Last 14 Days</SelectItem>
        <SelectItem value="1m">Last Month</SelectItem>
        <SelectItem value="2m">Last 2 Months</SelectItem>
        <SelectItem value="3m">Last 3 Months</SelectItem>
        <SelectItem value="6m">Last 6 Months</SelectItem>
        <SelectItem value="1y">Last Year</SelectItem>
        <SelectItem value="2y">Last 2 Years</SelectItem>
        <SelectItem value="3y">Last 3 Years</SelectItem>
        <SelectItem value="5y">Last 5 Years</SelectItem>
        <SelectItem value="all">All Time</SelectItem>
      </SelectContent>
    </Select>
  );
}