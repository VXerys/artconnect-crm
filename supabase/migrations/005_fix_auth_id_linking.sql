-- ============================================================================
-- ARTCONNECT CRM - SECURE AUTH_ID LINKING FUNCTION
-- ============================================================================
-- Author: ArtConnect Team
-- Created: 2024-01-08
-- Description: Create a secure RPC function to link auth_id to existing profile
-- ============================================================================

-- Create function to link or create profile
CREATE OR REPLACE FUNCTION public.link_or_create_profile(
  p_auth_id UUID,
  p_email TEXT,
  p_full_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  auth_id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges
SET search_path = public
AS $$
DECLARE
  v_profile RECORD;
BEGIN
  -- First check if profile exists with this auth_id
  SELECT * INTO v_profile FROM users u WHERE u.auth_id = p_auth_id;
  
  IF FOUND THEN
    -- Profile already exists with correct auth_id
    RETURN QUERY SELECT u.id, u.auth_id, u.email, u.full_name, u.avatar_url, u.role, u.created_at, u.updated_at 
    FROM users u WHERE u.auth_id = p_auth_id;
    RETURN;
  END IF;
  
  -- Check if profile exists with this email
  SELECT * INTO v_profile FROM users u WHERE u.email = p_email;
  
  IF FOUND THEN
    -- Profile exists with email but different auth_id - update it
    UPDATE users SET 
      auth_id = p_auth_id,
      full_name = COALESCE(p_full_name, users.full_name),
      avatar_url = COALESCE(p_avatar_url, users.avatar_url),
      updated_at = NOW()
    WHERE users.email = p_email;
    
    RETURN QUERY SELECT u.id, u.auth_id, u.email, u.full_name, u.avatar_url, u.role, u.created_at, u.updated_at 
    FROM users u WHERE u.auth_id = p_auth_id;
    RETURN;
  END IF;
  
  -- No profile exists - create new one
  INSERT INTO users (auth_id, email, full_name, avatar_url, role)
  VALUES (p_auth_id, p_email, COALESCE(p_full_name, 'User'), p_avatar_url, 'artist');
  
  RETURN QUERY SELECT u.id, u.auth_id, u.email, u.full_name, u.avatar_url, u.role, u.created_at, u.updated_at 
  FROM users u WHERE u.auth_id = p_auth_id;
  RETURN;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.link_or_create_profile TO authenticated;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'Profile linking function created successfully!';
END
$$;
