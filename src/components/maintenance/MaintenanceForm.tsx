import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceFormProps {
  onSubmit: (formData: FormData) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

interface Profile {
  id: string;
  full_name: string;
  role: string;
}

const maintenanceTypes = [
  "Preventive",
  "Corrective",
  "Regulatory",
  "Conditional",
  "Currative",
  "Improvement"
] as const;

export function MaintenanceForm({ onSubmit, selectedDate, setSelectedDate }: MaintenanceFormProps) {
  const { data: technicians, isLoading: isLoadingTechnicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('role', 'technician')
        .eq('is_active', true);
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }} className="space-y-4">
      <div className="space-y-2">
        <Label>Date</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select name="type" required>
          <SelectTrigger>
            <SelectValue placeholder="Select maintenance type" />
          </SelectTrigger>
          <SelectContent>
            {maintenanceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Estimated Time (minutes)</Label>
        <Input id="time" name="time" type="number" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="technician">Technician</Label>
        <Select name="technician" required>
          <SelectTrigger>
            <SelectValue placeholder="Select technician" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingTechnicians ? (
              <SelectItem value="loading">Loading technicians...</SelectItem>
            ) : (
              technicians?.map((tech) => (
                <SelectItem key={tech.id} value={tech.id}>
                  {tech.full_name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Add Record</Button>
    </form>
  );
}