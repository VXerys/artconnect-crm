-- ============================================================================
-- ARTCONNECT CRM - SUPABASE DATABASE MIGRATIONS
-- ============================================================================
-- Author: ArtConnect Team
-- Created: 2024-12-28
-- Description: Complete database schema for ArtConnect CRM with Firebase Auth
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================================================
-- ENUMS (Custom Types)
-- ============================================================================

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'artist', 'collector', 'user');

-- Artwork status
CREATE TYPE artwork_status AS ENUM ('concept', 'wip', 'finished', 'sold');

-- Contact types
CREATE TYPE contact_type AS ENUM ('gallery', 'collector', 'museum', 'curator');

-- Sale/Transaction status
CREATE TYPE sale_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');

-- Activity types
CREATE TYPE activity_type AS ENUM (
  'artwork_created',
  'artwork_updated',
  'artwork_sold',
  'contact_added',
  'contact_updated',
  'sale_created',
  'sale_completed',
  'report_generated',
  'user_login',
  'user_profile_updated'
);

-- Report types
CREATE TYPE report_type AS ENUM ('sales', 'artworks', 'contacts', 'performance', 'custom');

-- Report format
CREATE TYPE report_format AS ENUM ('pdf', 'csv', 'excel');

-- Report frequency (for scheduled reports)
CREATE TYPE report_frequency AS ENUM ('daily', 'weekly', 'monthly', 'quarterly');

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- Syncs with Firebase Auth - stores additional user profile data
-- ----------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(50),
  role user_role DEFAULT 'user',
  business_name VARCHAR(255), -- For artists/galleries
  bio TEXT,
  website VARCHAR(255),
  location VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'IDR',
  timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
  settings JSONB DEFAULT '{}', -- User preferences
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ----------------------------------------------------------------------------
-- 2. ARTWORKS TABLE
-- Stores artwork information for CRM
-- ----------------------------------------------------------------------------
CREATE TABLE artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  medium VARCHAR(100), -- e.g., "Acrylic on Canvas", "Oil on Canvas"
  dimensions VARCHAR(100), -- e.g., "100 x 80 cm"
  year INTEGER,
  status artwork_status DEFAULT 'concept',
  price DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'IDR',
  image_url TEXT,
  thumbnail_url TEXT,
  images JSONB DEFAULT '[]', -- Array of additional images
  category VARCHAR(100),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  sold_at TIMESTAMPTZ,
  sold_price DECIMAL(15, 2),
  buyer_contact_id UUID, -- Reference to contact who bought it
  notes TEXT,
  metadata JSONB DEFAULT '{}', -- Additional flexible data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_artworks_user_id ON artworks(user_id);
CREATE INDEX idx_artworks_status ON artworks(status);
CREATE INDEX idx_artworks_created_at ON artworks(created_at DESC);
CREATE INDEX idx_artworks_title ON artworks USING gin(title gin_trgm_ops); -- Text search

-- ----------------------------------------------------------------------------
-- 3. CONTACTS TABLE
-- CRM contacts (galleries, collectors, museums, curators)
-- ----------------------------------------------------------------------------
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type contact_type NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  address TEXT,
  website VARCHAR(255),
  company VARCHAR(255), -- Gallery name, museum name, etc.
  position VARCHAR(100), -- Job title/position
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  tags TEXT[],
  social_media JSONB DEFAULT '{}', -- { instagram: "", twitter: "", etc }
  preferences JSONB DEFAULT '{}', -- Art preferences, interests
  total_purchases DECIMAL(15, 2) DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  last_contact_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  is_vip BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_contacts_name ON contacts USING gin(name gin_trgm_ops); -- Text search
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_rating ON contacts(rating);

-- ----------------------------------------------------------------------------
-- 4. SALES TABLE
-- Transaction/sales records
-- ----------------------------------------------------------------------------
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  
  -- Sale details
  title VARCHAR(255) NOT NULL, -- Can be different from artwork title
  description TEXT,
  
  -- Pricing
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) NOT NULL,
  
  -- Status
  status sale_status DEFAULT 'pending',
  
  -- Payment info
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  paid_at TIMESTAMPTZ,
  
  -- Additional info
  notes TEXT,
  invoice_number VARCHAR(50),
  invoice_url TEXT,
  
  -- Dates
  sale_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_artwork_id ON sales(artwork_id);
