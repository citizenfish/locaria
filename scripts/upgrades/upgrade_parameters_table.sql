ALTER TABLE locaria_core.parameters ADD COLUMN IF NOT EXISTS  usage TEXT;
ALTER TABLE locaria_core.parameters DROP CONSTRAINT  parameter_name_unique;
ALTER TABLE locaria_core.parameters ADD CONSTRAINT parameter_name_unique UNIQUE (parameter_name,usage);