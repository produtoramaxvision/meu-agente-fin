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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bd_ativo: {
        Row: {
          created_at: string
          id: number
          number: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          number?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          number?: string | null
        }
        Relationships: []
      }
      calendars: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendars_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
        ]
      }
      chat_agente_sdr: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      chat_meu_agente: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      chat_remarketing: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          avatar_url: string | null
          billing_provider: string | null
          cpf: string | null
          created_at: string
          email: string | null
          external_subscription_id: string | null
          is_active: boolean
          last_seen_at: string | null
          name: string
          password: string | null
          phone: string
          plan_id: string | null
          subscription_active: boolean
          trial_ends_at: string | null
          updated_at: string
          whatsapp_instance_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          billing_provider?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          external_subscription_id?: string | null
          is_active?: boolean
          last_seen_at?: string | null
          name: string
          password?: string | null
          phone: string
          plan_id?: string | null
          subscription_active?: boolean
          trial_ends_at?: string | null
          updated_at?: string
          whatsapp_instance_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          billing_provider?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          external_subscription_id?: string | null
          is_active?: boolean
          last_seen_at?: string | null
          name?: string
          password?: string | null
          phone?: string
          plan_id?: string | null
          subscription_active?: boolean
          trial_ends_at?: string | null
          updated_at?: string
          whatsapp_instance_url?: string | null
        }
        Relationships: []
      }
      clientes_service_keys: {
        Row: {
          apify_actors_api_key_cipher: string | null
          apify_actors_api_key_last4: string | null
          apify_rag_web_browser_key_cipher: string | null
          apify_rag_web_browser_key_last4: string | null
          created_at: string
          firecrawl_api_key_cipher: string | null
          firecrawl_api_key_last4: string | null
          openai_api_key_cipher: string | null
          openai_api_key_last4: string | null
          openrouter_api_key_cipher: string | null
          openrouter_api_key_last4: string | null
          phone: string
          tavily_api_key_cipher: string | null
          tavily_api_key_last4: string | null
          updated_at: string
        }
        Insert: {
          apify_actors_api_key_cipher?: string | null
          apify_actors_api_key_last4?: string | null
          apify_rag_web_browser_key_cipher?: string | null
          apify_rag_web_browser_key_last4?: string | null
          created_at?: string
          firecrawl_api_key_cipher?: string | null
          firecrawl_api_key_last4?: string | null
          openai_api_key_cipher?: string | null
          openai_api_key_last4?: string | null
          openrouter_api_key_cipher?: string | null
          openrouter_api_key_last4?: string | null
          phone: string
          tavily_api_key_cipher?: string | null
          tavily_api_key_last4?: string | null
          updated_at?: string
        }
        Update: {
          apify_actors_api_key_cipher?: string | null
          apify_actors_api_key_last4?: string | null
          apify_rag_web_browser_key_cipher?: string | null
          apify_rag_web_browser_key_last4?: string | null
          created_at?: string
          firecrawl_api_key_cipher?: string | null
          firecrawl_api_key_last4?: string | null
          openai_api_key_cipher?: string | null
          openai_api_key_last4?: string | null
          openrouter_api_key_cipher?: string | null
          openrouter_api_key_last4?: string | null
          phone?: string
          tavily_api_key_cipher?: string | null
          tavily_api_key_last4?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cliente_service_keys_phone_fkey"
            columns: ["phone"]
            isOneToOne: true
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
        ]
      }
      event_participants: {
        Row: {
          comment: string | null
          email: string
          event_id: string
          id: string
          invited_at: string | null
          name: string
          responded_at: string | null
          response: string | null
          role: string | null
        }
        Insert: {
          comment?: string | null
          email: string
          event_id: string
          id?: string
          invited_at?: string | null
          name: string
          responded_at?: string | null
          response?: string | null
          role?: string | null
        }
        Update: {
          comment?: string | null
          email?: string
          event_id?: string
          id?: string
          invited_at?: string | null
          name?: string
          responded_at?: string | null
          response?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_reminders: {
        Row: {
          event_id: string
          id: string
          method: string
          offset_minutes: number
          payload: Json | null
        }
        Insert: {
          event_id: string
          id?: string
          method?: string
          offset_minutes?: number
          payload?: Json | null
        }
        Update: {
          event_id?: string
          id?: string
          method?: string
          offset_minutes?: number
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "event_reminders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_resources: {
        Row: {
          event_id: string
          resource_id: string
        }
        Insert: {
          event_id: string
          resource_id: string
        }
        Update: {
          event_id?: string
          resource_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_resources_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          all_day: boolean | null
          calendar_id: string | null
          category: string | null
          color: string | null
          conference_url: string | null
          created_at: string | null
          description: string | null
          end_ts: string
          exdates: string[] | null
          id: string
          location: string | null
          phone: string
          priority: string | null
          privacy: string | null
          rdates: string[] | null
          rrule: string | null
          series_master_id: string | null
          start_ts: string
          status: string | null
          timezone: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          all_day?: boolean | null
          calendar_id?: string | null
          category?: string | null
          color?: string | null
          conference_url?: string | null
          created_at?: string | null
          description?: string | null
          end_ts: string
          exdates?: string[] | null
          id?: string
          location?: string | null
          phone: string
          priority?: string | null
          privacy?: string | null
          rdates?: string[] | null
          rrule?: string | null
          series_master_id?: string | null
          start_ts: string
          status?: string | null
          timezone?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          all_day?: boolean | null
          calendar_id?: string | null
          category?: string | null
          color?: string | null
          conference_url?: string | null
          created_at?: string | null
          description?: string | null
          end_ts?: string
          exdates?: string[] | null
          id?: string
          location?: string | null
          phone?: string
          priority?: string | null
          privacy?: string | null
          rdates?: string[] | null
          rrule?: string | null
          series_master_id?: string | null
          start_ts?: string
          status?: string | null
          timezone?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
          {
            foreignKeyName: "events_series_master_id_fkey"
            columns: ["series_master_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_registros: {
        Row: {
          categoria: string
          created_at: string
          data_hora: string
          data_vencimento: string | null
          descricao: string | null
          id: number
          phone: string
          recorrencia_fim: string | null
          recorrente: boolean
          status: string
          tipo: Database["public"]["Enums"]["financeiro_tipo"]
          updated_at: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          data_hora?: string
          data_vencimento?: string | null
          descricao?: string | null
          id?: number
          phone: string
          recorrencia_fim?: string | null
          recorrente?: boolean
          status?: string
          tipo: Database["public"]["Enums"]["financeiro_tipo"]
          updated_at?: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          data_hora?: string
          data_vencimento?: string | null
          descricao?: string | null
          id?: number
          phone?: string
          recorrencia_fim?: string | null
          recorrente?: boolean
          status?: string
          tipo?: Database["public"]["Enums"]["financeiro_tipo"]
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_registros_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
        ]
      }
      focus_blocks: {
        Row: {
          created_at: string | null
          goal_minutes: number
          id: string
          phone: string
          priority: string | null
          recurrence_rrule: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          goal_minutes: number
          id?: string
          phone: string
          priority?: string | null
          recurrence_rrule?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          goal_minutes?: number
          id?: string
          phone?: string
          priority?: string | null
          recurrence_rrule?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_blocks_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
        ]
      }
      ingestion_log: {
        Row: {
          external_id: string
          id: string
          phone: string | null
          raw: Json
          received_at: string | null
          source: string
          upserted_event_id: string | null
        }
        Insert: {
          external_id: string
          id?: string
          phone?: string | null
          raw: Json
          received_at?: string | null
          source: string
          upserted_event_id?: string | null
        }
        Update: {
          external_id?: string
          id?: string
          phone?: string | null
          raw?: Json
          received_at?: string | null
          source?: string
          upserted_event_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingestion_log_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
          {
            foreignKeyName: "ingestion_log_upserted_event_id_fkey"
            columns: ["upserted_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      metas: {
        Row: {
          created_at: string | null
          icone: string | null
          id: string
          meta_principal: boolean
          phone: string
          prazo_meses: number | null
          titulo: string
          updated_at: string | null
          valor_atual: number
          valor_meta: number
        }
        Insert: {
          created_at?: string | null
          icone?: string | null
          id?: string
          meta_principal?: boolean
          phone: string
          prazo_meses?: number | null
          titulo: string
          updated_at?: string | null
          valor_atual?: number
          valor_meta: number
        }
        Update: {
          created_at?: string | null
          icone?: string | null
          id?: string
          meta_principal?: boolean
          phone?: string
          prazo_meses?: number | null
          titulo?: string
          updated_at?: string | null
          valor_atual?: number
          valor_meta?: number
        }
        Relationships: [
          {
            foreignKeyName: "metas_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          lida: boolean | null
          mensagem: string
          phone: string
          tipo: string
          titulo: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          lida?: boolean | null
          mensagem: string
          phone: string
          tipo: string
          titulo: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          lida?: boolean | null
          mensagem?: string
          phone?: string
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notifications_cliente_phone"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
          {
            foreignKeyName: "notifications_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
        ]
      }
      resources: {
        Row: {
          capacity: number | null
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          phone: string
          type: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          phone: string
          type: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          phone?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
        ]
      }
      scheduling_links: {
        Row: {
          active: boolean | null
          booking_rules: Json | null
          calendar_id: string | null
          created_at: string | null
          id: string
          mode: string
          phone: string
          public_slug: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          booking_rules?: Json | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          mode?: string
          phone: string
          public_slug: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          booking_rules?: Json | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          mode?: string
          phone?: string
          public_slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduling_links_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduling_links_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
        ]
      }
      sync_state: {
        Row: {
          created_at: string | null
          error: string | null
          external_calendar_id: string
          id: string
          last_synced_at: string | null
          phone: string
          provider: string
          status: string | null
          sync_token: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          external_calendar_id: string
          id?: string
          last_synced_at?: string | null
          phone: string
          provider: string
          status?: string | null
          sync_token?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error?: string | null
          external_calendar_id?: string
          id?: string
          last_synced_at?: string | null
          phone?: string
          provider?: string
          status?: string | null
          sync_token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_state_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["phone"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          phone: string
          position: number
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          phone: string
          position?: number
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          phone?: string
          position?: number
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_api_key_llm: {
        Args: { p_phone: string; p_secret: string }
        Returns: string
      }
      get_service_api_key: {
        Args: { p_phone: string; p_secret: string; p_service: string }
        Returns: string
      }
      set_api_key_llm: {
        Args: { p_phone: string; p_plainkey: string; p_secret: string }
        Returns: undefined
      }
      set_service_api_key: {
        Args: {
          p_phone: string
          p_plain: string
          p_secret: string
          p_service: string
        }
        Returns: undefined
      }
      update_monthly_goals: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_transaction_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      delivery_status: "pending" | "delivered" | "failed" | "discarded"
      execution_status:
        | "queued"
        | "running"
        | "succeeded"
        | "failed"
        | "canceled"
      financeiro_tipo: "entrada" | "saida"
      llm_provider: "openai" | "azure_openai" | "anthropic" | "google" | "other"
      message_direction: "inbound" | "outbound"
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "paused"
      task_priority: "low" | "medium" | "high"
      task_status: "pending" | "done" | "overdue"
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
      delivery_status: ["pending", "delivered", "failed", "discarded"],
      execution_status: [
        "queued",
        "running",
        "succeeded",
        "failed",
        "canceled",
      ],
      financeiro_tipo: ["entrada", "saida"],
      llm_provider: ["openai", "azure_openai", "anthropic", "google", "other"],
      message_direction: ["inbound", "outbound"],
      subscription_status: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "paused",
      ],
      task_priority: ["low", "medium", "high"],
      task_status: ["pending", "done", "overdue"],
    },
  },
} as const
