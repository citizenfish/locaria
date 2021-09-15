--The main search query engine
CREATE OR REPLACE FUNCTION locus_core.search(search_parameters JSONB) RETURNS JSONB AS $$
DECLARE

    results_var JSONB;

BEGIN


    WITH CLUSTER_RESULTS AS (

            SELECT *
            FROM locus_core.cluster(search_parameters)
            WHERE COALESCE(search_parameters->>'cluster', '') ='true'

    ), SEARCH_RESULTS AS (

            --Only run if we are not clustering
            SELECT *
            FROM locus_core.search_get_records(search_parameters)
            WHERE COALESCE(search_parameters->>'cluster', '') !='true'

    )

    --Currently format as Geojson but can add other formatters here
    SELECT jsonb_build_object('type','FeatureCollection',
                     'features', COALESCE(json_agg(
                                    json_build_object('type',        'Feature',
                                                      'properties',  _attributes || jsonb_build_object('rank', _search_rank),
                                                      'geometry',    ST_ASGEOJSON(_wkb_geometry)::JSON)
                                    ), json_build_array())
                    )
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