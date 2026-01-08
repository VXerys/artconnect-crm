-- ============================================================================
-- ARTCONNECT CRM - SECURE AUTH_ID LINKING FUNCTION (FIXED)
-- ============================================================================
-- Drop old function first
DROP FUNCTION IF EXISTS public.link_or_create_profile(UUID, TEXT, TEXT, TEXT);

-- Create simpler function that returns JSON instead
CREATE OR REPLACE FUNCTION public.link_or_create_profile(
  p_auth_id UUID,
  p_email TEXT,
  p_full_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile RECORD;
  v_result JSON;
BEGIN
  -- First check if profile exists with this auth_id
  SELECT * INTO v_profile FROM users u WHERE u.auth_id = p_auth_id;
  
  IF FOUND THEN
    SELECT json_build_object(
      'id', u.id, 'auth_id', u.auth_id, 'email', u.email, 
      'full_name', u.full_name, 'avatar_url', u.avatar_url, 
      'role', u.role, 'created_at', u.created_at, 'updated_at', u.updated_at
    ) INTO v_result FROM users u WHERE u.auth_id = p_auth_id;
    RETURN v_result;
  END IF;
  
  -- Check if profile exists with this email
  SELECT * INTO v_profile FROM users u WHERE u.email = p_email;
  
  IF FOUND THEN
    -- Update existing profile with new auth_id
    UPDATE users SET 
      auth_id = p_auth_id,
      full_name = COALESCE(p_full_name, users.full_name),
      avatar_url = COALESCE(p_avatar_url, users.avatar_url),
      updated_at = NOW()
    WHERE users.email = p_email;
    
    SELECT json_build_object(
      'id', u.id, 'auth_id', u.auth_id, 'email', u.email, 
      'full_name', u.full_name, 'avatar_url', u.avatar_url, 
      'role', u.role, 'created_at', u.created_at, 'updated_at', u.updated_at
    ) INTO v_result FROM users u WHERE u.auth_id = p_auth_id;
    RETURN v_result;
  END IF;
  
  -- No profile exists - create new one
  INSERT INTO users (auth_id, email, full_name, avatar_url, role)
  VALUES (p_auth_id, p_email, COALESCE(p_full_name, 'User'), p_avatar_url, 'artist');
  
  SELECT json_build_object(
    'id', u.id, 'auth_id', u.auth_id, 'email', u.email, 
    'full_name', u.full_name, 'avatar_url', u.avatar_url, 
    'role', u.role, 'created_at', u.created_at, 'updated_at', u.updated_at
  ) INTO v_result FROM users u WHERE u.auth_id = p_auth_id;
  RETURN v_result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.link_or_create_profile TO authenticated;
