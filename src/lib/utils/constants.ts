/**
 * Application-wide constants
 */

export const APP_NAME = 'Garderobă profesională'
export const APP_DESCRIPTION = 'Professional Cloakroom Services for Events'

export const QUOTE_STATUS = {
  NEW: 'new',
  IN_REVIEW: 'in_review',
  OFFER_SENT: 'offer_sent',
  NEGOTIATION: 'negotiation',
  BOOKED: 'booked',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  PENDING_COD: 'pending_cod',
  PENDING_BANK_TRANSFER: 'pending_bank_transfer',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const

export const PAYMENT_METHOD = {
  CARD: 'card',
  COD: 'cod',
  BANK_TRANSFER: 'bank_transfer',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export const EVENT_TYPES = [
  { value: 'festival', label_ro: 'Festival', label_en: 'Festival' },
  { value: 'concert', label_ro: 'Concert', label_en: 'Concert' },
  { value: 'club', label_ro: 'Club / Petrecere', label_en: 'Club / Party' },
  { value: 'theater', label_ro: 'Teatru', label_en: 'Theater' },
  { value: 'conference', label_ro: 'Conferință', label_en: 'Conference' },
  { value: 'corporate', label_ro: 'Corporate', label_en: 'Corporate' },
  { value: 'sports', label_ro: 'Sportiv', label_en: 'Sports' },
  { value: 'other', label_ro: 'Altele', label_en: 'Other' },
] as const

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SALES: 'sales',
  OPS: 'ops',
  WAREHOUSE: 'warehouse',
  FINANCE: 'finance',
  EDITOR: 'editor',
} as const

export const MODULES = {
  QUOTES: 'quotes',
  BOOKINGS: 'bookings',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  PARTNERS: 'partners',
  CONTENT: 'content',
  SETTINGS: 'settings',
} as const

export const PERMISSION_TYPES = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const

export const DEFAULT_TAX_RATE = 19 // 19% VAT in Romania

export const STORAGE_BUCKETS = {
  PUBLIC_ASSETS: 'public-assets',
  PRIVATE_FILES: 'private-files',
} as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const

export const ITEMS_PER_PAGE = {
  DEFAULT: 20,
  PRODUCTS: 24,
  BLOG: 12,
  ADMIN: 50,
} as const

export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/cloakroom-pro',
  INSTAGRAM: 'https://instagram.com/cloakroom-pro',
  LINKEDIN: 'https://linkedin.com/company/cloakroom-pro',
} as const
