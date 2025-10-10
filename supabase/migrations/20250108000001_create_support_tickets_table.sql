-- Migration: Create support tickets table
-- Description: Creates table for support tickets with RLS policies

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_phone TEXT REFERENCES clientes(phone) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('support', 'bug', 'suggestion')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  attachments JSONB DEFAULT '[]'::jsonb,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_phone ON support_tickets(user_phone);
CREATE INDEX IF NOT EXISTS idx_support_tickets_ticket_number ON support_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_type ON support_tickets(type);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);

-- Create function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  ticket_num TEXT;
  counter INTEGER;
BEGIN
  -- Get current counter or start from 1
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 4) AS INTEGER)), 0) + 1
  INTO counter
  FROM support_tickets
  WHERE ticket_number LIKE 'TK-%';
  
  -- Format ticket number
  ticket_num := 'TK-' || LPAD(counter::TEXT, 6, '0');
  
  RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate ticket number
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_ticket_number();

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can create support tickets
CREATE POLICY "Users can create support tickets"
ON support_tickets FOR INSERT
WITH CHECK (
  user_phone = current_setting('request.jwt.claims', true)::json->>'phone'
);

-- Users can view their own tickets
CREATE POLICY "Users can view their own tickets"
ON support_tickets FOR SELECT
USING (
  user_phone = current_setting('request.jwt.claims', true)::json->>'phone'
);

-- Users can update their own tickets (only certain fields)
CREATE POLICY "Users can update their own tickets"
ON support_tickets FOR UPDATE
USING (
  user_phone = current_setting('request.jwt.claims', true)::json->>'phone'
  AND status IN ('open', 'in_progress')
)
WITH CHECK (
  user_phone = current_setting('request.jwt.claims', true)::json->>'phone'
  AND status IN ('open', 'in_progress')
);

-- Admin policies (for future admin panel)
-- Note: These policies assume admin users have a specific role or flag
-- You may need to adjust based on your admin authentication system

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets"
ON support_tickets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM clientes 
    WHERE phone = current_setting('request.jwt.claims', true)::json->>'phone'
    AND role = 'admin'
  )
);

-- Admins can update all tickets
CREATE POLICY "Admins can update all tickets"
ON support_tickets FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM clientes 
    WHERE phone = current_setting('request.jwt.claims', true)::json->>'phone'
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clientes 
    WHERE phone = current_setting('request.jwt.claims', true)::json->>'phone'
    AND role = 'admin'
  )
);

-- Grant necessary permissions
GRANT ALL ON support_tickets TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create RPC function to get user's ticket limit based on plan
CREATE OR REPLACE FUNCTION get_user_ticket_limit(user_phone_param TEXT)
RETURNS INTEGER AS $$
DECLARE
  user_plan TEXT;
  ticket_count INTEGER;
  limit_count INTEGER;
BEGIN
  -- Get user's plan
  SELECT plan_id INTO user_plan
  FROM clientes
  WHERE phone = user_phone_param;
  
  -- Get current month ticket count
  SELECT COUNT(*)
  INTO ticket_count
  FROM support_tickets
  WHERE user_phone = user_phone_param
  AND created_at >= date_trunc('month', NOW());
  
  -- Set limit based on plan
  CASE user_plan
    WHEN 'free' THEN limit_count := 3;
    WHEN 'basic' THEN limit_count := 10;
    WHEN 'business', 'premium' THEN limit_count := -1; -- Unlimited
    ELSE limit_count := 3; -- Default to free plan
  END CASE;
  
  -- Return remaining tickets (or -1 for unlimited)
  IF limit_count = -1 THEN
    RETURN -1;
  ELSE
    RETURN GREATEST(0, limit_count - ticket_count);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_ticket_limit(TEXT) TO authenticated;
