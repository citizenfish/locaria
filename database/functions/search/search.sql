--The main search query engine
CREATE OR REPLACE FUNCTION locaria_core.search(search_parameters JSONB) RETURNS JSONB AS $$
DECLARE

    results_var JSONB;

BEGIN


    IF COALESCE(search_parameters->>'typeahead', '') = 'true' THEN
        RETURN locaria_core.typeahead_search(search_parameters);
    END IF;

    WITH CLUSTER_RESULTS AS (

            SELECT *
            FROM locaria_core.cluster(search_parameters)
            WHERE COALESCE(search_parameters->>'cluster', '') = 'true'

    ), SEARCH_RESULTS AS (

            --Only run if we are not clustering
            SELECT *
            FROM locaria_core.search_get_records(search_parameters)
            WHERE COALESCE(search_parameters->>'cluster', '') != 'true'

    )
    --Currently format as Geojson but can add other formatters here
    SELECT CASE WHEN COALESCE(search_parameters->>'format','') = 'datagrid' THEN

                jsonb_build_object('features',
                                    COALESCE(
                                      jsonb_agg(
                                        jsonb_build_object( 'id', _attributes->>'fid',
                                                            'title', _attributes#>>'{description,title}',
                                                            'text', _attributes#>>'{description,text}',
                                                            'data', _attributes->'data',
                                                            'tags', _attributes->'tags',
                                                            'category', _attributes->'category',
                                                            'geometry', ST_ASGEOJSON(_wkb_geometry)::JSON
                                                            )
                                               ),
                                      jsonb_build_array()
                                      ),
                                    'count', json_agg(_attributes->>'c')->0
                                    )
           ELSE

                jsonb_build_object('type','FeatureCollection',
                             'features', COALESCE(jsonb_agg(
                                            json_build_object('type',        'Feature',
                                                              'properties',  _attributes || jsonb_build_object('rank', _search_rank) - 'c',
                                                              'geometry',    ST_ASGEOJSON(_wkb_geometry)::JSON)
                                            ), jsonb_build_array())
                            )
           END

    INTO results_var

    FROM (
            SELECT * FROM CLUSTER_RESULTS
            UNION ALL
            SELECT * FROM SEARCH_RESULTS
         ) ALL_RESULTS;


    RETURN results_var;
END;
$$
LANGUAGE PLPGSQL;