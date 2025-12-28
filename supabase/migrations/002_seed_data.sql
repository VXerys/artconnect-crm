-- ============================================================================
-- ARTCONNECT CRM - SEED DATA
-- ============================================================================
-- Author: ArtConnect Team
-- Created: 2024-12-28
-- Description: Sample data for testing and development
-- ============================================================================

-- Note: This seed data assumes you have a user already created
-- You'll need to replace 'YOUR_USER_ID' with actual user ID after first login

-- ============================================================================
-- SAMPLE ARTWORKS
-- ============================================================================

-- These will be inserted when a user is created
-- Use the following INSERT statement after you have a user_id

/*
-- Replace 'YOUR_USER_ID' with the actual user UUID

INSERT INTO artworks (user_id, title, description, medium, dimensions, year, status, price, image_url, category, tags) VALUES
  ('YOUR_USER_ID', 'Sunset Horizon', 'A beautiful sunset over the ocean with vibrant orange and purple hues', 'Acrylic on Canvas', '100 x 80 cm', 2024, 'finished', 15000000, 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=400', 'Landscape', ARRAY['sunset', 'ocean', 'contemporary']),
  ('YOUR_USER_ID', 'Urban Dreams', 'Abstract representation of city life and modern architecture', 'Oil on Canvas', '120 x 90 cm', 2024, 'wip', NULL, 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400', 'Abstract', ARRAY['urban', 'architecture', 'abstract']),
  ('YOUR_USER_ID', 'Abstract Motion', 'Dynamic mixed media piece exploring movement and energy', 'Mixed Media', '150 x 100 cm', 2024, 'sold', 25000000, 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400', 'Abstract', ARRAY['motion', 'energy', 'mixed media']),
  ('YOUR_USER_ID', 'Nature''s Call', 'Watercolor interpretation of natural landscapes', 'Watercolor', '60 x 40 cm', 2024, 'concept', NULL, 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400', 'Landscape', ARRAY['nature', 'watercolor', 'serene']),
  ('YOUR_USER_ID', 'Digital Echoes', 'Contemporary digital art print with geometric patterns', 'Digital Print', '80 x 60 cm', 2024, 'finished', 8000000, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', 'Digital', ARRAY['digital', 'geometric', 'modern']),
  ('YOUR_USER_ID', 'Cosmic Dance', 'Large scale abstract piece inspired by celestial movements', 'Acrylic on Canvas', '200 x 150 cm', 2024, 'wip', NULL, 'https://images.unsplash.com/photo-1634017839464-5c339ez92a6?w=400', 'Abstract', ARRAY['cosmic', 'large scale', 'abstract']);

-- ============================================================================
-- SAMPLE CONTACTS
-- ============================================================================

INSERT INTO contacts (user_id, name, type, email, phone, location, rating, notes, company) VALUES
  ('YOUR_USER_ID', 'Galeri Nasional Indonesia', 'gallery', 'info@galnas.go.id', '+62 21 1234 5678', 'Jakarta', 5, 'Tertarik dengan seri landscape', 'Galeri Nasional Indonesia'),
  ('YOUR_USER_ID', 'Ahmad Wijaya', 'collector', 'ahmad.w@email.com', '+62 812 3456 7890', 'Surabaya', 4, 'Koleksi fokus pada contemporary art', NULL),
  ('YOUR_USER_ID', 'Museum Seni Rupa dan Keramik', 'museum', 'contact@museumsenirupa.id', '+62 21 9876 5432', 'Jakarta', 5, 'Diskusi untuk pameran kolaborasi', 'Museum Seni Rupa dan Keramik'),
  ('YOUR_USER_ID', 'Sarah Chen', 'curator', 'sarah.chen@artworld.com', '+65 9123 4567', 'Singapore', 4, 'Kurator untuk Singapore Art Week', 'ArtWorld Gallery'),
  ('YOUR_USER_ID', 'Budi Santoso', 'collector', 'budi.s@company.com', '+62 811 2233 4455', 'Bandung', 3, 'Pemula dalam koleksi seni', NULL),
  ('YOUR_USER_ID', 'Art Space Gallery', 'gallery', 'hello@artspace.id', '+62 22 7654 3210', 'Yogyakarta', 4, 'Gallery fokus pada emerging artists', 'Art Space Gallery');

-- ============================================================================
-- SAMPLE PIPELINE ITEMS
-- ============================================================================

INSERT INTO pipeline_items (user_id, title, medium, status, due_date, estimated_price, position) VALUES
  ('YOUR_USER_ID', 'Harmony in Blue', 'Oil on Canvas', 'concept', CURRENT_DATE + INTERVAL '30 days', 12000000, 0),
  ('YOUR_USER_ID', 'Morning Light', 'Watercolor', 'concept', CURRENT_DATE + INTERVAL '14 days', 5000000, 1),
  ('YOUR_USER_ID', 'City Reflections', 'Acrylic on Canvas', 'wip', CURRENT_DATE + INTERVAL '7 days', 18000000, 0),
  ('YOUR_USER_ID', 'Abstract Series #1', 'Mixed Media', 'wip', CURRENT_DATE + INTERVAL '21 days', 15000000, 1),
  ('YOUR_USER_ID', 'Golden Hour', 'Oil on Canvas', 'finished', NULL, 22000000, 0),
  ('YOUR_USER_ID', 'Serenity', 'Digital Print', 'finished', NULL, 8500000, 1);

-- ============================================================================
-- SAMPLE TAGS
-- ============================================================================

INSERT INTO tags (user_id, name, color, usage_count) VALUES
  ('YOUR_USER_ID', 'abstract', '#8B5CF6', 5),
  ('YOUR_USER_ID', 'landscape', '#10B981', 3),
  ('YOUR_USER_ID', 'contemporary', '#F59E0B', 4),
  ('YOUR_USER_ID', 'oil painting', '#EF4444', 2),
  ('YOUR_USER_ID', 'watercolor', '#3B82F6', 2),
  ('YOUR_USER_ID', 'mixed media', '#EC4899', 2),
  ('YOUR_USER_ID', 'digital', '#6366F1', 1);

*/

