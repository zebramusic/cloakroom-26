-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- ROLES & PERMISSIONS SYSTEM
-- =============================================

-- User roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Module permissions
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  module VARCHAR(50) NOT NULL, -- quotes, bookings, products, orders, partners, content, settings
  can_read BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_update BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, module)
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role_id UUID REFERENCES public.roles(id),
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PARTNERS
-- =============================================

CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_partners_slug ON public.partners(slug);
CREATE INDEX idx_partners_published ON public.partners(is_published, display_order);

-- =============================================
-- QUOTES & BOOKINGS
-- =============================================

CREATE TYPE quote_status AS ENUM (
  'new',
  'in_review',
  'offer_sent',
  'negotiation',
  'booked',
  'completed',
  'cancelled'
);

CREATE TYPE deal_type AS ENUM (
  'revenue_share',
  'fixed',
  'hybrid',
  'tbd'
);

CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Client info
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  client_company VARCHAR(255),
  
  -- Event details
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  location VARCHAR(500) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_participants INTEGER,
  
  -- Services requested
  needs_cloakroom BOOLEAN DEFAULT false,
  needs_vip BOOLEAN DEFAULT false,
  needs_backstage BOOLEAN DEFAULT false,
  needs_bag_check BOOLEAN DEFAULT false,
  needs_infrastructure BOOLEAN DEFAULT false,
  
  -- Additional info
  constraints TEXT,
  notes TEXT,
  
  -- Status & pipeline
  status quote_status DEFAULT 'new',
  internal_notes TEXT,
  
  -- Anti-spam
  honeypot VARCHAR(255),
  ip_address VARCHAR(45),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Deal terms
  deal_type deal_type DEFAULT 'tbd',
  revenue_share_pct DECIMAL(5,2),
  fixed_fee DECIMAL(12,2),
  deal_notes TEXT,
  
  -- Event execution details
  staff_count INTEGER,
  equipment_list TEXT,
  setup_time TIMESTAMP WITH TIME ZONE,
  breakdown_time TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_completed BOOLEAN DEFAULT false,
  completion_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quote_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_quotes_dates ON public.quotes(start_date, end_date);
CREATE INDEX idx_bookings_quote ON public.bookings(quote_id);

-- =============================================
-- PRODUCTS & SHOP
-- =============================================

CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ro VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description_ro TEXT,
  description_en TEXT,
  parent_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  
  -- Basic info
  name_ro VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  
  -- Description
  description_ro TEXT,
  description_en TEXT,
  features_ro TEXT,
  features_en TEXT,
  
  -- Pricing & stock
  base_price DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 19.00,
  has_variants BOOLEAN DEFAULT false,
  
  -- Inventory
  track_inventory BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  
  -- Product flags
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_returnable BOOLEAN DEFAULT true,
  
  -- Metadata
  weight_kg DECIMAL(10,2),
  dimensions VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  
  sku VARCHAR(100) UNIQUE NOT NULL,
  name_ro VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  
  -- Variant specifics
  attributes JSONB, -- e.g., {"color": "red", "size": "L"}
  
  -- Pricing
  price DECIMAL(12,2) NOT NULL,
  
  -- Stock
  stock_quantity INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text_ro VARCHAR(255),
  alt_text_en VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_compatibilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  compatible_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  description_ro TEXT,
  description_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, compatible_product_id)
);

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);

-- =============================================
-- ORDERS & PAYMENTS
-- =============================================

CREATE TYPE order_status AS ENUM (
  'pending',
  'pending_cod',
  'pending_bank_transfer',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE payment_method AS ENUM (
  'card',
  'cod',
  'bank_transfer'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  
  -- Customer info
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  
  -- Billing address
  billing_company VARCHAR(255),
  billing_cui VARCHAR(50),
  billing_address TEXT NOT NULL,
  billing_city VARCHAR(100) NOT NULL,
  billing_county VARCHAR(100),
  billing_postal_code VARCHAR(20),
  billing_country VARCHAR(2) DEFAULT 'RO',
  
  -- Shipping address
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_county VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(2) DEFAULT 'RO',
  
  -- Order totals
  subtotal DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) NOT NULL,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  
  -- Payment
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Shipping
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(255),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status order_status DEFAULT 'pending',
  
  -- Notes
  customer_notes TEXT,
  internal_notes TEXT,
  
  -- Invoice
  invoice_number VARCHAR(50),
  invoice_pdf_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  
  -- Product snapshot (for historical accuracy)
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100) NOT NULL,
  
  -- Pricing
  unit_price DECIMAL(12,2) NOT NULL,
  quantity INTEGER NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 19.00,
  
  -- Totals
  subtotal DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- =============================================
-- CONTENT MANAGEMENT
-- =============================================

CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_ro TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_ro TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL, -- e.g., "home_hero", "about_company"
  title_ro VARCHAR(255),
  title_en VARCHAR(255),
  content_ro TEXT,
  content_en TEXT,
  metadata JSONB, -- for flexible additional data
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.legal_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL, -- terms, privacy, cookies, returns
  title_ro VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  content_ro TEXT NOT NULL,
  content_en TEXT NOT NULL,
  version VARCHAR(20) DEFAULT '1.0',
  effective_date DATE,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(255) NOT NULL,
  client_company VARCHAR(255),
  client_role VARCHAR(100),
  testimonial_ro TEXT NOT NULL,
  testimonial_en TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  event_type VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_ro VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  excerpt_ro TEXT,
  excerpt_en TEXT,
  content_ro TEXT NOT NULL,
  content_en TEXT NOT NULL,
  featured_image_url TEXT,
  author_id UUID REFERENCES public.profiles(id),
  category VARCHAR(100),
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at);

-- =============================================
-- SETTINGS & CONFIGURATION
-- =============================================

CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shipping_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ro VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description_ro TEXT,
  description_en TEXT,
  base_cost DECIMAL(12,2) NOT NULL,
  free_shipping_threshold DECIMAL(12,2),
  estimated_days_min INTEGER,
  estimated_days_max INTEGER,
  zones TEXT[], -- e.g., ['RO', 'EU', 'WORLD']
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AUDIT LOG
-- =============================================

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL, -- create, update, delete
  entity_type VARCHAR(100) NOT NULL, -- product, order, quote, etc.
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON public.audit_log(created_at);

-- =============================================
-- TRIGGERS FOR updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_pages_updated_at BEFORE UPDATE ON public.legal_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_methods_updated_at BEFORE UPDATE ON public.shipping_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
