
CREATE OR REPLACE FUNCTION locaria_core.set_parameters(parameters_var JSONB DEFAULT json_build_object())  RETURNS JSONB AS
$$
DECLARE
    --default is view public, update/delete admins
    acl_var JSONB DEFAULT jsonb_build_object('update', jsonb_build_array('Admins'), 'delete', jsonb_build_array('Admins'));
    id_var BIGINT;

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'public';

    INSERT INTO parameters(parameter_name, parameter, acl, usage, last_updated)
    SELECT parameters_var->>'parameter_name',
           parameters_var->'parameters',
           COALESCE(parameters_var#>'{acl,_newACL}', acl_var),
           COALESCE(parameters_var->>'usage', 'SYSTEM'),
           now()
    ON CONFLICT(parameter_name,usage)
    DO UPDATE set parameter = EXCLUDED.parameter,
                  acl = EXCLUDED.acl,
                  usage = EXCLUDED.usage,
                  last_updated = EXCLUDED.last_updated
    WHERE (acl_check(parameters_var->'acl', parameters.acl)->>'update')::BOOLEAN
    RETURNING id
    INTO id_var;

    RETURN jsonb_build_object('id', id_var,'history', add_history(parameters_var));

END;
$$
    LANGUAGE PLPGSQL;