CREATE INDEX idx_sales_contact_id ON sales(contact_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_sale_date ON sales(sale_date DESC);
CREATE INDEX idx_sales_created_at ON sales(created_at DESC);

-- ----------------------------------------------------------------------------
-- 5. ACTIVITY LOG TABLE
-- Tracks user activities for audit and activity feed
-- ----------------------------------------------------------------------------
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Related entities
  entity_type VARCHAR(50), -- 'artwork', 'contact', 'sale', etc.
  entity_id UUID,
  entity_title VARCHAR(255),
  
  -- Additional data
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- ----------------------------------------------------------------------------
-- 6. REPORTS TABLE
-- Saved/generated reports
-- ----------------------------------------------------------------------------
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type report_type NOT NULL,
  format report_format DEFAULT 'pdf',
  
  -- Report configuration
  date_range_start DATE,
  date_range_end DATE,
  filters JSONB DEFAULT '{}',
  
  -- Generated file
  file_url TEXT,
  file_size INTEGER, -- in bytes
  
  -- Status
  is_generated BOOLEAN DEFAULT false,
  generated_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- ----------------------------------------------------------------------------
-- 7. SCHEDULED REPORTS TABLE
-- Scheduled/recurring reports
-- ----------------------------------------------------------------------------
CREATE TABLE scheduled_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type report_type NOT NULL,
  format report_format DEFAULT 'pdf',
  
  -- Schedule
  frequency report_frequency NOT NULL,
  day_of_week INTEGER, -- 0-6 for weekly
  day_of_month INTEGER, -- 1-31 for monthly
  time_of_day TIME DEFAULT '09:00:00',
  
  -- Report configuration
  filters JSONB DEFAULT '{}',
  
  -- Delivery
  email_recipients TEXT[], -- Array of emails to send report
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_scheduled_reports_user_id ON scheduled_reports(user_id);
CREATE INDEX idx_scheduled_reports_active ON scheduled_reports(is_active) WHERE is_active = true;
CREATE INDEX idx_scheduled_reports_next_run ON scheduled_reports(next_run_at);

-- ----------------------------------------------------------------------------
-- 8. PIPELINE ITEMS TABLE
-- For Kanban-style pipeline tracking (might overlap with artworks, but provides more flexibility)
-- ----------------------------------------------------------------------------
CREATE TABLE pipeline_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  medium VARCHAR(100),
  status artwork_status DEFAULT 'concept',
  
  -- Pipeline specific
  due_date DATE,
  priority INTEGER DEFAULT 0, -- 0 = low, 1 = medium, 2 = high
  position INTEGER DEFAULT 0, -- For ordering within status column
  
  -- Pricing
  estimated_price DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'IDR',
  
  -- Images
  image_url TEXT,
  
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pipeline_items_user_id ON pipeline_items(user_id);
CREATE INDEX idx_pipeline_items_status ON pipeline_items(status);
CREATE INDEX idx_pipeline_items_position ON pipeline_items(status, position);
CREATE INDEX idx_pipeline_items_due_date ON pipeline_items(due_date);

-- ----------------------------------------------------------------------------
-- 9. TAGS TABLE (optional, for normalized tags)
-- ----------------------------------------------------------------------------
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#6B7280', -- Hex color
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, name)
);

-- Index
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_name ON tags(name);

