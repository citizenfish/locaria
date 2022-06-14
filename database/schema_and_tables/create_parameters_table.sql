DROP TABLE IF EXISTS locaria_core.parameters;
CREATE  TABLE locaria_core.parameters(

    id              BIGSERIAL PRIMARY KEY,
    parameter_name  TEXT,
    usage           TEXT DEFAULT 'SYSTEM',
    parameter       JSONB,
    acl             JSONB DEFAULT jsonb_build_object('update', jsonb_build_array('Admins'), 'delete', jsonb_build_array('Admins'), 'view', jsonb_build_array('Admins')),
    last_updated    TIMESTAMP DEFAULT NOW(),
    CONSTRAINT parameter_name_unique UNIQUE (parameter_name,usage)

);