DO
$$
    DECLARE
        category_id_var BIGINT;
    BEGIN

        SELECT id INTO
            category_id_var
        FROM locaria_core.categories
        WHERE category = 'Community';

        DELETE FROM locaria_data.imports WHERE category_id = category_id_var;

        INSERT INTO locaria_data.imports(category_id, wkb_geometry, attributes)
        SELECT category_id_var,
               wkb_geometry,
               jsonb_build_object('description', jsonb_build_object('title', 'Toilet', 'text', ''),
                                  'data', jsonb_build_object('designation', COALESCE(designation, 'Unknown'), 'access', COALESCE(access, 'Unknown')),
                                  'tags', jsonb_build_array('toilet')
                   )
        FROM locaria_uploads.osm_toilets;

        INSERT INTO locaria_data.imports(category_id, wkb_geometry, attributes)
        SELECT category_id_var,
               wkb_geometry,
               jsonb_build_object('description', jsonb_build_object('title', "name", 'text', ''),
                                  'data', jsonb_build_object('wheelchair', COALESCE(wheelchair, 'Unknown'), 'opening_hours', COALESCE(opening_hours, 'Unknown')),
                                  'tags', jsonb_build_array('library')
                   )
        FROM locaria_uploads.osm_libraries;

        INSERT INTO locaria_data.imports(category_id, wkb_geometry, attributes)
        SELECT category_id_var,
               wkb_geometry,
               jsonb_build_object('description', jsonb_build_object('title', COALESCE("name", 'Playground'), 'text', ''),
                                  'data', jsonb_build_object(),
                                  'tags', jsonb_build_array('playground')
                   )
        FROM locaria_uploads.osm_playground_points;

        INSERT INTO locaria_data.imports(category_id, wkb_geometry, attributes)
        SELECT category_id_var,
               wkb_geometry,
               jsonb_build_object('description', jsonb_build_object('title', COALESCE("name", 'Community Centre'), 'text', ''),
                                  'data', jsonb_build_object(),
                                  'tags', jsonb_build_array('community_centre')
                   )
        FROM locaria_uploads.osm_community_centres;

        SELECT id INTO
            category_id_var
        FROM locaria_core.categories
        WHERE category = 'Highways';
        DELETE FROM locaria_data.imports WHERE category_id = category_id_var;

        INSERT INTO locaria_data.imports(category_id, wkb_geometry, attributes)
        SELECT category_id_var,
               wkb_geometry,
               jsonb_build_object('description', jsonb_build_object('title', COALESCE("name", 'Car Park'), 'text', ''),
                                  'data', jsonb_build_object('type', COALESCE(parking,''), 'capacity', COALESCE(capacity,'', 'operator', COALESCE(operator,''))),
                                  'tags', jsonb_build_array('parking')
                   )
        FROM locaria_uploads.osm_car_parks;

        SELECT id INTO
            category_id_var
        FROM locaria_core.categories
        WHERE category = 'Education';
        DELETE FROM locaria_data.imports WHERE category_id = category_id_var;

        INSERT INTO locaria_data.imports(category_id, wkb_geometry, attributes)
        SELECT category_id_var,
               wkb_geometry,
               jsonb_build_object('description', jsonb_build_object('title', COALESCE("name", 'School'), 'text', "addr:street", 'url', website),
                                  'data', jsonb_build_object('phone', COALESCE(phone,''), 'religion', COALESCE(religion,'', 'min_age', COALESCE(min_age,''), 'max_age', COALESCE(max_age,''))),
                                  'tags', jsonb_build_array('school')
                   )
        FROM locaria_uploads.osm_schools;

        REFRESH MATERIALIZED VIEW CONCURRENTLY locaria_data.global_search_view;

    END;
$$