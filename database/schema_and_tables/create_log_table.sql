DROP TABLE IF EXISTS locaria_core.logs;
CREATE  TABLE locaria_core.logs(

    id                  BIGSERIAL PRIMARY KEY,
    log_type            TEXT DEFAULT 'search',
    log_message         JSONB,
    log_timestamp       TIMESTAMP DEFAULT NOW()
);