export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          compatibility: string | null
          contacted: boolean
          contacted_at: string | null
          created_at: string
          email: string
          id: string
          matched_strain: string | null
          name: string | null
          province: string | null
          source: string | null
          strain_cbd: string | null
          strain_effects: string | null
          strain_flavours: string | null
          strain_price: string | null
          strain_shop_url: string | null
          strain_thc: string | null
          survey_answers: Json | null
          whatsapp: string | null
          whatsapp_e164: string | null
          whatsapp_opt_in: boolean
          whatsapp_sent_at: string | null
          whatsapp_status: string | null
        }
        Insert: {
          compatibility?: string | null
          contacted?: boolean
          contacted_at?: string | null
          created_at?: string
          email: string
          id?: string
          matched_strain?: string | null
          name?: string | null
          province?: string | null
          source?: string | null
          strain_cbd?: string | null
          strain_effects?: string | null
          strain_flavours?: string | null
          strain_price?: string | null
          strain_shop_url?: string | null
          strain_thc?: string | null
          survey_answers?: Json | null
          whatsapp?: string | null
          whatsapp_e164?: string | null
          whatsapp_opt_in?: boolean
          whatsapp_sent_at?: string | null
          whatsapp_status?: string | null
        }
        Update: {
          compatibility?: string | null
          contacted?: boolean
          contacted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          matched_strain?: string | null
          name?: string | null
          province?: string | null
          source?: string | null
          strain_cbd?: string | null
          strain_effects?: string | null
          strain_flavours?: string | null
          strain_price?: string | null
          strain_shop_url?: string | null
          strain_thc?: string | null
          survey_answers?: Json | null
          whatsapp?: string | null
          whatsapp_e164?: string | null
          whatsapp_opt_in?: boolean
          whatsapp_sent_at?: string | null
          whatsapp_status?: string | null
        }
        Relationships: []
      }
      survey_submissions: {
        Row: {
          compatibility: string | null
          created_at: string
          email: string
          id: string
          matched_strain: string | null
          name: string | null
          payload: Json
          source: string | null
          survey_answers: Json
          updated_at: string
          webhook_attempts: number
          webhook_error: string | null
          webhook_last_attempt_at: string | null
          webhook_response: string | null
          webhook_status: string
          webhook_status_code: number | null
          webhook_url: string
        }
        Insert: {
          compatibility?: string | null
          created_at?: string
          email: string
          id?: string
          matched_strain?: string | null
          name?: string | null
          payload?: Json
          source?: string | null
          survey_answers?: Json
          updated_at?: string
          webhook_attempts?: number
          webhook_error?: string | null
          webhook_last_attempt_at?: string | null
          webhook_response?: string | null
          webhook_status?: string
          webhook_status_code?: number | null
          webhook_url?: string
        }
        Update: {
          compatibility?: string | null
          created_at?: string
          email?: string
          id?: string
          matched_strain?: string | null
          name?: string | null
          payload?: Json
          source?: string | null
          survey_answers?: Json
          updated_at?: string
          webhook_attempts?: number
          webhook_error?: string | null
          webhook_last_attempt_at?: string | null
          webhook_response?: string | null
          webhook_status?: string
          webhook_status_code?: number | null
          webhook_url?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
