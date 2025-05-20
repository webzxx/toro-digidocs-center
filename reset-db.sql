-- SQL script to completely reset the database
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Create sequences needed for ID generation

-- Grant permissions (typically needed for PostgreSQL)
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Comment indicating completion
COMMENT ON SCHEMA public IS 'standard public schema';

