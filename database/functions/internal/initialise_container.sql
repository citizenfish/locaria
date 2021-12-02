CREATE OR REPLACE FUNCTION locaria_core.initialise_container(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

     SET SEARCH_PATH = 'locaria_core', 'public';

     INSERT INTO locaria_core.containers(attributes)
     SELECT parameters || jsonb_build_object('log_messages', jsonb_build_array(jsonb_build_object('created', to_char(now(), 'DD/MM/YYYY HH24:MI:SS'))))
     RETURNING jsonb_build_object('id', id)
     INTO ret_var;

     RETURN ret_var;
END;
$$ LANGUAGE PLPGSQL;
