DROP FUNCTION IF EXISTS  locaria_core.get_parameters(parameters_var JSONB , acl_var TEXT);

CREATE OR REPLACE FUNCTION locaria_core.get_parameters(parameters_var JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT jsonb_build_object(parameter_name, parameter)
    INTO ret_var
    FROM parameters
    WHERE (acl_check(parameters_var->'acl', acl)->>'view')::BOOLEAN
    AND parameter_name = COALESCE(parameters_var->>'parameter_name', parameter_name);

    RETURN COALESCE(ret_var, jsonb_build_object('error', 'parameter not found'));

END;
$$
    LANGUAGE PLPGSQL;