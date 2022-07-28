DO
$$
    DECLARE
        bounds_var GEOMETRY;
        mvt_var bytea;
    BEGIN

        CREATE OR REPLACE VIEW locaria_tests.census_data_output_areas AS
            SELECT wkb_geometry,
                   row_to_json(OA.*)::JSONB - 'wkb_geometry' AS attributes
        FROM locaria_data.census_data_output_areas OA;

        SELECT locaria_core.xyz_tile_to_bbox(16062,11056,15) INTO bounds_var;
        SELECT locaria_core.geometry_to_mvt('locaria_tests.census_data_output_areas', bounds_var) INTO mvt_var;

        RAISE NOTICE 'DEBUG %', mvt_var;
    END;
$$