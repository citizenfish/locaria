CREATE OR REPLACE FUNCTION locus_core.search(search_parameters JSON) RETURNS JSON AS $$
DECLARE
    default_limit INTEGER DEFAULT 1000;
    default_offset INTEGER DEFAULT 0;
	json_filter JSONB DEFAULT NULL;
    results_var JSON;
    search_ts_query tsquery;
    bbox_var GEOMETRY DEFAULT NULL;
    location_geometry GEOMETRY DEFAULT NULL;
    location_distance NUMERIC DEFAULT 1000;
    ref_search JSONB DEFAULT NULL;
    start_date_var DATE DEFAULT NULL;
    end_date_var DATE DEFAULT  NULL;
BEGIN


    IF NULLIF(search_parameters->>'search_text', '*') IS NULL THEN
        search_parameters = (search_parameters::JSONB || jsonb_build_object('search_text', ''))::JSON;
    END IF;

    IF COALESCE(search_parameters->>'limit','') ~ '^[0-9]+$' THEN
        default_limit = LEAST(default_limit, (search_parameters->>'limit')::INTEGER);
    END IF;

    IF COALESCE(search_parameters->>'offset','') ~ '^[0-9]+$' THEN
        default_offset =  (search_parameters->>'offset')::INTEGER;
    END IF;

    IF COALESCE(search_parameters->>'location','') ~ '^SRID=[0-9]+;POINT\([0-9\- .]+\)' THEN
       location_geometry = ST_TRANSFORM(ST_GEOMFROMEWKT(search_parameters->>'location'),4326);
       IF search_parameters->>'location_distance' = 'CONTAINS' THEN
       	location_distance = -1;
       ELSE
       	location_distance = COALESCE((search_parameters->>'location_distance')::NUMERIC, location_distance);
       END IF;
    END IF;

    IF COALESCE(search_parameters->>'reference', '') != '' THEN
        ref_search = jsonb_build_object('ref', search_parameters->>'reference');
    END IF;

	IF COALESCE(search_parameters->>'filter', '') != '' THEN
		json_filter = COALESCE((search_parameters->'filter')::JSONB, jsonb_build_object());
	END IF;

    --Requires BBOX as 'xmax ymax, xmin ymin'
    IF COALESCE(search_parameters->>'bbox','') ~ '^[0-9 ,\-.%C]+$' THEN
        bbox_var := ST_SETSRID(('BOX('|| REPLACE(search_parameters->>'bbox', '%2C', ',') ||')')::BOX2D,4326);
    END IF;

    --We only need one date to do a search if only one present use both for range
    IF COALESCE(search_parameters->>'start_date',search_parameters->>'end_date', '') ~ '^[0-9/-]+$' THEN
        start_date_var = COALESCE(search_parameters->>'start_date',search_parameters->>'end_date')::DATE;
        end_date_var   = COALESCE(search_parameters->>'end_date',search_parameters->>'start_date')::DATE;
    END IF;

    --Build our search ts_vector

    IF REPLACE(search_parameters->>'search_text', ' ', '') = '' THEN
        search_ts_query = to_tsquery(''); 
    ELSE
		search_ts_query = plainto_tsquery('English', search_parameters->>'search_text');
    END IF;

    --This is the core search query

    SELECT json_build_object('type','FeatureCollection',
                             'features', COALESCE(json_agg(
                                            json_build_object('type',        'Feature',
                                                              'properties',  attributes || jsonb_build_object('rank', search_rank)
                                                                                       ,
                                                              'geometry',    ST_ASGEOJSON(wkb_geometry)::JSON)
                                            ), json_build_array())
                            )
     INTO results_var
     FROM
            (

            SELECT fid,search_rank,wkb_geometry,
                   attributes || CASE WHEN distance >= 0 THEN jsonb_build_object('distance', distance) ELSE jsonb_build_object() END as attributes
            FROM (
                SELECT  distinct ON(fid) fid,
			            ts_rank(jsonb_to_tsvector('English'::regconfig, attributes, '["string", "numeric"]'::jsonb),search_ts_query)  as search_rank,
			            wkb_geometry,
			            (attributes::JSONB - 'table') || jsonb_build_object('category', category[1], 'fid', fid) as attributes,
			            COALESCE(ROUND(ST_DISTANCE(location_geometry::GEOGRAPHY, wkb_geometry::GEOGRAPHY)::NUMERIC,1), -1) AS distance
                FROM locus_core.global_search_view
                WHERE wkb_geometry IS NOT NULL
                AND (COALESCE(search_parameters->>'category', '*') = '*' OR  ARRAY[regexp_split_to_array(search_parameters->>'category', ',')] && category::text[])
                --Free text on JSONB attributes search
                AND (jsonb_to_tsvector('English'::regconfig, attributes, '["string", "numeric"]'::jsonb) @@ search_ts_query OR search_ts_query = '')
                --Bounding box search
                AND (bbox_var IS NULL OR wkb_geometry && bbox_var)
                --distance search
                AND (location_distance = -1 OR location_geometry IS NULL OR ST_DWithin(wkb_geometry::GEOGRAPHY, location_geometry::GEOGRAPHY, location_distance, FALSE))
                --contains search
                AND (location_geometry IS NULL OR location_distance != -1 OR  (location_distance = -1  AND ST_Contains(wkb_geometry, location_geometry)))
                --reference search
                AND (ref_search IS NULL OR attributes @> ref_search)
                --date search
                AND (start_date_var IS NULL OR date_added::DATE BETWEEN start_date_var AND end_date_var)
                --for sub-categorisation
                AND (
                        --first use any filters not related to type, if empty it will match all
                        attributes->'description' @> json_filter - 'type'
                        --then apply the type filter
                        AND (
                            (json_filter->'type') IS NULL OR
                            attributes#>>'{description,type}' = ANY (string_to_array(json_filter->>'type', ','))
                        )
                )
                OFFSET default_offset

            ) INNER_SUB
            ORDER by distance ASC, search_rank DESC
            LIMIT default_limit
            ) SUB_QUERY;

    RETURN results_var;
END;
$$
LANGUAGE PLPGSQL;