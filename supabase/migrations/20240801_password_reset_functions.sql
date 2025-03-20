
-- Function to verify a reset code
CREATE OR REPLACE FUNCTION verify_reset_code(p_email TEXT, p_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM password_resets
    WHERE email = p_email
    AND code = p_code
    AND expires_at > now()
  );
END;
$$;

-- Function to delete a reset code after it's used
CREATE OR REPLACE FUNCTION delete_reset_code(p_email TEXT, p_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM password_resets
  WHERE email = p_email
  AND code = p_code;
END;
$$;
