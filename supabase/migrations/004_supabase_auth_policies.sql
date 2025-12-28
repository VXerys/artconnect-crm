-- ============================================================================
-- ARTCONNECT CRM - UPDATE RLS POLICIES FOR SUPABASE AUTH
-- ============================================================================
-- Author: ArtConnect Team
-- Created: 2024-12-28
-- Description: Update RLS policies to use native Supabase Auth (auth.uid())
--              instead of Firebase Auth
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP EXISTING POLICIES (that use firebase_uid)
-- ============================================================================

-- Drop users policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;

-- Drop artworks policies
DROP POLICY IF EXISTS "Users can view own artworks" ON artworks;
DROP POLICY IF EXISTS "Users can insert own artworks" ON artworks;
DROP POLICY IF EXISTS "Users can update own artworks" ON artworks;
DROP POLICY IF EXISTS "Users can delete own artworks" ON artworks;

-- Drop contacts policies
DROP POLICY IF EXISTS "Users can view own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can insert own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can delete own contacts" ON contacts;

-- Drop sales policies
DROP POLICY IF EXISTS "Users can view own sales" ON sales;
DROP POLICY IF EXISTS "Users can insert own sales" ON sales;
DROP POLICY IF EXISTS "Users can update own sales" ON sales;
DROP POLICY IF EXISTS "Users can delete own sales" ON sales;

-- Drop activity_logs policies
DROP POLICY IF EXISTS "Users can view own activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Users can insert own activity logs" ON activity_logs;

-- Drop reports policies
DROP POLICY IF EXISTS "Users can view own reports" ON reports;
DROP POLICY IF EXISTS "Users can manage own reports" ON reports;

-- Drop scheduled_reports policies
DROP POLICY IF EXISTS "Users can manage own scheduled reports" ON scheduled_reports;

-- Drop pipeline_items policies
DROP POLICY IF EXISTS "Users can view own pipeline items" ON pipeline_items;
DROP POLICY IF EXISTS "Users can manage own pipeline items" ON pipeline_items;

-- Drop tags policies
DROP POLICY IF EXISTS "Users can manage own tags" ON tags;

-- Drop notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- ============================================================================
-- STEP 2: ALTER USERS TABLE TO USE auth.uid() DIRECTLY
-- ============================================================================

-- Add auth_id column that directly stores Supabase auth.uid()
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;

-- Drop firebase_uid column (optional - keeping for migration purposes)
-- ALTER TABLE users DROP COLUMN IF EXISTS firebase_uid;

-- Create index for new column
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

-- ============================================================================
-- STEP 3: CREATE NEW RLS POLICIES USING auth.uid()
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Users Policies
-- ----------------------------------------------------------------------------

-- Users can view their own profile
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  USING (auth_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth_id = auth.uid());

-- Allow insert for new users (during registration)
CREATE POLICY "users_insert_own"
  ON users FOR INSERT
  WITH CHECK (auth_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Artworks Policies
-- ----------------------------------------------------------------------------

CREATE POLICY "artworks_select_own"
  ON artworks FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "artworks_insert_own"
  ON artworks FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "artworks_update_own"
  ON artworks FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "artworks_delete_own"
  ON artworks FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- Contacts Policies
-- ----------------------------------------------------------------------------

CREATE POLICY "contacts_select_own"
  ON contacts FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "contacts_insert_own"
  ON contacts FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "contacts_update_own"
  ON contacts FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "contacts_delete_own"
  ON contacts FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- Sales Policies
-- ----------------------------------------------------------------------------

CREATE POLICY "sales_select_own"
  ON sales FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "sales_insert_own"
  ON sales FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "sales_update_own"
  ON sales FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "sales_delete_own"
  ON sales FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- Activity Logs Policies
-- ----------------------------------------------------------------------------

CREATE POLICY "activity_logs_select_own"
  ON activity_logs FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "activity_logs_insert_own"
  ON activity_logs FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- Reports Policies
-- ----------------------------------------------------------------------------

CREATE POLICY "reports_all_own"
  ON reports FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- Scheduled Reports Policies
-- ----------------------------------------------------------------------------

CREATE POLICY "scheduled_reports_all_own"
  ON scheduled_reports FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- Pipeline Items Policies
-- ----------------------------------------------------------------------------

CREATE POLICY "pipeline_items_all_own"
  ON pipeline_items FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- Tags Policies
-- ----------------------------------------------------------------------------

CREATE POLICY "tags_all_own"
  ON tags FOR ALL
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- Notifications Policies
-- ----------------------------------------------------------------------------

CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "notifications_insert_service"
  ON notifications FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ============================================================================
-- STEP 4: CREATE FUNCTION TO AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'artist'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile when new auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STEP 5: UPDATE STORAGE POLICIES FOR SUPABASE AUTH
-- ============================================================================

-- Drop old storage policies
DROP POLICY IF EXISTS "Users can upload artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;

-- Artworks Storage (authenticated users can upload to their own folder)
CREATE POLICY "Authenticated users can upload artworks"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'artworks' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can manage own artwork files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'artworks' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Avatars Storage
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can manage own avatar files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Reports Storage (Private)
CREATE POLICY "Users can manage own report files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'reports' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Documents Storage (Private)
CREATE POLICY "Users can manage own document files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'documents' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'RLS policies updated for Supabase Auth!';
  RAISE NOTICE 'User auto-creation trigger installed';
  RAISE NOTICE 'Storage policies updated';
END
$$;
