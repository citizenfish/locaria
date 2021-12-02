CREATE OR REPLACE FUNCTION locaria_core.geocoder(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var JSONB;
    max_limit INTEGER DEFAULT 10;
    limit_var INTEGER DEFAULT 1;
    postcode TEXT;

BEGIN

    limit_var = LEAST(COALESCE((parameters->>'_geocoder_limit')::BIGINT, limit_var), max_limit);

    --postcode geocoder is default
    IF COALESCE(parameters->>'_geocoder_type', 'postcode') = 'postcode' THEN

        --get the postcode into standard format for opennames check
        postcode = REPLACE(UPPER(parameters->>'postcode'), ' ', '');
        postcode = CONCAT_WS(' ',LEFT(postcode, LENGTH(postcode) - 3), RIGHT(postcode, 3));

        SELECT COALESCE(jsonb_agg(P.*), jsonb_build_array())
        INTO ret_var
        FROM (
            SELECT
                wkb_geometry,
                attributes->>'name1' AS postcode
            FROM locaria_core.opennames_search_view
            WHERE attributes @> jsonb_build_object('local_type', 'Postcode',
                                                   'name1', COALESCE(NULLIF(postcode,''), 'FAIL'))
        LIMIT limit_var
        ) P;

    END IF;

    --WGS84
    IF parameters->>'_geocoder_type' = 'lonlat' THEN


        SELECT
                jsonb_build_array(
                    jsonb_build_object( 'wkb_geometry', ST_GEOMFROMEWKT(concat('SRID=4326;POINT(', (parameters->>'lon')::FLOAT, ' ',(parameters->>'lat')::FLOAT, ')')),
                                        'attributes',   jsonb_build_object())
                                    )
        INTO ret_var;

    END IF;

    --Easting/Northing
    IF parameters->>'_geocoder_type' = 'osgrid' THEN

        SELECT
                jsonb_build_array(
                    jsonb_build_object( 'wkb_geometry', ST_TRANSFORM(ST_GEOMFROMEWKT(concat('SRID=27700;POINT(', (parameters->>'e')::FLOAT, ' ', (parameters->>'n')::FLOAT, ')')),4326),
                                        'attributes',   jsonb_build_object())
                                    )
        INTO ret_var;

    END IF;

    RETURN ret_var;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '%',SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE PLPGSQL