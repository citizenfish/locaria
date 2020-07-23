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
                   attributes#>>'{description,url}' as url,
                   string_agg(attributes->>'title',', ') over () as councillors
            FROM locus_core.global_search_view,point_geometry
            WHERE ST_CONTAINS(wkb_geometry, location_geometry)
            AND attributes->'description' @> jsonb_build_object('type', 'Councillor')

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
                                 'subTitle', ward,
                                 'additionalLinks', json_build_array(json_build_object('title', 'More information', 'link', url)),
                                 'items', json_build_array(
                                     json_build_object('title', 'Your Ward', 'value', ward ),
                                     json_build_object('title', 'Your Councillor(s)', 'value', councillors),

                                     json_build_object('title', 'Your MP', 'value', mp),
        json_build_object('title', 'Your Polling Station', 'value',ps_name)
                                 ),
                                'geojson', json_build_object('type', 'FeatureCollection',
                                                            'features', json_build_array(
                                                                json_build_object('type', 'Feature',
                                                                                 'geometry', ST_ASGEOJSON(ward_geom)::JSON,
                                                                                 'properties', json_build_object('name', ward, 'type', 'ward')),

                                                                json_build_object('type', 'Feature',
                                                                                 'geometry', ST_ASGEOJSON(ps_geom)::JSON,
                                                                                 'properties', json_build_object('name', ps_name, 'type', 'polling_station'))
                                                            ))

                                ) FROM COUNCILLOR_WARDS,MP,POLLING_STATION


    $SQL$);