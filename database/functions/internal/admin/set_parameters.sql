
CREATE OR REPLACE FUNCTION locaria_core.set_parameters(parameters_var JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    acl_var TEXT DEFAULT 'internal';
    id_var BIGINT;

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    INSERT INTO parameters(parameter_name, parameter,acl)
    SELECT parameters_var->>'parameter_name',
           parameters_var->'parameters',
           COALESCE(parameters_var->>'acl', acl_var)
    ON CONFLICT(parameter_name)
    DO UPDATE set parameter = EXCLUDED.parameter, acl = EXCLUDED.acl
    RETURNING id
    INTO id_var;

    RETURN jsonb_build_object('id', id_var);

END;
$$
    LANGUAGE PLPGSQL;