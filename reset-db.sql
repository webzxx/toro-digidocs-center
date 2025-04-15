-- SQL script to completely reset the database
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Create sequences needed for ID generation
CREATE SEQUENCE bahay_toro_system_id_seq;
CREATE SEQUENCE reference_number_seq;

-- Grant permissions (typically needed for PostgreSQL)
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Comment indicating completion
COMMENT ON SCHEMA public IS 'standard public schema';

