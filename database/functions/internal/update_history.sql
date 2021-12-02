CREATE OR REPLACE FUNCTION locaria_core.update_history(parameters JSONB DEFAULT jsonb_build_object('refresh_view', true)) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB DEFAULT jsonb_build_object();
BEGIN

     SET SEARCH_PATH = 'locaria_core', 'public';

     IF (parameters->>'refresh_view')::BOOLEAN THEN

        UPDATE history
        SET in_view = TRUE
        WHERE NOT in_view;

        ret_var = jsonb_build_object('refresh_view', 'completed');
     END IF;

     RETURN ret_var;
EXCEPTION WHEN OTHERS THEN

    RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE PLPGSQL;
