DROP TABLE IF EXISTS locaria_core.history;
CREATE TABLE locaria_core.history (
    id BIGSERIAL PRIMARY KEY,
    history_timestamp TIMESTAMP DEFAULT now(),
    attributes JSONB,
    in_view BOOLEAN DEFAULT FALSE
);

