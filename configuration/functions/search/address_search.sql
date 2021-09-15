--Function to search for an address using keyword search principle

CREATE OR REPLACE FUNCTION locus_core.address_search(address_parameters JSONB) RETURNS JSONB AS
$$
DECLARE
	results_var JSONB;
	search_ts_query tsquery;
	default_limit INTEGER DEFAULT 10;
    default_offset INTEGER DEFAULT 0;
BEGIN


        IF COALESCE(address_parameters->>'limit','') ~ '^[0-9]+$' THEN
            default_limit = LEAST(default_limit, (address_parameters->>'limit')::INTEGER);
        END IF;

        IF COALESCE(address_parameters->>'offset','') ~ '^[0-9]+$' THEN
            default_offset =  (address_parameters->>'offset')::INTEGER;
        END IF;

        IF REPLACE(address_parameters->>'address', ' ', '') = '' THEN
            RETURN json_build_object('error', 'Missing address');
        ELSE
            search_ts_query = plainto_tsquery(address_parameters->>'address');
        END IF;

	    SELECT json_build_object('type','FeatureCollection',
                             'features', COALESCE(json_agg(
                                            json_build_object('type',        'Feature',
                                                              'properties',  attributes || jsonb_build_object('rank', search_rank),
                                                              'geometry',    ST_ASGEOJSON(wkb_geometry,4326)::JSON)
                                            ), json_build_array())
                            )
        INTO results_var
		FROM (

            --TODO rank order as per deprecated/data_loading/location_data/load_opennames.sh
		    SELECT attributes,
		           wkb_geometry,
		           ts_rank(jsonb_to_tsvector('simple'::regconfig, attributes, '["string", "numeric"]'::jsonb),search_ts_query) as search_rank
            FROM   locus_core.address_search_view
            WHERE  jsonb_to_tsvector('simple'::regconfig, attributes, '["string", "numeric"]'::jsonb) @@ search_ts_query
            ORDER BY search_rank DESC --,
					 --(attributes->>'pao_start_number')::NUMERIC,
					 --attributes->>'pao_start_suffix' ASC,
					 --attributes->>'pao_text'
            OFFSET default_offset
            LIMIT  default_limit
		) SUB;


		RETURN results_var;

END;
$$ LANGUAGE PLPGSQL;