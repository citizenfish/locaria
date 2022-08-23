CREATE OR REPLACE FUNCTION locaria_core.get_files(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

     SET SEARCH_PATH = 'locaria_core', 'public';


     SELECT jsonb_build_object('files', COALESCE(json_agg(FILES.*), json_build_array())::JSONB)
     INTO ret_var
     FROM (
            SELECT id,
                   status,
                   attributes,
                   to_char(created, 'DD/MM/YYYY HH24:MI') AS created,
                   to_char(created, 'DD/MM/YYYY HH24:MI') AS last_updated
            FROM files
            WHERE (COALESCE(parameters->>'id', '*') = '*' OR id = (parameters->>'id')::BIGINT)
            AND   ((status != 'DELETED' AND COALESCE(parameters->>'status', '*') = '*') OR status = (parameters->>'status'))
            AND   ((parameters->>'filter') IS NULL OR attributes @> (parameters->'filter'))

     ) FILES;

     RETURN ret_var;

END;
$$ LANGUAGE PLPGSQL;
