DROP TABLE IF EXISTS locus_core.containers;
CREATE  TABLE locus_core.containers(
    id                  BIGSERIAL PRIMARY KEY,
    status              TEXT DEFAULT 'INITIALISING',
    attributes          JSONB,
    created             TIMESTAMP DEFAULT NOW(),
    last_update         TIMESTAMP DEFAULT NOW()
);