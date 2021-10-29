--Retrieve an item's detail from the search view
CREATE OR REPLACE FUNCTION locus_core.get_item(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
    direct_attributes JSONB;
    direct_geometry JSON;
BEGIN

       EXECUTE format(
       $SQL$
           SELECT  jsonb_build_object(
                                    'type', 'FeatureCollection',
                                    'features', json_build_array(
                                        json_build_object(
                                                'type', 'Feature',
                                                'properties', attributes || jsonb_build_object('_live', $2),
                                                'geometry',   ST_ASGEOJSON(ST_TRANSFORM(wkb_geometry,4326))::JSON
                                        )
                                    )
            )
              FROM %1$s
              WHERE fid = $1
        $SQL$,
        CASE WHEN COALESCE(parameters->>'live','false')::BOOLEAN THEN 'locus_core.global_search_view_live' ELSE 'locus_core.global_search_view' END
        )
        INTO ret_var
        USING COALESCE(parameters->>'fid', 'THISWILLFAIL'),
              COALESCE(parameters->>'live','false')::BOOLEAN;

       RETURN ret_var;


END;
$$ LANGUAGE PLPGSQL;