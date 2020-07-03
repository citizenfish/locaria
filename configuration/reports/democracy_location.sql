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

		), NEAREST_WARD AS (
			SELECT distinct on(attributes#>>'{description,ward}')
                   wkb_geometry as ward_geom,
                   attributes#>>'{description,ward}' as ward,
                   attributes#>>'{description,url}' as url,
                   attributes->>'title' as councillors
            FROM locus_core.global_search_view,point_geometry
            WHERE (SELECT 1 FROM COUNCILLOR_WARDS LIMIT 1) IS NULL
            AND attributes->'description' @> jsonb_build_object('type', 'Councillor')
			ORDER BY attributes#>>'{description,ward}',wkb_geometry <-> location_geometry
			LIMIT 1
		)
        --If in area
        SELECT json_build_object('title', 'Democratic Information',
                                 'description', '',
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
		UNION ALL
		--If we are outside of area show nearest
		SELECT json_build_object('title', 'Democratic Information',
                                 'description', 'Your location is out of Surrey Heath BC area and this is displaying your nearest ward',
                                 'subTitle', 'Nearest ward :' ||ward,
                                 'additionalLinks', json_build_array(json_build_object('title', 'More information', 'link', url)),
                                 'items', json_build_array(
                                     json_build_object('title', 'Your Ward', 'value', ward ),
                                     json_build_object('title', 'Your Councillor(s)', 'value', councillors)

                                 ),
                                'geojson', json_build_object('type', 'FeatureCollection',
                                                            'features', json_build_array(
                                                                json_build_object('type', 'Feature',
                                                                                 'geometry', ST_ASGEOJSON(ward_geom)::JSON,
                                                                                 'properties', json_build_object('name', ward, 'type', 'ward'))
                                                            ))

                                ) FROM NEAREST_WARD


    $SQL$);