-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_compatibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() 
    AND r.name IN ('super_admin', 'admin')
    AND p.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has permission for module
CREATE OR REPLACE FUNCTION has_permission(module_name TEXT, permission_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.permissions perm ON p.role_id = perm.role_id
    WHERE p.id = auth.uid()
    AND perm.module = module_name
    AND p.is_active = true
    AND (
      (permission_type = 'read' AND perm.can_read = true) OR
      (permission_type = 'create' AND perm.can_create = true) OR
      (permission_type = 'update' AND perm.can_update = true) OR
      (permission_type = 'delete' AND perm.can_delete = true)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PROFILES POLICIES
-- =============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (is_admin());

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (is_admin());

-- Admins can insert profiles
CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (is_admin());

-- =============================================
-- ROLES & PERMISSIONS POLICIES
-- =============================================

CREATE POLICY "Anyone can read roles"
  ON public.roles FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage roles"
  ON public.roles FOR ALL
  USING (is_admin());

CREATE POLICY "Anyone can read permissions"
  ON public.permissions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage permissions"
  ON public.permissions FOR ALL
  USING (is_admin());

-- =============================================
-- PARTNERS POLICIES
-- =============================================

-- Anyone can read published partners
CREATE POLICY "Anyone can read published partners"
  ON public.partners FOR SELECT
  USING (is_published = true OR is_admin());

-- Admins can manage partners
CREATE POLICY "Admins can manage partners"
  ON public.partners FOR ALL
  USING (is_admin());

-- =============================================
-- QUOTES POLICIES
-- =============================================

-- Anyone can insert quotes (public form submission)
CREATE POLICY "Anyone can create quotes"
  ON public.quotes FOR INSERT
  WITH CHECK (true);

-- Users with quotes permission can read
CREATE POLICY "Staff can read quotes"
  ON public.quotes FOR SELECT
  USING (has_permission('quotes', 'read'));

-- Users with quotes permission can update
CREATE POLICY "Staff can update quotes"
  ON public.quotes FOR UPDATE
  USING (has_permission('quotes', 'update'));

-- Users with quotes permission can delete
CREATE POLICY "Staff can delete quotes"
  ON public.quotes FOR DELETE
  USING (has_permission('quotes', 'delete'));

-- =============================================
-- BOOKINGS POLICIES
-- =============================================

CREATE POLICY "Staff can read bookings"
  ON public.bookings FOR SELECT
  USING (has_permission('bookings', 'read'));

CREATE POLICY "Staff can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (has_permission('bookings', 'create'));

CREATE POLICY "Staff can update bookings"
  ON public.bookings FOR UPDATE
  USING (has_permission('bookings', 'update'));

CREATE POLICY "Staff can delete bookings"
  ON public.bookings FOR DELETE
  USING (has_permission('bookings', 'delete'));

-- =============================================
-- QUOTE ATTACHMENTS POLICIES
-- =============================================

CREATE POLICY "Staff can read quote attachments"
  ON public.quote_attachments FOR SELECT
  USING (has_permission('quotes', 'read'));

CREATE POLICY "Staff can create quote attachments"
  ON public.quote_attachments FOR INSERT
  WITH CHECK (has_permission('quotes', 'update'));

CREATE POLICY "Staff can delete quote attachments"
  ON public.quote_attachments FOR DELETE
  USING (has_permission('quotes', 'delete'));

-- =============================================
-- PRODUCTS POLICIES
-- =============================================

-- Anyone can read active products and categories
CREATE POLICY "Anyone can read product categories"
  ON public.product_categories FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Anyone can read active products"
  ON public.products FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Anyone can read product variants"
  ON public.product_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
      AND (p.is_active = true OR is_admin())
    )
  );

CREATE POLICY "Anyone can read product images"
  ON public.product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
      AND (p.is_active = true OR is_admin())
    )
  );

CREATE POLICY "Anyone can read product compatibilities"
  ON public.product_compatibilities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_compatibilities.product_id
      AND (p.is_active = true OR is_admin())
    )
  );

-- Staff can manage products
CREATE POLICY "Staff can manage product categories"
  ON public.product_categories FOR ALL
  USING (has_permission('products', 'update'));

CREATE POLICY "Staff can manage products"
  ON public.products FOR ALL
  USING (has_permission('products', 'update'));

