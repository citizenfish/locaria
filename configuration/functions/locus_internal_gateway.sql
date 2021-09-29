--Single gateway for all Internal API calls to locus_core
CREATE OR REPLACE FUNCTION locus_core.locus_internal_gateway(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    debug_var BOOLEAN DEFAULT FALSE;
    log_var BOOLEAN DEFAULT TRUE;
    ret_var JSONB;
    logid_var BIGINT;
    version_var TEXT DEFAULT '0.2';
BEGIN

    --This keeps us within our search schema when running code
    SET SEARCH_PATH = 'locus_core', 'public';

    --From the incoming JSON select the method and run it
    CASE WHEN parameters->>'method' IN ('get_tables') THEN
            ret_var = get_tables(parameters);

         WHEN parameters->>'method' IN ('add_item') THEN
                     ret_var = add_item(parameters);

         WHEN parameters->>'method' IN ('delete_item') THEN
                     ret_var = delete_item(parameters);

         WHEN parameters->>'method' IN ('update_item') THEN
                     ret_var = update_item(parameters);

         WHEN parameters->>'method' IN ('refresh_search_view') THEN

            REFRESH MATERIALIZED VIEW CONCURRENTLY locus_core.global_search_view WITH data;
            RETURN jsonb_build_object('message', 'view refreshed');

         ELSE
            RETURN json_build_object('error', 'unsupported method', 'method', parameters->>'method');
    END CASE;

    --If debug_var is set then the API will return the calling parameters in a debug object. NOTE WELL this will break GeoJSON returned
    IF debug_var OR parameters->>'debug' = 'true' THEN
        ret_var = ret_var || jsonb_build_object('debug', parameters);
    END IF;

    -- Operations can be logged to the logs table. This is set on by default but can be switched off with a parameter
    log_var = COALESCE((SELECT (parameter->>'log_searches')::BOOLEAN FROM locus_core.parameters WHERE parameter_name = 'log_configuration'), log_var);

    IF log_var THEN
        INSERT INTO logs(log_type, log_message)
        SELECT parameters->>'method',
               jsonb_build_object('parameters', parameters, 'response', CASE WHEN COALESCE(ret_var->>'error', '') = '' THEN 'ok' ELSE ret_var->>'error' END);
    END IF;


    RETURN ret_var;

--This block will trap any errors and write a log entry. The log entry id is returned to the user and can be used for debugging if necessary
EXCEPTION WHEN OTHERS THEN

        RAISE NOTICE '%', SQLERRM;

        INSERT INTO locus_core.logs(log_type, log_message)
        SELECT parameters->>'method',
               jsonb_build_object('path', 'internal', 'parameters', parameters, 'response', SQLERRM)
        RETURNING id INTO logid_var;

    RETURN json_build_object('error', 'request could not be completed','system_log_id', logid_var);
END;
$$ LANGUAGE PLPGSQL;