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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      countries: {
        Row: {
          code: string
          currency: string
          enabled: boolean
          name_ar: string
          name_en: string
          shipping_cost: number
          sort_order: number
        }
        Insert: {
          code: string
          currency?: string
          enabled?: boolean
          name_ar: string
          name_en: string
          shipping_cost?: number
          sort_order?: number
        }
        Update: {
          code?: string
          currency?: string
          enabled?: boolean
          name_ar?: string
          name_en?: string
          shipping_cost?: number
          sort_order?: number
        }
        Relationships: []
      }
      inventory: {
        Row: {
          available: boolean
          color: string
          id: string
          product_id: string
          size: string
          stock: number
        }
        Insert: {
          available?: boolean
          color: string
          id?: string
          product_id: string
          size: string
          stock?: number
        }
        Update: {
          available?: boolean
          color?: string
          id?: string
          product_id?: string
          size?: string
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          color: string
          design: Json
          garment: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          qty: number
          size: string
          unit_price: number
        }
        Insert: {
          color: string
          design?: Json
          garment?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          qty?: number
          size: string
          unit_price?: number
        }
        Update: {
          color?: string
          design?: Json
          garment?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          qty?: number
          size?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          city: string
          country_code: string
          created_at: string
          currency: string
          customer_name: string
          discount: number
          email: string
          id: string
          notes: string | null
          order_number: string
          phone: string
          promo_code: string | null
          shipping: number
          status: string
          subtotal: number
          total: number
          user_id: string | null
        }
        Insert: {
          address?: string
          city?: string
          country_code: string
          created_at?: string
          currency?: string
          customer_name: string
          discount?: number
          email: string
          id?: string
          notes?: string | null
          order_number?: string
          phone: string
          promo_code?: string | null
          shipping?: number
          status?: string
          subtotal?: number
          total?: number
          user_id?: string | null
        }
        Update: {
          address?: string
          city?: string
          country_code?: string
          created_at?: string
          currency?: string
          customer_name?: string
          discount?: number
          email?: string
          id?: string
          notes?: string | null
          order_number?: string
          phone?: string
          promo_code?: string | null
          shipping?: number
          status?: string
          subtotal?: number
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      product_prices: {
        Row: {
          country_code: string
          id: string
          price: number
          product_id: string
          sale_price: number | null
        }
        Insert: {
          country_code: string
          id?: string
          price?: number
          product_id: string
          sale_price?: number | null
        }
        Update: {
          country_code?: string
          id?: string
          price?: number
          product_id?: string
          sale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_prices_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "product_prices_product_id_fkey"
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
          colors: Json
          created_at: string
          description_ar: string
          description_en: string
          enabled: boolean
          featured: boolean
          garment: string
          id: string
          images: Json
          name_ar: string
          name_en: string
          print_areas: Json
          size_chart: Json
          sizes: Json
          slug: string
          sort_order: number
          tagline_ar: string
          tagline_en: string
          updated_at: string
        }
        Insert: {
          category?: string
          colors?: Json
          created_at?: string
          description_ar?: string
          description_en?: string
          enabled?: boolean
          featured?: boolean
          garment?: string
          id?: string
          images?: Json
          name_ar?: string
          name_en: string
          print_areas?: Json
          size_chart?: Json
          sizes?: Json
          slug: string
          sort_order?: number
          tagline_ar?: string
          tagline_en?: string
          updated_at?: string
        }
        Update: {
          category?: string
          colors?: Json
          created_at?: string
          description_ar?: string
          description_en?: string
          enabled?: boolean
          featured?: boolean
          garment?: string
          id?: string
          images?: Json
          name_ar?: string
          name_en?: string
          print_areas?: Json
          size_chart?: Json
          sizes?: Json
          slug?: string
          sort_order?: number
          tagline_ar?: string
          tagline_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          min_total: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          min_total?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          min_total?: number
        }
        Relationships: []
      }
      site_content: {
        Row: {
          group_name: string
          key: string
          kind: string
          updated_at: string
          value_ar: string
          value_en: string
        }
        Insert: {
          group_name?: string
          key: string
          kind?: string
          updated_at?: string
          value_ar?: string
          value_en?: string
        }
        Update: {
          group_name?: string
          key?: string
          kind?: string
          updated_at?: string
          value_ar?: string
          value_en?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      check_promo: {
        Args: { _code: string; _subtotal: number }
        Returns: {
          code: string
          discount: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
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
      app_role: ["admin", "customer"],
    },
  },
} as const
