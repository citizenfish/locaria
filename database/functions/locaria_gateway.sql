--Single gateway for all Public API calls to locaria_core
CREATE OR REPLACE FUNCTION locaria_core.locaria_gateway(parameters JSONB, acl JSONB DEFAULT jsonb_build_object()) RETURNS JSONB AS
$$
DECLARE
    debug_var BOOLEAN DEFAULT FALSE;
    log_var BOOLEAN DEFAULT TRUE;
    ret_var JSONB;
    version_var TEXT DEFAULT '0.2';
BEGIN

    --This keeps us within our search schema when running code
    SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';

    --delete any user sent acl and add in api one
    parameters = parameters - 'acl' || jsonb_build_object('acl',acl);

    --From the incoming JSON select the method and run it
    CASE WHEN parameters->>'method' IN ('search','bboxsearch', 'refsearch', 'pointsearch', 'datesearch', 'filtersearch') THEN
            ret_var = search(parameters);

         WHEN parameters->>'method' IN ('get_item') THEN
            ret_var = get_item(parameters);

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
            ret_var = get_parameters(parameters, 'external');

         ELSE
            RETURN json_build_object('error', 'unsupported method');
    END CASE;

    --If debug_var is set then the API will return the calling parameters in a debug object. NOTE WELL this will break GeoJSON returned
    IF debug_var OR parameters->>'debug' = 'true' THEN
        ret_var = ret_var || jsonb_build_object('debug', parameters);
    END IF;

    -- Searches can be logged to the logs table. This is set on by default but can be switched off with a parameter
    log_var = COALESCE((SELECT (parameter->>'log_searches')::BOOLEAN FROM locaria_core.parameters WHERE parameter_name = 'log_configuration'), log_var);

    IF log_var THEN
        INSERT INTO logs(log_type, log_message)
        SELECT parameters->>'method',
               jsonb_build_object('parameters', parameters, 'response', CASE WHEN COALESCE(ret_var->>'error', '') = '' THEN 'ok' ELSE ret_var->>'error' END);
    END IF;


    RETURN jsonb_build_object('response_code', 200) ||ret_var;

--This block will trap any errors and write a log entry. The log entry id is returned to the user and can be used for debugging if necessary

EXCEPTION WHEN OTHERS THEN

    RAISE NOTICE 'ERROR %',SQLERRM;

    RETURN jsonb_build_object('route',           'public_api',
                             'error',           'request could not be completed',
                             'response_code',   600) ||locaria_core.log(parameters,SQLERRM);

END;
$$ LANGUAGE PLPGSQL;