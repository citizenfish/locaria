DROP FUNCTION IF EXISTS  locaria_core.get_parameters(parameters_var JSONB , acl_var TEXT);

CREATE OR REPLACE FUNCTION locaria_core.get_parameters(parameters_var JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    SELECT jsonb_object_agg(parameter_name,
                            jsonb_build_object('data', parameter  -  COALESCE(parameters_var->>'delete_key', ''))
                                       || jsonb_build_object('last_updated', to_char(last_updated, 'DD/MM/YYYY HH24:MI'))
                                       || CASE WHEN COALESCE(parameters_var->>'send_acl', 'false')::BOOLEAN
                                               THEN jsonb_build_object('_acl', acl)
                                               ELSE jsonb_build_object() END
        )
    INTO ret_var
    FROM parameters
    WHERE (acl_check(parameters_var->'acl', acl)->>'view')::BOOLEAN
    AND parameter_name = COALESCE(parameters_var->>'parameter_name', parameter_name)
    AND ((parameters_var->>'usage') IS NULL OR usage = parameters_var->>'usage');

    IF ret_var IS NOT NULL THEN
        RETURN jsonb_build_object('parameters',ret_var);
    END IF;

    RETURN jsonb_build_object('error', 'parameter not found');

END;
$$
    LANGUAGE PLPGSQL;