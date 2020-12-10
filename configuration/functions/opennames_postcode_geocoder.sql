CREATE OR REPLACE FUNCTION locus_core.opennames_postcode_geocoder(text_parameter TEXT) RETURNS GEOMETRY (Point, 4326) AS
$$
DECLARE

    postcode_var TEXT;
    geometry_var GEOMETRY;

BEGIN

    postcode_var := locus_core.find_postcode_in_text(text_parameter);

    IF postcode_var = '' THEN
        RETURN NULL;
    END IF;

    SELECT wkb_geometry INTO geometry_var FROM locus_core.os_opennames WHERE name1 = UPPER(postcode_var) AND local_type = 'Postcode' LIMIT 1;



    RETURN geometry_var;
EXCEPTION WHEN OTHERS THEN

    RETURN NULL;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION locus_core.find_postcode_in_text(text_param TEXT, outward_param BOOLEAN default TRUE) RETURNS character varying AS
$$
DECLARE
    postcode_regex_var TEXT DEFAULT '(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{0,2}))';

BEGIN

    RETURN upper(substring(text_param FROM postcode_regex_var));
END;
$$
LANGUAGE PLPGSQL;