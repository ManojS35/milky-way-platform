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
      daily_records: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          quantity: number
          rate: number
          type: string
          user_id: string
          user_name: string
          user_role: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          id?: string
          quantity: number
          rate: number
          type: string
          user_id: string
          user_name: string
          user_role: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          quantity?: number
          rate?: number
          type?: string
          user_id?: string
          user_name?: string
          user_role?: string
        }
        Relationships: []
      }
      dairy_rates: {
        Row: {
          buyer_rate: number
          created_at: string
          effective_date: string
          id: string
          milkman_rate: number
        }
        Insert: {
          buyer_rate?: number
          created_at?: string
          effective_date?: string
          id?: string
          milkman_rate?: number
        }
        Update: {
          buyer_rate?: number
          created_at?: string
          effective_date?: string
          id?: string
          milkman_rate?: number
        }
        Relationships: []
      }
      milkman_payments: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          milkman_id: string
          milkman_name: string
          payment_method: string
          transaction_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          id?: string
          milkman_id: string
          milkman_name: string
          payment_method: string
          transaction_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          milkman_id?: string
          milkman_name?: string
          payment_method?: string
          transaction_id?: string
        }
        Relationships: []
      }
      milkmen: {
        Row: {
          account_number: string | null
          available: boolean | null
          created_at: string
          distance: string | null
          id: string
          ifsc_code: string | null
          location: string
          name: string
          phone: string | null
          rating: number | null
          status: string
          total_due: number | null
        }
        Insert: {
          account_number?: string | null
          available?: boolean | null
          created_at?: string
          distance?: string | null
          id: string
          ifsc_code?: string | null
          location: string
          name: string
          phone?: string | null
          rating?: number | null
          status?: string
          total_due?: number | null
        }
        Update: {
          account_number?: string | null
          available?: boolean | null
          created_at?: string
          distance?: string | null
          id?: string
          ifsc_code?: string | null
          location?: string
          name?: string
          phone?: string | null
          rating?: number | null
          status?: string
          total_due?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          buyer_id: string
          buyer_name: string
          created_at: string
          date: string
          id: string
          payment_method: string
          transaction_id: string
        }
        Insert: {
          amount: number
          buyer_id: string
          buyer_name: string
          created_at?: string
          date: string
          id?: string
          payment_method: string
          transaction_id: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          buyer_name?: string
          created_at?: string
          date?: string
          id?: string
          payment_method?: string
          transaction_id?: string
        }
        Relationships: []
      }
      product_sales: {
        Row: {
          amount: number
          buyer_id: string
          buyer_name: string
          buyer_role: string
          created_at: string
          date: string
          id: string
          product_id: string
          product_name: string
          quantity: number
          rate: number
        }
        Insert: {
          amount: number
          buyer_id: string
          buyer_name: string
          buyer_role: string
          created_at?: string
          date: string
          id?: string
          product_id: string
          product_name: string
          quantity: number
          rate: number
        }
        Update: {
          amount?: number
          buyer_id?: string
          buyer_name?: string
          buyer_role?: string
          created_at?: string
          date?: string
          id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          price: number
          unit: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          price: number
          unit: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          price?: number
          unit?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          location: string | null
          phone: string | null
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          location?: string | null
          phone?: string | null
          role: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          username?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
