
CREATE OR REPLACE FUNCTION locus_core.locate(locate_parameters JSONB) RETURNS JSONB AS
$$
DECLARE
	results_var JSONB;
	search_ts_query tsquery;
	default_limit INTEGER DEFAULT 10;
    default_offset INTEGER DEFAULT 0;
BEGIN

		IF (SELECT 1 FROM   information_schema.tables WHERE  table_schema = 'locus_core' AND table_name = 'location_search_view') IS NULL THEN
			RETURN json_build_object('error', 'Missing location search view table');
		END IF;

        IF COALESCE(locate_parameters->>'limit','') ~ '^[0-9]+$' THEN
            default_limit = LEAST(default_limit, (locate_parameters->>'limit')::INTEGER);
        END IF;

        IF COALESCE(locate_parameters->>'offset','') ~ '^[0-9]+$' THEN
            default_offset =  (locate_parameters->>'offset')::INTEGER;
        END IF;

        IF REPLACE(locate_parameters->>'location', ' ', '') = '' THEN
            RETURN json_build_object('error', 'Missing location');
        ELSE

            search_ts_query = to_tsquery(
                                     replace('(' ||
                                            array_to_string( -- everything else joined with '|' to make optional
                                                regexp_split_to_array( -- make AND | IN | ON as mandatory keywords
                                                    regexp_replace( --remove non-word characters
                                                        trim(locate_parameters->>'location') --remove spaces
                                                        , '\W+', ' ', 'g')
                                                    , '\W+and\W+|\W+in\W+|\W+on\W+'  ), ')&(')
                                                || ')'
                                            , ' ', '|')
                                     );

        END IF;

	    SELECT jsonb_build_object('type','FeatureCollection',
                             'features', COALESCE(json_agg(
                                            json_build_object('type',        'Feature',
                                                              'properties',  attributes || jsonb_build_object('rank', search_rank),
                                                              'geometry',    ST_ASGEOJSON(wkb_geometry)::JSON)
                                            ), json_build_array())
                            )
        INTO results_var
		FROM (

		    SELECT jsonb_build_object('id',              id,
		                             'location',        location,
		                             'location_type',   location_type) AS attributes,
		           wkb_geometry,
		           ts_rank(tsv,search_ts_query) as search_rank
            FROM   locus_core.location_search_view
            WHERE  tsv @@ search_ts_query
            ORDER BY search_rank DESC
            OFFSET default_offset
            LIMIT  default_limit
		) SUB;


		RETURN results_var;

END;
$$ LANGUAGE PLPGSQL;