DO
$$
DECLARE
    ret_var JSON;
BEGIN

    SELECT locus_core.locus_gateway(
        json_build_object('method', 'search',
                          'search_text', '',
                          'category', 'Highways and Transport',
                          'location', 'SRID=4326;POINT(-0.676541007512713 51.3630470189067)',
                          'location_distance', '1000000000000000000000'

    )) INTO ret_var;


    RAISE NOTICE 'RESULT %', ret_var;
END;
$$ LANGUAGE PLPGSQL