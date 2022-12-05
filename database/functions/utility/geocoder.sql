CREATE OR REPLACE FUNCTION locaria_core.geocoder(parameters JSONB) RETURNS JSONB AS
$$
DECLARE
    ret_var            JSONB DEFAULT JSONB_BUILD_OBJECT('wkb_geometry', NULL);
    max_limit          INTEGER DEFAULT 10;
    limit_var          INTEGER DEFAULT 1;
    postcode           TEXT;
    postcode_regex_var TEXT DEFAULT '(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{0,2}))';
BEGIN

    limit_var = LEAST(COALESCE((parameters ->> '_geocoder_limit')::BIGINT, limit_var), max_limit);

    --Full text we go looking for postcode
    IF parameters ->> '_geocoder_type' = 'full_text_postcode' THEN
        parameters = parameters || JSONB_BUILD_OBJECT('_geocoder_type', 'postcode', 'postcode',
                                                      UPPER(SUBSTRING(parameters::TEXT FROM postcode_regex_var)));
    END IF;


    --postcode geocoder is default
    IF COALESCE(parameters ->> '_geocoder_type', 'postcode') = 'postcode' THEN
        --Use an alternative postcode field
        IF COALESCE(parameters ->> 'postcode_field', 'postcode') != 'postcode' THEN
            parameters = parameters || JSONB_BUILD_OBJECT('postcode',
                                                          JSONB_EXTRACT_PATH_TEXT(parameters, parameters ->> 'postcode_field'));
        END IF;

        --get the postcode into standard format for opennames check

        postcode = REPLACE(UPPER(parameters ->> 'postcode'), ' ', '');
        IF (LENGTH(postcode) > 4) THEN
            --full postcode search
            postcode = CONCAT_WS(' ', LEFT(postcode, LENGTH(postcode) - 3), RIGHT(postcode, 3));
            SELECT COALESCE(JSONB_AGG(P.*), JSONB_BUILD_ARRAY())
            INTO ret_var
            FROM (SELECT wkb_geometry::TEXT     AS wkb_geometry,
                         attributes ->> 'name1' AS postcode,
                         postcode               AS lookup
                  FROM locaria_data.location_search_view
                  WHERE attributes @> JSONB_BUILD_OBJECT('local_type', 'Postcode',
                                                         'name1', COALESCE(NULLIF(postcode, ''), 'FAIL'))
                  ) P;
        ELSE
            --outward search
            postcode = lower(postcode);

            SELECT COALESCE(JSONB_AGG(P.*), JSONB_BUILD_ARRAY())
            INTO ret_var
            FROM (SELECT wkb_geometry::TEXT     AS wkb_geometry,
                         attributes ->> 'name1' AS postcode,
                         postcode               AS lookup
                  FROM locaria_data.location_search_view
                  WHERE LOWER(attributes->>'name1') ~ postcode
                  LIMIT 1
                 ) P;
        END IF;
    END IF;

    IF parameters ->> '_geocoder_type' = 'locality' THEN

        SELECT COALESCE(JSONB_AGG(P.*), JSONB_BUILD_ARRAY())
        INTO ret_var
        FROM (SELECT wkb_geometry::TEXT     AS wkb_geometry,
                     attributes ->> 'name1' AS locality
              FROM locaria_data.location_search_view
              WHERE attributes @> JSONB_BUILD_OBJECT('name1', COALESCE(parameters->>'locality', 'FAIL'))) P;

    END IF;


    --WGS84
    IF parameters ->> '_geocoder_type' = 'lonlat' THEN

        IF COALESCE(parameters ->> 'x_field', 'lon') != 'lon' THEN
            parameters = parameters ||
                         JSONB_BUILD_OBJECT('lon', JSONB_EXTRACT_PATH_TEXT(parameters, parameters ->> 'x_field'));
        END IF;
        IF COALESCE(parameters ->> 'y_field', 'lat') != 'lat' THEN
            parameters = parameters ||
                         JSONB_BUILD_OBJECT('lat', JSONB_EXTRACT_PATH_TEXT(parameters, parameters ->> 'y_field'));
        END IF;

        SELECT JSONB_BUILD_ARRAY(
                       JSONB_BUILD_OBJECT('wkb_geometry',
                                          ST_GEOMFROMEWKT(CONCAT('SRID=4326;POINT(', (parameters ->> 'lon')::FLOAT, ' ',
                                                                 (parameters ->> 'lat')::FLOAT, ')'))::TEXT,
                                          'attributes', JSONB_BUILD_OBJECT())
                   )
        INTO ret_var;

    END IF;

    --Easting/Northing
    IF parameters ->> '_geocoder_type' = 'osgrid' THEN


        IF COALESCE(parameters ->> 'x_field', 'e') != 'e' THEN
            parameters = parameters ||
                         JSONB_BUILD_OBJECT('e', JSONB_EXTRACT_PATH_TEXT(parameters, parameters ->> 'x_field'));
        END IF;
        IF COALESCE(parameters ->> 'y_field', 'n') != 'n' THEN
            parameters = parameters ||
                         JSONB_BUILD_OBJECT('n', JSONB_EXTRACT_PATH_TEXT(parameters, parameters ->> 'y_field'));
        END IF;

        SELECT JSONB_BUILD_ARRAY(
                       JSONB_BUILD_OBJECT('wkb_geometry', ST_TRANSFORM(
                               ST_GEOMFROMEWKT(CONCAT('SRID=27700;POINT(', (parameters ->> 'e')::FLOAT, ' ',
                                                      (parameters ->> 'n')::FLOAT, ')')), 4326)::TEXT,
                                          'attributes', JSONB_BUILD_OBJECT())
                   )
        INTO ret_var;

    END IF;

    --OSGrid ref
    IF parameters ->> '_geocoder_type' = 'osgridref' THEN
        SELECT JSONB_BUILD_ARRAY(JSONB_BUILD_OBJECT('wkb_geometry', ST_TRANSFORM(
                ST_GEOMFROMEWKT(locaria_core.uk_gridref_parse(parameters ->> 'gridref')), 4326)::TEXT,
                                                    'attributes', JSONB_BUILD_OBJECT())
                   )
        INTO ret_var;
    END IF;

    RETURN ret_var;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '%',SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE PLPGSQL