--Single gateway for all Internal API calls to locaria_core
CREATE OR REPLACE FUNCTION locaria_core.locaria_internal_gateway(parameters JSONB, acl JSONB DEFAULT jsonb_build_object()) RETURNS JSONB AS
$$
DECLARE
    debug_var   BOOLEAN DEFAULT FALSE;
    log_var     BOOLEAN DEFAULT TRUE;
    ret_var     JSONB;
    logid_var   BIGINT;
    version_var TEXT DEFAULT '0.2';
BEGIN

    --This keeps us within our search schema when running code
    SET SEARCH_PATH = 'locaria_core', 'locaria_data','public';

    IF acl IS NOT NULL THEN
        parameters = jsonb_insert(parameters #- '{attributes,acl}', '{attributes,acl}', acl);
    END IF;

    --From the incoming JSON select the method and run it
    CASE WHEN parameters ->> 'method' IN ('get_tables') THEN
        ret_var = get_tables(parameters);

        WHEN parameters ->> 'method' IN ('add_item') THEN
            ret_var = add_item(parameters);

        WHEN parameters ->> 'method' IN ('delete_item') THEN
            ret_var = delete_item(parameters);

        WHEN parameters ->> 'method' IN ('update_item') THEN
            ret_var = update_item(parameters);

        WHEN parameters ->> 'method' IN ('refresh_search_view') THEN
            ret_var = update_history(jsonb_build_object('refresh_view', true));
            PERFORM locaria_core.views_union();
            REFRESH MATERIALIZED VIEW CONCURRENTLY global_search_view WITH data;
            RETURN jsonb_build_object('message', 'view refreshed', 'refresh', ret_var);

        WHEN parameters ->> 'method' IN ('get_files') THEN
            ret_var = get_files(parameters);

        WHEN parameters ->> 'method' IN ('add_file') THEN
            ret_var = add_file(parameters);

        WHEN parameters ->> 'method' IN ('update_file') THEN
            ret_var = update_file(parameters);

        WHEN parameters ->> 'method' IN ('delete_file') THEN
            ret_var = delete_file(parameters);

        WHEN parameters->>'method' IN ('report') THEN
            ret_var = run_report(parameters, TRUE);

        WHEN parameters ->> 'method' IN ('view_report') THEN
            ret_var = view_report(parameters);

        WHEN parameters ->> 'method' IN ('add_group') THEN
            ret_var = add_group(parameters);

        WHEN parameters ->> 'method' IN ('get_group') THEN
            ret_var = get_group(parameters);

        WHEN parameters->>'method' IN ('get_moderation_items') THEN
            ret_var = get_moderation_items(parameters);

        WHEN parameters->>'method' IN ('preview_file_data') THEN
            ret_var = preview_file_data(parameters);

        WHEN parameters->>'method' IN ('load_preview_file_data') THEN
            ret_var = load_preview_file_data(parameters);

        WHEN parameters->>'method' IN ('update_moderation_status') THEN
            ret_var = update_moderation_status(parameters);

        WHEN parameters->>'method' IN ('get_parameters') THEN
            ret_var = get_parameters(parameters);

        WHEN parameters->>'method' IN ('set_parameters') THEN
            ret_var = set_parameters(parameters);

        ELSE
            RETURN json_build_object('error', 'unsupported internal method', 'method', parameters ->> 'method');
        END CASE;

    --If debug_var is set then the API will return the calling parameters in a debug object. NOTE WELL this will break GeoJSON returned
    IF debug_var OR parameters ->> 'debug' = 'true' THEN
        ret_var = ret_var || jsonb_build_object('debug', parameters);
    END IF;

    -- Operations can be logged to the logs table. This is set on by default but can be switched off with a parameter
    log_var = COALESCE((SELECT (parameter ->> 'log_searches')::BOOLEAN
                        FROM locaria_core.parameters
                        WHERE parameter_name = 'log_configuration'), log_var);

    IF log_var THEN
        PERFORM log(parameters ||jsonb_build_object('ret',ret_var),CASE
                           WHEN COALESCE(ret_var ->> 'error', '') = ''
                               THEN 'ok'
                           ELSE ret_var ->> 'error' END);
    END IF;

    RETURN jsonb_build_object('response_code', 200) || ret_var;

--This block will trap any errors and write a log entry. The log entry id is returned to the user and can be used for debugging if necessary
EXCEPTION
    WHEN OTHERS THEN

        RETURN jsonb_build_object('route',           'internal_api',
                                  'error',           'request could not be completed',
                                  'response_code',   600) || locaria_core.log(parameters,SQLERRM);
END;
$$ LANGUAGE PLPGSQL;