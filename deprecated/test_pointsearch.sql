DO
$$
DECLARE
    ret_var JSON;
    r RECORD;
BEGIN

    SELECT locus_core.locus_gateway(
        json_build_object('method', 'pointsearch',
                          'category', 'Planning',
                          'location', 'SRID=4326;POINT(-0.743166424536075 51.3394703242612)',
                          'location_distance', '1609',
                          'limit', '1000'

    )) INTO ret_var;

    FOR r IN SELECT json_array_elements(ret_var->'features')  as json LOOP
        RAISE NOTICE 'NAME % DISTANCE %', r.json#>>'{properties,name}',  r.json#>>'{properties,distance}';
    END LOOP;

    RAISE NOTICE 'count %', json_array_length(ret_var->'features');
END;
$$ LANGUAGE PLPGSQL