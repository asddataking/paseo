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
      analytics_events: {
        Row: {
          business_id: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_staff: {
        Row: {
          business_id: string
          user_id: string
        }
        Insert: {
          business_id: string
          user_id: string
        }
        Update: {
          business_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_staff_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_staff_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_templates: {
        Row: {
          availability_labels: Json
          category: string
          id: string
          signal_options: Json
          wait_labels: Json
        }
        Insert: {
          availability_labels?: Json
          category: string
          id?: string
          signal_options?: Json
          wait_labels?: Json
        }
        Update: {
          availability_labels?: Json
          category?: string
          id?: string
          signal_options?: Json
          wait_labels?: Json
        }
        Relationships: []
      }
      businesses: {
        Row: {
          address: string | null
          business_config: Json | null
          category: string | null
          claimed_by: string | null
          created_at: string
          google_place_id: string | null
          id: string
          infra_tier: string
          name: string
          phone: string | null
          photo_url: string | null
          status: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_config?: Json | null
          category?: string | null
          claimed_by?: string | null
          created_at?: string
          google_place_id?: string | null
          id?: string
          infra_tier?: string
          name: string
          phone?: string | null
          photo_url?: string | null
          status?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_config?: Json | null
          category?: string | null
          claimed_by?: string | null
          created_at?: string
          google_place_id?: string | null
          id?: string
          infra_tier?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          status?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_claimed_by_fkey"
            columns: ["claimed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_items: {
        Row: {
          business_id: string
          collection_id: string
          created_at: string
          id: string
        }
        Insert: {
          business_id: string
          collection_id: string
          created_at?: string
          id?: string
        }
        Update: {
          business_id?: string
          collection_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "user_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      copilot_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          tool_calls: Json | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          tool_calls?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          tool_calls?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "copilot_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      current_business_status: {
        Row: {
          active_note: string | null
          active_perk_id: string | null
          active_signals: Json
          availability_status: string | null
          business_id: string
          last_updated_at: string
          wait_status: string | null
        }
        Insert: {
          active_note?: string | null
          active_perk_id?: string | null
          active_signals?: Json
          availability_status?: string | null
          business_id: string
          last_updated_at?: string
          wait_status?: string | null
        }
        Update: {
          active_note?: string | null
          active_perk_id?: string | null
          active_signals?: Json
          availability_status?: string | null
          business_id?: string
          last_updated_at?: string
          wait_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "current_business_status_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_businesses: {
        Row: {
          business_id: string
          created_at: string
          created_by: string | null
          featured_until: string | null
          id: string
          premium_placement: boolean
        }
        Insert: {
          business_id: string
          created_at?: string
          created_by?: string | null
          featured_until?: string | null
          id?: string
          premium_placement?: boolean
        }
        Update: {
          business_id?: string
          created_at?: string
          created_by?: string | null
          featured_until?: string | null
          id?: string
          premium_placement?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "featured_businesses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_businesses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_card_summaries: {
        Row: {
          ai_summary: string | null
          business_id: string
          computed_at: string
          context_hash: string | null
          expires_at: string
        }
        Insert: {
          ai_summary?: string | null
          business_id: string
          computed_at?: string
          context_hash?: string | null
          expires_at?: string
        }
        Update: {
          ai_summary?: string | null
          business_id?: string
          computed_at?: string
          context_hash?: string | null
          expires_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_card_summaries_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      live_signals: {
        Row: {
          business_id: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          metadata: Json
          signal_type: string
          signal_value: Json | null
          value: Json
        }
        Insert: {
          business_id: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json
          signal_type: string
          signal_value?: Json | null
          value?: Json
        }
        Update: {
          business_id?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json
          signal_type?: string
          signal_value?: Json | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "live_signals_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_signals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_copilot_actions: {
        Row: {
          action_type: string
          created_at: string
          id: string
          payload: Json
          preview: string
          status: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          payload: Json
          preview: string
          status?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          payload?: Json
          preview?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_copilot_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      perks: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          starts_at: string | null
          status: string
          tier_required: string
          title: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          status?: string
          tier_required?: string
          title: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          status?: string
          tier_required?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "perks_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          membership_tier: string
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          membership_tier?: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          membership_tier?: string
          role?: string
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          business_id: string
          created_at: string
          id: string
          perk_id: string
          redeemed_at: string | null
          redemption_code: string
          status: string
          user_id: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          perk_id: string
          redeemed_at?: string | null
          redemption_code: string
          status?: string
          user_id?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          perk_id?: string
          redeemed_at?: string | null
          redemption_code?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_perk_id_fkey"
            columns: ["perk_id"]
            isOneToOne: false
            referencedRelation: "perks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_behavior_events: {
        Row: {
          business_id: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json
          user_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          user_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_behavior_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_behavior_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_collections: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_business_member: { Args: { bid: string }; Returns: boolean }
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
