--The main search query engine
DROP FUNCTION IF EXISTS locaria_core.search_get_records_explain(JSONB, INTEGER);
CREATE OR REPLACE FUNCTION locaria_core.search_get_records_explain(search_parameters JSONB, default_limit INTEGER DEFAULT 10000)
    RETURNS SETOF JSON AS $$
DECLARE
    default_offset INTEGER DEFAULT 0;
    json_filter JSONB DEFAULT json_build_object();
    filter_var BOOLEAN DEFAULT FALSE;
    search_ts_query tsquery;
    bbox_var GEOMETRY DEFAULT NULL;
    location_geometry GEOMETRY DEFAULT NULL;
    location_distance NUMERIC DEFAULT 10000;
    start_date_var TIMESTAMP ;
    end_date_var TIMESTAMP;
    metadata_var BOOLEAN DEFAULT TRUE;
    min_range_var FLOAT;
    max_range_var FLOAT;
    ranking_attribute_var TEXT [] DEFAULT ARRAY ['description','title'];
    jsonpath_var TEXT DEFAULT '';
    category_var TEXT[];
    owned_var BOOLEAN;
    live_flag BOOLEAN DEFAULT FALSE;
BEGIN

    SET SEARCH_PATH = 'locaria_core', 'locaria_data', 'public';

    IF NULLIF(search_parameters->>'search_text', '*') IS NULL THEN
        search_parameters = (search_parameters::JSONB || jsonb_build_object('search_text', ''))::JSON;
    END IF;

    IF COALESCE(search_parameters->>'limit','') ~ '^[0-9]+$' THEN
        default_limit = LEAST(default_limit, (search_parameters->>'limit')::INTEGER);
    END IF;

    IF COALESCE(search_parameters->>'offset','') ~ '^[0-9]+$' THEN
        default_offset =  (search_parameters->>'offset')::INTEGER;
    END IF;

    --Changed to support polygon/multipolygon
    IF COALESCE(search_parameters->>'location','') ~ '^SRID=[0-9]+;.*\)' THEN
        location_geometry = ST_TRANSFORM(ST_GEOMFROMEWKT(search_parameters->>'location'),4326);
        IF search_parameters->>'location_distance' = 'CONTAINS' THEN
            location_distance = -1;
        ELSE
            location_distance = COALESCE((search_parameters->>'location_distance')::NUMERIC, location_distance);
        END IF;
    END IF;

    IF COALESCE(search_parameters->>'reference', '') != '' THEN
        json_filter = json_filter || jsonb_build_object('ref', search_parameters->>'reference');
        filter_var = TRUE;
    END IF;

    IF COALESCE(search_parameters->>'filter', '') NOT IN('', '{}') THEN
        json_filter = json_filter || (search_parameters->'filter');
        filter_var = TRUE;
    END IF;

    IF COALESCE(search_parameters->>'category', '*') != '*' THEN
        IF jsonb_typeof(search_parameters->'category') = 'string' THEN
            search_parameters = search_parameters || jsonb_build_object('category', jsonb_build_array(search_parameters->'category'));
        END IF;
    ELSE
        search_parameters = search_parameters - 'category';
    END IF;

    --Requires BBOX as 'xmax ymax, xmin ymin'
    IF COALESCE(search_parameters->>'bbox','') ~ '^[0-9 ,\-.%C]+$' THEN
        bbox_var := ST_SETSRID(('BOX('|| REPLACE(search_parameters->>'bbox', '%2C', ',') ||')')::BOX2D,4326);
    END IF;

    IF COALESCE(search_parameters->>'bbox_3857','') ~ '^[0-9 ,\-.%C]+$' THEN
        bbox_var := ST_TRANSFORM(ST_SETSRID(('BOX('|| REPLACE(search_parameters->>'bbox_3857', '%2C', ',') ||')')::BOX2D,3857),4326);
    END IF;

    --We only need one date to do a search if only one present use both for range
    IF COALESCE(search_parameters->>'start_date',search_parameters->>'end_date', '') ~ '^[0-9/\-.: ]+$' THEN

        start_date_var = to_timestamp(COALESCE(search_parameters->>'start_date',search_parameters->>'end_date'), 'DD/MM/YYYY HH24:MI:SS');
        end_date_var   = to_timestamp(COALESCE(search_parameters->>'end_date',search_parameters->>'start_date'), 'DD/MM/YYYY HH24:MI:SS');

        --If we only received dates not timestamps then push to end of day to support range queries
        IF NOT search_parameters->>'start_date' ~ ':' THEN
            start_date_var = start_date_var::DATE::TIMESTAMP;
        END IF;
        --TODO is 59 minutes precise enough?
        IF NOT COALESCE(search_parameters->>'end_date','') ~ ':' THEN
            end_date_var = end_date_var::DATE::TIMESTAMP + INTERVAL '23 hours 59 minutes';
        END IF;

    END IF;

    --range searches

    IF COALESCE(search_parameters->>'min_range', '') != '' THEN

        min_range_var = (search_parameters->>'min_range')::FLOAT;
        max_range_var = COALESCE(search_parameters->>'max_range', min_range_var::TEXT)::FLOAT;

    END IF;

    --Build our search ts_vector

    IF REPLACE(search_parameters->>'search_text', ' ', '') = '' THEN
        search_ts_query = '_IGNORE';

    ELSE
        search_ts_query = plainto_tsquery('English', search_parameters->>'search_text');
    END IF;

    --Switch off metadata if require

    metadata_var = COALESCE(search_parameters->>'metadata', metadata_var::TEXT)::BOOLEAN;

    --We rank results by default on description, title but this can be overridden by search parameters: Format = 'description,foo,baa'
    IF search_parameters->>'ranking_attributes' ~ '^[a-zA-Z0-9,_]+$' THEN
        ranking_attribute_var = string_to_array(search_parameters->>'ranking_attributes',',');
    END IF;

    --We support jsonpath indexed using the @? operator and only on equality or IN operators
    jsonpath_var = NULLIF(search_parameters->>'jsonpath', '');

    --Cast category to a TEXT array for ?| operator
    category_var = json2text(search_parameters->'category');
    owned_var = COALESCE(search_parameters->>'owned','FALSE')::BOOLEAN;
    live_flag = COALESCE(search_parameters->>'live','FALSE')::BOOLEAN;

    RAISE NOTICE 'DEBUG filter_var %',filter_var;
    RAISE NOTICE 'DEBUG search_ts_query %',search_ts_query;
    RAISE NOTICE 'DEBUG json_path_var %',jsonpath_var;
    RAISE NOTICE 'DEBUG bbox_var %', bbox_var;
    RAISE NOTICE 'DEBUG location_distance %', location_distance;
    RAISE NOTICE 'DEBUG location_geometry %',location_geometry;
    RAISE NOTICE 'DEBUG start_data_var %', start_date_var;
    RAISE NOTICE 'DEBUG tags %',search_parameters->'tags';
    RAISE NOTICE 'DEBUG min_range_var %',min_range_var;
    RAISE NOTICE 'DEBUG owned_var %',owned_var;
    RAISE NOTICE 'DEBUG category_var %',category_var;

    RETURN QUERY

        EXPLAIN (FORMAT JSON, ANALYZE,VERBOSE) SELECT fid,
               search_rank::DOUBLE PRECISION,
               wkb_geometry,
               attributes || CASE WHEN distance >= 0 THEN jsonb_build_object('distance', distance) ELSE jsonb_build_object() END
                   || CASE WHEN metadata_var THEN metadata ELSE jsonb_build_object() END
                   --return category as a string not array
                   || jsonb_build_object('category', attributes->'category'->0,
                                         'c', count(*) OVER())
                   - 'acl'
                   as attributes

        FROM (
                 SELECT  fid,
                      CASE WHEN search_ts_query = '_IGNORE' THEN 1 ELSE ts_rank(jsonb_to_tsvector('English'::regconfig, attributes, '["string", "numeric"]'::jsonb),search_ts_query) END  as search_rank,
                      wkb_geometry,
                      (attributes::JSONB - 'table') || jsonb_build_object('fid', fid) as attributes,
                      COALESCE(ROUND(ST_DISTANCE(location_geometry::GEOGRAPHY, wkb_geometry::GEOGRAPHY)::NUMERIC,1), -1) AS distance,
                      jsonb_build_object('metadata', jsonb_build_object('edit', edit, 'sd', start_date, 'ed', end_date, 'rm', range_min, 'rma', range_max, 'acl', attributes->'acl')) AS metadata,
                      --used to further rank results against a specific attribute
                      levenshtein(lower(jsonb_extract_path_text(attributes,VARIADIC ranking_attribute_var)), lower(search_parameters->>'search_text')) AS attribute_rank

                -- TODO reinstate live view
                -- FROM (SELECT * FROM global_search_view WHERE live_flag = FALSE UNION SELECT * FROM global_search_view_live WHERE live_flag = TRUE) VW
                 FROM global_search_view
                 WHERE wkb_geometry IS NOT NULL
                   --Category, refs and general filters
                   AND (NOT filter_var OR attributes @> json_filter)
                   --Free text on JSONB attributes search
                   AND (search_ts_query = '_IGNORE' OR jsonb_to_tsvector('English'::regconfig, attributes->'description', '["string", "numeric"]'::jsonb) @@ search_ts_query)
                   --jsonpath search
                   AND (jsonpath_var IS NULL OR attributes @@ jsonpath_var::JSONPATH)--jsonb_path_match(attributes->'data', jsonpath_var::JSONPATH))
                   --Bounding box search
                   AND (bbox_var IS NULL OR wkb_geometry && bbox_var)
                   --distance search
                   AND (location_distance = -1 OR location_geometry IS NULL OR ST_DWithin(wkb_geometry::GEOGRAPHY, location_geometry::GEOGRAPHY, location_distance, FALSE))
                   --contains search
                   AND (location_geometry IS NULL OR location_distance != -1 OR  (location_distance = -1  AND ST_Contains(wkb_geometry, location_geometry)))
                   --date search
                   AND (start_date_var IS NULL OR (start_date >= start_date_var AND end_date <= end_date_var))
                   --for tags
                   AND ( (search_parameters->'tags') IS NULL OR attributes->'tags' ?| json2text(search_parameters->'tags') )
                   --for categories
                   AND ( (search_parameters->'category') IS NULL OR attributes->'category' ?| category_var )
                   --range query
                   AND (min_range_var IS NULL OR (range_min >= min_range_var AND range_max <= max_range_var))
                   AND (
                       --Bring back items acl is allowed to view
                       (owned_var = FALSE AND (acl_check(search_parameters->'acl', attributes->'acl')->>'view')::BOOLEAN)
                        --Bring back only items owned by the acl sent
                        OR (owned_var = TRUE AND (acl_check(search_parameters->'acl', attributes->'acl')->>'owner')::BOOLEAN)
                       )

                 LIMIT default_limit
                 OFFSET default_offset
             ) INNER_SUB
        ORDER by distance ASC, attribute_rank ASC, search_rank DESC;

END;
$$
    LANGUAGE PLPGSQL;