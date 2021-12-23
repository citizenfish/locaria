DROP TABLE IF EXISTS locaria_core.files;
CREATE  TABLE locaria_core.files(
     id                  BIGSERIAL PRIMARY KEY,
     status              TEXT DEFAULT 'REGISTERED',
     attributes          JSONB,
     created             TIMESTAMP DEFAULT NOW(),
     last_update         TIMESTAMP DEFAULT NOW()
);