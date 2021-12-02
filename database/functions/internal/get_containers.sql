CREATE OR REPLACE FUNCTION locaria_core.get_containers(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

     SET SEARCH_PATH = 'locaria_core', 'public';

     SELECT parameter
     INTO ret_var
     FROM parameters WHERE parameter_name = 'containers';

     RETURN COALESCE(ret_var, jsonb_build_object('error', 'No configured containers', 'response_code', 1098));
END;
$$ LANGUAGE PLPGSQL;
