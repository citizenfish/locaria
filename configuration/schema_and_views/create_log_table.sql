DROP TABLE IF EXISTS locus_core.logs;
CREATE  TABLE locus_core.logs(

    id                  BIGSERIAL,
    log_type            TEXT DEFAULT 'search',
    log_message         JSONB,
    log_timestamp       TIMESTAMP DEFAULT NOW()

);