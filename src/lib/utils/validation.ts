import { z } from 'zod'

/**
 * Quote form validation schema
 */
export const quoteFormSchema = z.object({
  client_name: z.string().min(2, 'Name must be at least 2 characters'),
  client_email: z.string().email('Invalid email address'),
  client_phone: z.string().min(10, 'Phone must be at least 10 characters').optional(),
  client_company: z.string().optional(),
  event_name: z.string().min(3, 'Event name must be at least 3 characters'),
  event_type: z.string().min(1, 'Please select an event type'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  estimated_participants: z.number().int().positive().optional(),
  needs_cloakroom: z.boolean().default(false),
  needs_vip: z.boolean().default(false),
  needs_backstage: z.boolean().default(false),
  needs_bag_check: z.boolean().default(false),
  needs_infrastructure: z.boolean().default(false),
  constraints: z.string().optional(),
  notes: z.string().optional(),
  honeypot: z.string().optional(), // Anti-spam field (should be empty)
})

export type QuoteFormData = z.infer<typeof quoteFormSchema>

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

/**
 * Checkout form validation schema
 */
export const checkoutFormSchema = z.object({
  customer_email: z.string().email('Invalid email address'),
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_phone: z.string().min(10, 'Phone must be at least 10 characters'),
  
  billing_company: z.string().optional(),
  billing_cui: z.string().optional(),
  billing_address: z.string().min(5, 'Address must be at least 5 characters'),
  billing_city: z.string().min(2, 'City must be at least 2 characters'),
  billing_county: z.string().optional(),
  billing_postal_code: z.string().optional(),
  
  shipping_address: z.string().min(5, 'Address must be at least 5 characters'),
  shipping_city: z.string().min(2, 'City must be at least 2 characters'),
  shipping_county: z.string().optional(),
  shipping_postal_code: z.string().optional(),
  
  shipping_method_id: z.string().uuid('Invalid shipping method'),
  payment_method: z.enum(['card', 'cod', 'bank_transfer']),
  
  customer_notes: z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>

/**
 * Product form validation schema (admin)
 */
export const productFormSchema = z.object({
  category_id: z.string().uuid('Invalid category'),
  name_ro: z.string().min(3, 'Romanian name must be at least 3 characters'),
  name_en: z.string().min(3, 'English name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  description_ro: z.string().optional(),
  description_en: z.string().optional(),
  base_price: z.number().positive('Price must be positive'),
  tax_rate: z.number().min(0).max(100).default(19),
  has_variants: z.boolean().default(false),
  track_inventory: z.boolean().default(true),
  stock_quantity: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_returnable: z.boolean().default(true),
})

export type ProductFormData = z.infer<typeof productFormSchema>

/**
 * Partner form validation schema (admin)
 */
export const partnerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  logo_url: z.string().url('Invalid URL').optional(),
  website_url: z.string().url('Invalid URL').optional(),
  description: z.string().optional(),
  display_order: z.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
})

export type PartnerFormData = z.infer<typeof partnerFormSchema>

/**
 * Login form validation schema
 */
export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginFormSchema>
