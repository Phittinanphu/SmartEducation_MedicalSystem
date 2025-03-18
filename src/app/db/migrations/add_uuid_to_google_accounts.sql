-- Add UUID column to userdata.google_accounts table
ALTER TABLE userdata.google_accounts 
ADD COLUMN IF NOT EXISTS uid UUID;

-- Create an extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update existing rows with a UUID if uid is null
UPDATE userdata.google_accounts 
SET uid = uuid_generate_v4() 
WHERE uid IS NULL;

-- Make uid column NOT NULL and add a unique constraint
ALTER TABLE userdata.google_accounts 
ALTER COLUMN uid SET NOT NULL,
ADD CONSTRAINT google_accounts_uid_unique UNIQUE (uid);

-- Add index on uid for faster lookups
CREATE INDEX IF NOT EXISTS idx_google_accounts_uid ON userdata.google_accounts (uid);

-- Comment on column to document its purpose
COMMENT ON COLUMN userdata.google_accounts.uid IS 'Unique identifier for Google accounts in UUID format'; 