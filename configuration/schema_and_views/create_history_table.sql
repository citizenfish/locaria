DROP TABLE IF EXISTS locus_core.history;
CREATE TABLE locus_core.history (
    id BIGSERIAL PRIMARY KEY,
    history_timestamp TIMESTAMP DEFAULT now(),
    attributes JSONB,
    in_view BOOLEAN DEFAULT FALSE
);

