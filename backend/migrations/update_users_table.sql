-- Drop existing columns if they exist (to avoid conflicts)
DO $$ 
BEGIN
    -- Check if columns exist before dropping
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') THEN
        ALTER TABLE users DROP COLUMN bio;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'location') THEN
        ALTER TABLE users DROP COLUMN location;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'social') THEN
        ALTER TABLE users DROP COLUMN social;
    END IF;
END $$;

-- Add new columns
ALTER TABLE users 
    ADD COLUMN bio TEXT,
    ADD COLUMN location VARCHAR(255),
    ADD COLUMN social TEXT; 