DELETE FROM locus_core.reports WHERE report_name = 'democracy_location';
 INSERT INTO locus_core.reports(report_name, report_parameters)
    SELECT 'democracy_location', jsonb_build_object('sql',

    $SQL$

        WITH point_geometry AS (

            SELECT ST_GEOMFROMEWKT($1->>'location') as location_geometry

        ),COUNCILLOR_WARDS AS (

            SELECT distinct on(attributes#>>'{description,ward}')
                   wkb_geometry as ward_geom,
                   attributes#>>'{description,ward}' as ward,
                   string_agg(attributes->>'title',', ') over () as councillors
            FROM locus_core.global_search_view,point_geometry
            WHERE ST_CONTAINS(wkb_geometry, location_geometry)
            AND attributes->'description' @> jsonb_build_object('type', 'Councillor')

        ), COUNCIL_TAX_BAND AS (

            SELECT wkb_geometry as band_geom,
                   attributes #>>'{description,ref}' as band
            FROM locus_core.global_search_view,point_geometry
            WHERE attributes->'description' @> jsonb_build_object('type', 'Council Tax Band')
            ORDER BY wkb_geometry <-> location_geometry
            LIMIT 1
        ), MP AS (
            SELECT 'Michael Gove' AS mp

        ), POLLING_STATION AS (

			SELECT wkb_geometry as ps_geom,
				   attributes#>>'{description,name}' AS ps_name
				   FROM locus_core.global_search_view, COUNCILLOR_WARDS
			WHERE ST_CONTAINS(ward_geom, wkb_geometry)
			AND attributes#>>'{description,type}' = 'Polling Station'
		)

        SELECT json_build_object('title', 'Democratic Information',
                                 'description', 'Simon needs to provide us with some copy',
                                 'items', json_build_array(
                                     json_build_object('title', 'Your Ward', 'value', ward),
                                     json_build_object('title', 'Your Councillor(s)', 'value', councillors),
                                     json_build_object('title', 'Your Council Tax Band', 'value', band),
                                     json_build_object('title', 'Your MP', 'value', mp),
									 json_build_object('title', 'Your Polling Station', 'value',ps_name)
                                 ),
                                'geojson', json_build_object('type', 'FeatureCollection',
                                                            'features', json_build_array(
                                                                json_build_object('type', 'Feature',
                                                                                 'geometry', ST_ASGEOJSON(ward_geom)::JSON,
                                                                                 'properties', json_build_object('name', ward)),
                                                                json_build_object('type', 'Feature',
                                                                                 'geometry', ST_ASGEOJSON(band_geom)::JSON,
                                                                                 'properties', json_build_object('name', band)),
                                                                json_build_object('type', 'Feature',
                                                                                 'geometry', ST_ASGEOJSON(ps_geom)::JSON,
                                                                                 'properties', json_build_object('name', ps_name))
                                                            ))

                                ) FROM COUNCILLOR_WARDS,COUNCIL_TAX_BAND,MP,POLLING_STATION


    $SQL$);