CREATE POLICY "Staff can manage product variants"
  ON public.product_variants FOR ALL
  USING (has_permission('products', 'update'));

CREATE POLICY "Staff can manage product images"
  ON public.product_images FOR ALL
  USING (has_permission('products', 'update'));

CREATE POLICY "Staff can manage product compatibilities"
  ON public.product_compatibilities FOR ALL
  USING (has_permission('products', 'update'));

-- =============================================
-- ORDERS POLICIES
-- =============================================

-- Authenticated users can read their own orders
CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create orders
CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Staff can read all orders
CREATE POLICY "Staff can read all orders"
  ON public.orders FOR SELECT
  USING (has_permission('orders', 'read'));

-- Staff can update orders
CREATE POLICY "Staff can update orders"
  ON public.orders FOR UPDATE
  USING (has_permission('orders', 'update'));

-- Staff can delete orders
CREATE POLICY "Staff can delete orders"
  ON public.orders FOR DELETE
  USING (has_permission('orders', 'delete'));

-- Order items follow order permissions
CREATE POLICY "Users can read own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR has_permission('orders', 'read'))
    )
  );

CREATE POLICY "Users can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR has_permission('orders', 'create'))
    )
  );

CREATE POLICY "Staff can manage order items"
  ON public.order_items FOR ALL
  USING (has_permission('orders', 'update'));

-- =============================================
-- CONTENT POLICIES
-- =============================================

-- Anyone can read published content
CREATE POLICY "Anyone can read published faqs"
  ON public.faqs FOR SELECT
  USING (is_published = true OR has_permission('content', 'read'));

CREATE POLICY "Anyone can read published content blocks"
  ON public.content_blocks FOR SELECT
  USING (is_published = true OR has_permission('content', 'read'));

CREATE POLICY "Anyone can read published legal pages"
  ON public.legal_pages FOR SELECT
  USING (is_published = true OR has_permission('content', 'read'));

CREATE POLICY "Anyone can read published testimonials"
  ON public.testimonials FOR SELECT
  USING (is_published = true OR has_permission('content', 'read'));

CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true OR has_permission('content', 'read'));

-- Staff can manage content
CREATE POLICY "Staff can manage faqs"
  ON public.faqs FOR ALL
  USING (has_permission('content', 'update'));

CREATE POLICY "Staff can manage content blocks"
  ON public.content_blocks FOR ALL
  USING (has_permission('content', 'update'));

CREATE POLICY "Staff can manage legal pages"
  ON public.legal_pages FOR ALL
  USING (has_permission('content', 'update'));

CREATE POLICY "Staff can manage testimonials"
  ON public.testimonials FOR ALL
  USING (has_permission('content', 'update'));

CREATE POLICY "Staff can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (has_permission('content', 'update'));

-- =============================================
-- SETTINGS & SHIPPING POLICIES
-- =============================================

-- Anyone can read active shipping methods
CREATE POLICY "Anyone can read active shipping methods"
  ON public.shipping_methods FOR SELECT
  USING (is_active = true OR has_permission('settings', 'read'));

-- Anyone can read public settings
CREATE POLICY "Anyone can read settings"
  ON public.settings FOR SELECT
  USING (true);

-- Staff can manage settings
CREATE POLICY "Staff can manage settings"
  ON public.settings FOR ALL
  USING (has_permission('settings', 'update'));

CREATE POLICY "Staff can manage shipping methods"
  ON public.shipping_methods FOR ALL
  USING (has_permission('settings', 'update'));

-- =============================================
-- AUDIT LOG POLICIES
-- =============================================

-- Only admins can read audit log
CREATE POLICY "Admins can read audit log"
  ON public.audit_log FOR SELECT
  USING (is_admin());

-- Service role can insert audit log
CREATE POLICY "Service can insert audit log"
  ON public.audit_log FOR INSERT
  WITH CHECK (true);

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Public bucket (marketing assets, product images)
-- Create bucket: public-assets (public)

-- Private bucket (invoices, attachments)
-- Create bucket: private-files (private)

-- Note: Storage policies are configured in Supabase dashboard or via SQL:
-- Policies for public-assets bucket:
-- - Anyone can read
-- - Admins can upload/update/delete

-- Policies for private-files bucket:
-- - Only authenticated users with proper permissions can read
-- - Admins can upload/update/delete
