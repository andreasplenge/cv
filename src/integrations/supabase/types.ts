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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cv_coursework: {
        Row: {
          created_at: string
          education_id: string
          id: string
          name: string
          order_index: number
          technical_domain: string | null
          technical_domain_item: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          education_id: string
          id?: string
          name: string
          order_index?: number
          technical_domain?: string | null
          technical_domain_item?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          education_id?: string
          id?: string
          name?: string
          order_index?: number
          technical_domain?: string | null
          technical_domain_item?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_coursework_education_id_fkey"
            columns: ["education_id"]
            isOneToOne: false
            referencedRelation: "cv_education"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_education: {
        Row: {
          coursework: string[] | null
          created_at: string
          degree: string
          full_description: string | null
          honours: string | null
          id: string
          institution: string
          location: string | null
          order_index: number
          thesis: string | null
          updated_at: string
          year: number
        }
        Insert: {
          coursework?: string[] | null
          created_at?: string
          degree: string
          full_description?: string | null
          honours?: string | null
          id?: string
          institution: string
          location?: string | null
          order_index?: number
          thesis?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          coursework?: string[] | null
          created_at?: string
          degree?: string
          full_description?: string | null
          honours?: string | null
          id?: string
          institution?: string
          location?: string | null
          order_index?: number
          thesis?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      cv_experience: {
        Row: {
          company: string
          created_at: string
          description: string | null
          full_description: string | null
          id: string
          location: string | null
          order_index: number
          period: string
          role: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          full_description?: string | null
          id?: string
          location?: string | null
          order_index?: number
          period: string
          role: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          full_description?: string | null
          id?: string
          location?: string | null
          order_index?: number
          period?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      cv_general_info: {
        Row: {
          created_at: string
          email: string | null
          github: string | null
          id: string
          last_compiled: string | null
          linkedin: string | null
          location: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          github?: string | null
          id?: string
          last_compiled?: string | null
          linkedin?: string | null
          location?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          github?: string | null
          id?: string
          last_compiled?: string | null
          linkedin?: string | null
          location?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cv_publications: {
        Row: {
          authors: string | null
          created_at: string
          id: string
          link: string | null
          order_index: number
          title: string
          updated_at: string
          venue: string | null
          year: number | null
        }
        Insert: {
          authors?: string | null
          created_at?: string
          id?: string
          link?: string | null
          order_index?: number
          title: string
          updated_at?: string
          venue?: string | null
          year?: number | null
        }
        Update: {
          authors?: string | null
          created_at?: string
          id?: string
          link?: string | null
          order_index?: number
          title?: string
          updated_at?: string
          venue?: string | null
          year?: number | null
        }
        Relationships: []
      }
      cv_selected_work: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          features: string[] | null
          full_description: string | null
          id: string
          link: string | null
          order_index: number
          related_education_id: string | null
          related_experience_id: string | null
          slug: string | null
          tags: string[] | null
          tech_stack: string[] | null
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          full_description?: string | null
          id?: string
          link?: string | null
          order_index?: number
          related_education_id?: string | null
          related_experience_id?: string | null
          slug?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          full_description?: string | null
          id?: string
          link?: string | null
          order_index?: number
          related_education_id?: string | null
          related_experience_id?: string | null
          slug?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_selected_work_related_education_id_fkey"
            columns: ["related_education_id"]
            isOneToOne: false
            referencedRelation: "cv_education"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cv_selected_work_related_experience_id_fkey"
            columns: ["related_experience_id"]
            isOneToOne: false
            referencedRelation: "cv_experience"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_technical_domains: {
        Row: {
          created_at: string
          id: string
          is_highlighted: boolean
          order_index: number
          skill: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_highlighted?: boolean
          order_index?: number
          skill: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_highlighted?: boolean
          order_index?: number
          skill?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      pachinko_waitlist_entries: {
        Row: {
          afdeling: string
          areal: string | null
          boliggruppe: string
          created_at: string
          etage: string | null
          husleje: string | null
          id: string
          upload_date: string
          venteliste_placering: number | null
        }
        Insert: {
          afdeling: string
          areal?: string | null
          boliggruppe: string
          created_at?: string
          etage?: string | null
          husleje?: string | null
          id?: string
          upload_date: string
          venteliste_placering?: number | null
        }
        Update: {
          afdeling?: string
          areal?: string | null
          boliggruppe?: string
          created_at?: string
          etage?: string | null
          husleje?: string | null
          id?: string
          upload_date?: string
          venteliste_placering?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          color: Database["public"]["Enums"]["project_color"]
          created_at: string
          description: string | null
          id: string
          link: string
          title: string
        }
        Insert: {
          color?: Database["public"]["Enums"]["project_color"]
          created_at?: string
          description?: string | null
          id?: string
          link: string
          title: string
        }
        Update: {
          color?: Database["public"]["Enums"]["project_color"]
          created_at?: string
          description?: string | null
          id?: string
          link?: string
          title?: string
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
      project_color: "red" | "blue" | "yellow" | "green" | "blacknwhite"
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
      project_color: ["red", "blue", "yellow", "green", "blacknwhite"],
    },
  },
} as const
