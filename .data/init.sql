-- Initialize database for Finance App
-- This file runs when the PostgreSQL container starts for the first time

-- Create the public schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Grant necessary permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Set search path
SET search_path TO public;
