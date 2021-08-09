--Retrieve an item's detail from the search view

CREATE OR REPLACE FUNCTION locus_core.get_item(item_id_parameter TEXT) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
    attributes_var JSON DEFAULT json_build_object();
    record_id_var BIGINT;
    table_name_var TEXT;
    geometry_var JSON;
BEGIN


        SELECT  ST_ASGEOJSON(ST_TRANSFORM(wkb_geometry,4326))::JSON,
                attributes
        INTO geometry_var, attributes_var
        FROM locus_core.global_search_view
        WHERE fid = item_id_parameter::BIGINT;


       SELECT  jsonb_build_object(
                                'type', 'FeatureCollection',
                                'features', json_build_array(
                                    json_build_object(
                                            'type', 'Feature',
                                            'properties', attributes,
                                            'geometry',   ST_ASGEOJSON(ST_TRANSFORM(wkb_geometry,4326))::JSON
                                    )
                                )

        ) INTO ret_var
          FROM locus_core.global_search_view
          WHERE fid = item_id_parameter::BIGINT;

        RETURN ret_var;


END;
$$ LANGUAGE PLPGSQL;