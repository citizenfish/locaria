DELETE FROM locaria_core.reports WHERE report_name ='os_boundary_line_post_process';

INSERT INTO locaria_core.reports(report_name, report_parameters, admin_privilege)
SELECT 'os_boundary_line_post_process',
       jsonb_build_object('sql',
$SQL$
    --You cannot pass $ parameters into DO statements so we set local variable instead
    SELECT set_config('chosen.la', ($1::JSONB->>'bounding_la_id'), true);
    SELECT set_config('chosen.layers', ($1::JSONB)->>'layer', true);
    DO
    $$
    DECLARE
        ret_var JSONB DEFAULT jsonb_build_object();
        schema_var TEXT DEFAULT 'locaria_uploads';
        category_id_var INTEGER;
        count_var INTEGER;
        la_id_var INTEGER DEFAULT current_setting('chosen.la')::INTEGER;
        chosen_layers JSONB DEFAULT current_setting('chosen.layers')::JSONB;
        selected_la_geometry GEOMETRY;
        la_attributes_var JSONB;
    BEGIN
            SET SEARCH_PATH = 'locaria_core', 'public';
            DROP TABLE IF EXISTS os_boundary_line_post_process_output;

            INSERT INTO locaria_core.categories(category)
            VALUES('OS Boundaries')
            ON CONFLICT(category) DO NOTHING;

            SELECT id into category_id_var
            FROM locaria_core.categories WHERE category = 'OS Boundaries';

            RAISE NOTICE 'LA %',la_id_var;
            RAISE NOTICE 'CATEGORY %',category_id_var;
            RAISE NOTICE 'CHOSEN LAYERS %', chosen_layers;

            SELECT ST_TRANSFORM(ST_BUFFER(ST_TRANSFORM(wkb_geometry,27700),150),4326),
                   attributes
            INTO selected_la_geometry,la_attributes_var
            FROM locaria_data.local_authority_boundary
            WHERE id = la_id_var;

            --local authority boundary
            IF selected_la_geometry IS NOT NULL THEN
                DELETE FROM locaria_data.imports
                WHERE category_id = category_id_var
                AND attributes->'tags' ?| ARRAY['la_boundary'];

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('la_boundary_deletes',  count_var);

                INSERT INTO locaria_data.imports(category_id,wkb_geometry,attributes)
                SELECT category_id_var,
                       selected_la_geometry,
                       jsonb_build_object('description', jsonb_build_object('title', la_attributes_var->>'name', 'text',
                                                                            concat_ws(' ', la_attributes_var->>'name', 'Local Authority Boundary')),
                                          'data', jsonb_build_object('area', ST_AREA(selected_la_geometry::GEOGRAPHY), 'source',
                                                                     'district_borough_unitary') || la_attributes_var - 'name',
                                          'tags', jsonb_build_array('la_boundary')
                           );

                ret_var = ret_var || jsonb_build_object('la_boundary_inserts',  1);
            END IF;

            --boundary_line_ceremonial_counties
            IF chosen_layers  ? 'boundary_line_ceremonial_counties' THEN
                RAISE NOTICE '*** boundary_line_ceremonial_counties ***';
                DELETE FROM locaria_data.imports
                WHERE category_id = category_id_var
                AND attributes->'tags' ?| ARRAY['boundary_line_ceremonial_counties'];

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('boundary_line_ceremonial_counties_deletes',  count_var);


                INSERT INTO locaria_data.imports(category_id,wkb_geometry,attributes)
                SELECT category_id_var,
                       ST_TRANSFORM(ST_SIMPLIFYPRESERVETOPOLOGY(ST_TRANSFORM(wkb_geometry,27700),5),4326),
                       jsonb_build_object('description', jsonb_build_object('title', name, 'text',
                                                                            concat_ws(' ', name, 'Ceremonial County')),
                                          'data', jsonb_build_object('area', ST_AREA(wkb_geometry::GEOGRAPHY), 'source',
                                                                     'boundary_line_ceremonial_counties'),
                                          'tags', jsonb_build_array('boundary_line_ceremonial_counties')
                           )
                FROM locaria_uploads.boundary_line_ceremonial_counties
                WHERE  selected_la_geometry IS NULL OR ST_INTERSECTS(selected_la_geometry,wkb_geometry);

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('boundary_line_ceremonial_counties_inserts',  count_var);

            END IF;

            --boundary_line_historic_counties
            IF chosen_layers  ? 'boundary_line_historic_counties' THEN
                RAISE NOTICE '*** boundary_line_historic_counties ***';
                DELETE FROM locaria_data.imports
                WHERE category_id = category_id_var
                  AND attributes->'tags' ?| ARRAY['boundary_line_historic_counties'];

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('boundary_line_historic_counties_deletes',  count_var);

                INSERT INTO locaria_data.imports(category_id,wkb_geometry,attributes)
                SELECT category_id_var,
                       ST_TRANSFORM(ST_SIMPLIFYPRESERVETOPOLOGY(ST_TRANSFORM(wkb_geometry,27700),5),4326),
                       jsonb_build_object('description', jsonb_build_object('title', name, 'text',
                                                                            concat_ws(' ', name, 'Historic County')),
                                          'data', jsonb_build_object('area', ST_AREA(wkb_geometry::GEOGRAPHY), 'source',
                                                                     'boundary_line_historic_counties'),
                                          'tags', jsonb_build_array('boundary_line_historic_counties')
                           )
                FROM locaria_uploads.boundary_line_historic_counties
                WHERE  selected_la_geometry IS NULL OR ST_INTERSECTS(selected_la_geometry,wkb_geometry);

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('boundary_line_historic_counties_inserts',  count_var);
            END IF;

            --counties
            IF chosen_layers  ? 'county' THEN
                RAISE NOTICE '*** county ***';
                DELETE FROM locaria_data.imports
                WHERE category_id = category_id_var
                  AND attributes->'tags' ?| ARRAY['county'];

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('county_deletes',  count_var);

                INSERT INTO locaria_data.imports(category_id,wkb_geometry,attributes)
                SELECT category_id_var,
                       ST_TRANSFORM(ST_SIMPLIFYPRESERVETOPOLOGY(ST_TRANSFORM(wkb_geometry,27700),5),4326),
                       jsonb_build_object('description', jsonb_build_object('title', name, 'text',
                                                                            concat_ws(' ', name, 'County')),
                                          'data', jsonb_build_object('area', ST_AREA(wkb_geometry::GEOGRAPHY), 'source',
                                                                     'county'),
                                          'tags', jsonb_build_array('county')
                           )
                FROM locaria_uploads.county
                WHERE  selected_la_geometry IS NULL OR ST_INTERSECTS(selected_la_geometry,wkb_geometry);

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('county_inserts',  count_var);
            END IF;

            --wards
            IF chosen_layers  ? 'district_borough_unitary_ward' THEN
                RAISE NOTICE '*** district_borough_unitary_ward ***';
                DELETE FROM locaria_data.imports
                WHERE category_id = category_id_var
                  AND attributes->'tags' ?| ARRAY['ward'];

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('district_borough_unitary_ward_deletes',  count_var);

                INSERT INTO locaria_data.imports(category_id,wkb_geometry,attributes)
                SELECT category_id_var,
                       ST_TRANSFORM(ST_SIMPLIFYPRESERVETOPOLOGY(ST_TRANSFORM(wkb_geometry,27700),5),4326),
                       jsonb_build_object('description', jsonb_build_object('title', name, 'text',
                                                                            concat_ws(' ', name, 'Ward')),
                                          'data', jsonb_build_object('area', ST_AREA(wkb_geometry::GEOGRAPHY), 'source',
                                                                     'district_borough_unitary_ward') || row_to_json(W.*)::JSONB - 'wkb_geometry' -'ogc_fid',
                                          'tags', jsonb_build_array('ward')
                           )
                FROM locaria_uploads.district_borough_unitary_ward W
                WHERE  selected_la_geometry IS NULL OR ST_INTERSECTS(selected_la_geometry,wkb_geometry);

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('district_borough_unitary_ward_inserts',  count_var);
            END IF;

            --parish
            IF chosen_layers  ? 'parish' THEN
                RAISE NOTICE '*** parish ***';
                DELETE FROM locaria_data.imports
                WHERE category_id = category_id_var
                  AND attributes->'tags' ?| ARRAY['parish'];

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('parish_deletes',  count_var);

                INSERT INTO locaria_data.imports(category_id,wkb_geometry,attributes)
                SELECT category_id_var,
                       ST_TRANSFORM(ST_SIMPLIFYPRESERVETOPOLOGY(ST_TRANSFORM(wkb_geometry,27700),5),4326),
                       jsonb_build_object('description', jsonb_build_object('title', name, 'text',
                                                                            concat_ws(' ', name, 'Parish')),
                                          'data', jsonb_build_object('area', ST_AREA(wkb_geometry::GEOGRAPHY), 'source',
                                                                     'parish') || row_to_json(P.*)::JSONB - 'wkb_geometry' -'ogc_fid',
                                          'tags', jsonb_build_array('parish')
                           )
                FROM locaria_uploads.parish P
                WHERE  selected_la_geometry IS NULL OR ST_INTERSECTS(selected_la_geometry,wkb_geometry);

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('parish_inserts',  count_var);
            END IF;

            --Polling district
            IF chosen_layers  ? 'polling_districts_england' THEN
                RAISE NOTICE '*** polling_districts_england ***';
                DELETE FROM locaria_data.imports
                WHERE category_id = category_id_var
                  AND attributes->'tags' ?| ARRAY['polling_district'];

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('polling_districts_england_deletes',  count_var);

                INSERT INTO locaria_data.imports(category_id,wkb_geometry,attributes)
                SELECT category_id_var,
                       ST_TRANSFORM(ST_SIMPLIFYPRESERVETOPOLOGY(ST_TRANSFORM(wkb_geometry,27700),5),4326),
                       jsonb_build_object('description', jsonb_build_object('title', pd_id, 'text',
                                                                            concat_ws(' ', 'District', pd_id)),
                                          'data', jsonb_build_object('area', ST_AREA(wkb_geometry::GEOGRAPHY), 'source',
                                                                     'polling_districts_england') || row_to_json(PD.*)::JSONB - 'wkb_geometry' -'ogc_fid',
                                          'tags', jsonb_build_array('polling_district')
                           )
                FROM locaria_uploads.polling_districts_england PD
                WHERE  selected_la_geometry IS NULL OR ST_INTERSECTS(selected_la_geometry,wkb_geometry);

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('polling_districts_england_inserts',  count_var);
            END IF;

            --Constituencies
            IF chosen_layers  ? 'westminster_const' THEN
                RAISE NOTICE '*** westminster_const ***';
                DELETE FROM locaria_data.imports
                WHERE category_id = category_id_var
                  AND attributes->'tags' ?| ARRAY['parliamentary_constituency'];

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('westminster_const_deletes',  count_var);

                INSERT INTO locaria_data.imports(category_id,wkb_geometry,attributes)
                SELECT category_id_var,
                       ST_TRANSFORM(ST_SIMPLIFYPRESERVETOPOLOGY(ST_TRANSFORM(wkb_geometry,27700),5),4326),
                       jsonb_build_object('description', jsonb_build_object('title', name, 'text',
                                                                            concat_ws(' ', name, 'Constituency')),
                                          'data', jsonb_build_object('area', ST_AREA(wkb_geometry::GEOGRAPHY), 'source',
                                                                     'westminster_const') || row_to_json(WC.*)::JSONB - 'wkb_geometry' -'ogc_fid',
                                          'tags', jsonb_build_array('parliamentary_constituency')
                           )
                FROM locaria_uploads.westminster_const WC
                WHERE  selected_la_geometry IS NULL OR ST_INTERSECTS(selected_la_geometry,wkb_geometry);

                GET DIAGNOSTICS count_var = ROW_COUNT;
                ret_var = ret_var || jsonb_build_object('westminster_const_inserts',  count_var);
            END IF;

            RAISE NOTICE '********* REFRESHING VIEW ***************';

            REFRESH MATERIALIZED VIEW CONCURRENTLY locaria_data.global_search_view;

            RAISE NOTICE '*********COMPLETE***************';
            --Write results to temp table so can be read outside of DO
            CREATE TEMP TABLE os_boundary_line_post_process_output AS
            SELECT ret_var;

    EXCEPTION WHEN OTHERS THEN

            RAISE NOTICE '************* % ***************', SQLERRM;
            CREATE TEMP TABLE IF NOT EXISTS os_boundary_line_post_process_output(error jsonb);
            DELETE FROM os_boundary_line_post_process_output;
            INSERT INTO os_boundary_line_post_process_output SELECT jsonb_build_object('error', SQLERRM) ;
    END;
    $$ LANGUAGE PLPGSQL;

    SELECT * FROM os_boundary_line_post_process_output C;

$SQL$
           ),
       TRUE;
