export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      barometric_pressure_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      bridge_status: {
        Row: {
          created_at: string | null
          id: number
          is_in_maintenance: boolean | null
          next_opening: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_in_maintenance?: boolean | null
          next_opening?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_in_maintenance?: boolean | null
          next_opening?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      displacement_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      flow_speed_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      humidity_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      load_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      maintenance: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          maintenance_time: number | null
          maintenance_type: string | null
          status: string | null
          technician: string | null
          technician_id: string | null
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          maintenance_time?: number | null
          maintenance_type?: string | null
          status?: string | null
          technician?: string | null
          technician_id?: string | null
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          maintenance_time?: number | null
          maintenance_type?: string | null
          status?: string | null
          technician?: string | null
          technician_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      noise_level_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          is_pending_role_change: boolean | null
          requested_role: Database["public"]["Enums"]["user_role"] | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_pending_role_change?: boolean | null
          requested_role?: Database["public"]["Enums"]["user_role"] | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_pending_role_change?: boolean | null
          requested_role?: Database["public"]["Enums"]["user_role"] | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sensor_configs: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          sensor_type: Database["public"]["Enums"]["sensor_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          sensor_type: Database["public"]["Enums"]["sensor_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          sensor_type?: Database["public"]["Enums"]["sensor_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sensor_readings: {
        Row: {
          barometric_pressure: number | null
          created_at: string | null
          cumulative_strain: number | null
          day: number | null
          flow_speed: number | null
          hour: number | null
          humidity: number | null
          id: number
          minute: number | null
          month: number | null
          noise_level: number | null
          strain: number | null
          temperature: number | null
          traffic_load: number | null
          uv_radiation: number | null
          vibration_amplitude: number | null
          vibration_frequency: number | null
          wind_speed: number | null
          year: number | null
        }
        Insert: {
          barometric_pressure?: number | null
          created_at?: string | null
          cumulative_strain?: number | null
          day?: number | null
          flow_speed?: number | null
          hour?: number | null
          humidity?: number | null
          id?: number
          minute?: number | null
          month?: number | null
          noise_level?: number | null
          strain?: number | null
          temperature?: number | null
          traffic_load?: number | null
          uv_radiation?: number | null
          vibration_amplitude?: number | null
          vibration_frequency?: number | null
          wind_speed?: number | null
          year?: number | null
        }
        Update: {
          barometric_pressure?: number | null
          created_at?: string | null
          cumulative_strain?: number | null
          day?: number | null
          flow_speed?: number | null
          hour?: number | null
          humidity?: number | null
          id?: number
          minute?: number | null
          month?: number | null
          noise_level?: number | null
          strain?: number | null
          temperature?: number | null
          traffic_load?: number | null
          uv_radiation?: number | null
          vibration_amplitude?: number | null
          vibration_frequency?: number | null
          wind_speed?: number | null
          year?: number | null
        }
        Relationships: []
      }
      sensor_readings_new: {
        Row: {
          created_at: string | null
          id: number
          sensor: Database["public"]["Enums"]["sensor_type"]
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          sensor: Database["public"]["Enums"]["sensor_type"]
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          sensor?: Database["public"]["Enums"]["sensor_type"]
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      sensors: {
        Row: {
          barometric_pressure: number | null
          created_at: string | null
          cumulative_strain: number | null
          displacement: number | null
          flow_speed: number | null
          humidity: number | null
          id: number
          is_active: boolean | null
          load: number | null
          location_section: string | null
          location_x: number | null
          location_y: number | null
          location_z: number | null
          maintenance_name: string | null
          maintenance_time: number | null
          maintenance_type: string | null
          noise_level: number | null
          sensor_type: string | null
          strain: number | null
          temperature: number | null
          timestamp: string
          uv_radiation: number | null
          vibration_amplitude: number | null
          vibration_frequency: number | null
          water_level: number | null
        }
        Insert: {
          barometric_pressure?: number | null
          created_at?: string | null
          cumulative_strain?: number | null
          displacement?: number | null
          flow_speed?: number | null
          humidity?: number | null
          id?: number
          is_active?: boolean | null
          load?: number | null
          location_section?: string | null
          location_x?: number | null
          location_y?: number | null
          location_z?: number | null
          maintenance_name?: string | null
          maintenance_time?: number | null
          maintenance_type?: string | null
          noise_level?: number | null
          sensor_type?: string | null
          strain?: number | null
          temperature?: number | null
          timestamp?: string
          uv_radiation?: number | null
          vibration_amplitude?: number | null
          vibration_frequency?: number | null
          water_level?: number | null
        }
        Update: {
          barometric_pressure?: number | null
          created_at?: string | null
          cumulative_strain?: number | null
          displacement?: number | null
          flow_speed?: number | null
          humidity?: number | null
          id?: number
          is_active?: boolean | null
          load?: number | null
          location_section?: string | null
          location_x?: number | null
          location_y?: number | null
          location_z?: number | null
          maintenance_name?: string | null
          maintenance_time?: number | null
          maintenance_type?: string | null
          noise_level?: number | null
          sensor_type?: string | null
          strain?: number | null
          temperature?: number | null
          timestamp?: string
          uv_radiation?: number | null
          vibration_amplitude?: number | null
          vibration_frequency?: number | null
          water_level?: number | null
        }
        Relationships: []
      }
      session_history: {
        Row: {
          created_at: string | null
          event_type: Database["public"]["Enums"]["session_event_type"]
          id: number
          session_duration: unknown | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: Database["public"]["Enums"]["session_event_type"]
          id?: never
          session_duration?: unknown | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: Database["public"]["Enums"]["session_event_type"]
          id?: never
          session_duration?: unknown | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      strain_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          due_date: string | null
          finished_at: string | null
          id: number
          name: string
          priority: string | null
          status: string | null
        }
        Insert: {
          assignee_id?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          finished_at?: string | null
          id?: number
          name: string
          priority?: string | null
          status?: string | null
        }
        Update: {
          assignee_id?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          finished_at?: string | null
          id?: number
          name?: string
          priority?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      temperature_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      uv_radiation_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      vibration_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      water_level_readings: {
        Row: {
          created_at: string | null
          id: number
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          timestamp: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      sensor_type:
        | "Temperature"
        | "Humidity"
        | "Load"
        | "FlowSpeed"
        | "Displacement"
        | "BarometricPressure"
        | "WaterLevel"
        | "Vibration"
        | "Strain"
        | "NoiseLevel"
        | "UVRadiation"
      session_event_type: "login" | "logout"
      user_role: "citizen" | "technician" | "engineer" | "superadmin" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
