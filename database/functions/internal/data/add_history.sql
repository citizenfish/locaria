CREATE OR REPLACE FUNCTION locaria_core.add_history(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
BEGIN

     SET SEARCH_PATH = 'locaria_core', 'public';

     INSERT INTO history(attributes)
     SELECT parameters
     RETURNING jsonb_build_object('id',id)
     INTO ret_var;

     RETURN ret_var;
EXCEPTION WHEN OTHERS THEN

    RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE PLPGSQL;
