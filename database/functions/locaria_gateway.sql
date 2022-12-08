--Single gateway for all Public API calls to locaria_core
CREATE OR REPLACE FUNCTION locaria_core.locaria_gateway(parameters JSONB, acl JSONB DEFAULT jsonb_build_object()) RETURNS JSONB AS
$$
DECLARE
    debug_var BOOLEAN DEFAULT FALSE;
    log_var BOOLEAN DEFAULT TRUE;
    ret_var JSONB;
    version_var TEXT DEFAULT '0.8';
    --added to shared methods with internal gateway to flag this has come via public path
    internal JSONB DEFAULT jsonb_build_object('internal', false);
    logged_in_var BOOLEAN DEFAULT FALSE;

BEGIN

    --This keeps us within our search schema when running code
    SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';

    --delete any user sent acl and add in api one
    parameters = parameters - 'acl' - 'id_token' || jsonb_build_object('acl',acl);

    --is user logged in
    IF jsonb_array_length(acl->'groups') > 1 OR acl->'groups'->>0 != 'PUBLIC' THEN
        logged_in_var = TRUE;
    END IF;
    --From the incoming JSON select the method and run it
    CASE WHEN parameters->>'method' IN ('search','bboxsearch', 'refsearch', 'pointsearch', 'datesearch', 'filtersearch') THEN
            ret_var = search(parameters);

         WHEN parameters->>'method' IN ('get_item') THEN
            ret_var = get_item(parameters);

         WHEN parameters->>'method' IN ('get_my_items') AND logged_in_var = TRUE THEN
             ret_var = get_my_items(parameters);

         WHEN parameters->>'method' IN ('add_item') AND logged_in_var = TRUE THEN
            --acl is scrubbed above so _newACL cannot be injected
            ret_var = add_item(parameters || internal);

         WHEN parameters ->> 'method' IN ('update_item') AND logged_in_var = TRUE THEN --TODO documentation
             ret_var = update_item(parameters || internal);

         WHEN parameters->>'method' IN ('list_categories') THEN
            ret_var = list_categories(parameters);

         WHEN parameters->>'method' IN ('list_tags') THEN
            ret_var = list_tags(parameters);

         WHEN parameters->>'method' IN ('list_categories_with_data') THEN
            ret_var = list_categories_with_data(parameters);

	     WHEN parameters->>'method' IN ('location_search','address_search') THEN
	     	 ret_var = location_search(parameters);

         WHEN parameters->>'method' IN ('version') THEN
            ret_var = json_build_object('version', version_var);

         WHEN parameters->>'method' IN ('revgeocoder') THEN
            ret_var = reverse_geocoder(parameters);

         WHEN parameters->>'method' IN ('add_message') THEN
            ret_var = add_message(parameters);

         WHEN parameters->>'method' IN ('report') THEN
            ret_var = run_report(parameters, FALSE);

         WHEN parameters->>'method' IN ('get_parameters') THEN
            ret_var = get_parameters(parameters);

        WHEN parameters->>'method' IN ('add_asset') AND logged_in_var = TRUE THEN
            ret_var = add_asset(parameters || internal);

        WHEN parameters->>'method' IN ('get_asset') THEN
            ret_var = get_asset(parameters || internal);

        WHEN parameters->>'method' IN ('delete_asset') AND logged_in_var = TRUE THEN
            ret_var = delete_asset(parameters || internal);

        WHEN parameters->>'method' IN ('add_user_store')  THEN
             ret_var = add_user_store(parameters,acl);

        WHEN parameters->>'method' IN ('get_user_store')  THEN
             ret_var = get_user_store(parameters,acl);

        WHEN parameters->>'method' IN ('get_vector_tile') THEN
            ret_var = get_parameters(parameters || jsonb_build_object('parameter_name', parameters->>'tileset', 'usage', 'VECTOR_TILES'));
            ret_var = jsonb_build_object('vt',
                get_vector_tile(jsonb_extract_path_text(ret_var, 'parameters', parameters->>'tileset', 'table'),
                                (parameters->>'x')::INTEGER,
                                (parameters->>'y')::INTEGER,
                                (parameters->>'z')::INTEGER,
                                COALESCE(jsonb_extract_path_text(ret_var, 'parameters', parameters->>'tileset', 'cache'), 'true')::BOOLEAN));
ELSE
            RETURN jsonb_build_object('error', 'Unsupported public method',
                                     'route', 'public_api',
                                     'response_code', 401) || locaria_core.log(parameters,'Unsupported public method');
    END CASE;

    --If debug_var is set then the API will return the calling parameters in a debug object. NOTE WELL this will break GeoJSON returned
    IF debug_var OR parameters->>'debug' = 'true' THEN
        ret_var = ret_var || jsonb_build_object('debug', parameters);
    END IF;

    -- Searches can be logged to the logs table. This is set on by default but can be switched off with a parameter
    log_var = COALESCE((SELECT (parameter->>'log_searches')::BOOLEAN FROM locaria_core.parameters WHERE parameter_name = 'log_configuration'), log_var);

    --TODO use log function
    IF log_var THEN
        INSERT INTO logs(log_type, log_message)
        SELECT parameters->>'method',
               jsonb_build_object('response_code',COALESCE(ret_var->>'response_code', '200'),
                                  'parameters',   parameters ,
                                  'logpath',     'external',
                                  'acl',          acl,
                                  'response',     CASE WHEN COALESCE(ret_var->>'error', '') = '' THEN 'ok' ELSE ret_var->>'error' END,
                                  'search_stats', COALESCE(ret_var->'options', jsonb_build_object())
               );
    END IF;


    RETURN jsonb_build_object('response_code', 200) || ret_var;

--This block will trap any errors and write a log entry. The log entry id is returned to the user and can be used for debugging if necessary

EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'ERROR %',SQLERRM;

    RETURN jsonb_build_object('route',           'public_api',
                              'error',           'request could not be completed',
                              'response_code',   600) ||locaria_core.log(parameters,SQLERRM);

END;
$$ LANGUAGE PLPGSQL;