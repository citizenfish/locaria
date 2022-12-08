--DROP TABLE IF EXISTS locaria_core.user_store;
CREATE TABLE IF NOT EXISTS locaria_core.user_store (
     userID TEXT PRIMARY KEY NOT NULL,
     created TIMESTAMP DEFAULT now(),
     attributes JSONB DEFAULT jsonb_build_object(),
     last_updated TIMESTAMP DEFAULT now()
);