-- ----------------------------------------------------------------------------
-- 10. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error
  
  -- Related entity
  entity_type VARCHAR(50),
  entity_id UUID,
  action_url TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: Update updated_at timestamp automatically
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Function: Update contact statistics after sale
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_contact_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE contacts
    SET 
      total_purchases = total_purchases + NEW.total_amount,
      purchase_count = purchase_count + 1,
      last_contact_at = NOW(),
      updated_at = NOW()
    WHERE id = NEW.contact_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Function: Mark artwork as sold when sale is completed
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_artwork_sale()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.artwork_id IS NOT NULL THEN
    UPDATE artworks
    SET 
      status = 'sold',
      sold_at = NOW(),
      sold_price = NEW.total_amount,
      buyer_contact_id = NEW.contact_id,
      updated_at = NOW()
    WHERE id = NEW.artwork_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Function: Log activity
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_activity_type activity_type,
  p_title VARCHAR(255),
  p_description TEXT DEFAULT NULL,
  p_entity_type VARCHAR(50) DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_entity_title VARCHAR(255) DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO activity_logs (
    user_id, activity_type, title, description,
    entity_type, entity_id, entity_title, metadata
  ) VALUES (
    p_user_id, p_activity_type, p_title, p_description,
    p_entity_type, p_entity_id, p_entity_title, p_metadata
  )
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at for all tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artworks_updated_at
  BEFORE UPDATE ON artworks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_reports_updated_at
  BEFORE UPDATE ON scheduled_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_items_updated_at
  BEFORE UPDATE ON pipeline_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update contact stats when sale is completed
CREATE TRIGGER on_sale_completed_update_contact
  AFTER UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION update_contact_stats();

-- Mark artwork as sold when sale is completed
CREATE TRIGGER on_sale_completed_update_artwork
  AFTER UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION handle_artwork_sale();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- RLS Policies for Users
-- ----------------------------------------------------------------------------
-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = firebase_uid);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = firebase_uid);

-- Allow insert during registration (via service role)
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- RLS Policies for Artworks
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own artworks"
  ON artworks FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can insert own artworks"
  ON artworks FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can update own artworks"
  ON artworks FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can delete own artworks"
  ON artworks FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- ----------------------------------------------------------------------------
-- RLS Policies for Contacts
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can insert own contacts"
  ON contacts FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- ----------------------------------------------------------------------------
-- RLS Policies for Sales
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own sales"
  ON sales FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can insert own sales"
  ON sales FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can update own sales"
  ON sales FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can delete own sales"
  ON sales FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- ----------------------------------------------------------------------------
-- RLS Policies for Activity Logs
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own activity logs"
  ON activity_logs FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can insert own activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- ----------------------------------------------------------------------------
-- RLS Policies for Reports
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can manage own reports"
  ON reports FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- ----------------------------------------------------------------------------
-- RLS Policies for Scheduled Reports
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can manage own scheduled reports"
  ON scheduled_reports FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- ----------------------------------------------------------------------------
-- RLS Policies for Pipeline Items
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own pipeline items"
  ON pipeline_items FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can manage own pipeline items"
  ON pipeline_items FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- ----------------------------------------------------------------------------
-- RLS Policies for Tags
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can manage own tags"
  ON tags FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- ----------------------------------------------------------------------------
-- RLS Policies for Notifications
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- ============================================================================
-- VIEWS (for easier querying)
-- ============================================================================

-- Dashboard stats view
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  u.id as user_id,
  COUNT(DISTINCT a.id) as total_artworks,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'concept') as concept_count,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'wip') as wip_count,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'finished') as finished_count,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'sold') as sold_count,
  COUNT(DISTINCT c.id) as total_contacts,
  COUNT(DISTINCT s.id) as total_sales,
  COALESCE(SUM(s.total_amount) FILTER (WHERE s.status = 'completed'), 0) as total_revenue
FROM users u
LEFT JOIN artworks a ON a.user_id = u.id AND NOT a.is_archived
LEFT JOIN contacts c ON c.user_id = u.id AND c.is_active
LEFT JOIN sales s ON s.user_id = u.id
GROUP BY u.id;

-- Monthly sales summary view
CREATE OR REPLACE VIEW monthly_sales_summary AS
SELECT 
  user_id,
  DATE_TRUNC('month', sale_date) as month,
  COUNT(*) as sale_count,
  SUM(total_amount) as total_amount,
  AVG(total_amount) as avg_amount
FROM sales
WHERE status = 'completed'
GROUP BY user_id, DATE_TRUNC('month', sale_date)
ORDER BY month DESC;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'ArtConnect CRM database schema created successfully!';
  RAISE NOTICE 'Tables created: users, artworks, contacts, sales, activity_logs, reports, scheduled_reports, pipeline_items, tags, notifications';
  RAISE NOTICE 'RLS policies enabled for all tables';
  RAISE NOTICE 'Views created: dashboard_stats, monthly_sales_summary';
END
$$;
