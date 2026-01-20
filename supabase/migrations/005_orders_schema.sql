-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- pending, processing, shipped, delivered, cancelled
  
  -- Contact information
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  
  -- Billing address
  billing_first_name VARCHAR(100) NOT NULL,
  billing_last_name VARCHAR(100) NOT NULL,
  billing_company VARCHAR(255),
  billing_address TEXT NOT NULL,
  billing_city VARCHAR(100) NOT NULL,
  billing_county VARCHAR(100) NOT NULL,
  billing_postal_code VARCHAR(20) NOT NULL,
  billing_country VARCHAR(100) DEFAULT 'România' NOT NULL,
  
  -- Shipping address
  shipping_is_same BOOLEAN DEFAULT true,
  shipping_first_name VARCHAR(100),
  shipping_last_name VARCHAR(100),
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  shipping_county VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100),
  
  -- Delivery & Payment
  delivery_method VARCHAR(50) NOT NULL, -- pickup, courier
  payment_method VARCHAR(50) NOT NULL, -- bank_transfer, cash_on_delivery
  payment_status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- pending, paid, failed, refunded
  
  -- Financial
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  cod_fee DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Additional info
  notes TEXT,
  tracking_number VARCHAR(100),
  
  -- Metadata
  locale VARCHAR(10) DEFAULT 'ro',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT orders_status_check CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  CONSTRAINT orders_payment_status_check CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  CONSTRAINT orders_delivery_method_check CHECK (delivery_method IN ('pickup', 'courier')),
  CONSTRAINT orders_payment_method_check CHECK (payment_method IN ('bank_transfer', 'cash_on_delivery'))
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  
  -- Snapshot of product data at time of order
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100) NOT NULL,
  
  -- Pricing
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT order_items_quantity_check CHECK (quantity > 0)
);

-- Indexes for performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public can insert orders (for checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Public can insert order items (for checkout)
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Public can view their own orders by email
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Public can view order items for their orders
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Admin policies will be added later with authentication
