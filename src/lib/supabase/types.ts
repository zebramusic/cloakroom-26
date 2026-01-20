// This file is auto-generated from your Supabase schema
// Do not edit manually - run: supabase gen types typescript --local

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role_id: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role_id?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role_id?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
      }
      permissions: {
        Row: {
          id: string
          role_id: string
          module: string
          can_read: boolean
          can_create: boolean
          can_update: boolean
          can_delete: boolean
          created_at: string
        }
      }
      partners: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          website_url: string | null
          description: string | null
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          website_url?: string | null
          description?: string | null
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          website_url?: string | null
          description?: string | null
          display_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          quote_number: string
          client_name: string
          client_email: string
          client_phone: string | null
          client_company: string | null
          event_name: string
          event_type: string
          location: string
          start_date: string
          end_date: string
          estimated_participants: number | null
          needs_cloakroom: boolean
          needs_vip: boolean
          needs_backstage: boolean
          needs_bag_check: boolean
          needs_infrastructure: boolean
          constraints: string | null
          notes: string | null
          status: 'new' | 'in_review' | 'offer_sent' | 'negotiation' | 'booked' | 'completed' | 'cancelled'
          internal_notes: string | null
          honeypot: string | null
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_number: string
          client_name: string
          client_email: string
          client_phone?: string | null
          client_company?: string | null
          event_name: string
          event_type: string
          location: string
          start_date: string
          end_date: string
          estimated_participants?: number | null
          needs_cloakroom?: boolean
          needs_vip?: boolean
          needs_backstage?: boolean
          needs_bag_check?: boolean
          needs_infrastructure?: boolean
          constraints?: string | null
          notes?: string | null
          status?: 'new' | 'in_review' | 'offer_sent' | 'negotiation' | 'booked' | 'completed' | 'cancelled'
          internal_notes?: string | null
          honeypot?: string | null
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_number?: string
          client_name?: string
          client_email?: string
          client_phone?: string | null
          client_company?: string | null
          event_name?: string
          event_type?: string
          location?: string
          start_date?: string
          end_date?: string
          estimated_participants?: number | null
          needs_cloakroom?: boolean
          needs_vip?: boolean
          needs_backstage?: boolean
          needs_bag_check?: boolean
          needs_infrastructure?: boolean
          constraints?: string | null
          notes?: string | null
          status?: 'new' | 'in_review' | 'offer_sent' | 'negotiation' | 'booked' | 'completed' | 'cancelled'
          internal_notes?: string | null
          honeypot?: string | null
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name_ro: string
          name_en: string
          slug: string
          sku: string
          description_ro: string | null
          description_en: string | null
          features_ro: string | null
          features_en: string | null
          base_price: number
          tax_rate: number
          has_variants: boolean
          track_inventory: boolean
          stock_quantity: number
          low_stock_threshold: number
          is_active: boolean
          is_featured: boolean
          is_returnable: boolean
          weight_kg: number | null
          dimensions: string | null
          created_at: string
          updated_at: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          name_ro: string
          name_en: string
          attributes: Json | null
          price: number
          stock_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          billing_company: string | null
          billing_cui: string | null
          billing_address: string
          billing_city: string
          billing_county: string | null
          billing_postal_code: string | null
          billing_country: string
          shipping_address: string
          shipping_city: string
          shipping_county: string | null
          shipping_postal_code: string | null
          shipping_country: string
          subtotal: number
          tax_amount: number
          shipping_cost: number
          total_amount: number
          payment_method: 'card' | 'cod' | 'bank_transfer'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          stripe_payment_intent_id: string | null
          paid_at: string | null
          shipping_method: string | null
          tracking_number: string | null
          shipped_at: string | null
          delivered_at: string | null
          status: 'pending' | 'pending_cod' | 'pending_bank_transfer' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          customer_notes: string | null
          internal_notes: string | null
          invoice_number: string | null
          invoice_pdf_url: string | null
          created_at: string
          updated_at: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          product_name: string
          product_sku: string
          unit_price: number
          quantity: number
          tax_rate: number
          subtotal: number
          tax_amount: number
          total: number
          created_at: string
        }
      }
      faqs: {
        Row: {
          id: string
          question_ro: string
          question_en: string
          answer_ro: string
          answer_en: string
          category: string | null
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
      }
      content_blocks: {
        Row: {
          id: string
          key: string
          title_ro: string | null
          title_en: string | null
          content_ro: string | null
          content_en: string | null
          metadata: Json | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
      }
      legal_pages: {
        Row: {
          id: string
          slug: string
          title_ro: string
          title_en: string
          content_ro: string
          content_en: string
          version: string
          effective_date: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
      }
      shipping_methods: {
        Row: {
          id: string
          name_ro: string
          name_en: string
          code: string
          description_ro: string | null
          description_en: string | null
          base_cost: number
          free_shipping_threshold: number | null
          estimated_days_min: number | null
          estimated_days_max: number | null
          zones: string[] | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_permission: {
        Args: {
          module_name: string
          permission_type: string
        }
        Returns: boolean
      }
    }
    Enums: {
      quote_status: 'new' | 'in_review' | 'offer_sent' | 'negotiation' | 'booked' | 'completed' | 'cancelled'
      deal_type: 'revenue_share' | 'fixed' | 'hybrid' | 'tbd'
      order_status: 'pending' | 'pending_cod' | 'pending_bank_transfer' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
      payment_method: 'card' | 'cod' | 'bank_transfer'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    }
  }
}
