--Look up an address against co-ordinates
CREATE OR REPLACE FUNCTION locaria_core.reverse_geocoder(search_parameters JSONB) RETURNS JSONB AS
$$
DECLARE
	results_var JSONB;
	default_limit INTEGER DEFAULT 15;
    default_offset INTEGER DEFAULT 0;
    point_geometry GEOMETRY (Point, 4326);

BEGIN



        IF COALESCE(search_parameters->>'limit','') ~ '^[0-9]+$' THEN
            default_limit = LEAST(default_limit, (search_parameters->>'limit')::INTEGER);
        END IF;

        IF COALESCE(search_parameters->>'offset','') ~ '^[0-9]+$' THEN
            default_offset =  (search_parameters->>'offset')::INTEGER;
        END IF;

        IF NOT COALESCE(search_parameters->>'lon','') ~ '^[0-9\-.]+$' THEN
            RETURN json_build_object('error', 'missing longitude');
        END IF;

        IF NOT COALESCE(search_parameters->>'lat','') ~ '^[0-9\-.]+$' THEN
            RETURN json_build_object('error', 'missing latitude');
        END IF;

		point_geometry = ST_GEOMFROMEWKT('SRID=4326;POINT('|| (search_parameters->>'lon') ||' '||(search_parameters->>'lat')||')');

	    SELECT jsonb_build_object('type','FeatureCollection',
                             'features', COALESCE(json_agg(
                                            json_build_object('type',        'Feature',
                                                              'properties',  attributes || jsonb_build_object('distance_rank', distance_rank),
                                                              'geometry',    ST_ASGEOJSON(wkb_geometry,4326)::JSON)
                                            ), json_build_array())
                            )
        INTO results_var
		FROM (

		    SELECT attributes,
		           wkb_geometry,
		           ST_DISTANCE(wkb_geometry::GEOGRAPHY, point_geometry::GEOGRAPHY,false) as distance_rank
            FROM   locaria_core.address_search_view
            ORDER BY wkb_geometry <-> point_geometry
            OFFSET default_offset
            LIMIT  default_limit
		) SUB;


		RETURN results_var;

END;
$$ LANGUAGE PLPGSQL;