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
      ad_spend_daily: {
        Row: {
          campaign_slug: string | null
          clicks: number
          created_at: string
          date: string
          external_campaign_id: string | null
          id: string
          impressions: number
          source: string
          spend: number
        }
        Insert: {
          campaign_slug?: string | null
          clicks?: number
          created_at?: string
          date: string
          external_campaign_id?: string | null
          id?: string
          impressions?: number
          source: string
          spend?: number
        }
        Update: {
          campaign_slug?: string | null
          clicks?: number
          created_at?: string
          date?: string
          external_campaign_id?: string | null
          id?: string
          impressions?: number
          source?: string
          spend?: number
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      campaign_variants: {
        Row: {
          campaign_id: string
          created_at: string
          cta_color: string | null
          cta_label: string | null
          hero_headline: string | null
          hero_image_url: string | null
          hero_subheadline: string | null
          id: string
          traffic_weight: number
          variant_label: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          cta_color?: string | null
          cta_label?: string | null
          hero_headline?: string | null
          hero_image_url?: string | null
          hero_subheadline?: string | null
          id?: string
          traffic_weight?: number
          variant_label: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          cta_color?: string | null
          cta_label?: string | null
          hero_headline?: string | null
          hero_image_url?: string | null
          hero_subheadline?: string | null
          id?: string
          traffic_weight?: number
          variant_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_variants_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          created_at: string
          created_by: string | null
          cta_color: string | null
          cta_label: string | null
          end_date: string | null
          hero_headline: string | null
          hero_image_url: string | null
          hero_subheadline: string | null
          id: string
          name: string
          notes: string | null
          slug: string
          source: string
          start_date: string | null
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          cta_color?: string | null
          cta_label?: string | null
          end_date?: string | null
          hero_headline?: string | null
          hero_image_url?: string | null
          hero_subheadline?: string | null
          id?: string
          name: string
          notes?: string | null
          slug: string
          source?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          cta_color?: string | null
          cta_label?: string | null
          end_date?: string | null
          hero_headline?: string | null
          hero_image_url?: string | null
          hero_subheadline?: string | null
          id?: string
          name?: string
          notes?: string | null
          slug?: string
          source?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          html_body: string
          key: string
          subject: string
          text_body: string | null
          updated_at: string
        }
        Insert: {
          html_body: string
          key: string
          subject: string
          text_body?: string | null
          updated_at?: string
        }
        Update: {
          html_body?: string
          key?: string
          subject?: string
          text_body?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lead_events: {
        Row: {
          created_at: string
          created_by: string | null
          event_type: string
          id: string
          lead_id: string | null
          payload: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          event_type: string
          id?: string
          lead_id?: string | null
          payload?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event_type?: string
          id?: string
          lead_id?: string | null
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          browser: string | null
          campaign_slug: string | null
          compatibility: string | null
          contacted: boolean
          contacted_at: string | null
          created_at: string
          device_type: string | null
          email: string
          fbclid: string | null
          gclid: string | null
          id: string
          landing_page: string | null
          last_contacted_at: string | null
          matched_strain: string | null
          name: string | null
          notes: string | null
          province: string | null
          referrer: string | null
          source: string | null
          status: string
          strain_cbd: string | null
          strain_effects: string | null
          strain_flavours: string | null
          strain_price: string | null
          strain_shop_url: string | null
          strain_thc: string | null
          survey_answers: Json | null
          ttclid: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          variant: string | null
          whatsapp: string | null
          whatsapp_e164: string | null
          whatsapp_opt_in: boolean
          whatsapp_sent_at: string | null
          whatsapp_status: string | null
        }
        Insert: {
          browser?: string | null
          campaign_slug?: string | null
          compatibility?: string | null
          contacted?: boolean
          contacted_at?: string | null
          created_at?: string
          device_type?: string | null
          email: string
          fbclid?: string | null
          gclid?: string | null
          id?: string
          landing_page?: string | null
          last_contacted_at?: string | null
          matched_strain?: string | null
          name?: string | null
          notes?: string | null
          province?: string | null
          referrer?: string | null
          source?: string | null
          status?: string
          strain_cbd?: string | null
          strain_effects?: string | null
          strain_flavours?: string | null
          strain_price?: string | null
          strain_shop_url?: string | null
          strain_thc?: string | null
          survey_answers?: Json | null
          ttclid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant?: string | null
          whatsapp?: string | null
          whatsapp_e164?: string | null
          whatsapp_opt_in?: boolean
          whatsapp_sent_at?: string | null
          whatsapp_status?: string | null
        }
        Update: {
          browser?: string | null
          campaign_slug?: string | null
          compatibility?: string | null
          contacted?: boolean
          contacted_at?: string | null
          created_at?: string
          device_type?: string | null
          email?: string
          fbclid?: string | null
          gclid?: string | null
          id?: string
          landing_page?: string | null
          last_contacted_at?: string | null
          matched_strain?: string | null
          name?: string | null
          notes?: string | null
          province?: string | null
          referrer?: string | null
          source?: string | null
          status?: string
          strain_cbd?: string | null
          strain_effects?: string | null
          strain_flavours?: string | null
          strain_price?: string | null
          strain_shop_url?: string | null
          strain_thc?: string | null
          survey_answers?: Json | null
          ttclid?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant?: string | null
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
          browser: string | null
          campaign_slug: string | null
          compatibility: string | null
          created_at: string
          device_type: string | null
          email: string
          fbclid: string | null
          gclid: string | null
          id: string
          landing_page: string | null
          matched_strain: string | null
          name: string | null
          payload: Json
          referrer: string | null
          source: string | null
          survey_answers: Json
          ttclid: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          variant: string | null
          webhook_attempts: number
          webhook_error: string | null
          webhook_last_attempt_at: string | null
          webhook_response: string | null
          webhook_status: string
          webhook_status_code: number | null
          webhook_url: string
        }
        Insert: {
          browser?: string | null
          campaign_slug?: string | null
          compatibility?: string | null
          created_at?: string
          device_type?: string | null
          email: string
          fbclid?: string | null
          gclid?: string | null
          id?: string
          landing_page?: string | null
          matched_strain?: string | null
          name?: string | null
          payload?: Json
          referrer?: string | null
          source?: string | null
          survey_answers?: Json
          ttclid?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant?: string | null
          webhook_attempts?: number
          webhook_error?: string | null
          webhook_last_attempt_at?: string | null
          webhook_response?: string | null
          webhook_status?: string
          webhook_status_code?: number | null
          webhook_url?: string
        }
        Update: {
          browser?: string | null
          campaign_slug?: string | null
          compatibility?: string | null
          created_at?: string
          device_type?: string | null
          email?: string
          fbclid?: string | null
          gclid?: string | null
          id?: string
          landing_page?: string | null
          matched_strain?: string | null
          name?: string | null
          payload?: Json
          referrer?: string | null
          source?: string | null
          survey_answers?: Json
          ttclid?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant?: string | null
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          updated_at: string
          variables: Json
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
