-- Add unique constraint to skills table
-- This fixes the ON CONFLICT (name) error in studentSkill.model.js

-- Add unique constraint on the name column
ALTER TABLE skills ADD CONSTRAINT skills_name_unique UNIQUE (name);

-- This will allow the following query to work:
-- INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO NOTHING
