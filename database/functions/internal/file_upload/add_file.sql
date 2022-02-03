CREATE OR REPLACE FUNCTION locaria_core.add_file(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

     SET SEARCH_PATH = 'locaria_core', 'public';

     INSERT INTO locaria_core.files(attributes)
     SELECT COALESCE(parameters->'file_attributes', jsonb_build_object()) || jsonb_build_object('log_messages', jsonb_build_array(jsonb_build_object('message', 'File created', 'timestamp', to_char(now(), 'DD/MM/YYYY HH24:MI:SS'))))
     RETURNING jsonb_build_object('id', id, 'status', status)
     INTO ret_var;

     RETURN ret_var;
END;
$$ LANGUAGE PLPGSQL;
