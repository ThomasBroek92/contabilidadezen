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
      cadence_steps: {
        Row: {
          cadence_id: string
          created_at: string | null
          day_offset: number
          id: string
          priority: string | null
          task_description: string | null
          task_title: string
          task_type: string | null
        }
        Insert: {
          cadence_id: string
          created_at?: string | null
          day_offset: number
          id?: string
          priority?: string | null
          task_description?: string | null
          task_title: string
          task_type?: string | null
        }
        Update: {
          cadence_id?: string
          created_at?: string | null
          day_offset?: number
          id?: string
          priority?: string | null
          task_description?: string | null
          task_title?: string
          task_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cadence_steps_cadence_id_fkey"
            columns: ["cadence_id"]
            isOneToOne: false
            referencedRelation: "cadence_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      cadence_templates: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      geo_settings: {
        Row: {
          ai_custom_instructions: string | null
          ai_tone: string | null
          allowed_external_sources: string[] | null
          answer_first_format: boolean | null
          auto_expert_quotes_enabled: boolean | null
          auto_generate_faq: boolean | null
          auto_suggest_frequency: string | null
          brand_authority_keywords: string[] | null
          brand_name: string | null
          brand_statistics: Json | null
          content_length_max: number | null
          content_length_min: number | null
          created_at: string | null
          cta_button_text: string | null
          cta_description: string | null
          cta_enabled: boolean | null
          cta_position: string | null
          cta_title: string | null
          cta_type: string | null
          cta_whatsapp_message: string | null
          exclude_competitor_quotes: boolean | null
          excluded_citation_keywords: string[] | null
          expert_bio: string | null
          expert_company: string | null
          expert_name: string | null
          expert_quotes_enabled: boolean | null
          expert_title: string | null
          external_linking_enabled: boolean | null
          faq_count: number | null
          freshness_signals_enabled: boolean | null
          id: string
          internal_linking_enabled: boolean | null
          lead_form_description: string | null
          lead_form_title: string | null
          max_external_links: number | null
          max_internal_links: number | null
          min_external_links: number | null
          min_geo_score_publish: number | null
          min_internal_links: number | null
          preferred_citation_sources: string[] | null
          preferred_expert_types: string[] | null
          reading_level: string | null
          seo_meta_auto_generate: boolean | null
          show_lead_form: boolean | null
          show_pj_comparison: boolean | null
          show_tax_calculator: boolean | null
          statistics_citations_enabled: boolean | null
          structured_data_enabled: boolean | null
          target_personas: string[] | null
          updated_at: string | null
        }
        Insert: {
          ai_custom_instructions?: string | null
          ai_tone?: string | null
          allowed_external_sources?: string[] | null
          answer_first_format?: boolean | null
          auto_expert_quotes_enabled?: boolean | null
          auto_generate_faq?: boolean | null
          auto_suggest_frequency?: string | null
          brand_authority_keywords?: string[] | null
          brand_name?: string | null
          brand_statistics?: Json | null
          content_length_max?: number | null
          content_length_min?: number | null
          created_at?: string | null
          cta_button_text?: string | null
          cta_description?: string | null
          cta_enabled?: boolean | null
          cta_position?: string | null
          cta_title?: string | null
          cta_type?: string | null
          cta_whatsapp_message?: string | null
          exclude_competitor_quotes?: boolean | null
          excluded_citation_keywords?: string[] | null
          expert_bio?: string | null
          expert_company?: string | null
          expert_name?: string | null
          expert_quotes_enabled?: boolean | null
          expert_title?: string | null
          external_linking_enabled?: boolean | null
          faq_count?: number | null
          freshness_signals_enabled?: boolean | null
          id?: string
          internal_linking_enabled?: boolean | null
          lead_form_description?: string | null
          lead_form_title?: string | null
          max_external_links?: number | null
          max_internal_links?: number | null
          min_external_links?: number | null
          min_geo_score_publish?: number | null
          min_internal_links?: number | null
          preferred_citation_sources?: string[] | null
          preferred_expert_types?: string[] | null
          reading_level?: string | null
          seo_meta_auto_generate?: boolean | null
          show_lead_form?: boolean | null
          show_pj_comparison?: boolean | null
          show_tax_calculator?: boolean | null
          statistics_citations_enabled?: boolean | null
          structured_data_enabled?: boolean | null
          target_personas?: string[] | null
          updated_at?: string | null
        }
        Update: {
          ai_custom_instructions?: string | null
          ai_tone?: string | null
          allowed_external_sources?: string[] | null
          answer_first_format?: boolean | null
          auto_expert_quotes_enabled?: boolean | null
          auto_generate_faq?: boolean | null
          auto_suggest_frequency?: string | null
          brand_authority_keywords?: string[] | null
          brand_name?: string | null
          brand_statistics?: Json | null
          content_length_max?: number | null
          content_length_min?: number | null
          created_at?: string | null
          cta_button_text?: string | null
          cta_description?: string | null
          cta_enabled?: boolean | null
          cta_position?: string | null
          cta_title?: string | null
          cta_type?: string | null
          cta_whatsapp_message?: string | null
          exclude_competitor_quotes?: boolean | null
          excluded_citation_keywords?: string[] | null
          expert_bio?: string | null
          expert_company?: string | null
          expert_name?: string | null
          expert_quotes_enabled?: boolean | null
          expert_title?: string | null
          external_linking_enabled?: boolean | null
          faq_count?: number | null
          freshness_signals_enabled?: boolean | null
          id?: string
          internal_linking_enabled?: boolean | null
          lead_form_description?: string | null
          lead_form_title?: string | null
          max_external_links?: number | null
          max_internal_links?: number | null
          min_external_links?: number | null
          min_geo_score_publish?: number | null
          min_internal_links?: number | null
          preferred_citation_sources?: string[] | null
          preferred_expert_types?: string[] | null
          reading_level?: string | null
          seo_meta_auto_generate?: boolean | null
          show_lead_form?: boolean | null
          show_pj_comparison?: boolean | null
          show_tax_calculator?: boolean | null
          statistics_citations_enabled?: boolean | null
          structured_data_enabled?: boolean | null
          target_personas?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      indexing_queue: {
        Row: {
          action: string
          blog_post_id: string | null
          created_at: string
          id: string
          processed_at: string | null
          result: Json | null
          retry_count: number
          status: string
          url: string
        }
        Insert: {
          action?: string
          blog_post_id?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          result?: Json | null
          retry_count?: number
          status?: string
          url: string
        }
        Update: {
          action?: string
          blog_post_id?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          result?: Json | null
          retry_count?: number
          status?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "indexing_queue_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
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
      partner_referrals: {
        Row: {
          commission_value: number | null
          created_at: string
          id: string
          notes: string | null
          paid_at: string | null
          partner_email: string
          partner_name: string
          referred_email: string
          referred_empresa: string | null
          referred_name: string
          referred_segmento: string | null
          referred_whatsapp: string
          status: string
          updated_at: string
        }
        Insert: {
          commission_value?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          partner_email: string
          partner_name: string
          referred_email: string
          referred_empresa?: string | null
          referred_name: string
          referred_segmento?: string | null
          referred_whatsapp: string
          status?: string
          updated_at?: string
        }
        Update: {
          commission_value?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          partner_email?: string
          partner_name?: string
          referred_email?: string
          referred_empresa?: string | null
          referred_name?: string
          referred_segmento?: string | null
          referred_whatsapp?: string
          status?: string
          updated_at?: string
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
      tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          notion_page_id: string | null
          position: number
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          notion_page_id?: string | null
          position?: number
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          notion_page_id?: string | null
          position?: number
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "backlog" | "todo" | "in_progress" | "review" | "done"
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
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["backlog", "todo", "in_progress", "review", "done"],
    },
  },
} as const
