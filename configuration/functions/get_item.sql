CREATE OR REPLACE FUNCTION locus_core.get_item(item_id_parameter TEXT) RETURNS JSON AS
$$
DECLARE
    ret_var JSON;
    record_id_var BIGINT;
    table_name_var TEXT;
    geometry_var JSON;
    source_geometry_var JSON;
BEGIN



        SELECT (attributes->>'ofid')::INTEGER,
                COALESCE(attributes->>'table', 'base_table'),
                ST_ASGEOJSON(wkb_geometry)::JSON
        INTO record_id_var, table_name_var,geometry_var
        FROM locus_core.global_search_view
        WHERE fid = item_id_parameter;


        EXECUTE format('SELECT row_to_json(FOO.*) FROM %s FOO WHERE id = $1', table_name_var)
        USING  record_id_var
        INTO ret_var;

        --Here we extract the source geometry if it exists in WKB format and this will override the view geometry.

        BEGIN
            SELECT ST_ASGEOJSON(value)::JSON
            INTO  source_geometry_var
            FROM json_each_text(ret_var)
            --Look for a WKB in the source table
            WHERE value::TEXT ~* '^[A-Z0-9]{10,}$'
            LIMIT 1;
        EXCEPTION WHEN OTHERS THEN
            SELECT NULL INTO source_geometry_var;
        END;

        ret_var =  json_build_object(
                                'type', 'FeatureCollection',
                                'features', json_build_array(
                                    json_build_object(
                                            'type', 'Feature',
                                            'properties', ret_var,
                                            'geometry', COALESCE(source_geometry_var,geometry_var)
                                    )
                                )

        );

        RETURN ret_var;


END;
$$ LANGUAGE PLPGSQL;