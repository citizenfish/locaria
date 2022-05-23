CREATE OR REPLACE FUNCTION locaria_core.file_cron(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;

BEGIN

    SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';

    WITH F AS (
        UPDATE files
        SET status = COALESCE(parameters->>'new_status', 'REGISTERED')
        WHERE attributes @> (parameters->'filter')
        RETURNING id
    ) SELECT jsonb_agg(id)
      INTO ret_var
      FROM F;

    PERFORM log(parameters || jsonb_build_object('method', 'file_cron', 'ids', ret_var));

    RETURN ret_var;
EXCEPTION WHEN OTHERS THEN

    RETURN jsonb_build_object('route',           'file_cron',
                              'error',           'request could not be completed',
                              'response_code',   2000) ||locaria_core.log(parameters,SQLERRM);
END;
$$ LANGUAGE PLPGSQL;