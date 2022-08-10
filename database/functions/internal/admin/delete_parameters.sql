

CREATE OR REPLACE FUNCTION locaria_core.delete_parameters(parameters_var JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    delete_count INTEGER;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    IF COALESCE(parameters_var->>'parameter_name',parameters_var->>'usage') IS NULL THEN
        RETURN jsonb_build_object('error', 'One of parameter_name, usage must be supplied');
    END IF;

    DELETE
    FROM parameters
    WHERE (acl_check(parameters_var->'acl', acl)->>'delete')::BOOLEAN
    AND parameter_name = COALESCE(parameters_var->>'parameter_name', parameter_name)
    AND ((parameters_var->>'usage') IS NULL OR usage = parameters_var->>'usage');

    GET DIAGNOSTICS delete_count = ROW_COUNT;

    IF delete_count = 1 THEN
        RETURN jsonb_build_object('message', concat_ws(' ', 'delete success:', parameters_var->>'parameter_name'),'history', add_history(parameters_var));
    END IF;

    RETURN jsonb_build_object('error',  concat_ws(' ', 'delete failure:', parameters_var->>'parameter_name'));

END;
$$
    LANGUAGE PLPGSQL;