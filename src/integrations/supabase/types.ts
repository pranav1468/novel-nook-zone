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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          name: string
          requirement_type: string
          requirement_value?: number
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number
        }
        Relationships: []
      }
      chapters: {
        Row: {
          chapter_number: number
          content: string | null
          created_at: string
          id: string
          novel_id: string
          title: string
        }
        Insert: {
          chapter_number: number
          content?: string | null
          created_at?: string
          id?: string
          novel_id: string
          title: string
        }
        Update: {
          chapter_number?: number
          content?: string | null
          created_at?: string
          id?: string
          novel_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          contribution_type: string
          created_at: string
          id: string
          language_from: string | null
          language_to: string | null
          message: string
          novel_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          contribution_type: string
          created_at?: string
          id?: string
          language_from?: string | null
          language_to?: string | null
          message: string
          novel_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          contribution_type?: string
          created_at?: string
          id?: string
          language_from?: string | null
          language_to?: string | null
          message?: string
          novel_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contributions_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          achievements: boolean
          created_at: string
          id: string
          new_chapters: boolean
          recommendations: boolean
          user_id: string
        }
        Insert: {
          achievements?: boolean
          created_at?: string
          id?: string
          new_chapters?: boolean
          recommendations?: boolean
          user_id: string
        }
        Update: {
          achievements?: boolean
          created_at?: string
          id?: string
          new_chapters?: boolean
          recommendations?: boolean
          user_id?: string
        }
        Relationships: []
      }
      novel_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          novel_id: string
          parent_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          novel_id: string
          parent_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          novel_id?: string
          parent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "novel_comments_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "novel_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "novel_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      novel_requests: {
        Row: {
          created_at: string
          description: string | null
          id: string
          original_language: string | null
          source_url: string | null
          status: string
          title: string
          user_id: string
          vote_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          original_language?: string | null
          source_url?: string | null
          status?: string
          title: string
          user_id: string
          vote_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          original_language?: string | null
          source_url?: string | null
          status?: string
          title?: string
          user_id?: string
          vote_count?: number
        }
        Relationships: []
      }
      novel_reviews: {
        Row: {
          content: string
          created_at: string
          helpful_count: number
          id: string
          novel_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          helpful_count?: number
          id?: string
          novel_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          helpful_count?: number
          id?: string
          novel_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "novel_reviews_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
      novel_votes: {
        Row: {
          created_at: string
          id: string
          novel_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          novel_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          novel_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "novel_votes_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
      novels: {
        Row: {
          author: string
          chapter_count: number
          cover_url: string | null
          created_at: string
          featured: boolean
          genre: string[]
          id: string
          rating: number
          status: Database["public"]["Enums"]["novel_status"]
          synopsis: string | null
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author: string
          chapter_count?: number
          cover_url?: string | null
          created_at?: string
          featured?: boolean
          genre?: string[]
          id?: string
          rating?: number
          status?: Database["public"]["Enums"]["novel_status"]
          synopsis?: string | null
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author?: string
          chapter_count?: number
          cover_url?: string | null
          created_at?: string
          featured?: boolean
          genre?: string[]
          id?: string
          rating?: number
          status?: Database["public"]["Enums"]["novel_status"]
          synopsis?: string | null
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      reading_list_items: {
        Row: {
          added_at: string
          id: string
          list_id: string
          novel_id: string
          sort_order: number
        }
        Insert: {
          added_at?: string
          id?: string
          list_id: string
          novel_id: string
          sort_order?: number
        }
        Update: {
          added_at?: string
          id?: string
          list_id?: string
          novel_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "reading_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "reading_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_list_items_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          chapter_number: number
          id: string
          novel_id: string
          scroll_position: number
          updated_at: string
          user_id: string
        }
        Insert: {
          chapter_number?: number
          id?: string
          novel_id: string
          scroll_position?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          chapter_number?: number
          id?: string
          novel_id?: string
          scroll_position?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      request_votes: {
        Row: {
          created_at: string
          id: string
          request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_votes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "novel_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_libraries: {
        Row: {
          added_at: string
          id: string
          novel_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          novel_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          novel_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_libraries_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "novels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_login_date: string
          level: number
          longest_streak: number
          total_logins: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login_date?: string
          level?: number
          longest_streak?: number
          total_logins?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login_date?: string
          level?: number
          longest_streak?: number
          total_logins?: number
          updated_at?: string
          user_id?: string
          xp?: number
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
      novel_status: "ongoing" | "completed" | "hiatus"
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
      novel_status: ["ongoing", "completed", "hiatus"],
    },
  },
} as const
