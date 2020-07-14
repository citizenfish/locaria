CREATE OR REPLACE FUNCTION locus_core.locus_gateway(search_parameters JSON) RETURNS JSON AS
$$
DECLARE
    debug_var BOOLEAN DEFAULT FALSE;
    log_var BOOLEAN DEFAULT TRUE;
    ret_var JSON;
    logid_var BIGINT;
    version_var TEXT DEFAULT '0.2';
BEGIN

    --This keeps us within our search schema when running code
    SET SEARCH_PATH = 'locus_core', 'public';

    --From the incoming JSON select the method and run it
    CASE WHEN search_parameters->>'method' IN ('search','bboxsearch', 'refsearch', 'pointsearch', 'datesearch', 'filtersearch') THEN
            ret_var = search(search_parameters);

         WHEN search_parameters->>'method' IN ('get_item') THEN
            ret_var = get_item(search_parameters->>'fid');

         WHEN search_parameters->>'method' IN ('locate') THEN
            ret_var = locate(search_parameters);

         WHEN search_parameters->>'method' IN ('list_categories') THEN

            SELECT json_agg(CAT.unnest) INTO ret_var FROM (
                    select * FROM unnest(enum_range(enum_first(null::locus_core.search_category)))
	        ) CAT;

         WHEN search_parameters->>'method' IN ('list_categories_with_data') THEN

			SELECT json_agg(json) INTO ret_var FROM (
							SELECT distinct ON (category)
								json_build_object('category',	  category,
												  'sub_category', COALESCE(json_agg(sub_category) FILTER (WHERE sub_category IS NOT NULL) OVER (partition by category), json_build_array())
												  ) as json
							FROM (
								SELECT distinct on( category[1], attributes#>'{description,type}')
										category[1] as category,
										attributes#>'{description,type}' as sub_category
								FROM locus_core.global_search_view
								WHERE search_parameters->>'category' IS NULL OR (category[1])::TEXT = search_parameters->>'category'
								) FOO
			) BAA;

	     WHEN search_parameters->>'method' IN ('address_search') THEN
	     	 ret_var = address_search(search_parameters);

         WHEN search_parameters->>'method' IN ('version') THEN
            ret_var = json_build_object('version', version_var);

         WHEN search_parameters->>'method' IN ('revgeocoder') THEN
            ret_var = reverse_geocoder(search_parameters);

         WHEN search_parameters->>'method' IN ('report') THEN
            ret_var = run_report(search_parameters);

         ELSE
            RETURN json_build_object('error', 'unsupported method');
    END CASE;

    --If debug_var is set then the API will return the calling parameters in a debug object. NOTE WELL this will break GeoJSON returned
    IF debug_var OR search_parameters->>'debug' = 'true' THEN
        ret_var = (ret_var::JSONB || jsonb_build_object('debug', search_parameters))::JSON;
    END IF;

    -- Searches can be logged to the logs table. This is set on by default but can be switched off with a parameter
    log_var = COALESCE((SELECT (parameter->>'log_searches')::BOOLEAN FROM locus_core.parameters WHERE parameter_name = 'log_configuration'), log_var);

    IF log_var THEN
        INSERT INTO logs(log_type, log_message)
        SELECT search_parameters->>'method',
               jsonb_build_object('parameters', search_parameters, 'response', CASE WHEN COALESCE(ret_var->>'error', '') = '' THEN 'ok' ELSE ret_var->>'error' END);
    END IF;


    RETURN ret_var;

--This block will trap any errors occuring and write a log entry. The log entry id is returned to the user and can be used for debugging if necessary
EXCEPTION WHEN OTHERS THEN
        INSERT INTO locus_core.logs(log_type, log_message)
        SELECT search_parameters->>'method',
               jsonb_build_object('parameters', search_parameters, 'response', SQLERRM)
        RETURNING id INTO logid_var;

    RETURN json_build_object('error', 'request could not be completed','system_log_id', logid_var);
END;
$$ LANGUAGE PLPGSQL;