-- ============================================================================
-- FUNCTION TO CREATE INITIAL USER DATA
-- ============================================================================

-- This function can be called after a new user registers via Firebase
-- It creates the user in Supabase and optionally seeds initial data

CREATE OR REPLACE FUNCTION create_user_with_sample_data(
  p_firebase_uid VARCHAR(128),
  p_email VARCHAR(255),
  p_full_name VARCHAR(255) DEFAULT NULL,
  p_create_sample_data BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Insert the user
  INSERT INTO users (firebase_uid, email, full_name, role)
  VALUES (p_firebase_uid, p_email, p_full_name, 'artist')
  RETURNING id INTO v_user_id;

  -- Optionally create sample data
  IF p_create_sample_data THEN
    -- Insert sample artworks
    INSERT INTO artworks (user_id, title, description, medium, dimensions, year, status, price, image_url, category, tags) VALUES
      (v_user_id, 'Sunset Horizon', 'A beautiful sunset over the ocean', 'Acrylic on Canvas', '100 x 80 cm', 2024, 'finished', 15000000, 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=400', 'Landscape', ARRAY['sunset', 'ocean']),
      (v_user_id, 'Urban Dreams', 'Abstract city representation', 'Oil on Canvas', '120 x 90 cm', 2024, 'wip', NULL, 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400', 'Abstract', ARRAY['urban', 'abstract']),
      (v_user_id, 'Digital Echoes', 'Contemporary digital art', 'Digital Print', '80 x 60 cm', 2024, 'finished', 8000000, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', 'Digital', ARRAY['digital', 'modern']);

    -- Insert sample contacts
    INSERT INTO contacts (user_id, name, type, email, phone, location, rating, notes) VALUES
      (v_user_id, 'Galeri Nasional Indonesia', 'gallery', 'info@galnas.go.id', '+62 21 1234 5678', 'Jakarta', 5, 'Tertarik dengan seri landscape'),
      (v_user_id, 'Ahmad Wijaya', 'collector', 'ahmad.w@email.com', '+62 812 3456 7890', 'Surabaya', 4, 'Koleksi fokus pada contemporary art');

    -- Insert sample tags
    INSERT INTO tags (user_id, name, color, usage_count) VALUES
      (v_user_id, 'abstract', '#8B5CF6', 2),
      (v_user_id, 'landscape', '#10B981', 1),
      (v_user_id, 'digital', '#6366F1', 1);

    -- Log the activity
    PERFORM log_activity(
      v_user_id,
      'user_login',
      'Akun baru dibuat',
      'Selamat datang di ArtConnect CRM!',
      'user',
      v_user_id,
      p_full_name
    );
  END IF;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Allow authenticated users to execute the function
GRANT EXECUTE ON FUNCTION create_user_with_sample_data TO authenticated;
GRANT EXECUTE ON FUNCTION log_activity TO authenticated;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'Seed data and helper functions created successfully!';
  RAISE NOTICE 'Use create_user_with_sample_data() function to create users with sample data';
END
$$;
