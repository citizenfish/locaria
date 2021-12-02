DROP TABLE IF EXISTS locaria_core.containers;
CREATE  TABLE locaria_core.containers(
    id                  BIGSERIAL PRIMARY KEY,
    status              TEXT DEFAULT 'INITIALISING',
    attributes          JSONB,
    created             TIMESTAMP DEFAULT NOW(),
    last_update         TIMESTAMP DEFAULT NOW()
);