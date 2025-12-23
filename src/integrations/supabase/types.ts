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
      blog_posts: {
        Row: {
          answer_first_validated: boolean | null
          author_id: string | null
          authority_citations: string[] | null
          auto_published: boolean | null
          category: string
          content: string
          created_at: string
          ctr: number | null
          editorial_status:
            | Database["public"]["Enums"]["editorial_status"]
            | null
          etapa_funil: Database["public"]["Enums"]["funnel_stage"] | null
          excerpt: string | null
          expert_quotes: Json | null
          faq_schema: Json | null
          featured_image_url: string | null
          freshness_date: string | null
          geo_score: number | null
          id: string
          leads_gerados: number | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          objetivo: Database["public"]["Enums"]["content_objective"] | null
          persona_alvo: string | null
          published_at: string | null
          read_time_minutes: number | null
          responsavel_editor_id: string | null
          responsavel_redator_id: string | null
          responsavel_revisor_id: string | null
          roi: number | null
          scheduled_for: string | null
          slug: string
          statistics: Json | null
          status: string
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          answer_first_validated?: boolean | null
          author_id?: string | null
          authority_citations?: string[] | null
          auto_published?: boolean | null
          category?: string
          content: string
          created_at?: string
          ctr?: number | null
          editorial_status?:
            | Database["public"]["Enums"]["editorial_status"]
            | null
          etapa_funil?: Database["public"]["Enums"]["funnel_stage"] | null
          excerpt?: string | null
          expert_quotes?: Json | null
          faq_schema?: Json | null
          featured_image_url?: string | null
          freshness_date?: string | null
          geo_score?: number | null
          id?: string
          leads_gerados?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          objetivo?: Database["public"]["Enums"]["content_objective"] | null
          persona_alvo?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          responsavel_editor_id?: string | null
          responsavel_redator_id?: string | null
          responsavel_revisor_id?: string | null
          roi?: number | null
          scheduled_for?: string | null
          slug: string
          statistics?: Json | null
          status?: string
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          answer_first_validated?: boolean | null
          author_id?: string | null
          authority_citations?: string[] | null
          auto_published?: boolean | null
          category?: string
          content?: string
          created_at?: string
          ctr?: number | null
          editorial_status?:
            | Database["public"]["Enums"]["editorial_status"]
            | null
          etapa_funil?: Database["public"]["Enums"]["funnel_stage"] | null
          excerpt?: string | null
          expert_quotes?: Json | null
          faq_schema?: Json | null
          featured_image_url?: string | null
          freshness_date?: string | null
          geo_score?: number | null
          id?: string
          leads_gerados?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          objetivo?: Database["public"]["Enums"]["content_objective"] | null
          persona_alvo?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          responsavel_editor_id?: string | null
          responsavel_redator_id?: string | null
          responsavel_revisor_id?: string | null
          roi?: number | null
          scheduled_for?: string | null
          slug?: string
          statistics?: Json | null
          status?: string
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      blog_topics: {
        Row: {
          category: string
          created_at: string | null
          error_message: string | null
          generated_post_id: string | null
          id: string
          scheduled_date: string
          search_query: string | null
          status: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          error_message?: string | null
          generated_post_id?: string | null
          id?: string
          scheduled_date: string
          search_query?: string | null
          status?: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          error_message?: string | null
          generated_post_id?: string | null
          id?: string
          scheduled_date?: string
          search_query?: string | null
          status?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_topics_generated_post_id_fkey"
            columns: ["generated_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      geo_settings: {
        Row: {
          auto_suggest_frequency: string | null
          brand_authority_keywords: string[] | null
          brand_name: string | null
          brand_statistics: Json | null
          created_at: string | null
          id: string
          min_geo_score_publish: number | null
          preferred_expert_types: string[] | null
          target_personas: string[] | null
          updated_at: string | null
        }
        Insert: {
          auto_suggest_frequency?: string | null
          brand_authority_keywords?: string[] | null
          brand_name?: string | null
          brand_statistics?: Json | null
          created_at?: string | null
          id?: string
          min_geo_score_publish?: number | null
          preferred_expert_types?: string[] | null
          target_personas?: string[] | null
          updated_at?: string | null
        }
        Update: {
          auto_suggest_frequency?: string | null
          brand_authority_keywords?: string[] | null
          brand_name?: string | null
          brand_statistics?: Json | null
          created_at?: string | null
          id?: string
          min_geo_score_publish?: number | null
          preferred_expert_types?: string[] | null
          target_personas?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_interactions: {
        Row: {
          created_at: string
          data_interacao: string
          descricao: string
          duracao_minutos: number | null
          id: string
          lead_id: string
          resultado: string | null
          tipo: Database["public"]["Enums"]["interaction_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data_interacao?: string
          descricao: string
          duracao_minutos?: number | null
          id?: string
          lead_id: string
          resultado?: string | null
          tipo: Database["public"]["Enums"]["interaction_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data_interacao?: string
          descricao?: string
          duracao_minutos?: number | null
          id?: string
          lead_id?: string
          resultado?: string | null
          tipo?: Database["public"]["Enums"]["interaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_tasks: {
        Row: {
          concluida: boolean | null
          created_at: string
          data_vencimento: string
          descricao: string | null
          id: string
          lead_id: string
          prioridade: string | null
          titulo: string
          user_id: string | null
        }
        Insert: {
          concluida?: boolean | null
          created_at?: string
          data_vencimento: string
          descricao?: string | null
          id?: string
          lead_id: string
          prioridade?: string | null
          titulo: string
          user_id?: string | null
        }
        Update: {
          concluida?: boolean | null
          created_at?: string
          data_vencimento?: string
          descricao?: string | null
          id?: string
          lead_id?: string
          prioridade?: string | null
          titulo?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          cargo: string | null
          consentimento_lgpd: boolean | null
          created_at: string
          data_consentimento: string | null
          data_proximo_followup: string | null
          data_ultimo_contato: string | null
          economia_anual: number | null
          email: string
          empresa: string | null
          faturamento_mensal: number | null
          fonte: string
          gmv_total: number | null
          id: string
          media_compra_mensal: number | null
          nome: string
          origem: Database["public"]["Enums"]["lead_origin"] | null
          pipeline_stage: Database["public"]["Enums"]["pipeline_stage"] | null
          probabilidade_fechamento: number | null
          qtd_compras: number | null
          responsavel_id: string | null
          segmento: string
          updated_at: string | null
          valor_negocio: number | null
          whatsapp: string
        }
        Insert: {
          cargo?: string | null
          consentimento_lgpd?: boolean | null
          created_at?: string
          data_consentimento?: string | null
          data_proximo_followup?: string | null
          data_ultimo_contato?: string | null
          economia_anual?: number | null
          email: string
          empresa?: string | null
          faturamento_mensal?: number | null
          fonte: string
          gmv_total?: number | null
          id?: string
          media_compra_mensal?: number | null
          nome: string
          origem?: Database["public"]["Enums"]["lead_origin"] | null
          pipeline_stage?: Database["public"]["Enums"]["pipeline_stage"] | null
          probabilidade_fechamento?: number | null
          qtd_compras?: number | null
          responsavel_id?: string | null
          segmento: string
          updated_at?: string | null
          valor_negocio?: number | null
          whatsapp: string
        }
        Update: {
          cargo?: string | null
          consentimento_lgpd?: boolean | null
          created_at?: string
          data_consentimento?: string | null
          data_proximo_followup?: string | null
          data_ultimo_contato?: string | null
          economia_anual?: number | null
          email?: string
          empresa?: string | null
          faturamento_mensal?: number | null
          fonte?: string
          gmv_total?: number | null
          id?: string
          media_compra_mensal?: number | null
          nome?: string
          origem?: Database["public"]["Enums"]["lead_origin"] | null
          pipeline_stage?: Database["public"]["Enums"]["pipeline_stage"] | null
          probabilidade_fechamento?: number | null
          qtd_compras?: number | null
          responsavel_id?: string | null
          segmento?: string
          updated_at?: string | null
          valor_negocio?: number | null
          whatsapp?: string
        }
        Relationships: []
      }
      recurring_schedules: {
        Row: {
          auto_publish: boolean
          categories: string[]
          created_at: string
          day_of_week: number
          id: string
          is_active: boolean
          last_run_at: string | null
          min_geo_score: number
          name: string
          next_run_at: string | null
          time_of_day: string
          topic_templates: string[]
          topics_per_run: number
          updated_at: string
        }
        Insert: {
          auto_publish?: boolean
          categories?: string[]
          created_at?: string
          day_of_week: number
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          min_geo_score?: number
          name: string
          next_run_at?: string | null
          time_of_day?: string
          topic_templates?: string[]
          topics_per_run?: number
          updated_at?: string
        }
        Update: {
          auto_publish?: boolean
          categories?: string[]
          created_at?: string
          day_of_week?: number
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          min_geo_score?: number
          name?: string
          next_run_at?: string | null
          time_of_day?: string
          topic_templates?: string[]
          topics_per_run?: number
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_leads: { Args: { _user_id: string }; Returns: boolean }
      generate_blog_slug: { Args: { title: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      publish_scheduled_posts: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "sales_manager" | "sales_rep"
      content_objective: "trafego" | "leads" | "autoridade"
      editorial_status:
        | "draft"
        | "writing"
        | "review"
        | "scheduled"
        | "published"
      funnel_stage: "topo" | "meio" | "fundo"
      interaction_type:
        | "chamada"
        | "reuniao"
        | "email"
        | "whatsapp"
        | "anotacao"
      lead_origin: "inbound" | "outbound" | "indicacao" | "evento" | "outro"
      pipeline_stage:
        | "primeiro_contato"
        | "qualificacao"
        | "proposta"
        | "negociacao"
        | "fechamento"
        | "perdido"
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
      app_role: ["admin", "sales_manager", "sales_rep"],
      content_objective: ["trafego", "leads", "autoridade"],
      editorial_status: [
        "draft",
        "writing",
        "review",
        "scheduled",
        "published",
      ],
      funnel_stage: ["topo", "meio", "fundo"],
      interaction_type: ["chamada", "reuniao", "email", "whatsapp", "anotacao"],
      lead_origin: ["inbound", "outbound", "indicacao", "evento", "outro"],
      pipeline_stage: [
        "primeiro_contato",
        "qualificacao",
        "proposta",
        "negociacao",
        "fechamento",
        "perdido",
      ],
    },
  },
} as const
