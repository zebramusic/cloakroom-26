-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL,
  
  -- Event details
  event_type TEXT NOT NULL,
  event_date_from TIMESTAMP NOT NULL,
  event_date_to TIMESTAMP,
  estimated_attendees INTEGER NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  
  -- Services
  services TEXT[] NOT NULL DEFAULT '{}',
  
  -- Client details
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_company TEXT,
  client_role TEXT,
  
  -- Preferences
  budget_range TEXT,
  referral_source TEXT,
  
  -- Quote status and pricing
  status TEXT NOT NULL DEFAULT 'new',
  total_price DECIMAL(10, 2),
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  
  -- Constraints
  CHECK (status IN ('new', 'pending', 'sent', 'accepted', 'rejected', 'expired')),
  CHECK (estimated_attendees >= 100 AND estimated_attendees <= 12000)
);

-- Create index for faster queries
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_client_email ON quotes(client_email);
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON quotes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert (public quote form)
CREATE POLICY "Anyone can create quotes"
  ON quotes FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view all quotes (admin)
CREATE POLICY "Authenticated users can view all quotes"
  ON quotes FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to update quotes (admin)
CREATE POLICY "Authenticated users can update quotes"
  ON quotes FOR UPDATE
  USING (auth.role() = 'authenticated');
