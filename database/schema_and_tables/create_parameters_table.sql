DROP TABLE IF EXISTS locaria_core.parameters;
CREATE  TABLE locaria_core.parameters(

    id              BIGSERIAL PRIMARY KEY,
    parameter_name  TEXT,
    parameter       JSONB,
    last_updated    TIMESTAMP DEFAULT NOW(),
    CONSTRAINT parameter_name_unique UNIQUE (parameter_name)

);