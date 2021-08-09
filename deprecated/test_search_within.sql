DO
$$
DECLARE
    ret_var JSON;
BEGIN

    SELECT locus_core.locus_gateway(
        json_build_object('method', 'search',
                          'search_text', '',
                          'category', 'Democracy',
                          'location', 'SRID=4326;POINT(-0.6644 51.3328)',
                          'location_distance', 'CONTAINS'

    )) INTO ret_var;


    RAISE NOTICE 'RESULT %', ret_var;
END;
$$ LANGUAGE PLPGSQL